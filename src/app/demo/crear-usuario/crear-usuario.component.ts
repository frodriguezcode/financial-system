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
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule, ReactiveFormsModule,TableModule,DialogModule],
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
Roles:any=[]
RolesBack:any=[]
Sucursales: any = [];
SucursalesTodas: any = [];
SucursalesTodasBack: any = [];
Empresas: any = [];
EmpresasBack: any = [];
Usuarios: any = [];
UsuariosTodos: any = [];
UsuariosBack: any = [];
usuario:any
visible: boolean = false;
ngOnInit(): void {
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
  
   
    this.obtenerSucursales()
    this.obtenerRoles()
    this.obtenerEmpresas()
  
 
  });
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

}
showDialog() {
  this.visible = true;
}
obtenerUsuarios(){
  this.authS.obtenerUsuariosByMatriz(this.usuario.idMatriz).subscribe(resp=>{
    if(this.getNombreRol(this.usuario.idRol)=='Super Usuario'){
      this.Usuarios=resp
    }
    else {
      this.Usuarios=resp.filter((resp:any)=>resp.idEmpresa==this.usuario.idEmpresa)

    }

 

    if(this.getNombreRol(this.usuario.idRol)=='Super Usuario'){
      this.Roles=this.RolesBack
    }
    else {
      this.Roles=this.RolesBack.filter((resp:any)=>resp.idEmpresa==this.usuario.idEmpresa)

    }
    this.usuario.Rol=this.getNombreRol(this.usuario.idRol)
    localStorage.setItem('usuarioFinancialSystems', JSON.stringify( this.usuario)); 
    this.UsuariosBack=resp
  })
}
obtenerEmpresas(){
  this.authS.obtenerEmpresas(this.usuario.idMatriz).subscribe(resp=>{
    this.Empresas = resp.filter((resp:any)=>resp.id==this.usuario.idEmpresa)
    this.EmpresasBack = resp
  })
}
obtenerRoles(){
  this.authS.obtenerRolesByMatriz(this.usuario.idMatriz).subscribe(roles=>{


    this.RolesBack=roles
    this.Roles=this.RolesBack.filter((resp:any)=>resp.idEmpresa==this.usuario.idEmpresa)
    this.obtenerUsuarios()

  })
}

getRolesByEmpresa(idEmpresa:any){
let _Roles:any=[]
_Roles=this.RolesBack.filter((resp:any)=>resp.idEmpresa==idEmpresa)
return _Roles
}

getSucursalesByEmpresa(idEmpresa:any){
let _Sucursales:any=[]
_Sucursales=this.SucursalesTodasBack.filter((resp:any)=>resp.idEmpresa==idEmpresa)
return _Sucursales
}
getEmpresaByMatriz(idEmpresa:any){
let _Empresas:any=[]
_Empresas=this.EmpresasBack.filter((resp:any)=>resp.id==idEmpresa)

return _Empresas
}


getNombreRol(idRol:string){
  let _rol:any=[]
  _rol=this.RolesBack.filter((s:any)=> s.id == idRol)
  if(_rol.length>0){
    
    return _rol[0].Rol

  }
  else {
    return 'Sin Rol'
  }
}
obtenerSucursales(){
  this.conS.obtenerSucursalesByMatriz(this.usuario.idMatriz).subscribe(resp=>{
    this.Sucursales=resp.filter((resp:any)=>resp.idEmpresa==this.usuario.idEmpresa)
    this.SucursalesTodas=resp
    this.SucursalesTodasBack=resp
    this.cargarFormulario()
  })
}
getNombreEmpresa(idEmpresa){
  let _Empresa:any=this.EmpresasBack.filter((emp:any)=>emp.id==idEmpresa)
  if(_Empresa.length>0){
    return _Empresa[0].Nombre
  }
  else{
    return ''
  }
}
selectSucursalByEmpresa(idEmpresa:any){
 if(idEmpresa=='0') {
  this.SucursalesTodas=this.SucursalesTodasBack
 }
 else {
   this.SucursalesTodas=this.SucursalesTodasBack.filter((resp:any)=>resp.idEmpresa==idEmpresa)
  this.Roles=this.RolesBack.filter((resp:any)=>resp.idEmpresa==idEmpresa)
 }
 
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
  this.usuarioForm = new FormGroup({
    Nombres: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    Usuario: new FormControl('', [Validators.required]),
    FechaRegistro: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')),
    MesRegistro:new FormControl(this.MesesTodos[this.getMonthName(Fecha)].Mes),
    AnioRegistro: new FormControl(new Date().getFullYear()),
    Activo: new FormControl(true),
    Editando: new FormControl(false),
    idEmpresa: new FormControl('',[Validators.required]),
    idMatriz: new FormControl(this.usuario.idMatriz),
    idRol: new FormControl('',[Validators.required]),
    IdSucursal: new FormControl(0),
    ConfigInicialCompletado:new FormControl(false),
    Correo: new FormControl('', [Validators.email, Validators.required]),
    // TODO VERIFICACIONES, CONTRASENA AUTOMATICA, API QUE ENVIA AL CORREO.
  });
}
toggleEdicion(Usuario: any) {
  if(this.authS.validarAtributo('JCcvjQOlOQ7ktXNPORzL',[])==true){
    Usuario.Editando = !Usuario.Editando;
  }

  else {
    this.toastr.warning('', '¡Acceso Denegado!',{
      timeOut: 1000,
    });
 }
}
actualizarUsuario(Usuario:any){
    let _usuario= this.Usuarios;
    const usuarioEncontrado = _usuario.filter((user:any) => user.id == Usuario.id);
    usuarioEncontrado[0].Nombres=Usuario.Nombres
    usuarioEncontrado[0].Correo=Usuario.Correo
    usuarioEncontrado[0].Password=Usuario.Password
    usuarioEncontrado[0].IdSucursal=Usuario.IdSucursal
    usuarioEncontrado[0].Editando = !Usuario.Editando;
    usuarioEncontrado[0].idRol=Usuario.idRol
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
  this.usuarioForm.value.Empresa=this.getNombreEmpresa(this.usuarioForm.value.idEmpresa)
  this.authS.crearUsuario(this.usuarioForm.value).then((resp:any)=>{
    this.toastr.success('Guardado', '¡Exito!');
    this.usuarioForm.get('Nombres').setValue('');
    this.usuarioForm.get('Password').setValue('');
    this.usuarioForm.get('Correo').setValue('');
  })
}
}
