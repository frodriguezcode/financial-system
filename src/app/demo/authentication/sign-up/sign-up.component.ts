import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent implements OnInit {
  constructor(
    private authS: AuthService,
    private datePipe: DatePipe,
    private readonly router: Router
  ) {}
  usuarioForm!: FormGroup;
  Fecha: any = new Date();

  MesesTodos: any = [];
  ngOnInit() {

    this.MesesTodos = [
      {
        Mes: 'Sin Mes',
        id: 0,
        seleccionado: false
      },
      {
        Mes: 'Enero',
        id: 1,
        seleccionado: false
      },
      {
        Mes: 'Febrero',
        id: 2,
        seleccionado: false
      },
      {
        Mes: 'Marzo',
        id: 3,
        seleccionado: false
      },
      {
        Mes: 'Abril',
        id: 4,
        seleccionado: false
      },
      {
        Mes: 'Mayo',
        id: 5,
        seleccionado: false
      },
      {
        Mes: 'Junio',
        id: 6,
        seleccionado: false
      },
      {
        Mes: 'Julio',
        id: 7,
        seleccionado: false
      },
      {
        Mes: 'Agosto',
        id: 8,
        seleccionado: false
      },
      {
        Mes: 'Septiembre',
        id: 9,
        seleccionado: false
      },
      {
        Mes: 'Octubre',
        id: 10,
        seleccionado: false
      },
      {
        Mes: 'Noviembre',
        id: 11,
        seleccionado: false
      },
      {
        Mes: 'Diciembre',
        id: 12,
        seleccionado: false
      }
    ];
    this. cargarFormulario()
  }



  cargarFormulario() {
    // *Formulario de usuario
    let Fecha:any
    Fecha=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
    console.log('Fecha',this.getMonthName(Fecha))
    this.usuarioForm = new FormGroup({
      Nombres: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      Usuario: new FormControl('', [Validators.required]),
      FechaRegistro: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')),
      MesRegistro:new FormControl(this.MesesTodos[this.getMonthName(Fecha)].Mes),
      AnioRegistro: new FormControl(new Date().getFullYear()),
      Activo: new FormControl(true),
      IdSucursal: new FormControl(0),
      ConfigInicialCompletado:new FormControl(false),
      Correo: new FormControl('', [Validators.email, Validators.required]),
      // TODO VERIFICACIONES, CONTRASENA AUTOMATICA, API QUE ENVIA AL CORREO.
    });
  }

  // !Funcion que devuelve el mes
  getMonthName(Fecha: string) {
    return Number(Fecha.substring(5).substring(0, 2));
  }

  // !Funcion para guardar usuario
  guardarUsuario(){
    console.log('UsuarioForm',this.usuarioForm.value)
    this.authS.crearUsuario(this.usuarioForm.value).then((resp:any)=>{
      this.router.navigate(['/auth/signin'])
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario creado exitosamente",
        showConfirmButton: false,
        timer: 1500
      });
    })
    // TODO CREAR ALERTA DE USUARIO CREADO, REDIRECCIONAR A INICIO DE SESION
  }


}
