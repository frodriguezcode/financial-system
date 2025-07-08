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
import { TreeTableModule } from 'primeng/treetable';
import { Table, TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SidebarModule } from 'primeng/sidebar';
import { Subscription } from 'rxjs';
interface TreeNode {
  label: string;
  key: string;
  tipo:number,
  numPeriodo:number,
  children?: TreeNode[];
}

interface Column {
    field: string;
    header: string;
}


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
    TreeTableModule,
    SidebarModule],
  templateUrl: './planeacion-financiera-mejorada.component.html',
  styleUrls: ['./planeacion-financiera-mejorada.component.scss']
})
export default class PlaneacionFinancieraMejoradaComponent implements OnInit  {
usuario:any
selectedSize='p-treetable-sm'
Meses:any=[]
MesesBack:any=[]
MesesSeleccionados:any=[]
Semestres:any=[]
SemestresBack:any=[]
Trimestres:any=[]
TrimestresBack:any=[]
TrimestresSeleccionados: any[] = [];
cargando:boolean=true
visible:boolean=false
AniosPlaneacion: any[] = []
Anios: any[] = []
AniosSeleccionados: any[] = []
AniosBack: any[] = []
Cabecera: any[] = []
Categorias:any=[]
CabeceraBack:any=[]
Items:any=[]
ItemsBack:any=[]
DataTreeTableProyectado:any=[]
DataTreeTableReal:any=[]
DataTreeTableRealBack:any=[]
Sucursales:any=[]
SucursalSeleccionada:any=[]
Usuarios:any=[]
UsuariosSeleccionados:any=[]
Proyectos:any=[]
ProyectoSeleccionado:any=[]
CuentasBancarias:any=[]
CuentaBancariaSeleccionada:any=[]
Registros:any=[]
RegistrosBackUp:any=[]
idEmpresa:string=''
DataByMatriz:any=[]
DataByEmpresa:any=[]
cargar:boolean=true
constructor(private conS:ConfigurationService,private toastr: ToastrService){


}

ngOnInit(): void {
this.Anios=[
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

this.Meses= [

    {
      Mes: 'Enero',
      NumMes:1,
      Trimestre:1,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      Trimestre:1,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      Trimestre:1,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Abril',
      NumMes:4,
      Trimestre:2,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      Trimestre:2,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Junio',
      NumMes:6,
      Trimestre:2,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Julio',
      NumMes:7,
      Trimestre:3,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      Trimestre:3,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      Trimestre:3,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      Trimestre:4,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      Trimestre:4,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      Trimestre:4,
      Semestre:2,
      seleccionado: false
    },
  
]
this.MesesBack=this.Meses

this.Semestres=[
  {
    Semestre:"Semestre 1",
    Nombre:"Semestre 1",
    id:1
  },
  {
    Trimestre:"Semestre 2",
    Nombre:"Semestre 2",
    id:2
  }

]  
this.Trimestres=[
  {
    Trimestre:"Trimestre 1",
    Nombre:"Trimestre 1",
    id:1,
    idSemestre:1
  },
  {
    Trimestre:"Trimestre 2",
    Nombre:"Trimestre 2",
    id:2,
    idSemestre:1
  },
  {
    Trimestre:"Trimestre 3",
    Nombre:"Trimestre 3",
    id:3,
    idSemestre:2
  },
  {
    Trimestre:"Trimestre 4",
    Nombre:"Trimestre 4",
    id:4,
    idSemestre:2
  }
]  
this.TrimestresBack= this.Trimestres
this.SemestresBack=this.Semestres
this.AniosBack=this.Anios
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    this.idEmpresa=this.usuario.idEmpresa
    this.obtenerDataEmpresa()
    this.obtenerAniosPlaneacion()
    
    this.construirCabecera()
    
 
  });



}

