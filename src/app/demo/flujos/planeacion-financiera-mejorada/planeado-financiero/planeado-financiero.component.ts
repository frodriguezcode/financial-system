// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TreeTableModule } from 'primeng/treetable';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-planeado-financiero',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeTableModule],
  templateUrl: './planeado-financiero.component.html',
  styleUrls: ['./planeado-financiero.component.scss']
})
export default class PlaneadoFinancieroComponent implements OnInit {
constructor(private confS:ConfigurationService,private toastr: ToastrService){}
Meses:any=[]
MesesBack:any=[]
MesesSeleccionados:any=[]
Semestres:any=[]
SemestresBack:any=[]
Trimestres:any=[]
TrimestresBack:any=[]
TrimestresSeleccionados: any[] = [];
DataByMatriz:any=[]
DataByEmpresa:any=[]
DataTreeTableRealBack:any=[]
DataTreeTableReal:any=[]
selectedSize='p-treetable-sm'
Categorias:any=[]
Cabecera:any=[]
FlujoEfectivoPlan:any=[]
Items:any=[]
Proyectos:any=[]
Registros:any=[]
RegistrosBack:any=[]
Sucursales:any=[]
Anios: any[] = []
AniosBack: any[] = []
usuario:any
cargar:boolean=true
ngOnInit(): void {
this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);

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
  this.confS.dataPlaneadoFinanciera$.subscribe((data:any)=>{
    console.log('data',data)
    if(data!=null){
      this.Categorias=[]
      this.Categorias=data.Categorias.filter((data:any)=>data.Orden!=13)
      this.Cabecera=data.Cabecera
      this.Items=data.Items
      this.RegistrosBack=data.Registros
      this.FlujoEfectivoPlan=data.FlujoEfectivoValores
      this.Proyectos=data.Proyectos
      this.Sucursales=data.Sucursales
      this.Categorias.push({
      "Calculado": true,
      "Mostrar": true,
      "Nombre": "Flujo de Efectivo Acumulado",
      "Orden": 13,
      "Suma": true,
      "Tipo": 3,
      "id": "13"
      })
      this.Categorias.push({
      "Calculado": true,
      "Mostrar": true,
      "Nombre": "Diferencia Teórico vs Real",
      "Orden": 14,
      "Suma": true,
      "Tipo": 3,
      "id": "14"
      })
  
      this.builData()

    }


  })
}



builData(){
this.DataTreeTableRealBack=
this.confS.construirItemsCatalogos(
true,
this.Categorias,
12,
this.Anios,
this.RegistrosBack,
this.FlujoEfectivoPlan,
[],
this.Items
)
this.DataTreeTableReal=this.DataTreeTableRealBack.filter(obj => obj.data.orden !== 0 && obj.data.orden !== 11);
this.DataTreeTableReal.forEach(dataTree => {

  dataTree.children.forEach(dataTreeHijo => {
    delete dataTreeHijo.children

  });
});

if(this.DataTreeTableReal.length>0){

  this.cargar=false
}
}



}
