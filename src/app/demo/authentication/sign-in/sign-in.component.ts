import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent implements OnInit {
  constructor(private autS:AuthService,private readonly router: Router,private conS:ConfigurationService){}
  Usuario:FormControl=new FormControl('');
  Password:FormControl=new FormControl('');
  Empresas:any=[]
ngOnInit(): void {
  localStorage.removeItem('AtributosUsuarioFinancial_System');
  localStorage.removeItem('usuarioFinancialSystems');
}
  login(){

    Swal.fire({
      title: 'Iniciando sesión....'
     });
     Swal.showLoading();
    this.autS.obtenerUsuarioLogin(this.Usuario.value,this.Password.value).subscribe((resp:any)=>{
      localStorage.setItem('usuarioFinancialSystems', JSON.stringify(resp[0]));
    
      if(resp.length>0){  
         this.conS.obtenerEmpresas(resp[0].idMatriz).subscribe((empresa:any)=>{

           if(empresa[0].ConfigInicial==false){
             this.router.navigate(['/configuracion-inicial'])
             Swal.close()
             this.obtenerAtributos(resp[0].idEmpresa,resp[0].idRol)
           }
           else{
            this.obtenerAtributos(resp[0].idEmpresa,resp[0].idRol)
             this.router.navigate(['/registros'])
             Swal.fire({
               position: "center",
               icon: "success",
               title: "Inicio de sesión exitosa",
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
          resolve(resp[0].Atributos);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

}
