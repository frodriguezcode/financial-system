// angular import
import { AfterViewInit, Component, ElementRef, Injectable, Input, OnInit, TemplateRef, ViewChild, importProvidersFrom, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import Swal from 'sweetalert2'
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import {  MessageService, SelectItem } from 'primeng/api';
import { Registro } from 'src/app/models/registro';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import BancosComponent from '../../bancos/bancos.component';
import ItemsComponent from '../../Items/items.component';
import SocioNegocioComponent from '../../socios/socios.component';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencySymbolPipe } from 'src/app/pipe/currency.pipe';
import { TabViewModule } from 'primeng/tabview';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import TiposOperacionComponent from '../../tipos-operacion/tipos-operacion.component';
import { Subscription } from 'rxjs';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule,
    TableModule,
    FileUploadModule,
    ToolbarModule,
    TagModule,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    CommonModule,
    ToastModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SharedModule,
    CalendarModule,
    InputIconModule,
    IconFieldModule,
    BancosComponent,
    TiposOperacionComponent,
    ItemsComponent,
    SocioNegocioComponent,
    CurrencySymbolPipe,
    TabViewModule,
    ButtonModule,
    MultiSelectModule,
    TreeSelectModule
   ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss'],
  providers: [MessageService]
})
export default class CrearRegistroComponent implements OnInit,AfterViewInit  {
@Input() TipoRegistro: any;
private offcanvasService = inject(NgbOffcanvas);
@ViewChild('scrollTop') scrollTop!: ElementRef;
@ViewChild('scrollContainer') scrollContainer!: ElementRef;
expandedKeys: { [key: string]: boolean } = {};
  // NEW: bottom scrollbar
  @ViewChild('scrollBottom') scrollBottom!: ElementRef;

  constructor(
    private conS:ConfigurationService,private datePipe: DatePipe, 
    private messageService: MessageService,
    private toastr: ToastrService,
    private authS:AuthService,
    private firestore: AngularFirestore
  ){}
  emptyMessage='Selecicone una cuenta'
  page = 1;
	pageSize = 10;
	collectionSize = 0;
  selectedNodes: any;
  // isDragging = false;
  // startX = 0;
  // scrollLeft = 0;
  registroForm!:FormGroup
  EditRegistroForm!:FormGroup
  registroDialog: boolean = false;
  visible: boolean = false;
  visibleEditar: boolean = false;
  visibleCuenta: boolean = false;
  visibleElemento: boolean = false;
  visibleSocioNegocio: boolean = false;
  visibleTipoOperacion: boolean = false;
  submitted: boolean = false;
  isNegativo: boolean = true;
  registros: any=[];
  registrosSeleccionados: any=[];
  registrosBackUp: any=[];
  FiltrosSideBar: boolean = false;
  OpcionesSideBar: boolean = false;
  // *Registros desde la promesa
  _Registros: Registro[];
  clonedRegistros: { [s: string]: Registro } = {};
  idTipoRegistro:number=1
  claseTabla:string='p-datatable-sm'
  // *Registros desde la promesa
  FechaDesde:FormControl=new FormControl('')
  FechaHasta:FormControl=new FormControl('')

