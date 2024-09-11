// Angular Import
import { Component, DoCheck, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2'
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
  chatMessage: boolean;
  friendId!: number;
  usuario:any
  Roles:any=[]
  Nombres:FormControl=new FormControl('')
  Correo:FormControl=new FormControl('')
  Celular:FormControl=new FormControl('')

  visible: boolean = false;
  visiblePassw: boolean = false;
  gradientConfig = GradientConfig;

  // constructor
  constructor(   private authS:AuthService) {
    this.visibleUserList = false;
    this.chatMessage = false;
 
  }
  showDialog() {
    this.visible = true;
    this.Nombres.setValue(this.usuario.Nombres)
    this.Correo.setValue(this.usuario.Correo)
    this.Celular.setValue(this.usuario.Celular || '')
}

  ngOnInit(): void {
    this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    console.log('usuario',this.usuario)
    this.obtenerRoles()
  }

  obtenerRoles(){
    this.authS.obtenerRoles(this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.Roles=resp;
      console.log('Roles',this.Roles)
    })
    }
getRolName(idRol:any){
  let rolName = this.Roles.find((rol:any)=> rol.id == idRol).Rol
  return rolName

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
      console.log('_User',_User) 
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
