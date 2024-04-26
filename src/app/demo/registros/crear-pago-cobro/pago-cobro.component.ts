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
import {  SelectItem } from 'primeng/api';
import { Registro } from 'src/app/models/registro';
import { ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CalendarModule } from 'primeng/calendar';

import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
@Component({
  selector: 'app-pago-cobro',
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
    IconFieldModule
   ],
  templateUrl: './pago-cobro.component.html',
  styleUrls: ['./pago-cobro.component.scss']
})
export default class PagoCobroComponent implements OnInit {

  constructor(
    private conS:ConfigurationService,private datePipe: DatePipe, 
    private toastr: ToastrService
  ){}
  registroForm!:FormGroup
  isNegativo: boolean = true;
  Registros: any=[];
  registrosBackUp: any=[];
  FechaPago:FormControl=new FormControl()
  inputVal = ''; // Initialize inputVal to be empty
  FechaDesde:FormControl=new FormControl()
  FechaHasta:FormControl=new FormControl()
  cuentas: any=[];
  selectedRegistros!: any[] | null;
  Categorias!: SelectItem[] | any;
  SociosNegocios: any=[];
  MesesTodos: any=[];
  Items: any=[];
  ItemSeleccionados: any=[];
  usuario:any
  visibleFechaPago:boolean=false
  Fecha:any= new Date();
  ItemsCategGroup:any= [];
  ItemsCategGroupBack:any= [];
  Flujos: any = [
    {id: "1", name: "Banco"},
    {id: "2", name: "Caja"},
    
  ]
  ngOnInit(): void {
    this.MesesTodos= [
    
      {
        Mes: 'Sin Mes',
        id:0,
        seleccionado: false
      },
      {
        Mes: 'Enero',
        id:'01',
        seleccionado: false
      },
      {
        Mes: 'Febrero',
        id:'02',
        seleccionado: false
      },
      {
        Mes: 'Marzo',
        id:'03',
        seleccionado: false
      },
      {
        Mes: 'Abril',
        id:'04',
        seleccionado: false
      },
      {
        Mes: 'Mayo',
        id:'05',
        seleccionado: false
      },
      {
        Mes: 'Junio',
        id:'06',
        seleccionado: false
      },
      {
        Mes: 'Julio',
        id:'07',
        seleccionado: false
      },
      {
        Mes: 'Agosto',
        id:'08',
        seleccionado: false
      },
      {
        Mes: 'Septiembre',
        id:'09',
        seleccionado: false
      },
      {
        Mes: 'Octubre',
        id:'10',
        seleccionado: false
      },
      {
        Mes: 'Noviembre',
        id:'11',
        seleccionado: false
      },
      {
        Mes: 'Diciembre',
        id:'12',
        seleccionado: false
      },
    
    ]
    this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);

    this.obtenerCuentas()
    this.obtenerSocios()
    this.obtenerCategorias()
    this.obtenerRegistros()
  }
  setFechaPago(){
    this.visibleFechaPago=true
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

  obtenerCuentas(){
    this.conS.obtenerCuentas(this.usuario.idEmpresa).subscribe(resp=>{
      this.cuentas=resp
  
    })
  }
  obtenerSocios(){
    this.conS.obtenerSocios(this.usuario.idEmpresa).subscribe(resp=>{
      this.SociosNegocios=resp
    })
  }
  getMonthName(Fecha:string){
    console.log('Fecha',Fecha)
    if(Fecha!=null){
      return Number((Fecha.substring(5)).substring(0,2))

    }
    else {
      return 0
    }
   }
   getWeekNumber() {
    let d:any = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
     let yearStart:any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
     var weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
     return weekNumber
   }

   getWeek(date: Date): number {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + yearStart.getDay() + 1) / 7);
    return weekNo;
  }
  cargarFormulario(){
    let _Fecha:any=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
    this.registroForm = new FormGroup({
      Elemento: new FormControl(''), 
      Cuenta: new FormControl('',[Validators.required]), 
      Valor: new FormControl('',[Validators.required]), 
      idFlujo: new FormControl('',[Validators.required]), 
      NumMes: new FormControl(this.getMonthName(_Fecha)), 
      NumSemana: new FormControl(this.getWeekNumber()), 
      AnioRegistro: new FormControl(new Date().getFullYear()), 
      TipoRegistro:new FormControl('PagoCobro'), 
      Semana: new FormControl("Semana" + ' ' + this.getWeekNumber()), 
      MesRegistro:new FormControl(this.MesesTodos[this.getMonthName(_Fecha)].Mes),
      Activo: new FormControl(true), 
      Nuevo: new FormControl(true), 
      Pagado: new FormControl(false), 
      Editando: new FormControl(true), 
      Orden: new FormControl(this.Registros.length+1),
      idSocioNegocio: new FormControl(''), 
      idEmpresa: new FormControl(this.usuario.idEmpresa), 
      idMatriz: new FormControl(this.usuario.idMatriz), 
      idCategoria: new FormControl(''), 
      FechaCompromisoPago: new FormControl(''), 
      FechaPagoReal: new FormControl(''), 
      NombreElemento:new FormControl('NombreElemento'),
      NumCuenta:new FormControl('NumCuenta'),
      CategoriaNombre:new FormControl('CategoriaNombre'),
      SocioNegocio:new FormControl('SocioNegocio'),
      idSucursal: new FormControl('0',[Validators.required]), 
      FechaRegistro: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
     })
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

  obtenerRegistros(){
    this.conS.obtenerRegistrosFacturas(this.usuario.idEmpresa).subscribe((resp:any)=>{
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
          "FechaCompromisoPago":element.FechaCompromisoPago,
          "NumMes":element.NumMes,
          "NumSemana":element.NumSemana,
          "Orden":element.Orden,
          "Semana":element.Semana,
          "Valor":element.Valor,
          "Tipo":element.Tipo || '',
          "id":element.id,
          "Pagado":element.Pagado,
          "idCategoria":element.idCategoria,
          "idEmpresa":element.idEmpresa,
          "idFlujo":element.idFlujo,
          "idTipo":element.idTipo,
          "idMatriz":element.idMatriz,
          "idSocioNegocio":element.idSocioNegocio,
          "idSucursal":element.idSucursal,
          "NombreElemento":element.Elemento.label || '',
          "NumCuenta":element.Cuenta.Cuenta || '',
          "CategoriaNombre":element.idCategoria.Nombre || '',
          "SocioNegocio":element.idSocioNegocio.Nombre || '',
  
        }
        this.Registros.push(_Registro)
      })
  
      this.registrosBackUp=this.Registros
  
      this.cargarFormulario()
    })
  }
  crearRegistro(tipo:any) {
    let _Categorias:any=[]
  
    _Categorias=this.ItemsCategGroupBack
    this.ItemsCategGroup=_Categorias.filter((cat:any)=>cat.Tipo==tipo)
    this.crearRegistroFactura(tipo)
  }

  crearRegistroFactura(idTipo:number){
    console.log('idTipo', this.registroForm.value)
    this.registroForm.value.idTipo=idTipo;
    this.conS.crearRegistroFactura(this.registroForm.value).then(resp=>{
    
    
    this.cargarFormulario()
    })
    
    }
  restablecer(){
    this.Registros=this.registrosBackUp
  }
  buscarByFecha(){

    this.Registros=this.registrosBackUp.
    filter((reg:any)=>reg.FechaRegistro>=this.FechaDesde.value && reg.FechaRegistro<=this.FechaHasta.value)
  }
  borrarRegistro(idRegistro){
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
        this.conS.borrarRegistroFactura(idRegistro).then(resp=>{
  
  
        })
       
      }
    });
  }