  cuentas: any=[];
  selectedRegistros!: any[] | null;
  registro: any=[];
  itemSeleccionado: any;
  itemsFiltrados: any;
  // Categorias: any=[];
  Categorias!: SelectItem[] | any;
  CategoriasSeleccionadas:any=[]
  CategoriasTodas:any=[]
  CategoriaContable:any
  SociosNegocios: any=[];
  MesesTodos: any=[];
  Registros: any=[];
  Items: any=[];
  ItemsBack: any=[];
  ItemSeleccionados: any=[];
  usuario:any
  idItem:any=''
  Roles: any=[];
  ItemsCategGroup:any= [];
  ItemsCategGroupBack:any= [];
  TiposOperacion:any= [];
  OrdenMax: number = 0;
  Sucursales: any=[];
  Proyectos: any=[];
  ProyectoSeleccionado: any;
  SucursaleSeleccionada: any;
  CuentasContables:any=[]
  SeleccionarTodo:boolean=false
  MostraSubCuentas:boolean=false
  Empresas:any
  CuentasHijos:any=[]
  Flujos: any = [
    {id: "1", name: "Banco"},
    {id: "2", name: "Efectivo"},
    
  ]
cargando:boolean=true
  Fecha:any= new Date();
  ImporteTotal:number=0
  ImporteSubTotal:number=0

ngOnInit(): void {

  this.MesesTodos= [
    
    {
      Mes: 'Sin Mes',
      id:0,
      seleccionado: false
    },
    {
      Mes: 'Enero',
      id:1,
      seleccionado: false
    },
    {
      Mes: 'Febrero',
      id:2,
      seleccionado: false
    },
    {
      Mes: 'Marzo',
      id:3,
      seleccionado: false
    },
    {
      Mes: 'Abril',
      id:4,
      seleccionado: false
    },
    {
      Mes: 'Mayo',
      id:5,
      seleccionado: false
    },
    {
      Mes: 'Junio',
      id:6,
      seleccionado: false
    },
    {
      Mes: 'Julio',
      id:7,
      seleccionado: false
    },
    {
      Mes: 'Agosto',
      id:8,
      seleccionado: false
    },
    {
      Mes: 'Septiembre',
      id:9,
      seleccionado: false
    },
    {
      Mes: 'Octubre',
      id:10,
      seleccionado: false
    },
    {
      Mes: 'Noviembre',
      id:11,
      seleccionado: false
    },
    {
      Mes: 'Diciembre',
      id:12,
      seleccionado: false
    },
  
  ]
  this.conS.usuario$.subscribe(usuario => {
 
    this.cargando=true
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    this.obtenerEmpresas()
    this.obtenerRoles()
    this.obtenerTiposOperacionByEmpresa()

  });


      
}

ngAfterViewInit() {
  this.syncScroll();
}


// SYNC top, container, bottom scrollbars
syncScroll() {
  // 1) Ajusta el ancho dinámico al real de la tabla
  const tableWidth = this.scrollContainer.nativeElement.scrollWidth + 'px';
  this.scrollTop.nativeElement.children[0].style.width = tableWidth;
  this.scrollBottom.nativeElement.children[0].style.width = tableWidth;

  // 2) Vincula eventos scroll en top, container, bottom

  // (A) Barra TOP -> contenedor & bottom
  this.scrollTop.nativeElement.addEventListener('scroll', () => {
    const x = this.scrollTop.nativeElement.scrollLeft;
    this.scrollContainer.nativeElement.scrollLeft = x;
    this.scrollBottom.nativeElement.scrollLeft = x;
  });

  // (B) Contenedor -> top & bottom
  this.scrollContainer.nativeElement.addEventListener('scroll', () => {
    const x = this.scrollContainer.nativeElement.scrollLeft;
    this.scrollTop.nativeElement.scrollLeft = x;
    this.scrollBottom.nativeElement.scrollLeft = x;
  });

  // (C) Barra BOTTOM -> contenedor & top
  this.scrollBottom.nativeElement.addEventListener('scroll', () => {
    const x = this.scrollBottom.nativeElement.scrollLeft;
    this.scrollContainer.nativeElement.scrollLeft = x;
    this.scrollTop.nativeElement.scrollLeft = x;
  });
}






openEnd(content: TemplateRef<any>) {
  this.offcanvasService.open(content, { position: 'end' });
}









obtenerTiposOperacionByEmpresa(){
  this.conS.obtenerTiposOperacionByMatriz(this.usuario.idMatriz).subscribe(resp=>{
    this.TiposOperacion=resp
  })

}

setIsAdmin(){
  let _RolUsuario=[]
  _RolUsuario=this.Roles.filter((rol:any)=>rol.id===this.usuario.idRol)
  this.usuario.isAdmin=_RolUsuario[0].isAdmin ==undefined ? false :_RolUsuario[0].isAdmin
  localStorage.setItem('usuarioFinancialSystems', JSON.stringify(this.usuario)); 
}
obtenerRoles(){
  this.authS.obtenerRolesByMatriz(this.usuario.idMatriz).subscribe(resp=>{
    this.Roles=resp
    this.setIsAdmin()
    this.obtenerSucursales()
    this.obtenerItems()
    this.obtenerCuentas()
    this.obtenerSocios()
    this.obtenerCategorias()

  })
}

obtenerEmpresas(){
  this.authS.obtenerEmpresas(this.usuario.idMatriz).subscribe(resp=>{
    this.Empresas=resp
  })
}

getNombreEmpresa(idEmpresa:string){
  let _empresa:any=[]
  _empresa=this.Empresas.filter((s:any)=> s.id == idEmpresa)
  if (_empresa.length>0){
    return _empresa[0].Nombre

  }
  else {
    return 'Sin empresa'
  }
}
seleccionarRegistro(registro:any){
  let RegistroEncontrado:any=[]
  registro.Seleccionado=!registro.Seleccionado
  if(this.Registros.every(obj => obj.Seleccionado) ) {
    this.SeleccionarTodo=true
  }
  else {
    this.SeleccionarTodo=false
  }
  RegistroEncontrado=this.registrosSeleccionados.filter((reg:any)=>reg.id==registro.id)
  if(RegistroEncontrado.length==0){
    this.registrosSeleccionados.push(registro)
    
  }
  else {
    this.registrosSeleccionados.splice(this.registrosSeleccionados.indexOf(RegistroEncontrado[0]))
  }

}
seleccionarRegistros(){
  this.SeleccionarTodo=true
  this.Registros.forEach(element => {
    element.Seleccionado=!element.Seleccionado
    
  });
  if(!this.Registros.every(obj => obj.Seleccionado) ) {
    this.registrosSeleccionados=[]
  }
  else {
    this.registrosSeleccionados=this.Registros
  }


}
borrarRegistros(){

  if(this.authS.validarAtributo('sAXrUYfJvISYOx6Tbg3L',[])==true){
    let Contador:number=this.registrosSeleccionados.length
   this.registrosSeleccionados.forEach(element => {
    try{
      this.conS.borrarRegistro(element.id).then(resp=>{
      })
      //this.Registros=this.Registros.filter((reg:any)=>reg.id!=element.id && reg.TipoRegistro==this.idTipoRegistro).sort((a:any, b:any) => b.Orden - a.Orden)
      this.registrosSeleccionados=this.registrosSeleccionados.filter((reg:any)=>reg.id!=element.id)
      this.registrosBackUp=this.registrosBackUp.filter((reg:any)=>reg.id!=element.id)
      this.refreshRegistros([],false)
      if(this.registrosSeleccionados.length==0){
        this.SeleccionarTodo=false
        this.toastr.success('', `${Contador} registros borrados`,{
          timeOut: 1000,
        });
      }

    }
    catch(error){
      this.toastr.success('', 'Hubo un error inesperado, inténtelo de nuevo',{
        timeOut: 1000,
      });
    }


   });

   
   this.registrosSeleccionados=[]
  //  let OrdenNuevo:number=1
  //  const coleccionRef = this.firestore.collection('Registro');

  //   this.Registros.sort((a:any, b:any) => a.Orden - b.Orden).forEach(element => {
      
  //     const registroRef = coleccionRef.doc(element.id).ref; 
  //     const batch = this.firestore.firestore.batch();
  //     batch.update(registroRef, { Orden: OrdenNuevo });
  //     element.Orden =OrdenNuevo;
  //     OrdenNuevo+=1

  //   })
  }  
   else {
    this.toastr.warning('', '¡Acceso Denegado!',{
      timeOut: 1000,
    });
 }

}
onInput(event: any) {
  let valor = event.target.value;
  if (!valor.startsWith('$')) {
    valor = '$' + valor;
  }
  // Remover todo menos dígitos y el símbolo de $
  valor = '$' + valor.replace(/[^\d]/g, '');

}
obtenerSucursales(){
  this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe(resp=>{
    this.Sucursales=resp.filter((suc:any)=>suc.Activo==true)
    this.Sucursales.push({
      "Activo":true,
      "Editando":false,
      "FechaCreacion":"",
      "Nombre":"Todas",
      "Sucursal":"Todas",
      "id":"0",
      "idEmpresa":"GRfgJohSdEvq6yqVUBFo",
      "idMatriz":"DeCofZ7At1eUwsRo9hPs",
      "idUsuario":"YpLYlsIffwelfqtCkSP9"
    });


    this.obtenerProyectos()

    
  })
}
obtenerProyectos(){
  if(this.usuario.isAdmin==true){
    this.conS.obtenerProyectosByMatriz(this.usuario.idMatriz).subscribe((resp: any)=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal,proyect.idEmpresa) )
    this.Proyectos.push({
      "Activo":true,
      "Editando":false,
      "FechaCreacion":"",
      "Nombre":"Todas",
      "NombreSucursal":"Todas",
      "id":"0",
      "idEmpresa":"GRfgJohSdEvq6yqVUBFo",
      "idMatriz":"DeCofZ7At1eUwsRo9hPs",
      "idUsuario":"YpLYlsIffwelfqtCkSP9"
    });
    this.obtenerRegistros()
  
    })
    
  }
  else {
    this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe((resp: any)=>{
      this.Proyectos=resp
      this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal,proyect.idEmpresa) )
    
      this.Proyectos.push({
        "Activo":true,
        "Editando":false,
        "FechaCreacion":"",
        "Nombre":"Todas",
        "NombreSucursal":"Todas",
        "id":"0",
        "idEmpresa":"GRfgJohSdEvq6yqVUBFo",
        "idMatriz":"DeCofZ7At1eUwsRo9hPs",
        "idUsuario":"YpLYlsIffwelfqtCkSP9"
      });
      this.obtenerRegistros()
    
      })
  }
}

