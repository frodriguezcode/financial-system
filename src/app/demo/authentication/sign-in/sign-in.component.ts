import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule,DialogModule,InputTextModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent implements OnInit {
  constructor(private autS:AuthService,private readonly router: Router,private conS:ConfigurationService){}
  Usuario:FormControl=new FormControl('');
  Password:FormControl=new FormControl('');
  Empresas:any=[]
  Roles:any=[]
  Correo:FormControl=new FormControl('');
  UsuarioRecover:any=[]
  visible: boolean = false;
ngOnInit(): void {
  localStorage.removeItem('AtributosUsuarioFinancial_System');
  localStorage.removeItem('usuarioFinancialSystems');
}


  login(){
    
    Swal.fire({
      title: 'Iniciando sesión....'
     });
     Swal.showLoading();
     let Subscription:Subscription
     let SubscriptionEmpresa:Subscription
 
     Subscription=  this.autS.obtenerUsuarioLogin(this.Usuario.value,this.Password.value).subscribe((resp:any)=>{
      Subscription.unsubscribe()
      localStorage.setItem('usuarioFinancialSystems', JSON.stringify(resp[0])); 
      if(resp.length>0){  
      SubscriptionEmpresa=  
         this.conS.obtenerEmpresas(resp[0].idMatriz).subscribe((empresa:any)=>{
          SubscriptionEmpresa.unsubscribe()
           if(empresa[0].ConfigInicial==false){
             this.router.navigate(['/empresas'])
             Swal.close()
             this.obtenerAtributos(resp[0].idEmpresa,resp[0].idRol)
           }
           else{
            this.obtenerAtributos(resp[0].idEmpresa,resp[0].idRol)
             this.router.navigate(['/registros'])
             Swal.fire({
               position: "center",
               icon: "success",
               title: "Inicio de sesión exitoso",
               showConfirmButton: false,
               timer: 1500
             });
   
    
           }
         })   
      }
      else{
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Credenciales incorrectas",
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
  }

  getNombreRol(idRol:string){
    let _rol:any=[]
    _rol=this.Roles.filter((s:any)=> s.id == idRol)
    if(_rol.length>0){
      
      return _rol[0].Rol
  
    }
    else {
      return 'Sin Rol'
    }
  }
 
  getNombreEmpresa(idEmpresa){
    let _Empresa:any=this.Empresas.filter((emp:any)=>emp.id==idEmpresa)
    if(_Empresa.length>0){
      return _Empresa[0].Nombre
    }
    else{
      return ''
    }
  }
  showDialog() {
    this.visible = true;
}

  async  obtenerAtributos(idEmpresa: any, idRol: string) {
    try {
      const atributos = await this.obtenerRoles(idEmpresa, idRol);
    
      localStorage.setItem('AtributosUsuarioFinancial_System', JSON.stringify(atributos));
    } catch (error) {
      console.error(error);
    }
  }
  
  obtenerRoles(idEmpresa: any, idRol: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.autS.obtenerRolesbyId(idEmpresa, idRol).subscribe(
        (resp: any) => {
          this.Roles=resp
          resolve(resp[0].Atributos);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

hideModal(){
  this.visible=false
}

  recuperarContrasenia(){
    this.visible=false
    Swal.fire({
      title: 'Buscando correo en el sistema....'
     });
     Swal.showLoading();   
    let Subscription:Subscription
    Subscription=   this.autS.obtenerUsuariosbyCorreo(this.Correo.value).subscribe((resp:any)=>{
      Subscription.unsubscribe()
      if(resp.length>0){   
        Swal.fire({
          title: 'Enviando correo....'
         });
         Swal.showLoading();       
       this.UsuarioRecover=resp
      console.log('UsuarioRecover',this.UsuarioRecover) 
          let _User ={
            "correo":this.UsuarioRecover[0].Correo,
            "idUser":this.UsuarioRecover[0].id,
            "nombre":this.UsuarioRecover[0].Nombres,
          }
      console.log('_User',_User) 
      this.autS.sendMailRecoverPassw(_User).subscribe((resp:any)=>{

        Swal.fire({
         position: "center",
         icon: "success",
         title: "Correo enviado",
         showConfirmButton: false,
         timer: 1500
         });
         
      })
      }
      else{
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "No se ha encontrado un perfil con este correo, inténtelo nuevamente",
          showConfirmButton: false,
          timer: 3000
          });
          this.Correo.setValue('')
          setTimeout(()=>{            
            this.visible=true
        }, 3000);
          
      }




    })

  }

}
