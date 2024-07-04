import { Component } from '@angular/core';
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
export default class SignInComponent {
  constructor(private autS:AuthService,private readonly router: Router,private conS:ConfigurationService){}
  Usuario:FormControl=new FormControl('');
  Password:FormControl=new FormControl('');
  Empresas:any=[]

  login(){
    Swal.fire({
      title: 'Iniciando sesión....'
     });
     Swal.showLoading();
    this.autS.obtenerUsuarioLogin(this.Usuario.value,this.Password.value).subscribe((resp:any)=>{
      localStorage.setItem('usuarioFinancialSystems', JSON.stringify(resp[0]));

      if(resp.length>0){  
         this.conS.obtenerEmpresas(resp[0].idMatriz).subscribe((resp:any)=>{
           if(resp[0].ConfigInicialCompletado==false){
             this.router.navigate(['/configuracion-inicial'])
             Swal.close()
           }
           else{
             this.router.navigate(['/analytics'])
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
  

}
