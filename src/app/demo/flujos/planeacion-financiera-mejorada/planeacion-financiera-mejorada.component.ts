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
import { TreeSelectModule } from 'primeng/treeselect';
import PlaneadoFinancieroComponent from './planeado-financiero/planeado-financiero.component';

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
    PlaneadoFinancieroComponent,
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
    TreeSelectModule,
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
DataPlanesByEmpresa:any=[]
cargar:boolean=true
modoSeleccionado: string = 'todo';
timeHierarchy:any
selectedNodes: any;
PeriodosTiempos:any=[]
PeriodosTiemposSeleccionados:any=[]
verTodo:boolean=true
verMensual:boolean=false
verTrimestral:boolean=false
verSemestral:boolean=false
verAnual:boolean=false
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
this.timeHierarchy = this.generateTimeHierarchy(2024, new Date().getFullYear());
  this.PeriodosTiempos.push(
    {
      "Nombre":"Trimestre 1",
      "Numero":1,
      "Tipo":1,
      "Orden":1
    },
    {
      "Nombre":"Trimestre 2",
      "Numero":2,
      "Tipo":1,
      "Orden":2
    },
    {
      "Nombre":"Trimestre 3",
      "Numero":3,
      "Tipo":1,
      "Orden":3
    },
    {
      "Nombre":"Trimestre 4",
      "Numero":4,
      "Tipo":1,
      "Orden":4
    },
    {
      "Nombre":"Semestre 1",
      "Numero":1,
      "Tipo":2,
      "Orden":5
    },
    {
      "Nombre":"Semestre 2",
      "Numero":2,
      "Tipo":2,
      "Orden":6
    },
    {
      "Nombre":"Anual",
      "Numero":1,
      "Tipo":3,
      "Orden":7
    },
)
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

capturarCambio() {
  let CopiaCabecera=[...this.CabeceraBack]
  if(this.modoSeleccionado=='todo'){
    this.verTodo=true
    this.verTrimestral=false
    this.verSemestral=false
    this.verAnual=false

 
    this.Cabecera=this.CabeceraBack

  }
  else if(this.modoSeleccionado=='trimestral'){
    this.verTrimestral=true
    this.verSemestral=false
    this.verTodo=false
    this.verAnual=false

  CopiaCabecera.forEach((cab:any)=>{
    if(cab.Tipo==6 || cab.Tipo==8){
      cab.Mostrar=true
    }
    else {
      cab.Mostrar=false
    }

  }) 
    this.Cabecera=CopiaCabecera.filter((_cab:any)=>_cab.Mostrar==true)

  }
  else if(this.modoSeleccionado=='semestral'){
    this.verSemestral=true
    this.verTodo=false
    this.verAnual=false
    this.verTrimestral=false

  CopiaCabecera.forEach((cab:any)=>{
    if(cab.Tipo==7 || cab.Tipo==9){
      cab.Mostrar=true
    }
    else {
      cab.Mostrar=false
  }
  }) 
    this.Cabecera=CopiaCabecera.filter((_cab:any)=>_cab.Mostrar==true)

  }
  else if(this.modoSeleccionado=='anual'){
    this.verAnual=true
    this.verSemestral=false
    this.verTrimestral=false
    this.verTodo=false
  CopiaCabecera.forEach((cab:any)=>{
    if(cab.Tipo==4 || cab.Tipo==5){
      cab.Mostrar=true
    }
    else {
      cab.Mostrar=false
  }
  }) 
    this.Cabecera=CopiaCabecera.filter((_cab:any)=>_cab.Mostrar==true)
  }

  this.enviarDatosReal()
  

}
obtenerDataEmpresa(){
  this.cargar=true
  this.conS.obtenerDataEmpresa(this.usuario.idMatriz).subscribe(resp=>{
    this.construirCabecera()
    this.DataByMatriz=resp
    this.construirData()
  })
}
generateTimeHierarchy(startYear: number, endYear: number): TreeNode[] {
  const years: TreeNode[] = [];
  
  for (let year = startYear; year <= endYear; year++) {
    years.push({
      label: year.toString(),
      key: year.toString(),
      tipo:1,
      numPeriodo:year,
      children: [
        {
          label: 'Semestre 1',
          key: `${year}-S1`,
          tipo:2,
          numPeriodo:1,
          children: [
            { label: 'Trimestre 1', key: `${year}-${year}-S1-T1` ,tipo:3,numPeriodo:1},
            { label: 'Trimestre 2', key: `${year}-${year}-S1-T2`,tipo:3,numPeriodo:2 }
          ]
        },
        {
          label: 'Semestre 2',
          tipo:2,
          numPeriodo:2,
          key: `${year}-S2`,
          children: [
            { label: 'Trimestre 3', key: `${year}-${year}-S2-T3`,tipo:3,numPeriodo:3 },
            { label: 'Trimestre 4', key: `${year}-${year}-S2-T4`,tipo:3,numPeriodo:4 }
          ]
        }
      ]
    });
  }
  
  return years;
}

