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
DataTreeTablePlanBack:any=[]
DataTreeTablePlan:any=[]
selectedSize='p-treetable-sm'
Categorias:any=[]
Cabecera:any=[]
FlujoEfectivoReal:any=[]
Items:any=[]
Proyectos:any=[]
RegistrosPlanes:any=[]
RegistrosPlanesBack:any=[]
Sucursales:any=[]
Anios: any[] = []
usuario:any
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
  this.confS.dataPlaneadoFinanciera$.subscribe((data:any)=>{
    this.Categorias=[]
    this.Categorias=data.Categorias

    this.Cabecera=data.Cabecera
    this.Items=data.Items
    this.RegistrosPlanesBack=data.DataPlanesByEmpresa
    this.FlujoEfectivoReal=data.DataTreeTableReal[9].data.valores
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
    console.log('Categorias2',this.Categorias)
 
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
this.RegistrosPlanesBack,
this.FlujoEfectivoReal,
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


guardarValorPlan(data:any,anio:any,mes:any,mesRegistro:any){
  let Valor:number=0

  Valor=Number(data.valores[data.idItem + '-' + mes + '-' + anio].ValorNumero)


  // if(data.TipoCateg==1 && Valor<0){
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'warning',
  //     title: 'El Valor debe ser positivo',
  //     showConfirmButton: false,
  //     timer: 1500
  //   });
  // }
  // else if(data.TipoCateg==2 && Valor>0){
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'warning',
  //     title: 'El Valor debe ser negativo',
  //     showConfirmButton: false,
  //     timer: 1500
  //   });
  // }
  //else {
    let dataPlaneacion={
      "idItem":data.idItem,
      "idCategoria":data.idCategoria,
      "idEmpresa":this.usuario.idEmpresa,
      "idMatriz":this.usuario.idMatriz,
      "Valor":data.TipoCateg==2? Math.abs(Valor)*-1:Valor,
      "Anio":anio,
      "NumMes":mes,
      "MesRegistro":mesRegistro,
    }

    // Update local array
    const index = this.RegistrosPlanesBack.findIndex((reg: any) =>
       reg.idItem === dataPlaneacion.idItem &&
       reg.Anio === dataPlaneacion.Anio &&
       reg.Mes === dataPlaneacion.NumMes 
    );
    if (index !== -1) {
      // If exists, update
      this.RegistrosPlanesBack[index] = dataPlaneacion;
      this.confS.ActualizarValorPlan(dataPlaneacion).then((resp:any)=>{
        this.toastr.success('Registro actualizado', '¡Éxito!', {
            timeOut: 2000,
            positionClass: 'toast-center-center'
        });
      })
    } else {
      // If doesn't exist, add
      this.RegistrosPlanesBack.push(dataPlaneacion);
      this.confS.crearValorPlan(dataPlaneacion).then((resp:any)=>{
          this.toastr.success('Registro creado', '¡Éxito!', {
            timeOut: 2000,
            positionClass: 'toast-center-center'
        });
      })
    }
    this.RegistrosPlanes=this.RegistrosPlanesBack

  //}

}




}
