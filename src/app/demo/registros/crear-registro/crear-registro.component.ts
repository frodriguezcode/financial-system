// angular import
import { Component, OnInit } from '@angular/core';
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
    RadioButtonModule
   ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss']
})
export default class CrearRegistroComponent implements OnInit {
  constructor(private conS:ConfigurationService,private datePipe: DatePipe){}
  registroForm!:FormGroup
  EditRegistroForm!:FormGroup
  registroDialog: boolean = false;
  visible: boolean = false;
  visibleEditar: boolean = false;
  submitted: boolean = false;
  registros: any=[];
  cuentas: any=[];
  selectedRegistros!: any[] | null;
  registro: any=[];
  Categorias: any=[];
  SociosNegocios: any=[];
  MesesTodos: any=[];
  Registros: any=[];
  Items: any=[];
  ItemSeleccionados: any=[];
  usuario:any
  idItem:any=''
  Departamentos: string[] = [];
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
  this.obtenerItems()
  this.obtenerSocios()
  this.obtenerCategorias()
  this.obtenerRegistros()
  this.cargarFormulario()
}

obtenerSocios(){
  this.conS.obtenerSocios(this.usuario.idEmpresa).subscribe(resp=>{
    this.SociosNegocios=resp
  })
}
obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe(resp=>{
    this.Registros=resp
    console.log('Registros',this.Registros)
  })
}

obtenerCategorias(){
  this.conS.obtenerCategorias().subscribe(resp=>{
    this.Categorias=resp
  })
}

getMonthName(Fecha:string){
  return Number((Fecha.substring(5)).substring(0,2))
 }
obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.Items=resp
    console.log('Items',this.Items)
  })
}
crearRegistro() {
  this.visible = true;
}

get selectedCategoria() {
  return this.Categorias.find((cat:any):any => cat.id === this.EditRegistroForm.value.idCategoria);
}
editarRegistro(idRegistro:string) {
  
  let _RegistroEditar:any={}
  _RegistroEditar=this.Registros.filter((r:any) => r.id == idRegistro)[0]

  this.EditRegistroForm = new FormGroup({
    Elemento: new FormControl(_RegistroEditar.Elemento,[Validators.required]), 
    Cuenta: new FormControl(_RegistroEditar.Cuenta,[Validators.required]), 
    Valor: new FormControl(_RegistroEditar.Valor,[Validators.required]), 
    idFlujo: new FormControl(_RegistroEditar.idFlujo,[Validators.required]), 
    NumMes: new FormControl(_RegistroEditar.NumMes), 
    NumSemana: new FormControl(_RegistroEditar.NumSemana), 
    AnioRegistro: new FormControl(_RegistroEditar.AnioRegistro), 
    Semana: new FormControl(_RegistroEditar.Semana), 
    MesRegistro:new FormControl(_RegistroEditar.MesRegistro),
    Nuevo:new FormControl(false),
    Activo: new FormControl(_RegistroEditar.Activo), 
    Editando: new FormControl(_RegistroEditar.Editando), 
    idSocioNegocio: new FormControl(_RegistroEditar.idSocioNegocio), 
    idEmpresa: new FormControl(_RegistroEditar.idEmpresa), 
    idMatriz: new FormControl(_RegistroEditar.idMatriz), 
    idCategoria: new FormControl(_RegistroEditar.idCategoria), 
    idSucursal: new FormControl(_RegistroEditar.idSucursal,[Validators.required]), 
    FechaRegistro: new FormControl(_RegistroEditar.FechaRegistro), 
    id: new FormControl(_RegistroEditar.id), 
   })
   console.log('EditRegistroForm',this.EditRegistroForm.value);
   this.visibleEditar = true;
 
}


getWeekNumber() {
 let d:any = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  let yearStart:any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNumber
}

getIdItem(idItem:string){
  console.log('idItem',idItem)
  this.idItem=idItem
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
    Editando: new FormControl(false), 
    idSocioNegocio: new FormControl(''), 
    idEmpresa: new FormControl(this.usuario.idEmpresa), 
    idMatriz: new FormControl(this.usuario.idMatriz), 
    idCategoria: new FormControl(''), 
    idSucursal: new FormControl('0',[Validators.required]), 
    FechaRegistro: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
   })
}
openNew() {
    this.registro = {};
    this.submitted = false;
    this.registroDialog = true;
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
guardarRegistro(){
console.log('Valorform',this.registroForm.value)
this.conS.crearRegistro(this.registroForm.value).then(resp=>{
  this.visible=false
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Registro creado",
    showConfirmButton: false,
    timer: 1500
  });
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
