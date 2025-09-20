// angular import
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    NgSelectModule,
    DialogModule
    ],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export default class SucursalesComponent implements OnInit {
  Sucursales:any=[]
  Empresas:any=[]
  sucursalFound:boolean=false
  cargando:boolean=false
  SucursalForm!:FormGroup
  Fecha:any= new Date();
  usuario:any
  Usuarios:any=[]
  visible: boolean = false;
  @Input() empresaID:string=''
  @Input() ConfigInicial:boolean
  @Output() sucursalCreada = new EventEmitter<any>();
  idEmpresa:string=''
  constructor(private datePipe: DatePipe,
    private authS:AuthService,
    private conS:ConfigurationService,
    private toastr: ToastrService, private readonly router: Router) {}

ngOnInit(): void {
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    if(this.empresaID!=''){
        this.idEmpresa=this.empresaID
    }
    else {
        this.idEmpresa=this.usuario.idEmpresa
    }
    this.obtenerUsuarios(this.ConfigInicial)
  
    this.obtenerEmpresas()
  
 
  });



  
}
obtenerUsuariosProyectos(idsUsuarios:any){
  return this.Usuarios.filter((user:any)=>idsUsuarios.includes(user.id))
}

obtenerUsuarios(ConfigInicial:boolean){
   this.authS.obtenerUsuarios(this.idEmpresa).subscribe(resp=>{
    this.Usuarios=resp
    this.obtenerSucursales(ConfigInicial)
   })
}

guardarUsuarios(sucursal:any){
sucursal.idsUsuarios=sucursal.UsuariosSeleccionados.map((user:any)=>user.id)
delete sucursal.UsuariosSeleccionados

this.conS.ActualizarSucursal(sucursal).then(resp=>{})
}

cargarFormulario(showDialog:boolean){

  this.SucursalForm = new FormGroup({
    Nombre: new FormControl('',[Validators.required]), 
    idMatriz: new FormControl(this.usuario.idMatriz,[Validators.required]), 
    idEmpresa: new FormControl(this.idEmpresa,[Validators.required]), 
    Activo: new FormControl(true), 
    UsuariosSeleccionados: new FormControl([]), 
    Editando: new FormControl(false), 
    FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
   })
 
    this.visible=showDialog
   
}
toggleEdicion(Sucursal: any) {

  Sucursal.Editando = !Sucursal.Editando;
}


actualizarSucursal(sucursal:any){
  let _Sucursal= this.Sucursales;
  const sucursalEncontrado = _Sucursal.filter((suc:any) => suc.id == sucursal.id);
  sucursalEncontrado[0].Nombre=sucursal.Nombre
  sucursalEncontrado[0].Editando = !sucursal.Editando;

  this.conS.ActualizarSucursal(sucursalEncontrado[0]).then(resp=>{
    this.toastr.success('Sucursal editada', '¡Exito!');
  })
}

ActualizaEstadoSucursal(Sucursal:any,Estado:boolean){
  this.conS.ActualizaEstadoSucursal(Sucursal,Estado).then(resp=>{
    if(Estado==true){
      this.toastr.success('Sucursal activada', '¡Exito!');
    }
    else{
      this.toastr.success('Sucursal desactivada', '¡Exito!');
    }
  })
}

verificarSucursal(){
  let sucursalEncontrada:any=[]
  sucursalEncontrada=this.Sucursales.filter((sucursal:any)=>sucursal.Nombre==this.SucursalForm.value['Sucursal'])
  if(sucursalEncontrada.length>0){
    this.sucursalFound=true
  }
  else {
    this.sucursalFound=false
  }
}

crearSucursal(){
this.SucursalForm.addControl('idsUsuarios', new FormControl([]));
this.SucursalForm.patchValue({

  idsUsuarios: this.SucursalForm.value.UsuariosSeleccionados == undefined
  || this.SucursalForm.value.UsuariosSeleccionados.length==0
  ? []: this.SucursalForm.value.UsuariosSeleccionados?.map((user: any) => user.id) || []
})

this.SucursalForm.removeControl('UsuariosSeleccionados')
  this.conS.crearSucursal(this.SucursalForm.value).then((resp: any)=>{
    this.sucursalCreada.emit(this.SucursalForm.value);
    
    this.cargarFormulario(false)
  })
}
obtenerSucursales(ConfigInicial:boolean){
  this.conS.obtenerSucursales(this.idEmpresa).subscribe((resp: any)=>{
  this.Sucursales=resp
  this.Sucursales.map((sucursal:any)=>sucursal.UsuariosSeleccionados=this.obtenerUsuariosProyectos(sucursal.idsUsuarios))
this.cargarFormulario(ConfigInicial)
  })
}
obtenerEmpresas(){
  this.conS.obtenerEmpresas(this.usuario.idMatriz).subscribe((resp: any)=>{

  this.Empresas=resp
  
  })
}


}