getNameSucursal(idSucursal:any,idEmpresa:string){
  if(idSucursal=='0'){
    return this.getNombreEmpresa(idEmpresa)

  }
  else {
    let sucursal = this.Sucursales.filter((suc: any) => suc.id==idSucursal)
    if(sucursal.length){
      return sucursal[0].Sucursal
    }
    else{
      return 'General'
    }
  }
}

obtenerSocios(){
  this.conS.obtenerSocios(this.usuario.idEmpresa).subscribe(resp=>{
    this.SociosNegocios=resp
  })
}

crearCuenta(){
  
 if(this.authS.validarAtributo('lxq2zstbrTHOplePyDec',[])==true){

  this.visibleCuenta=true
  
 }
 else {
   this.toastr.warning('', '¡Acceso Denegado!',{
     timeOut: 1000,
   });
}


}
crearElemento(){

    
 if(this.authS.validarAtributo('26rZNQ46kHegVjK0rNvq',[])==true){

  this.visibleElemento=true
  
 }
 else {
   this.toastr.warning('', '¡Acceso Denegado!',{
     timeOut: 1000,
   });
}


}
crearSocioNegocio(){
      
 if(this.authS.validarAtributo('qVDT9etHoRfSLoAnfSuK',[])==true){

  this.visibleSocioNegocio=true
  
 }
 else {
   this.toastr.warning('', '¡Acceso Denegado!',{
     timeOut: 1000,
   });
}
  
}
crearTipoOperacion(){
      
 if(this.authS.validarAtributo('qVDT9etHoRfSLoAnfSuK',[])==true){

  this.visibleTipoOperacion=true
  
 }
 else {
   this.toastr.warning('', '¡Acceso Denegado!',{
     timeOut: 1000,
   });
}
  
}

buscarByFecha(){

 if(this.authS.validarAtributo('sAXrUYfJvISYOx6Tbg3L',[])==true){

  this.filtrarByCategoria()
  

 }
 else {
   this.toastr.warning('', '¡Acceso Denegado!',{
     timeOut: 1000,
   });
}


}

filtrarByCategoria(){
let Categorias:any=[]
let ProyectoSeleccionado:any
let SucursaleSeleccionada:any
let RegistrosTotales:any=[]

if(this.SucursaleSeleccionada && this.SucursaleSeleccionada.id!='0'){
  RegistrosTotales=this.registrosBackUp.filter((reg:any)=>reg.TipoRegistro==this.idTipoRegistro && reg.idSucursal== this.SucursaleSeleccionada.id)
  this.calcularImporteSubTotal(RegistrosTotales)

  SucursaleSeleccionada=this.SucursaleSeleccionada.id
}
else if(!this.SucursaleSeleccionada || this.SucursaleSeleccionada.id=='0') {
  SucursaleSeleccionada=''
  this.calcularImporteSubTotal(this.registrosBackUp)

}
if(this.ProyectoSeleccionado && this.ProyectoSeleccionado.id!='0'){
  RegistrosTotales=this.registrosBackUp.filter((reg:any)=>reg.TipoRegistro==this.idTipoRegistro && reg.idProyecto== this.ProyectoSeleccionado.id)
  this.calcularImporteSubTotal(RegistrosTotales)
  ProyectoSeleccionado=this.ProyectoSeleccionado.id
}
else if(!this.ProyectoSeleccionado || this.ProyectoSeleccionado.id=='0') {
  ProyectoSeleccionado=''
  this.calcularImporteSubTotal(this.registrosBackUp)
}
if(this.CategoriasSeleccionadas.length>0){
  Categorias=this.CategoriasSeleccionadas
  
}
else {
  Categorias=[]
}

let _Criterios={
  "idCategoria":Categorias,
  "idSucursal":SucursaleSeleccionada,
  "idProyecto":ProyectoSeleccionado
}

const registrosFiltrados = this.registrosBackUp.filter(registro => {
  // Filtrar por idCategoria solo si está presente en los criterios
  const categoriaMatch = _Criterios.idCategoria.length === 0 || 
  _Criterios.idCategoria.some(cat => cat.id === registro.idCategoria.id);

  // Filtrar por idSucursal solo si el criterio no está vacío
  const sucursalMatch = !_Criterios.idSucursal || registro.idSucursal === _Criterios.idSucursal;

  // Filtrar por idProyecto solo si el criterio no está vacío
  const proyectoMatch = !_Criterios.idProyecto || registro.idProyecto === _Criterios.idProyecto;

  if(this.idTipoRegistro==1){
    return categoriaMatch && sucursalMatch;
  }
  else {
    return categoriaMatch &&  proyectoMatch;
  }

  
});


if(this.FechaDesde.value==''|| this.FechaHasta.value==''){
  let _RegistrosFiltrados:any=[]
  _RegistrosFiltrados=registrosFiltrados.filter((reg:any)=>reg.TipoRegistro==this.idTipoRegistro)
  this.refreshRegistros(_RegistrosFiltrados,true)

}
else {
  let _RegistrosFiltrados:any=[]
  _RegistrosFiltrados=registrosFiltrados.filter((reg:any)=>reg.TipoRegistro==this.idTipoRegistro
  && (reg.FechaRegistro>=this.FechaDesde.value && reg.FechaRegistro<=this.FechaHasta.value)
  
)

this.refreshRegistros(_RegistrosFiltrados,true)
this.FiltrosSideBar=false

}



  
} 
restablecer(){
  this.Registros=this.registrosBackUp.
  filter((reg:any)=>  reg.TipoRegistro == this.idTipoRegistro)

  this.FechaDesde.setValue('')
  this.FechaHasta.setValue('')
  this.CategoriasSeleccionadas=[]
  this.SucursaleSeleccionada= {};
  this.ProyectoSeleccionado= {};
  this.refreshRegistros([],false)

}
obtenerRegistros(){
  if(this.usuario.isAdmin==true){
    let Subscribe:Subscription
    Subscribe=  this.conS.obtenerRegistrosByMatriz(this.usuario.idMatriz).subscribe((resp:any)=>{
      Subscribe.unsubscribe()
               this.registrosBackUp=[]
               this.registrosBackUp= resp.sort((a:any, b:any) => b.Orden - a.Orden)
              //  resp.sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
              //    let _Registro={
              //      "Activo":element.Activo,
              //      "Animation":'animate__animated animate__flipInX',
              //      "ActivarAnimation":false,
              //      "AnioRegistro":element.AnioRegistro,
              //      "Cuenta":element.Cuenta,
              //      "CuentaSeleccionada":[],
              //      "Editando":element.Editando,
              //      "FechaRegistro":element.FechaRegistro,
              //      "MesRegistro":element.MesRegistro,
              //      "NumMes":element.NumMes,
              //      "Orden":element.Orden,
              //      "Valor":element.Valor,
              //      "TipoOperacion":element.TipoOperacion || '',
              //      "Tipo":element.Tipo || '',
              //      "TipoRegistro":element.TipoRegistro,
              //      "id":element.id,
              //      "idAbuelo":element.idFlujo,
              //      "idPadre":element.idCategoria,
              //      "idNieto":element.idNieto,
              //      "idEmpresa":element.idEmpresa,
              //      "idTipo":element.idTipo,
              //      "idMatriz":element.idMatriz,
              //      "idSocioNegocio":element.idSocioNegocio,
              //      "idSucursal":element.idSucursal,
              //      "idProyecto":element.idProyecto || '',
              //      "NumCuenta":element.Cuenta.Cuenta || '',
              //      "Comentarios":element.Comentarios || '',
           
              //    }
              //    this.registrosBackUp.push(_Registro)
              //  })
               this.refreshRegistros([],false)

               setTimeout(() => {
                this.syncScroll();
              }, 0);
      })

  }
  else {
    let Subscribe:Subscription
    Subscribe= this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    Subscribe.unsubscribe()
    this.registrosBackUp=[]
    this.registrosBackUp= resp.sort((a:any, b:any) => b.Orden - a.Orden)
    // resp.sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
    //              let _Registro={
    //                "Activo":element.Activo,
    //                "Animation":'animate__animated animate__flipInX',
    //                "ActivarAnimation":false,
    //                "AnioRegistro":element.AnioRegistro,
    //                "Cuenta":element.Cuenta,
    //                "CuentaSeleccionada":[],
    //                "Editando":element.Editando,
    //                "FechaRegistro":element.FechaRegistro,
    //                "MesRegistro":element.MesRegistro,
    //                "NumMes":element.NumMes,
    //                "Orden":element.Orden,
    //                "Valor":element.Valor,
    //                "TipoOperacion":element.TipoOperacion || '',
    //                "Tipo":element.Tipo || '',
    //                "TipoRegistro":element.TipoRegistro,
    //                "id":element.id,
    //                "idAbuelo":element.idFlujo,
    //                "idPadre":element.idCategoria,
    //                "idNieto":element.idNieto,
    //                "idEmpresa":element.idEmpresa,
    //                "idTipo":element.idTipo,
    //                "idMatriz":element.idMatriz,
    //                "idSocioNegocio":element.idSocioNegocio,
    //                "idSucursal":element.idSucursal,
    //                "idProyecto":element.idProyecto || '',
    //                "NumCuenta":element.Cuenta.Cuenta || '',
    //                "Comentarios":element.Comentarios || '',
           
    //              }
    //   this.registrosBackUp.push(_Registro)
    // })
    this.refreshRegistros([],false)

    setTimeout(() => {
      this.syncScroll();
    }, 0);

  })

  }


 
}

