import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router,ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'
import { ConfigurationService } from 'src/app/services/configuration.service';
@Component({
  selector: 'app-recover-passw',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './recover-passw.component.html',
  styleUrls: ['./recover-passw.component.scss']
})
export default class RecoverPassw implements OnInit {
  constructor(
  private autS:AuthService,
  private readonly router: Router,
  private conS:ConfigurationService,
  private rutaActiva: ActivatedRoute){}
  Password:FormControl=new FormControl('');
  Empresas:any=[]
  Usuario:any=[]
  idLead:any
ngOnInit(): void {
  this.idLead= this.rutaActiva.snapshot.paramMap.get('idUsuario')!;
  
  this.autS.obtenerUsuariosbyId(this.idLead).subscribe((resp:any)=>{
    this.Usuario=resp
    console.log('Usuario',this.Usuario)
  })


  
  
}
actualizarPass(){

let _Usuario={
  "id": this.Usuario[0].id,
  "Password":this.Password.value,
  "correo":this.Usuario[0].Correo,
  "nombre":this.Usuario[0].Nombres,
  "user":this.Usuario[0].Usuario
}
this.autS.ActualizarPassw(_Usuario).then(resp=>{
  console.log('_Usuario',_Usuario)
  this.autS.sendMailUpdatePassw(_Usuario).subscribe(resp=>{
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Correo enviado con su contraseña nueva",
      showConfirmButton: false,
      timer: 1500
      });
  })

})

}
 


 
 

}
