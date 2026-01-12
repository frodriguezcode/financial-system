// Angular Import
import { Component, DoCheck, inject, OnInit, TemplateRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2'
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements DoCheck,OnInit {
  // public props
  visibleUserList: boolean;
  visibleLogin: boolean;
  visibleEmpresa: boolean;
  chatMessage: boolean;
  friendId!: number;
  usuario:any
  Roles:any=[]
  Nombres:FormControl=new FormControl('')
  Correo:FormControl=new FormControl('')
  Celular:FormControl=new FormControl('')
  UsuarioLogin:FormControl=new FormControl('')
  Passw:FormControl=new FormControl('')
  idEmpresa:string=''
  Empresas:any=[]
  Usuarios:any=[]
  visible: boolean = false;
  visiblePassw: boolean = false;
  gradientConfig = GradientConfig;

	closeResult = '';
  // constructor
  constructor(  
    private readonly router: Router,
    private authS:AuthService,private conS:ConfigurationService,private toastr: ToastrService,

    config: NgbModalConfig,
		private modalService: NgbModal,

  ) {
    this.visibleUserList = false;
    this.chatMessage = false;
 
  }

	open(content) {
		this.modalService.open(content);
	}

  showDialog() {
    this.visible = true;
    this.Nombres.setValue(this.usuario.Nombres)
    this.Correo.setValue(this.usuario.Correo)
    this.Celular.setValue(this.usuario.Celular || '')
}
  showDialogEmpresa() {
    if(this.authS.validarAtributo('qWA0Fr8xGLzxhCHwhm1n',[])==true){
      this.visibleEmpresa = true;
    }
  
    else {
      this.toastr.warning('', '¡No tiene permitido cambiar de empresa!',{
        timeOut: 1000,
      });
   }
  
   
}

  ngOnInit(): void {
  const user = this.authS.getUserFromToken();
console.log('Expira en:', new Date(user!.exp * 1000));
  if (!user) {
    this.router.navigate(['/login']);
    return;
  }
    this.usuario= user
    this.obtenerRoles()
    this.obtenerUsuariosByMatriz()
    this.obtenerEmpresas()
  }

  obtenerRoles(){
    this.authS.obtenerRoles(this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.Roles=resp;

    })
}
obtenerUsuariosByMatriz(){
    this.authS.obtenerUsuariosByMatriz(this.usuario.idMatriz).subscribe((resp:any)=>{
      this.Usuarios=resp;
   
    })
}
obtenerEmpresas(){
    this.authS.obtenerEmpresas(this.usuario.idMatriz).subscribe((resp:any)=>{
      this.Empresas=resp;
 
      this.usuario.Empresa=this.getNombreEmpresa(this.usuario.idEmpresa)

    })
}

getRolName(idRol:any){
  let rolName = this.Roles.filter((rol:any)=> rol.id == idRol)

  if(rolName.length>0){
    return rolName[0].Rol

  }
  else {
    return ''
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



setEmpresa(idEmpresa:any){
this.idEmpresa=idEmpresa



  if(idEmpresa=='0'){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Elija una empresa",
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
  
  
    this.visibleEmpresa = false;
    setTimeout(()=>{ 
      this.conS.setUsuario(this.usuario); 
      this.ShowIniciarSesion()
  }, 1000);
  }






}

ShowIniciarSesion(){

this.visibleLogin=true
}

iniciarSesion(){
let UsuarioEncontrado:any=[]

UsuarioEncontrado=this.Usuarios.filter((user:any)=>user.Password==this.Passw.value 
&& user.Usuario==this.UsuarioLogin.value && user.idEmpresa==this.idEmpresa )
if(UsuarioEncontrado.length>0){
  this.usuario.Correo=UsuarioEncontrado[0].Correo
  this.usuario.Usuario=UsuarioEncontrado[0].Usuario
  this.usuario.idEmpresa=UsuarioEncontrado[0].idEmpresa
  this.usuario.idRol=UsuarioEncontrado[0].idRol
  this.usuario.Password=UsuarioEncontrado[0].Password
  this.usuario.Nombres=UsuarioEncontrado[0].Nombres
  this.usuario.Activo=UsuarioEncontrado[0].Activo
  this.usuario.Empresa = this.getNombreEmpresa(UsuarioEncontrado[0].idEmpresa)

  this.conS.setUsuario(this.usuario);
  localStorage.setItem('usuarioFinancialSystems', JSON.stringify(this.usuario));
  this.obtenerAtributos(this.usuario.idEmpresa,this.usuario.idRol)
  this.visibleEmpresa = false;
  this.toastr.success('Hecho', `Se ha cambiado a ${this.usuario.Empresa}`,{
    timeOut: 3000,
  });
this.visibleLogin=false
}
else{

  Swal.fire({
    position: "center",
    icon: "warning",
    title: "Credenciales Incorrectas",
    showConfirmButton: false,
    timer: 1500
  });
}
}



async  obtenerAtributos(idEmpresa: any, idRol: string) {
  try {
    const atributos = await this.obtenerRolesByEmpresa(idEmpresa, idRol);

    localStorage.setItem('AtributosUsuarioFinancial_System', JSON.stringify(atributos));
  } catch (error) {
    console.error(error);
  }
}

obtenerRolesByEmpresa(idEmpresa: any, idRol: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.authS.obtenerRolesbyId(idEmpresa, idRol).subscribe(
      (resp: any) => {
        if(resp.length>0){
          resolve(resp[0].Atributos);


        }
        else {
          resolve([]);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}


ActualizarUsuario(){
  this.usuario.Nombres=this.Nombres.value
  this.usuario.Correo=this.Correo.value
  this.usuario.Celular=this.Celular.value
  this.authS.ActualizarUsuario(this.usuario).then(resp=>{
    this.visible=false
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Usuario Actualizado",
      showConfirmButton: false,
      timer: 1500
    });
    
    }).catch(error => {

      if (!navigator.onLine) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Sin conexión a internet",
          text: "Por favor, verifica tu conexión y vuelve a intentarlo.",
          showConfirmButton: true
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al actualizar",
          text: "Ocurrió un error inesperado. Por favor, inténtalo más tarde.",
          showConfirmButton: true
        });
      }

  })
}


hideModal(){
  this.visiblePassw=false
}

recuperarContrasenia(){
    Swal.fire({
      title: 'Enviando correo....'
     });
     Swal.showLoading();  
          let _User ={
            "correo":this.usuario.Correo,
            "idUser":this.usuario.id,
            "nombre":this.usuario.Nombres,
          }

      this.authS.sendMailRecoverPassw(_User)
      .pipe(
        catchError(error => {
          this.visible = false;
          
          if (!navigator.onLine) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Sin conexión a internet",
              text: "Por favor, verifica tu conexión y vuelve a intentarlo.",
              showConfirmButton: true
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Error al enviar el correo",
              text: "Ocurrió un error inesperado. Por favor, inténtalo más tarde.",
              showConfirmButton: true
            });
          }
    
          // Devolvemos un Observable vacío para que el flujo continúe
          return of(null);
        })
      )
      .subscribe((resp: any) => {
        this.visible = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Correo enviado",
          showConfirmButton: false,
          timer: 1500
        });
      });




}
   






    



  
  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  ngDoCheck() {
    if (document.querySelector('body')?.classList.contains('elite-rtl')) {
      this.gradientConfig.isRtlLayout = true;
    } else {
      this.gradientConfig.isRtlLayout = false;
    }
  }
}