refreshRegistros(RegistrosFiltrados:any,Filtro:boolean) {




  if(RegistrosFiltrados.length==0 && Filtro==false){
    this.Registros = [];
    
    let registrosFiltrados = [];
  
    if (this.idTipoRegistro == 1) {
      if (this.SucursaleSeleccionada != undefined && Object.keys(this.SucursaleSeleccionada).length > 0) {
        registrosFiltrados = this.registrosBackUp.filter(
          (reg: any) => reg.TipoRegistro == this.idTipoRegistro && reg.idSucursal == this.SucursaleSeleccionada.id
        );
      } 
      
      else {
        registrosFiltrados = this.registrosBackUp.filter(
          (reg: any) => reg.TipoRegistro == this.idTipoRegistro
        );
      }

    } 
    
    else {
      if (this.ProyectoSeleccionado != undefined && Object.keys(this.ProyectoSeleccionado).length > 0) {
        registrosFiltrados = this.registrosBackUp.filter(
          (reg: any) => reg.TipoRegistro == this.idTipoRegistro && reg.idProyecto == this.ProyectoSeleccionado.id
        );
      } else {
        registrosFiltrados = this.registrosBackUp.filter(
          (reg: any) => reg.TipoRegistro == this.idTipoRegistro
        );
      }
    }


    // Actualiza collectionSize con el número total de registros filtrados
    this.collectionSize = registrosFiltrados.length;
  
    // Ordena y aplica paginación
    this.Registros = registrosFiltrados
      .sort((a: any, b: any) => b.Orden - a.Orden)
      // .map((registro, i) => ({ id: i + 1, ...registro }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
      console.log('Registros',this.Registros)
    // Actualiza otros cálculos
    
  }

  else {
    this.collectionSize = RegistrosFiltrados.length;

    // Ordena y aplica paginación
    this.Registros = RegistrosFiltrados
      .sort((a: any, b: any) => b.Orden - a.Orden)
      .map((registro, i) => ({ id: i + 1, ...registro }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  this.calcularImporteSubTotal(this.Registros);
  this.calcularImporteTotal(this.Registros);

  this.OrdenMax = this.Registros.reduce((maxOrden, objeto) => {
    return Math.max(maxOrden, objeto.Orden);
  }, 0);

  this.cargarFormulario();
  this.cargando = false;
}

switchTipoRegistro(idTipo: number) {
  this.cargando = true;

  // Caso donde no hay proyectos
  if (idTipo === 2 && this.Proyectos.length === 0) {
    this.registroForm.value.idSucursal = '';
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'No tiene proyectos creados',
      showConfirmButton: false,
      timer: 1500
    });
    this.idTipoRegistro = 1;
    this.ProyectoSeleccionado = {};
  } else {
    // Asigna el nuevo tipo de registro y filtra datos
    this.idTipoRegistro = idTipo;
    this.Registros = this.registrosBackUp
      .filter((reg: any) => reg.TipoRegistro === idTipo)
      .sort((a: any, b: any) => b.Orden - a.Orden);

    // Filtra Items si es necesario
    this.Items = this.ItemsBack.filter((item: any) => item.TipoRubro === this.idTipoRegistro);
  }

  // Recalcula importes
  this.calcularImporteSubTotal(this.Registros);
  this.calcularImporteTotal(this.Registros);

  this.cargando = false;
  this.OpcionesSideBar = false;

  // Espera un tick para que la tabla se renderice y luego recalcula las barras
  setTimeout(() => {
    this.syncScroll();
  }, 150);
}



renderizarBarra(){
  setTimeout(() => {
    this.syncScroll();
  }, 150);
}

calcularImporteTotal(registros:any){
  this.ImporteTotal=0
  registros.forEach((element:any) => {
    this.ImporteTotal+= element.Valor=='' ? 0 : element.Valor
  });
}
calcularImporteSubTotal(registros:any){
 
  this.ImporteSubTotal=0
  registros.forEach((element:any) => {
    this.ImporteSubTotal+= element.Valor=='' ? 0 : element.Valor
  });
}
getWeek(date: Date): number {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + yearStart.getDay() + 1) / 7);
  return weekNo;
}
validarEgreso(tipo:any,monto:any,index:any){
  let _RegistroEncontrado:any=[]
  let ValorRegistro:any

  _RegistroEncontrado=this.Registros.find((reg:any)=>reg.Orden==index)
if(typeof monto=='string'){
  ValorRegistro=Number(_RegistroEncontrado.Valor.replace('$','')) 
}
else {
  ValorRegistro=_RegistroEncontrado.Valor
}

  if(ValorRegistro >0 && tipo==2){
    this.isNegativo=false
    return false
  }
  else {
    this.isNegativo=true

    return true
  }
}