construirData(){
this.cargar=true
this.DataByEmpresa=this.DataByMatriz.filter((data:any)=>data.idEmpresa==this.idEmpresa)[0]
this.Proyectos=this.DataByEmpresa.Proyectos
this.Sucursales=this.DataByEmpresa.Sucursales
this.DataPlanesByEmpresa=this.DataByEmpresa.RegistrosPlanes
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
true,
this.Categorias,
CantidadMeses,
AniosCabecera,
this.Registros,
[],
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
  this.enviarDatosReal()
  this.cargar=false
}
}

enviarDatosReal(){
console.log('Categorias1',this.Categorias)
  let _Data={
"Categorias":this.Categorias.filter((cat:any)=>cat.Orden!=13 && cat.Orden!=14),

"DataTreeTableReal":this.DataTreeTableReal,
"Items":this.Items,
"Proyectos":this.ProyectoSeleccionado.length==0 ? this.Proyectos :this.ProyectoSeleccionado,
"Sucursales":this.SucursalSeleccionada.length==0 ? this.Sucursales :this.SucursalSeleccionada,
"Cabecera":this.Cabecera,
"DataPlanesByEmpresa":this.DataPlanesByEmpresa

}
this.conS.enviarDataPlaneadoFinanciera(_Data)
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



this.DataTreeTableReal=this.conS.filtrarDatos(resultado,this.AniosBack,CantidadMeses,this.Registros,[]).filter(obj => obj.data.orden !== 0 && obj.data.orden !== 11);
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

PeriodosSeleccionados(nodesSeleccionados: TreeNode[]){
  if(nodesSeleccionados==null){
    return []
  }
else {
  const anios = new Set<number>();
  const semestres = new Set<string>(); // usar string para Set
  const trimestres = new Set<string>();

  for (const node of nodesSeleccionados) {
    if (node.tipo === 1) {
      anios.add(node.numPeriodo);
    }
   
    
        if (node.tipo === 2) {
          // Extraer año desde key o usar alguna lógica para asociarlo
          const anio = +(node.key?.split('-')[0] || 0);
          anios.add(anio);
          semestres.add(`${anio}-${node.numPeriodo}`);
        }
    
        if (node.tipo === 3) {
          // Extraer año y semestre desde key (estructura tipo "2024-2024-S1-T1")
          const partes = node.key?.split('-') || [];
          const anio = +partes[0];
          const trimestre = node.numPeriodo;
    
          if (anio && trimestre) {
            anios.add(anio);
    
            // Trimestre está en el semestre, así que deducimos el semestre a partir del trimestre
            const semestre = trimestre <= 2 ? 1 : 2;
            semestres.add(`${anio}-${semestre}`);
            trimestres.add(`${anio}-${trimestre}`);
          }
        }
      }
    
      return {
        anios: Array.from(anios),
        semestres: Array.from(semestres).map(s => {
          const [anio, semestre] = s.split('-').map(Number);
          return { anio, semestre };
        }),
        trimestres: Array.from(trimestres).map(t => {
          const [anio, trimestre] = t.split('-').map(Number);
          return { anio, trimestre };
        })
      };
  
}
} 


verPeriodosSeleccionados(){

const seleccion:any = this.PeriodosSeleccionados(this.selectedNodes);
if(seleccion.length==0){
   this.Cabecera=this.CabeceraBack
}
else {
  let AniosUnicos=seleccion.anios
  let SemestresUnicos=seleccion.semestres.map((sem:any)=>sem.semestre)
  let TrimestresUnicos=seleccion.trimestres.map((trim:any)=>trim.trimestre)
  
  
  this.Anios=
  AniosUnicos.length==0? this.Anios=this.AniosBack:
  this.AniosBack.filter((anio:any)=>AniosUnicos.includes(anio.Anio))
  
  this.Trimestres=
  TrimestresUnicos.length==0?this.Trimestres=this.TrimestresBack:
  this.TrimestresBack.filter((trim:any)=>TrimestresUnicos.includes(trim.id))
  
  
  this.Semestres=
  SemestresUnicos.length==0?this.Semestres=this.SemestresBack :
  this.SemestresBack.filter((sem:any)=>SemestresUnicos.includes(sem.id))
  
      this.Cabecera=[]
      this.Anios.forEach((anio:any) => {
        this.Semestres.forEach(semestre => {
          this.getTrimestresBySemestre(semestre.id).forEach((trim:any)=>{
            this.getMesesByTrimestre(trim.id).forEach((mes:any) => {
                this.Cabecera.push({
                  "Nombre":mes.Mes + ' ' + anio.Anio,
                  "Mes":mes.Mes,
                  "NumMes":mes.NumMes,
                  "Anio":anio.Anio,
                  "Color":'#a2d7b4',
                  "Tipo":3,
                  "Mostrar":true
                })
              if(mes.NumMes==3){
                this.Cabecera.push({
                  "Nombre":"Total Trimestre 1",
                  "NumTrim":1,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":6,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Promedio Trimestre 1",
                  "NumTrim":1,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":8,
                  "Mostrar":false
                })
              }
              else if(mes.NumMes==6){
                this.Cabecera.push({
                  "Nombre":"Total Trimestre 2",
                  "NumTrim":2,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":6,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Promedio Trimestre 2",
                  "NumTrim":2,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":8,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Total Semestre 1",
                  "NumSem":1,
                  "Anio":anio.Anio,
                  "Color":'#2ac25e',
                  "Tipo":7,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Promedio Semestre 1",
                  "NumSem":1,
                  "Anio":anio.Anio,
                  "Color":'#2ac25e',
                  "Tipo":9,
                  "Mostrar":false
                })
              } 
              else if(mes.NumMes==9){
                this.Cabecera.push({
                  "Nombre":"Total Trimestre 3",
                  "NumTrim":3,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":6,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Promedio Trimestre 3",
                  "NumTrim":3,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":8,
                  "Mostrar":false
                })
              }
              else if(mes.NumMes==12){
                this.Cabecera.push({
                  "Nombre":"Total Trimestre 4",
                  "NumTrim":4,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":6,
                  "Mostrar":false
                })
      
                this.Cabecera.push({
                  "Nombre":"Promedio Trimestre 4",
                  "NumTrim":4,
                  "Anio":anio.Anio,
                  "Color":'#4fd37c',
                  "Tipo":8,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Total Semestre 2",
                  "NumSem":2,
                  "Anio":anio.Anio,
                  "Color":'#2ac25e',
                  "Tipo":7,
                  "Mostrar":false
                })
                this.Cabecera.push({
                  "Nombre":"Promedio Semestre 2",
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
  
        this.Cabecera.push({
          "Nombre":"Total " + anio.Anio,
          "Mes":"",
          "NumMes":"",
          "Anio":anio.Anio,
          "Color":'#58d683',
          "Tipo":4,
          "Mostrar":true
        })
        this.Cabecera.push({
          "Nombre":"Promedio " + anio.Anio,
          "Mes":"",
          "NumMes":"",
          "Color":'#58d683',
          "Anio":anio.Anio,
          "Tipo":5,
          "Mostrar":true
        })
        
  
      });

}

this.enviarDatosReal()
    //this.Cabecera=this.CabeceraBack.filter((cab:any)=>cab.Mostrar==true)
 
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
