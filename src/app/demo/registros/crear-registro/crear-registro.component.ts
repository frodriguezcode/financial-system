// angular import
import { Component, Injectable, OnInit, importProvidersFrom } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CalendarModule } from 'primeng/calendar';

import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import BancosComponent from '../../bancos/bancos.component';
import ItemsComponent from '../../Items/items.component';
import SocioNegocioComponent from '../../socios/socios.component';
import { AuthService } from 'src/app/services/auth.service';

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
    ItemsComponent,
    SocioNegocioComponent
    
   ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss'],
  providers: [MessageService]
})
export default class CrearRegistroComponent implements OnInit {
  constructor(
    private conS:ConfigurationService,private datePipe: DatePipe, 
    private messageService: MessageService,
    private toastr: ToastrService,
    private authS:AuthService
  ){}
  registroForm!:FormGroup
  EditRegistroForm!:FormGroup
  registroDialog: boolean = false;
  visible: boolean = false;
  visibleEditar: boolean = false;
  visibleCuenta: boolean = false;
  visibleElemento: boolean = false;
  visibleSocioNegocio: boolean = false;
  submitted: boolean = false;
  isNegativo: boolean = true;
  registros: any=[];
  registrosBackUp: any=[];
  // *Registros desde la promesa
  _Registros: Registro[];
  clonedRegistros: { [s: string]: Registro } = {};


  // *Registros desde la promesa
  inputVal = ''; // Initialize inputVal to be empty
  FechaDesde:FormControl=new FormControl()
  FechaHasta:FormControl=new FormControl()

  cuentas: any=[];
  selectedRegistros!: any[] | null;
  registro: any=[];
  itemSeleccionado: any;
  itemsFiltrados: any;
  // Categorias: any=[];
  Categorias!: SelectItem[] | any;
  SociosNegocios: any=[];
  MesesTodos: any=[];
  Registros: any=[];
  Items: any=[];
  ItemSeleccionados: any=[];
  usuario:any
  idItem:any=''
  Departamentos: string[] = [];
  ItemsCategGroup:any= [];
  ItemsCategGroupBack:any= [];
  OrdenMax: number = 0;
  Sucursales: any=[];
  Flujos: any = [
    {id: "1", name: "Banco"},
    {id: "2", name: "Caja"},
    
  ]

  Fecha:any= new Date();
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
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerSucursales()
  this.obtenerItems()
  this.obtenerCuentas()
  this.obtenerSocios()
  this.obtenerCategorias()



}
obtenerSucursales(){
  this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe(resp=>{
    this.Sucursales=resp
    console.log('Sucursales',this.Sucursales)
    this.obtenerRegistros()
  })
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

buscarByFecha(){

 if(this.authS.validarAtributo('sAXrUYfJvISYOx6Tbg3L',[])==true){

  this.Registros=this.registrosBackUp.
  filter((reg:any)=>reg.FechaRegistro>=this.FechaDesde.value && reg.FechaRegistro<=this.FechaHasta.value)
  
 }
 else {
   this.toastr.warning('', '¡Acceso Denegado!',{
     timeOut: 1000,
   });
}

}
restablecer(){
  this.Registros=this.registrosBackUp
}
obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Registros=[]
    resp.sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
      let _Registro={
        "Activo":element.Activo,
        "AnioRegistro":element.AnioRegistro,
        "Cuenta":element.Cuenta,
        "Editando":element.Editando,
        "Elemento":element.Elemento,
        "FechaRegistro":element.FechaRegistro,
        "MesRegistro":element.MesRegistro,
        "Nuevo":element.Nuevo,
        "NumMes":element.NumMes,
        "NumSemana":element.NumSemana,
        "Orden":element.Orden,
        "Semana":element.Semana,
        "Valor":element.Valor,
        "Tipo":element.Tipo || '',
        "id":element.id,
        "idCategoria":element.idCategoria,
        "idEmpresa":element.idEmpresa,
        "idFlujo":element.idFlujo,
        "idTipo":element.idTipo,
        "idMatriz":element.idMatriz,
        "idSocioNegocio":element.idSocioNegocio,
        "idSucursal":element.idSucursal,
        "Sucursal":element.Sucursal || '',
        "NombreElemento":element.Elemento.label || '',
        "NumCuenta":element.Cuenta.Cuenta || '',
        "CategoriaNombre":element.idCategoria.Nombre || '',
        "SocioNegocio":element.idSocioNegocio.Nombre || '',

      }
      this.Registros.push(_Registro)
    })
    console.log('Registros',this.Registros)
    this.registrosBackUp=this.Registros
 
    this.OrdenMax = this.Registros.reduce((maxOrden, objeto) => {
      return Math.max(maxOrden, objeto.Orden);
  }, 0);
    this.cargarFormulario()
  })
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
  _RegistroEncontrado=this.Registros.find((reg:any)=>reg.Orden==index)
  if(_RegistroEncontrado.Valor>0 && tipo==2){
    this.isNegativo=false
    return false
  }
  else {
    this.isNegativo=true
    return true
  }
}
borrarRegistro(idRegistro){
  if(this.authS.validarAtributo('sAXrUYfJvISYOx6Tbg3L',[])==true){

    Swal.fire({
      title: "¿Desea borrar este registro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.conS.borrarRegistro(idRegistro).then(resp=>{
  
  
        })
       
      }
    });
    
   }
   else {
    this.toastr.warning('', '¡Acceso Denegado!',{
      timeOut: 1000,
    });
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


salvarRegistro(Registro:any){
  if(this.validarEgreso(Registro.idTipo,Registro.Valor,Registro.Orden)==false){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "El valor debe ser negativo",
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
    if(Registro.Elemento==""){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Debe elegir un elemento",
        showConfirmButton: false,
        timer: 1500
      });
  
    }
  else  if(Registro.Valor==""  || Number(Registro.Valor)==0 )
    { 
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Debe colocar un valor",
        showConfirmButton: false,
        timer: 1500
      });
  
    }
  
  else  if(Registro.idFlujo==""){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Debe elegir un flujo (caja o banco)",
        showConfirmButton: false,
        timer: 1500
      });
  
    }
  
    if(Registro.idFlujo.id=="1" && Registro.Cuenta==""){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Debe colocar una cuenta de banco",
        showConfirmButton: false,
        timer: 1500
      });
  
    }
  
    else {
      let _categoriaEncontrada:any=[]
      let _MesRegistro:any=[]
      _MesRegistro=this.MesesTodos.filter((mes:any)=>mes.id==this.getMonthName(Registro.FechaRegistro))
      _categoriaEncontrada=this.Categorias.find(cat=> cat.id==Registro.Elemento.idCategoria)
      Registro.idCategoria=_categoriaEncontrada
      Registro.Tipo=this.getTipo(Registro.Elemento.idCategoria)
      Registro.Semana=this.getWeek(Registro.FechaRegistro)
      Registro.NumSemana=this.getWeek(Registro.FechaRegistro)
      Registro.MesRegistro=_MesRegistro[0].Mes
      Registro.NumMes=_MesRegistro[0].id
      Registro.AnioRegistro=new Date(Registro.FechaRegistro).getFullYear()
      Registro.idUsuario=this.usuario.id
      Registro.TipoRegistro="Normal"
      Registro.Valor=Number(Registro.Valor)
      Registro.Usuario=this.usuario.Usuario
      
      this.conS.ActualizarRegistro(Registro).then(resp=>{
            this.toastr.success('Guardado', '¡Exito!');
        })
  
    }

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