getTipo(idCategoria){

  let _Tipo:any=[]
  _Tipo=this.Categorias.find(cat=> cat.id==idCategoria)

  if(_Tipo){
    return  _Tipo.Tipo
  }
  else {
    return 'Calculado'
  }
}

validateInput(value: string): boolean {
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
  return regex.test(value);
}

formatearNumero(input: HTMLInputElement,Tipo:any) {

  let valor :any
  let Simbolo=Tipo==1 ? '$ ' : '-$ '
  if(Tipo==2 ){

    valor = input.value.replace(/[\s\-$]/g, '')
    }
  else {
    valor = input.value.replace(/[\s$]/g, '')
      
  }

  if (!isNaN(+valor)) {
    input.value =
     `${Simbolo} ${Number(valor).toLocaleString('en-US')}`
  }
}
salvarRegistro(Registro:any,Valor:any){
  console.log('Registro',Registro)


  let ValorRegistro:any=0

  if( Registro.idTipo==2){
    ValorRegistro= Number(Valor.replace(/[\s$,\-]/g, ''))<0 ?  Number(Valor.replace(/[\s$,\-]/g, ''))*-1 : Number(Valor.replace(/[\s$,\-]/g, ''))
  }
  else {
    ValorRegistro=Number(Valor.replace(/[\s$,\-]/g, ''))
  }


   if(Registro.CuentaSeleccionada.Tipo=='Padre' && Registro.CuentaSeleccionada.children.length>0){
   Swal.fire({
     position: "center",
     icon: "warning",
     title: "Debe seleccionar una sub-cuenta",
     showConfirmButton: false,
     timer: 1500
   });
   }

   else {
     if(Registro.CuentaSeleccionada.Tipo=='Hijo'){
       Registro.idPadre=Registro.CuentaSeleccionada.idPadre
       Registro.idAbuelo=Registro.CuentaSeleccionada.idAbuelo
       Registro.idNieto=Registro.CuentaSeleccionada.id
       Registro.idHijo=Registro.CuentaSeleccionada.ItemId
     }
   
    else if(Registro.CuentaSeleccionada.Tipo=='Padre' && Registro.CuentaSeleccionada.children.length==0){
       Registro.idPadre=Registro.CuentaSeleccionada.idPadre
       Registro.idAbuelo=Registro.CuentaSeleccionada.idAbuelo
       Registro.idHijo=Registro.CuentaSeleccionada.ItemId
       Registro.idNieto=""
     }

   
     Registro.NumCuenta=Registro.Cuenta.Cuenta
     Registro.Valor=ValorRegistro
     Registro.idSocioNegocio=Registro.idSocioNegocio.id
     console.log('RegistroFormat',Registro)
     console.log('ValorRegistro',ValorRegistro)
   
   

   }

  // Registro.Elemento=this.getCuentabyCategoria(Registro.idCategoria).filter((reg:any)=>reg.label==Registro.NombreElemento)[0]
// if(this.validateInput(this.quitarSimbolo(Valor))==true){
//   Swal.fire({
//     position: "center",
//     icon: "warning",
//     title: "El valor no debe contener letras ni simbolos",
//     showConfirmButton: false,
//     timer: 1500
//   });
// }
// else if (Number(this.quitarSimbolo(Valor))>=0 && Registro.Tipo==2  ){
//   console.log('valor',Number(this.quitarSimbolo(Valor)))
//   Swal.fire({
//     position: "center",
//     icon: "warning",
//     title: "El valor debe ser negativo",
//     showConfirmButton: false,
//     timer: 1500
//   })
// }
//else {
  // if(this.validarEgreso(Registro.idTipo,Number(this.quitarSimbolo(Valor)),Registro.Orden)==false){
  //   console.log('Registro',Number(this.quitarSimbolo(Valor)))
  //   Swal.fire({
  //     position: "center",
  //     icon: "warning",
  //     title: "El valor debe ser negativo",
  //     showConfirmButton: false,
  //     timer: 1500
  //   });
  // }


  //  if(Registro.CuentaSeleccionada=="" || Registro.CuentaSeleccionada==undefined){
  //     Swal.fire({
  //       position: "center",
  //       icon: "warning",
  //       title: "Debe elegir una cuenta contable",
  //       showConfirmButton: false,
  //       timer: 1500
  //     });
  
  //   }
  // else  if(this.quitarSimbolo(Valor)==""  || Number(this.quitarSimbolo(Valor))==0 )
    
  //   { 
  //     Swal.fire({
  //       position: "center",
  //       icon: "warning",
  //       title: "Debe colocar un valor",
  //       showConfirmButton: false,
  //       timer: 1500
  //     });
  
  //   }
  
  
  //   else {
  //     console.log('Registro',Registro)
  //     let _categoriaEncontrada:any=[]
  //     let _MesRegistro:any=[]
  //     _MesRegistro=this.MesesTodos.filter((mes:any)=>mes.id==this.getMonthName(Registro.FechaRegistro))
  //     _categoriaEncontrada=this.Categorias.find(cat=> cat.id==Registro.Elemento.idCategoria)
  //     Registro.idCategoria=_categoriaEncontrada
  //     Registro.Tipo=this.getTipo(Registro.Elemento.idCategoria)
  //     Registro.Semana=this.getWeek(Registro.FechaRegistro)
  //     Registro.NumSemana=this.getWeek(Registro.FechaRegistro)
  //     Registro.MesRegistro=_MesRegistro[0].Mes
  //     Registro.NumMes=_MesRegistro[0].id
  //     Registro.AnioRegistro=new Date(Registro.FechaRegistro).getFullYear()
  //     Registro.idUsuario=this.usuario.id
  //     Registro.idProyecto=this.getIdProyecto(Registro.Proyecto)
  //     Registro.idSucursal=this.getIdSucursal(Registro.Sucursal)

  //     if(Registro.Tipo==1 && Number(  this.quitarSimbolo(Valor))<0){
  //       Registro.Valor=Number(  this.quitarSimbolo(Valor))*-1
  //       Registro.Valor2=Number(  this.quitarSimbolo(Valor))*-1
  //     }
  //     else if (Registro.Tipo==2 && Number(  this.quitarSimbolo(Valor))>=0)
  //     {
  //       Registro.Valor=Number(  this.quitarSimbolo(Valor))*-1
  //       Registro.Valor2=Number(  this.quitarSimbolo(Valor))*-1
  //     }
  //     else {
  //       Registro.Valor=Number(  this.quitarSimbolo(Valor))
  //       Registro.Valor2=Number(  this.quitarSimbolo(Valor))
  //     }
  //     Registro.Usuario=this.usuario.Usuario
  //     this.Registros.filter((reg:any)=>reg.id==Registro.id)[0].Valor=Registro.Valor
  //     this.Registros.filter((reg:any)=>reg.id==Registro.id)[0].Valor2=Registro.Valor
   
     

  //     // this.conS.ActualizarRegistro(Registro).then(resp=>{
  //     //       this.toastr.success('Guardado', '¡Exito!');
  //     //       this.calcularImporteTotal(this.Registros)
  //     //       this.calcularImporteSubTotal(this.Registros)
  //     //   })
  
    

  // }

//}
}