CerrarModal(){
  console.log('cerrar')
  this.visibleFechaPago=false
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
   
      if(Registro.Valor==""  || Number(Registro.Valor)==0 )
      { 
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Debe colocar un valor",
          showConfirmButton: false,
          timer: 1500
        });
    
      }
   else  if(Registro.FechaPagoReal==""  && Registro.Pagado=="true" )
      { 
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Debe ingresar una fecha de pago",
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


        Registro.Tipo=this.getTipo(Registro.Elemento.idCategoria)
        Registro.Semana=this.getWeek(this.FechaPago.value)
        Registro.MesRegistro=this.MesesTodos[this.getMonthName(this.FechaPago.value)].Mes
        Registro.AnioRegistro=new Date(this.FechaPago.value).getFullYear()
        Registro.idUsuario=this.usuario.id
        Registro.FechaPagoReal=this.FechaPago.value
        Registro.TipoRegistro="PagoCobro"
        Registro.Valor=Number(Registro.Valor)
        Registro.Usuario=this.usuario.Usuario
        if(Registro.Pagado=="true" && Registro.FechaCompromisoPago!=''){
        
                let AnioMesFechaPago:number=0
                let AnioMesFechaFechaCompromiso:number=0
                AnioMesFechaPago= Number(`${new Date(this.FechaPago.value).getFullYear()}${this.MesesTodos[this.getMonthName(this.FechaPago.value)].id}`)
                AnioMesFechaFechaCompromiso=Number(`${new Date(Registro.FechaCompromisoPago).getFullYear()}${this.MesesTodos[this.getMonthName(Registro.FechaCompromisoPago)].id}`)
                
 
        console.log('AnioMesFechaPago',AnioMesFechaPago)
        console.log('AnioMesFechaFechaCompromiso',AnioMesFechaFechaCompromiso)

        if(Registro.idTipo==1){
          if(AnioMesFechaFechaCompromiso==AnioMesFechaPago){
            Registro.Elemento=this.conS.ObtenerCobrosCreditoFacturasVencidasMes()
          }
         else  if(AnioMesFechaFechaCompromiso>AnioMesFechaPago){
            Registro.Elemento=this.conS.ObtenerCobrosAnticipados()
          }
         else  if(AnioMesFechaFechaCompromiso<AnioMesFechaPago){
            Registro.Elemento=this.conS.ObtenerCobrosCreditoFacturasVencidasMesAnteriores()
          }
          else {
            Registro.Elemento=''
          }

        }
        else {
          if(AnioMesFechaFechaCompromiso==AnioMesFechaPago){
            Registro.Elemento=this.conS.ObtenerPagoProveedoresMes()
          }
         else  if(AnioMesFechaFechaCompromiso<AnioMesFechaPago){
            Registro.Elemento=this.conS.ObtenerPagosAnticipados()
          }
         else  if(AnioMesFechaFechaCompromiso>AnioMesFechaPago){
            Registro.Elemento=this.conS.ObtenerPagosFacturasVencidasMesAnteriores()
          }
          else {
            Registro.Elemento=''
          }


        }

      }
      else {
        Registro.Elemento=''
      }

      let _categoriaEncontrada:any=[]
      _categoriaEncontrada=this.Categorias.find(cat=> cat.id==Registro.Elemento.idCategoria)
      if(_categoriaEncontrada){
        Registro.idCategoria=_categoriaEncontrada
      }
      else {
        Registro.idCategoria=""
      }

      console.log('Registro',Registro)
        this.conS.ActualizarPagoFactura(Registro).then(resp=>{
            this.toastr.success('Guardado', '¡Exito!');
          })
    
      }
  
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
}