onRowEditSave(registro: Registro){
  if (registro.Elemento != '') {
    delete this.clonedRegistros[registro.id as string];
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Registro creado | actualizado',
    });
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Registro no valido',
    });
  }

}


onRowEditCancel(registro: Registro, index: number) {
  this._Registros[index] = this.clonedRegistros[registro.id as string];
  delete this.clonedRegistros[registro.id as string];
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
  this.conS.obtenerCategorias().subscribe(resp=>{
    this.Categorias=resp
  
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

getMonthName(Fecha:string){
  return Number((Fecha.substring(5)).substring(0,2))
 }
obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.Items=resp
  })
}
obtenerCuentas(){
  this.conS.obtenerCuentas(this.usuario.idEmpresa).subscribe(resp=>{
    this.cuentas=resp

  })
}
crearRegistro(tipo:any) {

  if(this.authS.validarAtributo('Oc1llyeOkxfUlMz96F0a',[])==true && tipo==1){

    this.guardarRegistro(tipo)
    
   }
 else if(this.authS.validarAtributo('Uzt6wv7KRCcTOp63coNJ',[])==true && tipo==2){

    this.guardarRegistro(tipo)
    
   }
   else {
     this.toastr.warning('', '¡Acceso Denegado!',{
       timeOut: 1000,
     });
  }

  

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
    Elemento: new FormControl('',[Validators.required]), 
    Cuenta: new FormControl('',[Validators.required]), 
    Valor: new FormControl('',[Validators.required]), 
    idFlujo: new FormControl('',[Validators.required]), 
    NumMes: new FormControl(this.getMonthName(_Fecha)), 
    NumSemana: new FormControl(this.getWeekNumber()), 
    AnioRegistro: new FormControl(new Date().getFullYear()), 
    Semana: new FormControl("Semana" + ' ' + this.getWeekNumber()), 
    MesRegistro:new FormControl(this.MesesTodos[this.getMonthName(_Fecha)].Mes),
    Activo: new FormControl(true), 
    Nuevo: new FormControl(true), 
    Editando: new FormControl(true), 
    Orden: new FormControl(this.OrdenMax+1),
    idSocioNegocio: new FormControl(''), 
    idEmpresa: new FormControl(this.usuario.idEmpresa), 
    idMatriz: new FormControl(this.usuario.idMatriz), 
    idCategoria: new FormControl(''), 
    NombreElemento:new FormControl('NombreElemento'),
    NumCuenta:new FormControl('NumCuenta'),
    CategoriaNombre:new FormControl('CategoriaNombre'),
    SocioNegocio:new FormControl('SocioNegocio'),
    idSucursal: new FormControl(this.usuario.IdSucursal,[Validators.required]), 
    Sucursal: new FormControl(this.getNombreSucursal(this.usuario.IdSucursal),[Validators.required]), 
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
this.conS.crearRegistro(this.registroForm.value).then(resp=>{


this.cargarFormulario()
})

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