getIdProyecto(proyectoNombre){
  let _idProyecto:any=[]
  _idProyecto=this.Proyectos.filter((proyect:any)=>proyect.NombreSucursal==proyectoNombre)
  if(_idProyecto.length>0){
    return _idProyecto[0].id
  }
  else {
    return ''
  }
}
getIdSucursal(nombre){
  let _idSucursal:any=[]
  _idSucursal=this.Sucursales.filter((proyect:any)=>proyect.Nombre==nombre)
  if(_idSucursal.length>0){
    return _idSucursal[0].id
  }
  else {
    return ''
  }
}

// obtenerRegistrosPromise(){
//   this.conS.obtenerRegistrosPromise(this.usuario.idEmpresa).then((resp =>{
//     this._Registros = resp;
//     console.log("promiseRegistros", this._Registros);
//   }))
// }



addRow() {
  const newRow: Registro = {
    id: '',
    Elemento: '',
    idFlujo : '',
    idCategoria: '',
    Cuenta: '',
    idSocioNegocio: '',
    Valor: '',
    FechaRegistro: '',
    
   
  };
  this._Registros = [newRow, ...this._Registros];


}

quitarSimbolo(valor: string): string {

  if ( typeof valor=='string' && valor.startsWith('$')) {
    return valor.replace(/[$,]/g, "");

  }
else  if ( typeof valor=='string' && valor.startsWith('-$')) {
    return valor.replace(/[-$,]/g, "");

  }
  else {
    return valor
  }
}




getItemsByCategory(idCategoria:string){
  let _Items:any=[]
  let _ItemFormat:any=[]
  _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria)
  _Items.forEach(item => {
    let _ItemFormatSingle ={
      "label": item.Nombre,
      "id":item.id,
      "idCategoria":item.idCategoria
    }
    _ItemFormat.push(_ItemFormatSingle)
    
  });
  
  return _ItemFormat;
}

obtenerCategorias(){
  this.conS.obtenerCategoriasFlujos().subscribe(resp=>{
    this.Categorias=resp.filter((data:any)=>data.Tipo!=3 && data.Mostrar==true)
  
    this.CategoriasTodas=resp.filter((re:any)=>re.Mostrar==true)
    this.Categorias.forEach((element)=>{
      let _GroupItems= {
        label:element.Nombre,
        Tipo: element.Tipo,
        items:this.getItemsByCategory(element.id)
      }
      this.ItemsCategGroup.push( _GroupItems);
    })
    this.ItemsCategGroupBack=this.ItemsCategGroup

  })
}


getHijosByCuenta(CuentasHijos:any,OrdenPadre:any,idPadre:any,idCuentaPadre:any,idAbuelo:any){
  let _CuentasHijos:any=[]
  CuentasHijos.forEach(element => {
    _CuentasHijos.push({
      key: `${OrdenPadre}-${element.Orden}`,
      label: element.Nombre,
      leaf: true,
      Tipo:'Hijo',
      idPadre: idPadre,
      idAbuelo: idAbuelo,
      id: element.id,
      ItemId: idCuentaPadre,
      data: 'Work Folder',
      icon: 'pi pi-fw pi-cog',
    })
  });

  return _CuentasHijos

}
getCuentabyCategoria(Categoria:any){

let cuentaContable:any=[]

this.ItemsBack.filter((item:any)=> (item.idPadre==Categoria.id || item.idPadre==Categoria)
&& item.TipoRubro==this.idTipoRegistro


).forEach((cuenta:any) => {
  cuentaContable.push({
    key: `${cuenta.Orden}`,
    label: cuenta.Nombre,
    Tipo:'Padre',
    ItemId: cuenta.id,
    idPadre:cuenta.idPadre,
    idAbuelo:cuenta.idAbuelo,
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
    expanded: true,
    children:cuenta.CuentasHijos==undefined ? [] : 
    this.getHijosByCuenta(cuenta.CuentasHijos,cuenta.Orden,cuenta.idPadre,cuenta.id,cuenta.idAbuelo)

  })
  
});


return cuentaContable

}

getCuentaSeleccionada(cuenta:any){

  const ItemsBack = [...this.ItemsBack]
  let ItemEncontrado=ItemsBack.filter((it:any)=>it.Nombre==cuenta && it.TipoRubro==this.idTipoRegistro )
  console.log('ItemEncontrado',ItemEncontrado)
  this.CuentasHijos=ItemEncontrado[0].CuentasHijos
}


