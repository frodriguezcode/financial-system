// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-planeado-financiero',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeTableModule],
  templateUrl: './planeado-financiero.component.html',
  styleUrls: ['./planeado-financiero.component.scss']
})
export default class PlaneadoFinancieroComponent implements OnInit {
constructor(private confS:ConfigurationService){}
DataTreeTablePlanBack:any=[]
DataTreeTablePlan:any=[]
selectedSize='p-treetable-sm'
Categorias:any=[]
Cabecera:any=[]
Items:any=[]
Proyectos:any=[]
Sucursales:any=[]
Anios: any[] = []
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
  this.confS.dataPlaneadoFinanciera$.subscribe((data:any)=>{
    this.Categorias=data.Categorias
    this.Cabecera=data.Cabecera
    this.Items=data.Items
    this.Proyectos=data.Proyectos
    this.Sucursales=data.Sucursales
    this.Categorias.push({
    "Calculado": true,
    "Mostrar": true,
    "Nombre": "Diferencia Teórico vs Real",
    "Orden": 13,
    "Suma": true,
    "Tipo": 3,
    "id": "13"
})
 
    this.builData()


  })
}

builData(){

this.DataTreeTablePlanBack=
this.confS.construirItemsCatalogos(
false,
this.Categorias,
12,
this.Anios,
[],
[],
this.Items
)
this.DataTreeTablePlan=this.DataTreeTablePlanBack.filter(obj => obj.data.orden !== 0 && obj.data.orden !== 11);
this.DataTreeTablePlan.forEach(dataTree => {

  dataTree.children.forEach(dataTreeHijo => {
    delete dataTreeHijo.children

  });
});


}



}
