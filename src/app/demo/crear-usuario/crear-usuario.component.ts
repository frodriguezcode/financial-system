// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export default class CrearUsuarioComponent implements OnInit {
  constructor(
    private authS: AuthService,
    private datePipe: DatePipe,
    private readonly router: Router,
    private conS:ConfigurationService,
    private toastr: ToastrService
  ) {}
usuarioForm!: FormGroup;
Fecha: any = new Date();
MesesTodos: any = [];
Sucursales: any = [];
Usuarios: any = [];
usuario:any
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
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
  this.obtenerUsuarios()
  this.obtenerSucursales()
}
obtenerUsuarios(){
  this.authS.obtenerUsuarios(this.usuario.idEmpresa).subscribe(resp=>{
    this.Usuarios = resp
  })
}
obtenerSucursales(){
  this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe(resp=>{
    this.Sucursales=resp
    this.cargarFormulario()
  })
}
getNombreSucursal(idSucursal:string){
  let _sucursal:any=[]
  _sucursal=this.Sucursales.filter((s:any)=> s.id == idSucursal)
  if(_sucursal.length>0){
    return _sucursal[0].Nombre

  }
  else {
    return 'Admin'
  }
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
    Editando: new FormControl(false),
    idEmpresa: new FormControl(this.usuario.idEmpresa),
    idMatriz: new FormControl(this.usuario.idMatriz),
    idRol: new FormControl(1),
    IdSucursal: new FormControl(0),
    ConfigInicialCompletado:new FormControl(false),
    Correo: new FormControl('', [Validators.email, Validators.required]),
    // TODO VERIFICACIONES, CONTRASENA AUTOMATICA, API QUE ENVIA AL CORREO.
  });
}
toggleEdicion(Usuario: any) {

  Usuario.Editando = !Usuario.Editando;
}
actualizarUsuario(Usuario:any){
  let _usuario= this.Usuarios;
  const usuarioEncontrado = _usuario.filter((user:any) => user.id == Usuario.id);
  usuarioEncontrado[0].Nombres=Usuario.Nombres
  usuarioEncontrado[0].Correo=Usuario.Correo
  usuarioEncontrado[0].Password=Usuario.Password
  usuarioEncontrado[0].IdSucursal=Usuario.IdSucursal
  usuarioEncontrado[0].Editando = !Usuario.Editando;

  this.authS.ActualizarUsuario(usuarioEncontrado[0]).then(resp=>{
    this.toastr.success('Banco editado', '¡Exito!');
  })
}


ActualizarUsuarioEstado(Usuario:any,Estado:boolean){
  this.authS.ActualizarUsuarioEstado(Usuario,Estado).then(resp=>{
    if(Estado==true){
      this.toastr.success('Usuario activado', '¡Exito!');
    }
    else{
      this.toastr.success('Usuario desactivado', '¡Exito!');
    }
  })
}
getMonthName(Fecha: string) {
  return Number(Fecha.substring(5).substring(0, 2));
}
crearUsuario(){
  console.log('usuarioForm',this.usuarioForm.value)

  this.authS.crearUsuario(this.usuarioForm.value).then((resp:any)=>{
    this.toastr.success('Guardado', '¡Exito!');
    this.cargarFormulario()
  })
}
}