getMonthName(Fecha:string){
  return Number((Fecha.substring(5)).substring(0,2))
 }
obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.ItemsBack=resp
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.idTipoRegistro)
    
  })
}
obtenerCuentas(){
  this.conS.obtenerCuentas(this.usuario.idEmpresa).subscribe(resp=>{
    this.cuentas=resp

  })
}

getCategoriasByTipo(tipo:any){
  let categorias:any=[]
  categorias=this.Categorias.filter((cat:any)=>cat.Tipo==tipo)

  return categorias
}
crearRegistro(tipo:any) {

  if(this.authS.validarAtributo('Oc1llyeOkxfUlMz96F0a',[])==true && tipo==1){

    this.guardarRegistro(tipo)
   // this.obtenerRegistros()
    
   }
 else if(this.authS.validarAtributo('Uzt6wv7KRCcTOp63coNJ',[])==true && tipo==2){

    this.guardarRegistro(tipo)
   // this.obtenerRegistros()
 
   }
   else {
     this.toastr.warning('', '¡Acceso Denegado!',{
       timeOut: 1000,
     });
  }



}

getNameFlujo(idCategoria:string){

let CategoriaFlujos:any=this.CategoriasTodas.filter((categ:any)=>categ.Tipo==3
&& categ.idCateg!='4'
&& categ.Categorias.some((categ: any) => categ.idCategoria == idCategoria)

)

if(CategoriaFlujos.length>0){
  return CategoriaFlujos[0].Nombre
}
else {
  return ''
}

}
descargarRegistros(){
  let _RegistrosDescargar:any=[]
  const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Registros');
if(this.idTipoRegistro=1){
  this.Registros.forEach(element => {
    _RegistrosDescargar.push(
      {
        "Orden":element.Orden,
        "Fecha":element.FechaRegistro,
        "Categoría":element.CategoriaNombre,
        "Cuenta Contable":element.NombreElemento,
        "Flujo":this.getNameFlujo(element.idCategoria.id),
        "Cuenta Bancaria":element.NumCuenta,
        "Sucursal":element.Sucursal,
        "Importe":element.Valor,
        "Socio Negocio":element.SocioNegocio,
        "Comentario":element.Comentarios
      }


    )
  });

  worksheet.columns = [
    { header: 'Orden', key: 'Orden', width: 10 },
    { header: 'Fecha', key: 'Fecha', width: 15 },
    { header: 'Categoría', key: 'Categoría', width: 60 },
    { header: 'Cuenta Contable', key: 'Cuenta Contable', width: 60 },
    { header: 'Flujo', key: 'Flujo', width: 60 },
    { header: 'Cuenta Bancaria', key: 'Cuenta Bancaria', width: 20 },
    { header: 'Sucursal', key: 'Sucursal', width: 25 },
    { header: 'Importe', key: 'Importe', width: 15 },
    { header: 'Socio Negocio', key: 'Socio Negocio', width: 25 },
    { header: 'Comentario', key: 'Comentario', width: 25 },
  ];

}
else {
  this.Registros.forEach(element => {
    _RegistrosDescargar.push(
      {
        "Orden":element.Orden,
        "Fecha":element.FechaRegistro,
        "Categoría":element.CategoriaNombre,
        "Cuenta Contable":element.NombreElemento,
        "Flujo":this.getNameFlujo(element.idCategoria.id),
        "Cuenta Bancaria":element.NumCuenta,
        "Proyecto":element.Proyecto,
        "Importe":element.Valor,
        "Socio Negocio":element.SocioNegocio,
        "Comentario":element.Comentarios
      }


    )
  });

  worksheet.columns = [
    { header: 'Orden', key: 'Orden', width: 10 },
    { header: 'Fecha', key: 'Fecha', width: 15 },
    { header: 'Categoría', key: 'Categoría', width: 60 },
    { header: 'Cuenta Contable', key: 'Cuenta Contable', width: 60 },
    { header: 'Flujo', key: 'Flujo', width: 60 },
    { header: 'Cuenta Bancaria', key: 'Cuenta Bancaria', width: 20 },
    { header: 'Proyecto', key: 'Proyecto', width: 25 },
    { header: 'Importe', key: 'Importe', width: 15 },
    { header: 'Socio Negocio', key: 'Socio Negocio', width: 25 },
    { header: 'Comentario', key: 'Comentario', width: 25 },
  ];
  
}






worksheet.getRow(1).eachCell((cell) => {
  cell.font = { bold: true, size: 12 };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCFFCC' }, 
  };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
});

_RegistrosDescargar.forEach((registro) => {
  worksheet.addRow(registro);
});


worksheet.getColumn('Importe').numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

workbook.xlsx.writeBuffer().then((data) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Registros.xlsx');
});

}
getItemsCategGroup(tipo:any){

  let _Categorias:any=[]
  _Categorias=this.ItemsCategGroupBack
  this.ItemsCategGroup=_Categorias.filter((cat:any)=>cat.Tipo==tipo)
  return this.ItemsCategGroup

}

get selectedCategoria() {
  return this.Categorias.find((cat:any):any => cat.id === this.EditRegistroForm.value.idCategoria);
}



getWeekNumber() {
 let d:any = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  let yearStart:any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNumber
}

getIdItem(idItem:string){
  this.idItem=idItem
}

getNombreSucursal(idSucursal:any){
  let _SucursalEncontrada:any=this.Sucursales.find((suc:any)=>suc.id==idSucursal)
  if(_SucursalEncontrada){
    return _SucursalEncontrada.Nombre
  }
  else {
    return ''
  }
}

cargarFormulario(){
  let _Fecha:any=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
  this.registroForm = new FormGroup({
    Cuenta: new FormControl('',[Validators.required]), 
    Valor: new FormControl(0,[Validators.required]), 
    NumMes: new FormControl(this.getMonthName(_Fecha)), 
    AnioRegistro: new FormControl(new Date().getFullYear()), 
    MesRegistro:new FormControl(this.MesesTodos[this.getMonthName(_Fecha)].Mes),
    Activo: new FormControl(true), 
    Nuevo: new FormControl(true), 
    Editando: new FormControl(true), 
    Orden: new FormControl(this.OrdenMax+1),
    idSocioNegocio: new FormControl(''), 
    idEmpresa: new FormControl(this.usuario.idEmpresa), 
    idMatriz: new FormControl(this.usuario.idMatriz), 
    idPadre: new FormControl('',[Validators.required]), 
    idAbuelo: new FormControl('',[Validators.required]), 
    idNieto: new FormControl('',[Validators.required]), 
    TipoOperacion: new FormControl(''), 
    CuentaSeleccionada: new FormControl(''),
    NumCuenta:new FormControl('NumCuenta'),
    Comentarios:new FormControl(''),
    idSucursal: new FormControl(""), 
    FechaRegistro: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
   })
}
openNew() {
    this.registro = {};
    this.submitted = false;
    this.registroDialog = true;
}

