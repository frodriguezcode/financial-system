import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {
  constructor(private autS:AuthService,    private readonly router: Router){}
  Usuario:FormControl=new FormControl('');
  Password:FormControl=new FormControl('');

  login(){
    Swal.fire({
      title: 'Iniciando sesión....'
     });
     Swal.showLoading();
    this.autS.obtenerUsuarioLogin(this.Usuario.value,this.Password.value).subscribe(resp=>{
      if(resp.length>0){
        this.router.navigate(['/analytics'])
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Inicio de sesión exitosa",
          showConfirmButton: false,
          timer: 1500
        });
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
