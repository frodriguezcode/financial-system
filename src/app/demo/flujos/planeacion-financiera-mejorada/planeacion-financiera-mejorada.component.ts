// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SidebarModule } from 'primeng/sidebar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-planeacion-financiera-mejorada',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TableModule,
    InputGroupModule,
    InputGroupAddonModule,
    SidebarModule],
  templateUrl: './planeacion-financiera-mejorada.component.html',
  styleUrls: ['./planeacion-financiera-mejorada.component.scss']
})
export default class PlaneacionFinancieraMejoradaComponent implements OnInit  {
usuario:any
Meses:any=[]
cargando:boolean=true
visible:boolean=false
AniosPlaneacion:any
Anios:any
AniosBack:any
Cabecera:any
Categorias:any=[]
CabeceraBack:any=[]
Items:any=[]
ItemsBack:any=[]
constructor(private conS:ConfigurationService,private toastr: ToastrService){


}

ngOnInit(): void {
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
 
    this.obtenerAniosPlaneacion()
  
 
  });

  this.Meses= [

    {
      Mes: 'Enero',
      NumMes:1,
      Mostrar: true
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      Mostrar: true
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      Mostrar: true
    },
    {
      Mes: 'Abril',
      NumMes:4,
      Mostrar: true
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      Mostrar: true
    },
    {
      Mes: 'Junio',
      NumMes:6,
      Mostrar: true
    },
    {
      Mes: 'Julio',
      NumMes:7,
      Mostrar: true
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      Mostrar: true
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      Mostrar: true
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      Mostrar: true
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      Mostrar: true
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      Mostrar: true
    },
  
  ]

}

showDialog() {
  this.visible = true;
}

guardarAnio(anio:any){
  let AnioEncontrado:any=[]
  AnioEncontrado=this.Anios.filter((a:any)=>a.Anio==Number(anio))
  if(AnioEncontrado.length>0){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: 'Ya existe este año',
      showConfirmButton: false,
      timer: 1500
    });
  }
  else if(anio<2015){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: 'Ingrese un año válido',
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
    this.AniosPlaneacion[0].Anios.push({Anio:Number(anio),
      Mostrar: true
    })
  this.conS.ActualizarAniosPlaneacion(this.AniosPlaneacion[0]).then(resp=>{
    this.construirCabecera()
    this.visible=false
  })

  }
  
}

obtenerAniosPlaneacion(){
  this.conS.obtenerAniosPlaneacion(this.usuario.idEmpresa).subscribe((resp:any)=>{

    if(resp.length>0){
      this.AniosPlaneacion=resp
      this.Anios=resp[0].Anios
      this.AniosBack=resp[0].Anios


    }
    else {
      let _AniosPlanes={
        idEmpresa:this.usuario.idEmpresa,
        Anios:[
          {Anio:2023,
          Mostrar: true
          },
          {Anio:2024,
          Mostrar: true
      
          },
          {Anio:2025,
          Mostrar: true
      
          },
        ]
      }
      this.conS.crearAniosPlaneacion(_AniosPlanes).then(resp=>{

 
      })
      this.AniosBack=[
        {Anio:2023,
        Mostrar: true
        },
        {Anio:2024,
        Mostrar: true
    
        },
        {Anio:2025,
        Mostrar: true
    
        },
      ]
    }


  })
}


construirCabecera(){
  this.Cabecera=[]
  this.Cabecera.push({
    "Nombre":"Catálogo de Cuentas",
    "Mes":"",
    "NumMes":"",
    "Anio":"",
    "Tipo":1,
    "Mostrar":true,
    "MostrarBoton":true
  })
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
      this.Cabecera.push({
        "Nombre":mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":2,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre": mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":3,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre":"Diferencia",
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":4,
        "Mostrar":true,
        "MostrarBoton":true
      })

      this.Cabecera.push({
        "Nombre":"% Variación",
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":5,
        "Mostrar":true,
        "MostrarBoton":true
      })



    })

    this.Cabecera.push({
      "Nombre":"Total" + anio.Anio,
      "Anio":anio.Anio,
      "Tipo":6,
      "Mostrar":true,
      "MostrarBoton":true
    })

 this.CabeceraBack=this.Cabecera

  })
//console.log('Cabecera',this.Cabecera)
}

obtenerCategorias(){
  this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
    // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
    this.Categorias=[]

    data.forEach(categoria => {
      let _Categ={
        "Calculado":categoria.Calculado,
        "Mostrar":categoria.Mostrar,
        "Nombre":categoria.Nombre,
        "Orden":categoria.Orden,
        "Suma":categoria.Suma,
        "Tipo":categoria.Tipo,
        "id":categoria.id,
      }

      this.Categorias.push(_Categ)
      
    })
    this.Categorias.push({
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Flujo de Efectivo Acumulado",
      "Orden":19,
      "Suma":true,
      "Tipo":19,
      "id":'Acumulado-0'
    })


    this.Categorias.push({
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Diferencia Teórico vs Real",
      "Orden":20,
      "Suma":true,
      "Tipo":20,
      "id":'Diferencia-0',
    })
    // this.Categorias.push({
    //   "Calculado":true,
    //   "Mostrar":true,
    //   "Nombre":"Diferencia Real vs Teórico",
    //   "Orden":21,
    //   "Suma":true,
    //   "Tipo":21,
    //   "id":'Diferencia-1',
    // })

    this.obtenerItems()

  })
}


obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.Items=[]
      this.Items=resp.filter((item:any)=>item.Activo==true);;
      this.ItemsBack=resp.filter((item:any)=>item.Activo==true);
  })
}



buidDataPlanesGeneral(){

}












}