onRowEditInit(registro: Registro) {
  
  this.clonedRegistros[registro.id as string] = { ...registro };
}

deleteSelectedProducts() {

}

deleteProduct(producto:any){

}
editProduct(producto:any){

}

hideDialog() {
  this.registroDialog = false;
  this.submitted = false;
}
guardarRegistro(idTipo:number){
this.registroForm.value.idTipo=idTipo;
this.registroForm.value.TipoRegistro=this.idTipoRegistro;

this.registroForm.value.idSucursal=this.SucursaleSeleccionada==undefined ? "":this.SucursaleSeleccionada.id;
this.registroForm.value.idProyecto=this.ProyectoSeleccionado==undefined ? "":this.ProyectoSeleccionado.id;
this.registroForm.value.Seleccionado=false

const coleccionRef = this.firestore.collection('Registro');
const nuevoDocRef = coleccionRef.doc().ref;
const nuevoId = nuevoDocRef.id;

this.OrdenMax = this.registrosBackUp
.filter((r:any)=>r.TipoRegistro==this.idTipoRegistro)
.reduce((maxOrden, objeto) => {
  return Math.max(maxOrden, objeto.Orden);
}, 0);
let _Registro={
  "Activo":this.registroForm.value.Activo,
  "Animation":'animate__animated animate__flipInX',
  "ActivarAnimation":true,
  "AnioRegistro":this.registroForm.value.AnioRegistro,
  "Cuenta":this.registroForm.value.Cuenta,
  "Editando":this.registroForm.value.Editando,
  "Seleccionado":false,
  "FechaRegistro":this.registroForm.value.FechaRegistro,
  "MesRegistro":this.registroForm.value.MesRegistro,
  "NumMes":this.registroForm.value.NumMes,
  "Orden":  this.OrdenMax+1 ,
  "Valor":this.registroForm.value.Valor,
  "TipoOperacion":this.registroForm.value.TipoOperacion || '',
  "Tipo":this.registroForm.value.Tipo || '',
  "TipoRegistro":this.idTipoRegistro,
  "id":nuevoId,
  "idAbuelo":this.registroForm.value.idPadre,
  "idPadre":this.getIdAbuelo(this.registroForm.value.idPadre),
  "idNieto":"",
  "idEmpresa":this.registroForm.value.idEmpresa,
  "idTipo":idTipo,
  "idMatriz":this.registroForm.value.idMatriz,
  "idSocioNegocio":this.registroForm.value.idSocioNegocio,
  "idSucursal":this.registroForm.value.idSucursal,
  "idProyecto":this.registroForm.value.idProyecto ||'',
  "NumCuenta":this.registroForm.value.Cuenta.Cuenta || '',
  "Comentarios":this.registroForm.value.Comentarios || '',
}
console.log('_Registro',_Registro)

this.registrosBackUp.push(_Registro)
this.refreshRegistros([],false)
this.registroForm.value.id=nuevoId
this.cargarFormulario()
this.conS.crearRegistro(_Registro).then(id => {
this.renderizarBarra()
}).catch(error => {
  console.error('Error al crear el registro:', error);
});

}

getIdAbuelo(idPadre:string){
  let Padre=this.Categorias.find((cat:any)=>cat.id==idPadre)
  if(Padre){
    return Padre.idAbuelo
  }
  else {
    return ""
  }

}

async copiarRegistro(registro: any) {
  try {
    // 1) Realiza una copia profunda del registro y elimina el id para asignarle uno nuevo.
    const RegistroCopiado: any = JSON.parse(JSON.stringify(registro));
    delete RegistroCopiado.id;

    // 2) Obtén una referencia a la colección y genera un nuevo ID
    const coleccionRef = this.firestore.collection('Registro');
    const nuevoDocRef = coleccionRef.doc().ref;
    const nuevoId = nuevoDocRef.id;
    RegistroCopiado.id = nuevoId;

    // 3) Guarda el orden original y filtra los registros que deben ser actualizados
    const ordenOriginal = registro.Orden;
    const _RegistrosPost = this.registrosBackUp
    .filter((reg: any) => reg.Orden > ordenOriginal
    && reg.TipoRegistro==this.idTipoRegistro
    );

    // 4) Crea un batch para actualizar los registros posteriores y para crear el nuevo registro
    const batch = this.firestore.firestore.batch();

    // Actualiza los documentos cuyo Orden sea mayor que el del registro original
    if (_RegistrosPost.length > 0) {
      for (const element of _RegistrosPost) {
        const docRef = coleccionRef.doc(element.id).ref;
        // Verifica si el documento existe
        const snapshot = await docRef.get();
        if (snapshot.exists) {
          // Si existe, incrementa su Orden y añade la actualización al batch
          element.Orden += 1;
          batch.update(docRef, { Orden: element.Orden });
        } else {
          console.warn(`Documento ${element.id} no existe, se omite update.`);
        }
      }
    }

    // 5) Asigna el nuevo Orden al registro copiado
    RegistroCopiado.Orden = ordenOriginal + 1;
    RegistroCopiado.ActivarAnimation = true;

    // 6) Agrega la creación del nuevo registro al batch
    batch.set(nuevoDocRef, RegistroCopiado);

    // 7) Espera a que se ejecute el batch
    await batch.commit();

    // 8) Actualiza la lista local y refresca la vista
    this.registrosBackUp.push(RegistroCopiado);
    this.refreshRegistros([], false);

  } catch (error) {
    console.error('Error al copiar registro:', error);
    this.toastr.error('Error al copiar registro', 'Error');
  }
}



getSelectedItemsLabel(): string {
  const count = this.CategoriasSeleccionadas ? this.CategoriasSeleccionadas.length : 0;
  
  return count >= 2 ? `${count} categorías seleccionadas` : null;
}
ActualizarRegistro(){
  this.conS.ActualizarRegistro(this.EditRegistroForm.value).then(resp=>{
    this.visibleEditar=false
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Registro actualizado",
      showConfirmButton: false,
      timer: 1500
    });
  })
}

DesactivarRegistro(idRegistro:any){
  Swal.fire({
    title: "¿Desea borrar este registro?",
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: `No`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.conS.DesactivarRegistro(idRegistro).then(resp=>{
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registro eliminado",
          showConfirmButton: false,
          timer: 1500
        });
      })
    } else if (result.isDenied) {
   
    }
  });

}

}