obtenerDataEmpresa(){
  this.cargar=true
  this.conS.obtenerDataEmpresa(this.usuario.idMatriz).subscribe(resp=>{
    this.construirCabecera()
    this.DataByMatriz=resp
    this.construirData()
  })
}


construirData(){
this.cargar=true
this.DataByEmpresa=this.DataByMatriz.filter((data:any)=>data.idEmpresa==this.idEmpresa)[0]
this.Proyectos=this.DataByEmpresa.Proyectos
this.Sucursales=this.DataByEmpresa.Sucursales
this.Items=this.DataByEmpresa.CuentasContables
this.ItemsBack=this.DataByEmpresa.CuentasContables
this.CuentasBancarias=this.DataByEmpresa.CuentasBancarias
this.Registros=this.DataByEmpresa.Registros
this.Categorias=[]
   this.Categorias.push(
      {
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Saldo Inicial en Bancos",
      "Orden":0,
      "Suma":false,
      "Tipo":0,
      "id":0,
    })
    this.DataByEmpresa.Categorias.forEach(categoria => {
        let _Categ={
          "Calculado":categoria.Calculado,
          "Mostrar":categoria.Mostrar,
          "Nombre":categoria.Nombre,
          "Orden":categoria.Orden,
          "Suma":categoria.Suma,
          "Tipo":categoria.Tipo,
          "id":categoria.id,
          "idAbuelo":categoria.idAbuelo,
        }
        this.Categorias.push(_Categ)

        if(categoria.Orden==9){
          this.Categorias.push(
            {
            "Calculado":true,
            "Mostrar":true,
            "Nombre":"Saldo Final en Bancos",
            "Orden":11,
            "Suma":false,
            "Tipo":11,
            "id":11,
          })
        }
    })

this.Categorias=this.Categorias.sort((a:any, b:any) => a.Orden - b.Orden)
let AniosCabecera=this.AniosSeleccionados.length>0 ? this.AniosSeleccionados:this.Anios
let CantidadMeses:number=0
CantidadMeses=this.MesesSeleccionados.length==0?12:this.MesesSeleccionados.length
this.DataTreeTableRealBack=
this.conS.construirItemsCatalogos(
this.Categorias,
CantidadMeses,
AniosCabecera,
this.Registros,
this.DataByEmpresa.SaldosIniciales,
this.Items
)




this.DataTreeTableReal = this.DataTreeTableRealBack.filter(obj => obj.data.orden !== 0 && obj.data.orden !== 11);

this.DataTreeTableReal.forEach(dataTree => {

  dataTree.children.forEach(dataTreeHijo => {
    delete dataTreeHijo.children

  });
});

if(this.DataTreeTableReal.length>0){
  this.cargar=false
}
}

filtrado(){

 if(this.ProyectoSeleccionado.length>0){
  this.SucursalSeleccionada=[]
 } 

 else if(this.SucursalSeleccionada.length>0){
  this.ProyectoSeleccionado=[]
 }

let idProyectos=

this.ProyectoSeleccionado.map((proy1:any)=>proy1.id)

let idSucursales=

this.SucursalSeleccionada.map((suc1:any)=>suc1.id)
const resultado = this.filtrarEstructura(this.DataTreeTableRealBack, idProyectos, idSucursales);


let AniosCabecera=this.AniosSeleccionados.length>0 ? this.AniosSeleccionados:this.Anios
let CantidadMeses:number=0
CantidadMeses=this.MesesSeleccionados.length==0?12:this.MesesSeleccionados.length



this.DataTreeTableReal=this.conS.filtrarDatos(resultado,AniosCabecera,CantidadMeses,this.Registros).filter(obj => obj.data.orden !== 0 && obj.data.orden !== 11);
//console.log('DataTreeTableReal',this.DataTreeTableReal)
}
filtrarEstructura(estructura: any[], proyectosSeleccionados: string[], sucursalesSeleccionadas: string[]) {
  return estructura.map(padre => {

    const hijosFiltrados = padre.children?.filter((hijo: any) => {

      if (proyectosSeleccionados.length > 0) {
        // Solo filtramos por proyectos, ignoramos sucursales
        return hijo.data.idProyectos.some((id: string) => proyectosSeleccionados.includes(id));
      }

      if (sucursalesSeleccionadas.length > 0) {
        // Solo filtramos por sucursales, ignoramos proyectos
        return hijo.data.idSucursales.some((id: string) => sucursalesSeleccionadas.includes(id));
      }

      // Si no hay proyectos ni sucursales seleccionados, mostramos todo
      return true;
    }) || [];

    return {
      ...padre,
      children: hijosFiltrados
    };
  });
}


