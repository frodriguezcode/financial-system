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
    private messageService: MessageService,
    private toastr: ToastrService
  ){}
  registroForm!:FormGroup
  isNegativo: boolean = true;
  Registros: any=[];
  registrosBackUp: any=[];
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
  }
  getMonthName(Fecha:string){
    return Number((Fecha.substring(5)).substring(0,2))
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
      Editando: new FormControl(true), 
      Orden: new FormControl(this.Registros.length+1),
      idSocioNegocio: new FormControl(''), 
      idEmpresa: new FormControl(this.usuario.idEmpresa), 
      idMatriz: new FormControl(this.usuario.idMatriz), 
      idCategoria: new FormControl(''), 
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
    this.conS.obtenerRegistrosTipo(this.usuario.idEmpresa,'PagoCobro').subscribe((resp:any)=>{
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
}
