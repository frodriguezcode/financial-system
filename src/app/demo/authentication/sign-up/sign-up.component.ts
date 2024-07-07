import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule, ReactiveFormsModule,DialogModule, ButtonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent implements OnInit {
  constructor(
    private authS: AuthService,
    private datePipe: DatePipe,
    private readonly router: Router,
    private rutaActiva: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  usuarioForm!: FormGroup;
  visible: boolean = false;
  Fecha: any = new Date();
  CardNumber:FormControl=new FormControl('')
  FechaVencimiento:FormControl=new FormControl('')
  cardType: string | null = null;
  idPlan:string=''
  usuarioCreado = {
    nombre : '',
    correo : '',
    user : '',
    passw : '',
  }

  MesesTodos: any = [];
  ngOnInit() {
    this.idPlan= this.rutaActiva.snapshot.paramMap.get('idPlan')!;
    console.log('idPlan',this.idPlan)

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
    this.cargarFormulario()

  }

  showDialog() {
    this.visible = true;
}


cardValidator() {
  if (this.CardNumber.value.startsWith('4')) {
    return 'https://firebasestorage.googleapis.com/v0/b/sistemafinanciero-924ff.appspot.com/o/LOGO%20VISA.png?alt=media&token=389956dd-21fd-4e74-8d45-7b2f7eab772b';
  } else if (this.CardNumber.value.startsWith('5')) {
    return 'https://firebasestorage.googleapis.com/v0/b/sistemafinanciero-924ff.appspot.com/o/LOGO%20MASTER%20CARD.png?alt=media&token=a0a8f4b5-2278-45c7-8fc1-df7750476ced';
  } else if (this.CardNumber.value.startsWith('3')) {
    return 'https://firebasestorage.googleapis.com/v0/b/sistemafinanciero-924ff.appspot.com/o/LOGO%20DINERS%20CLUB.png?alt=media&token=878da1fc-7c85-4917-a25b-f347d75e2f84';
  } else {
    return 'https://firebasestorage.googleapis.com/v0/b/sistemafinanciero-924ff.appspot.com/o/LOGO%20TARJETA.png?alt=media&token=dd22ab06-8965-4476-84d1-f9cf651d8a8d';
  }
}

formatFechaVencimiento(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos

  if (value.length >= 3) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }

  input.value = value;
  this.FechaVencimiento.setValue(value, { emitEvent: false });
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
      Empresa: new FormControl('', [Validators.required]),
      Matriz: new FormControl(''),
      FechaRegistro: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')),
      MesRegistro:new FormControl(this.MesesTodos[this.getMonthName(Fecha)].Mes),
      AnioRegistro: new FormControl(new Date().getFullYear()),
      Activo: new FormControl(true),
      idRol: new FormControl(1),
      IdSucursal: new FormControl(0),
      idPlan:new FormControl(this.idPlan),
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

    this.usuarioCreado.nombre = this.usuarioForm.value.Nombres;
    this.usuarioCreado.correo = this.usuarioForm.value.Correo;
    this.usuarioCreado.user = this.usuarioForm.value.Usuario;
    this.usuarioCreado.passw = this.usuarioForm.value.Password


    console.log(this.usuarioCreado);
   

  // Enviar correo electrónico
  this.authS.sendMail(this.usuarioCreado).subscribe();

    this.authS.crearUsuarioRegistro(this.usuarioForm.value).then((resp:any)=>{
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