getNameSucursal(idSucursal:any){
    if(idSucursal=='0'){
      return 'General'
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
  this.cargando=true
    this.Cabecera=[]
    this.CabeceraBack=[]
    
    this.Anios.forEach((anio:any) => {
      this.Semestres.forEach(semestre => {
        this.getTrimestresBySemestre(semestre.id).forEach((trim:any)=>{
          this.getMesesByTrimestre(trim.id).forEach((mes:any) => {
              this.CabeceraBack.push({
                "Nombre":mes.Mes + ' ' + anio.Anio,
                "Mes":mes.Mes,
                "NumMes":mes.NumMes,
                "Anio":anio.Anio,
                "Color":'#a2d7b4',
                "Tipo":3,
                "Mostrar":true
              })
            if(mes.NumMes==3){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 1" + ' (' + anio.Anio + ')',
                "NumTrim":1,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 1" + ' (' + anio.Anio + ')',
                "NumTrim":1,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
            }
            else if(mes.NumMes==6){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 2" + ' (' + anio.Anio + ')',
                "NumTrim":2,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 2" + ' (' + anio.Anio + ')',
                "NumTrim":2,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Total Semestre 1" + ' (' + anio.Anio + ')',
                "NumSem":1,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":7,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Semestre 1" + ' (' + anio.Anio + ')',
                "NumSem":1,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":9,
                "Mostrar":false
              })
            } 
            else if(mes.NumMes==9){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 3" + ' (' + anio.Anio + ')',
                "NumTrim":3,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 3" + ' (' + anio.Anio + ')',
                "NumTrim":3,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
            }
            else if(mes.NumMes==12){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 4" + ' (' + anio.Anio + ')',
                "NumTrim":4,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
    
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 4" + ' (' + anio.Anio + ')',
                "NumTrim":4,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Total Semestre 2" + ' (' + anio.Anio + ')',
                "NumSem":2,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":7,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Semestre 2" + ' (' + anio.Anio + ')', 
                "NumSem":2,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":9,
                "Mostrar":false
              })
    
              
            }
    
    
          });
          
        })

      })

      this.CabeceraBack.push({
        "Nombre":"Total " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Color":'#58d683',
        "Tipo":4,
        "Mostrar":true
      })
      this.CabeceraBack.push({
        "Nombre":"Promedio " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Color":'#58d683',
        "Anio":anio.Anio,
        "Tipo":5,
        "Mostrar":true
      })
      

    });
    this.Cabecera=this.CabeceraBack
}
// Función auxiliar para evitar repetir código
formatearItem(item: any) {
  return {
    data: {
      Nombre: item.Nombre,
      idItem: item.id,
      size: '200mb',
      type: 'Folder',
      orden: item.Orden,
      tipo: 'Hijo',
      valores: {},
    }
  };
}

getTrimestresBySemestre(idSemestre:any){
  return this.Trimestres.filter((trim:any)=>trim.idSemestre==idSemestre)
}
getMesesByTrimestre(idTrimestre:any){
  return this.Meses.filter((mes:any)=>mes.Trimestre==idTrimestre)
}
getMesesBySemestre(idSemestre:any){
  return this.Meses.filter((mes:any)=>mes.Semestre==idSemestre)
}







buidDataPlanesGeneral(){

}












}
