// angular import
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { TreeTableModule } from 'primeng/treetable';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import ConsolidadoMejoradoTrimesralComponent from './consolidado-mejorado-trimestral/consolidado-mejorado-trimestral';
import ConsolidadoSemestralComponent from './consolidado-mejorado-semestral/consolidado-mejorado-semestral.component';

interface TreeNodeData {
  Nombre: string;
  size: string;
  type: string;
  valores: {
    [clave: string]: number; // clave como "MM-YYYY" o "YYYY"
  };
}

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
  selector: 'app-consolidado-mejorado',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule,TreeSelectModule,
    TreeTableModule,TableModule,ButtonModule,TreeSelectModule],
  templateUrl: './consolidado-mejorado.component.html',
  styleUrls: ['./consolidado-mejorado.component.scss']
})


export default class ConsolidadoMejoradoComponent implements OnInit {
@ViewChild('dt') table: Table; 
  constructor(
    private conS:ConfigurationService
  ) {}
  ExpandirCuentas:boolean=false
  Categorias:any=[]
  categoriasExpandidas: { [id: number]: boolean } = {};
  Items:any=[]
  ItemsBack:any=[]
  Registros:any=[]
  RegistrosBackUp:any=[]
  Semanas:any=[]
  SemanasSingle:any=[]
  SemanasSeleccionadas:any=[]
  CatalogoFechas:any=[]
  Trimestres:any=[]
  TrimestresBack:any=[]
  TrimestresSeleccionados: any[] = [];
  Meses:any=[]
  MesesBack:any=[]
  MesesSeleccionados:any=[]
  Anios:any=[]
  AniosSeleccionados:any=[]
  AniosBack:any=[]
  Cabecera:any=[]
  Semestres:any=[]
  SemestresBack:any=[]
  CabeceraBack:any=[]
  usuario:any
  cargar:boolean=true
  MostrarTodasSemanas:boolean=false
  //Categorías
  DataCategorias:any=[]
  DataCategoriasMensual:any=[]
  DataCategoriasAnual:any=[]
  //FEO
  DataFEO:any=[]
  DataFEOMensual:any=[]
  DataFEOAnual:any=[]
  selectedSize='p-treetable-sm'

  //Items
  DataItems:any=[]
  DataItemsMensual:any=[]
  DataItemsAnual:any=[]

  //SaldosIniciales
  SaldoInicial:any=[]
  SaldoInicialBack:any=[]
  DataSaldoInicial:any=[]
  DataSaldoInicialMensual:any=[]
  DataSaldoInicialAnual:any=[]
  DataSaldoFinal:any=[]
  DataSaldoFinalMensual:any=[]
  DataSaldoFinalAnual:any=[]

  Sucursales:any=[]
  SucursalSeleccionada:any=[]
  Usuarios:any=[]
  UsuariosSeleccionados:any=[]
  Proyectos:any=[]
  ProyectoSeleccionado:any=[]

  CuentasBancarias:any=[]
  CuentaBancariaSeleccionada:any=[]
  SemanasTodas:any=[]

  Expandir:boolean=false
  catalogoFechas: any[] = [];
  MaestroSemanasMesAnio:any=[]
  MaestroSeleccionado:any

  showSemanas:boolean=true

  DataTreeTable:any=[]
  RegistrosSaldosFinalesMensuales:any=[]

  verTodo:boolean=true
  verMensual:boolean=false
  verTrimestral:boolean=false
  verSemestral:boolean=false
  verAnual:boolean=false
modoSeleccionado: string = 'todo';
  frozenCols!: Column[];
timeHierarchy:any
  maxCategoryLength: number = 0;
  selectedNodes: any;
  PeriodosTiempos:any=[]
  PeriodosTiemposSeleccionados:any=[]

  DataTreeTableRealBack:any=[]
  DataTreeTableReal:any=[]
  DataByMatriz:any=[]
  DataByEmpresa:any=[]
  idEmpresa:string=''
  ngOnInit(): void {
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

  const screenWidth = window.innerWidth;
   if (screenWidth >= 1024 && screenWidth <= 1400) {
      // Opción 1
      (document.body.style as any).zoom = '0.8'
  
   } 


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
this.SemestresBack=this.Semestres  
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
this.AniosBack=this.Anios
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
  this.AniosBack=this.Anios
    this.conS.usuario$.subscribe(usuario => {
      if (usuario) {
      this.usuario=usuario
      }
      else {
        this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }
      this.idEmpresa=this.usuario.idEmpresa
            this.obtenerSaldoInicial()
      // this.obtenerSucursales()
      // this.obtenerProyectos()
      // this.obtenerBancos()
      this.obtenerDataEmpresa()
      this.getCatalogoFechas()
   
    });

    this.maxCategoryLength = this.findLongestCategory();
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




this.DataTreeTable = this.DataTreeTableRealBack


if(this.DataTreeTable.length>0){
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



this.DataTreeTable=this.conS.filtrarDatos(resultado,AniosCabecera,CantidadMeses,this.Registros)
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


    //this.Cabecera=this.CabeceraBack.filter((cab:any)=>cab.Mostrar==true)
 
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



  findLongestCategory(): number {
    let maxLen = 0;
    // Recorre las filas principales
    for (const row of this.DataTreeTable) {
      const text = row.data.categoria || '';
      if (text.length > maxLen) {
        maxLen = text.length;
      }
      // Recorre los children
      if (row.data.children) {
        for (const child of row.data.children) {
          const childText = child.data.categoria || '';
          if (childText.length > maxLen) {
            maxLen = childText.length;
          }
        }
      }
    }
    return maxLen;
  }
  
  /**
   * Convierte la longitud de texto en px 
   * (aprox. 7px por carácter, puedes ajustar).
   */
  calcColumnWidthPx(): number {
    const factor = 7; // ~7px por carácter
    return this.maxCategoryLength * factor;
  }
  

  cambiarPeriodo(periodo:any){
    if(periodo==1){
      this.verMensual=true
      this.verTrimestral=false
      this.verSemestral=false
    }
    else if(periodo==2){
      this.verMensual=false
      this.verTrimestral=true
      this.verSemestral=false
    }
    else {
      this.verMensual=false
      this.verTrimestral=false
      this.verSemestral=true
    }
  }
  
  toggleAllRows() {
    if (this.table) {
      // Si hay filas expandidas, contraerlas todas
      if (Object.keys(this.table.expandedRowKeys).length > 0) {
        this.ExpandirCuentas=false
        this.table.expandedRowKeys = {}; // Contraer todas las filas
      } else {
        // Expandir todas las filas
        const expandedKeys = {};
        this.table.value.forEach((row) => {
          expandedKeys[row.key] = true; // Marcar todas las filas como expandidas
        });
        this.table.expandedRowKeys = expandedKeys;
        this.ExpandirCuentas=true
      }
    }
  }

  ValoresByItem(dataArray: any[], categoriaId: string, valueKey: string): number {
    // Filtrar por id_categoria
    const filteredCategories = dataArray.filter(item => item.data.id_categoria === categoriaId);
  
    if (filteredCategories.length > 0) {
      // Buscar en los children si existen y tienen el id_item
      for (const category of filteredCategories) {
        if (category.data.children) {
          const filteredChildren = category.data.children.filter(child => child.data.id_item === categoriaId);
  
          if (filteredChildren.length > 0) {
            // Si el valor existe en values, devolverlo, si no, null
            return filteredChildren[0].data.values[valueKey] ?? null;
          }
        }
      }
    }
  
    return 0;
  } 


descargarExcel(){
  let _Cabecera:any=[]
 _Cabecera=this.Cabecera.filter((cab:any)=>cab.Mostrar==true)
  const headerRow: any[] = [];
  _Cabecera.forEach((element: any) => {
    headerRow.push(element.Nombre);
  });
  let Data: any[] = [];
  let Contador:number=1
  this.Categorias.forEach((categ: any) => {
    let fila: any[] = [`${Contador}- ${categ.Nombre}`];
    Contador+=1
    _Cabecera.filter((cab: any) => cab.Tipo != 1 && cab.Tipo != 2).forEach((cab: any) => {
      const index = `${cab.Anio}-${cab.NumMes}-${categ.id}-${cab.NumSemana}`;
      const indexMensual = `${cab.NumMes}-${cab.Anio}`;
      const indexAnual = `${cab.Anio}`;
      let valor = 0;
      const categoriaEncontrada = this.DataTreeTable.find((dataT: any) => dataT.data.id_categoria === categ.id);
      if (categoriaEncontrada) {
        if (cab.Tipo === 3) {
          valor = categoriaEncontrada.data.values?.[indexMensual] ?? 0;
        } else if (cab.Tipo === 4) {
          valor = categoriaEncontrada.data.values?.[indexAnual] ?? 0;
        }
      }
      else {
        valor=0
      }

  fila.push(valor);
    })
    Data.push(fila);
    this.getItems(categ.id).forEach((item: any) => {
  let filaItem: any[] = [item.Nombre];
  _Cabecera.filter((cab: any) => cab.Tipo != 1 && cab.Tipo != 2).forEach((cab: any) => {
    const indexItem = `${cab.Anio}-${cab.NumMes}-${item.id}-${cab.NumSemana}`;
    const indexItemMensual = `${cab.Mes}-${cab.Anio}`;
    const indexItemAnual = `${cab.Anio}`;
    let valorItem = 0;
 if (cab.Tipo == 3) {
  valorItem = this.DataTreeTable.filter((dataT: any) => dataT.data.id_categoria == categ.id).length === 0
  ? 0
  : this.DataTreeTable.filter(
      (dataT: any) =>
        dataT.data.id_categoria == categ.id &&
        dataT.data.children.some((child: any) => child.data.id_item == item.id)
    ).length === 0
  ? 0
  : this.DataTreeTable
      .flatMap((dataT: any) => dataT.data.children) // Aplanar los children
      .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemMensual] || 0;

  }
  else if (cab.Tipo == 4) {
    valorItem = this.DataTreeTable.filter((dataT: any) => dataT.data.id_categoria == categ.id).length === 0
    ? 0
    : this.DataTreeTable.filter(
        (dataT: any) =>
          dataT.data.id_categoria == categ.id &&
          dataT.data.children.some((child: any) => child.data.id_item == item.id)
      ).length === 0
    ? 0
    : this.DataTreeTable
        .flatMap((dataT: any) => dataT.data.children) // Aplanar los children
        .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemAnual] || 0;
}
filaItem.push(valorItem);

  })
  Data.push(filaItem);
    })

  })

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Datos');
const headerRowData = worksheet.addRow(headerRow);

headerRowData.eachCell((cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '71bd9e' } // Fondo amarillo
  };
  cell.font = {
    bold: true,
    color: { argb: 'ffffff' } // Texto azul
  };
  cell.alignment = {
    horizontal: 'left',
    vertical: 'middle'
  };
  cell.border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  };
});

Data.forEach((row: any, index: any) => {
  const dataRow = worksheet.addRow(row);


  if(row[0].startsWith('1-') || row[0].startsWith('12-') 
  ){
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b4b4b4' },
      };
    });
  }
 else  if( 
     row[0].startsWith('3-') 
    || row[0].startsWith('4-')  
    || row[0].startsWith('6-') 
    || row[0].startsWith('7-')  
    || row[0].startsWith('9-')  
    || row[0].startsWith('10-')  
  ){
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' }, 
      };
    });
  }
else  if(row[0].startsWith('2-') 
    || row[0].startsWith('5-')
    || row[0].startsWith('8-') 
    || row[0].startsWith('10-')  
    || row[0].startsWith('11-')  
  )
  {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'afeffb' },
      };
    });
  }
else 
  {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' }, 
      };
    });
  }

  dataRow.eachCell((cell: any, colNumber: number) => {
    if (colNumber === 1) {
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle'
      };
    } else {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
    }
  });
});

worksheet.columns.forEach((column:any) => {
  const maxLength = column.values.reduce((acc: number, curr: any) => {
    return curr && curr.toString().length > acc ? curr.toString().length : acc;
  }, 10);
  column.width = maxLength + 2; // Ajustar el ancho de la columna
});
workbook.xlsx.writeBuffer().then((buffer: any) => {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'datos.xlsx');
});

}

ocultarSemanas(){
  this.Semanas.forEach(semana => {
 
      semana.Mostrar = false;
    
  });
  this.Cabecera.forEach(cab => {

    if (cab.Tipo==2) {
      cab.Mostrar = false;
    
    }
    if (cab.Tipo==3) {
     
      cab.MostrarBotonSemanal = false;
    }
    
  });
  this.showSemanas=false
}
mostrarSemanas(){
  this.Semanas.forEach(semana => {
 
      semana.Mostrar = true;
    
  });
  this.Cabecera.forEach(cab => {

    if (cab.Tipo==2) {
      cab.Mostrar = true;
    
    }
    if (cab.Tipo==3) {
     
      cab.MostrarBotonSemanal = true;
    }
    
  });
  this.showSemanas=true
}

ocultarMostrar(NumMes:any,Anio:any){
  this.Semanas.forEach(semana => {
    if (semana.Mes == NumMes && semana.Anio == Anio) {
      semana.Mostrar = !semana.Mostrar;
    }
  });
  this.Cabecera.forEach(cab => {
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==2)) {
      cab.Mostrar = !cab.Mostrar;
    
    }
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==3)) {
     
      cab.MostrarBotonSemanal = !cab.MostrarBotonSemanal;
    }
  });

}
ocultarMostrarMeses(NumMes:any,Anio:any){
  this.Anios.forEach(anio => {

    this.Meses.forEach(mes => {
      if (mes.NumMes == NumMes && anio.Anio == Anio) {
        mes.Mostrar = !mes.Mostrar;
      }
    });
    
  });

  this.Cabecera.forEach(cab => {
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==3)) {
      cab.Mostrar = !cab.Mostrar;

      if(cab.MostrarBotonSemanal==true){

        cab.MostrarBotonSemanal = !cab.MostrarBotonSemanal;
      }
      cab.MostrarSemanas= !cab.MostrarSemanas;
    
    }
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==2)) {
      if(cab.Mostrar==true){

        cab.Mostrar = !cab.Mostrar;
        cab.MostrarBotonMensual = !cab.MostrarBotonMensual;
      }
    }
 
  });
 
}
filtrarMeses(numMes:any){
    let _MesEncontrado:any=[]
    _MesEncontrado=this.MesesSeleccionados.filter((mes:any)=>mes.NumMes==numMes)
   
    if(_MesEncontrado.length>0){
      return true
    }
    else {
      return false
    }
}

obtenerProyectos(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
      _subscribe.unsubscribe()
      this.Proyectos=resp
      this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )

    })
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

getCatalogoFechas(){
    const fechaInicio = '2023-01-01';
    const dias = 365; // Número de días a generar
    let _Semanas:any=[]
    this.catalogoFechas = this.conS.generarCatalogoFechas(fechaInicio);

    let SemanasAgrupadas:any=[]
    SemanasAgrupadas=this.conS.agruparPorAnoMesSemana(this.catalogoFechas);
   
    SemanasAgrupadas.forEach((fecha:any)=>{
      _Semanas.push(
        { 
        NumSemana: fecha.semana, 
        Semana: "Semana " + fecha.semana, 
        SemanaAnio: "Semana " + fecha.semana + ' ' + '(' + fecha.año + ')', 
        Mes:fecha.numeroMes,
        NumMes:fecha.numeroMes,
        MesNombre:fecha.mes,
        Fechas:fecha.fechas,
        Anio:fecha.año
      })
    })
   this.SemanasTodas= this.conS.posicionarSemanas(_Semanas);


   }
   filtrarBySemanas(){
    let SemanasRegistros:any=[]
    let MesesRegistros:any=[]
    let AniosRegistros:any=[]
    let CriteriosRegistros:any=[]
    let CriteriosSaldos:any=[]

    if(this.MaestroSeleccionado.length>0 ){
      let MaestroSelec=this.MaestroSeleccionado.filter(obj => !('expanded' in obj));
        MaestroSelec.forEach((maestro:any) => {
        AniosRegistros.push(maestro.Anio)
        MesesRegistros.push(maestro.parent.data)
        SemanasRegistros.push(maestro.NumSemana)
      
        
      });
    
    }


    CriteriosRegistros={
      NumSemana:SemanasRegistros,
      AnioRegistro:AniosRegistros,
      MesRegistro:MesesRegistros,

    }
    CriteriosSaldos={
      SemanaNum:SemanasRegistros,
      AnioRegistro:AniosRegistros,
      MesRegistro:MesesRegistros,

    }
    this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
    this.SaldoInicial= this.conS.filtradoDinamico(CriteriosSaldos,this.SaldoInicialBack)

   this.construirCabecera()

  }

  filtrarPorAnioMes(){
    this.Anios=this.AniosSeleccionados.length>0 ? this.AniosSeleccionados: this.AniosBack
    this.Meses=this.MesesSeleccionados.length>0 ? this.MesesSeleccionados: this.MesesBack
    this.Cabecera=[]
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
          this.Cabecera.push({
            "Nombre":mes.Mes + ' ' + anio.Anio,
            "Mes":mes.Mes,
            "NumMes":mes.NumMes,
            "Anio":anio.Anio,
            "Tipo":3
          })
      });
      this.Cabecera.push({
        "Nombre":"Total " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Tipo":4
      })
      this.Cabecera.push({
        "Nombre":"Promedio " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Tipo":5
      })
      

    });


    this.CabeceraBack=this.Cabecera

    
  }
  filtrarPorTrimestre(){
  let DataTrimestral={
      'Cabecera':this.Cabecera,
      'Categorias':this.Categorias,
      'Items':this.Items,
      "Trimestres":this.TrimestresSeleccionados,
      "Anios":this.AniosSeleccionados,
      'DataTreeTable':this.DataTreeTable
    }
    this.conS.enviarRegistrosTrimestrales(DataTrimestral)
  }

  filtrarData(){
    let SemanasRegistros:any=[]
    let Cuentas:any=[]
    let CriteriosRegistros:any=[]
    let CriteriosSaldos:any=[]
    let Sucursales:any=[]
    let Proyectos:any=[]

    // if(this.SemanasSeleccionadas.length>0){
    //   this.SemanasSeleccionadas.forEach((element:any) => {
    //     SemanasRegistros.push(element.NumSemana)
    //   });
    // }
    if(this.CuentaBancariaSeleccionada.length>0){
      this.CuentaBancariaSeleccionada.forEach((element:any) => {
        Cuentas.push(element.Cuenta)
      });
    }
    if(this.SucursalSeleccionada.length>0){
      this.SucursalSeleccionada.forEach((element:any) => {
        Sucursales.push(element.id)
      });
    }
    if(this.ProyectoSeleccionado.length>0){
      this.ProyectoSeleccionado.forEach((element:any) => {
        Proyectos.push(element.id)
      });
    }

    CriteriosRegistros={
      NumSemana:SemanasRegistros,
      NumCuenta:Cuentas,
      idProyecto:Proyectos,
      idSucursal:Sucursales

    }
    CriteriosSaldos={
      SemanaNum:SemanasRegistros,
      NumCuenta:Cuentas,
      idProyecto:Proyectos,
      idSucursal:Sucursales

    }
   
    this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
    this.SaldoInicial= this.conS.filtradoDinamico(CriteriosSaldos,this.SaldoInicialBack)
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
                "Nombre":"Total Trimestre 1",
                "NumTrim":1,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 1",
                "NumTrim":1,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
            }
            else if(mes.NumMes==6){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 2",
                "NumTrim":2,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 2",
                "NumTrim":2,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Total Semestre 1",
                "NumSem":1,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":7,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Semestre 1",
                "NumSem":1,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":9,
                "Mostrar":false
              })
            } 
            else if(mes.NumMes==9){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 3",
                "NumTrim":3,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 3",
                "NumTrim":3,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
            }
            else if(mes.NumMes==12){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 4",
                "NumTrim":4,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":6,
                "Mostrar":false
              })
    
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 4",
                "NumTrim":4,
                "Anio":anio.Anio,
                "Color":'#4fd37c',
                "Tipo":8,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Total Semestre 2",
                "NumSem":2,
                "Anio":anio.Anio,
                "Color":'#2ac25e',
                "Tipo":7,
                "Mostrar":false
              })
              this.CabeceraBack.push({
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


    //this.Cabecera=this.CabeceraBack.filter((cab:any)=>cab.Mostrar==true)
    this.Cabecera=this.CabeceraBack
   
  
  }

  obtenerSucursales(){
    let _subscribe:Subscription
   _subscribe= this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe((resp:any)=>{
    _subscribe.unsubscribe()
    this.Sucursales=resp.filter((suc:any)=>suc.Activo==true)
    })
  }
  obtenerBancos(){
    this.conS.obtenerBancos( this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.CuentasBancarias=resp
      this.CuentasBancarias.map((c:any)=> c.CuentaNombre= c.Nombre + ' - ' + c.Cuenta)


    })
  }
  obtenerSaldoInicial(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerSaldoInicial( this.usuario.idEmpresa).subscribe((resp:any)=>{
      _subscribe.unsubscribe()
      this.SaldoInicial=resp
      this.SaldoInicial.map((saldo:any)=>{
        saldo.Trimestre=this.setTrim(saldo.MesRegistro), 
        saldo.Semestre=this.setSemestre(saldo.NumMes)
        
      })
      this.SaldoInicialBack=resp

      this.obtenerCategorias()
    })
  }

  obtenerCategorias(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
      // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
      _subscribe.unsubscribe() 
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
    
      this.Categorias.forEach(element => {
        this.categoriasExpandidas[element.id]=true
        
      });
      this.obtenerItems()
    })
  }
  toggleCategoria(id: number) {

    this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
  }
  expandirTodo(){
    this.Expandir=!this.Expandir
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=false
      
    });
  }
  contraerTodo(){
    this.Expandir=!this.Expandir
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=true
      
    });
  }
  
obtenerItems(){
  let _subscribe:Subscription
  _subscribe=  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    _subscribe.unsubscribe()
    this.Items=[]
          this.Items=resp.filter((item:any)=>item.Activo==true);
          this.ItemsBack=resp.filter((item:any)=>item.Activo==true);;
         this.obtenerRegistros()
      })
}

filtrarCuentas(TipoRubro:any){
 if( this.ProyectoSeleccionado.length==0 && this.SucursalSeleccionada.length==0){

    this.Items=this.ItemsBack
  }
 else if(TipoRubro==1){

    if( this.SucursalSeleccionada.length==0){
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro)
    }

    else {
      const sucursalesID = this.SucursalSeleccionada.map(p => p.id);
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro
      &&

      item.idSucursales.some(sucursal => sucursalesID.includes(sucursal))
      )


    }
    
  }
  else {

    if( this.ProyectoSeleccionado.length==0){
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro)
    }

    else {
      const proyectosIds = this.ProyectoSeleccionado.map(p => p.id);
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro &&
      item.idProyectos.some(proyecto => proyectosIds.includes(proyecto))
      )
    }
    
  }
this.construirItemsCatalogos()
  // this.getDataCategorias()
  // this.getDataCategoriasMensual()
  // this.getDataCategoriasAnual()


}
  
setTrim(MesRegistro:any){

if(MesRegistro=='Enero' || MesRegistro=='Febrero' || MesRegistro=='Marzo' ){
    return 1
}
else if(MesRegistro=='Abril' || MesRegistro=='Mayo' || MesRegistro=='Junio' ){
    return 2
}
else if(MesRegistro=='Julio' || MesRegistro=='Agosto' || MesRegistro=='Septiembre'){
    return 3
}
else if(MesRegistro=='Octubre' || MesRegistro=='Noviembre' || MesRegistro=='Diciembre'){
    return 4
}
else {
  return 0
}
  

}
setSemestre(NumMes:any){

if(NumMes>=6){
    return 2
}
else if(NumMes<6){
    return 1
}
else {
  return 0
}
  

}

obtenerRegistros(){
  let _subscribe:Subscription
  _subscribe=  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    _subscribe.unsubscribe()
    this.Registros=[]  
        resp.filter((data:any)=>data.Valor!=0).sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
          let _Registro={
            "Activo":element.Activo,
            "AnioRegistro":element.AnioRegistro,
            "TipoCuentaSeleccionada":element.CuentaSeleccionada.Tipo,
            "Trimestre":this.setTrim(element.MesRegistro), 
            "Semestre":this.setSemestre(element.NumMes),
            "Cuenta":element.Cuenta.Cuenta,
            "Editando":element.Editando,
            "FechaRegistro":element.FechaRegistro,
            "MesRegistro":element.MesRegistro,
            "NumMes":element.NumMes,
            "Orden":element.Orden,
            "Valor":element.Valor,
            "id":element.id,
            "CuentasHijos":element.CuentasHijos || [] ,
            "Tipo":element.Tipo || '',
            "idCategoria":element.idPadre,
            "idEmpresa":element.idEmpresa,
            "idFlujo":element.idAbuelo,
            "idUsuario":element.idUsuario,
            "idMatriz":element.idMatriz,
            "idSocioNegocio":element.idSocioNegocio.id,
            "idSucursal":element.idSucursal,
            "idHijo":element.idHijo,
            "idProyecto":element.idProyecto,
            "idSubCuentaContable":element.idNieto || '',
            "NumCuenta":element.Cuenta.Cuenta || ''
          }
          this.Registros.push(_Registro)
          });

         
          this.RegistrosBackUp=this.Registros
   


          const obtenerAniosUnicos = (registros1: any[], registros2: any[]) => {
            const aniosUnicos = new Map();
          
            // Unir ambos arreglos y extraer los años únicos
            [...registros1, ...registros2].forEach((item) => {
              if (!aniosUnicos.has(item.AnioRegistro)) {
                aniosUnicos.set(item.AnioRegistro, {
                  Anio: item.AnioRegistro,
                  seleccionado: false,
                  label: item.AnioRegistro,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(aniosUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };

          const aniosActivos = obtenerAniosUnicos(this.Registros, this.SaldoInicial);

          const obtenerMesesUnicos = (registros1: any[], registros2: any[]) => {
            const mesesUnicos = new Map();
              [...registros1, ...registros2].forEach((item) => {
              const claveUnica = `${item.AnioRegistro}-${item.MesRegistro}`;
              if (!mesesUnicos.has(claveUnica)) {
                mesesUnicos.set(claveUnica, {
                  Anio: item.AnioRegistro,
                  Mes: item.MesRegistro,
                  NumMes: item.NumMes,
                  seleccionado: false,
                  label: item.MesRegistro,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(mesesUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };

          const obtenerTrimestresUnicos = (registros1: any[], registros2: any[]) => {
            const trimestresUnicos = new Map();
              [...registros1, ...registros2].forEach((item) => {
              const claveUnica = `${item.AnioRegistro}-${item.Trimestre}`;
              if (!trimestresUnicos.has(claveUnica)) {
                trimestresUnicos.set(claveUnica, {
                  Anio: item.AnioRegistro,
                  NumTrimestre: item.Trimestre,
                  Trimestre: `Trimestre ${item.Trimestre}`,
                  seleccionado: false,
                  label: item.Trimestre,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(trimestresUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };

          const obtenerSemestresUnicos = (registros1: any[], registros2: any[]) => {
            const semestresUnicos = new Map();
              [...registros1, ...registros2].forEach((item) => {
              const claveUnica = `${item.AnioRegistro}-${item.Semestre}`;
              if (!semestresUnicos.has(claveUnica)) {
                semestresUnicos.set(claveUnica, {
                  Anio: item.AnioRegistro,
                  NumSemestre: item.Semestre,
                  Semestre: `Semestre ${item.Semestre}`,
                  seleccionado: false,
                  label: item.Semestre,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(semestresUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };


          const mesesActivos = obtenerMesesUnicos(this.Registros, this.SaldoInicial);

          // this.Meses=mesesActivos.sort((a:any, b:any) => a.NumMes- b.NumMes)
          // this.MesesBack=mesesActivos.sort((a:any, b:any) => a.NumMes- b.NumMes)
          // this.Anios=aniosActivos.sort((a:any, b:any) => a.Anio- b.Anio)
          // this.AniosBack=aniosActivos.sort((a:any, b:any) => a.Anio- b.Anio)
          //this.Trimestres=obtenerTrimestresUnicos(this.Registros, this.SaldoInicial)
          //this.Semestres=obtenerSemestresUnicos(this.Registros, this.SaldoInicial)
          // this.Anios.map((anio:any)=>{anio.Mostrar=true,anio.MostrarBoton=true})
          // this.Meses.map((mes:any)=>{mes.Mostrar=true,mes.MostrarBoton=true})

          // this.MesesSeleccionados=this.Meses
    
        
     
          

          this.construirCabecera()
});
}

getSemanas(Anio:any,Mes:any){
  let semanas: any= [];
  this.Semanas.filter((sem:any)=>sem.Mes==Mes && sem.Anio==Anio).forEach((semana:any) => {
    semanas.push({ 
      key: '0-0-0'+semana.NumSemana, 
      label: semana.Semana, 
      Mes:semana.Mes,
      Anio:semana.Anio,
      posicion:semana.posicion,
      NumSemana:semana.NumSemana,
      icon: 'pi pi-calendar', 
      data: semana.Semana },)
  });

  return semanas.sort((a:any, b:any) => a.NumSemana - b.NumSemana)

}

VerTodasSemanas(){
  this.MostrarTodasSemanas=!this.MostrarTodasSemanas

  this.construirCabecera()
}
getSemanasByMesAnio(Anio:any,NumMes:any){

  return this.Semanas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)

   // return this.SemanasTodas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)
  



  
}

getValorSaldoInicial(NumSemana:any,Mes:any,Anio:any,Posicion:any){
if(Posicion==0 || Posicion==1){
  let _Data: any=[];
  _Data=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.SemanaNum==NumSemana
  && saldo.NumMes==Mes
  && saldo.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    let UltimaSemana:any=[]
    if(Mes==1){
      UltimaSemana= this.getSemanasByMesAnio(Anio-1,12).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

    }
    else{
      UltimaSemana= this.getSemanasByMesAnio(Anio,(Mes-1)).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

    }
  
    if(UltimaSemana.length>0){
      return this.getValorSaldoFinal(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes)
  
    }
    else {
      return 0
    }


   
  }

}
else if (Posicion == 2) {
  let DataSaldoFinal:any=[]
  let Valor:any
  DataSaldoFinal=this.DataSaldoFinal.filter((saldo:any)=>saldo.Mes==Mes && saldo.Anio==Anio && saldo.NumSemana==NumSemana - 1)
  if (DataSaldoFinal.length >= 1) {
   Valor=DataSaldoFinal[0].Valor
  } 
  
  else {
    Valor= 0; // Condición de terminación cuando NumSemana es menor o igual a 1
  }
  return Valor
} else {
  let DataSaldoFinal:any=[]
  let Valor:any
  DataSaldoFinal=this.DataSaldoFinal.filter((saldo:any)=>saldo.Mes==Mes && saldo.Anio==Anio && saldo.NumSemana==NumSemana - 1)
  if (DataSaldoFinal.length >= 1) {
   Valor=DataSaldoFinal[0].Valor
  } else {
    Valor= 0; // Condición de terminación cuando NumSemana es menor o igual a 1
  }
  return Valor
}


}

getValorSaldoFinal(Mes:any,Anio:any){

  return  this.getSaldoInicialMensual(Mes,Anio) + 
  this.getDataFlujoLibreMensual(Mes,Anio)

}
getSaldoInicialMensual(Mes:any,Anio:any){
  let _Data: any=[];
  let _DataSaldoFinal: any=[];
  _Data=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.NumMes==Mes
  && saldo.AnioRegistro==Anio
  )

  _DataSaldoFinal=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.NumMes==Mes-1
  && saldo.AnioRegistro==Anio
  )


  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }


  else {
    let key=`${Mes-1}-${Anio}`
    let ValorSaldo:number=0

    let RSFM=this.RegistrosSaldosFinalesMensuales.filter((reg:any)=>reg.key==key)
    let RSFM2=this.RegistrosSaldosFinalesMensuales.filter((reg:any)=>reg.Anio==Anio-1)

 if(RSFM.length>0){
      ValorSaldo=RSFM[RSFM.length-1].Valor
    }
    else if(RSFM2.length>0) {
      ValorSaldo=RSFM2[RSFM2.length-1].Valor
    }
    else {
      ValorSaldo=0
    }


      return ValorSaldo


  }
}
getSaldoFinalMensual(Mes:any,Anio:any){
  let UltimaSemana:any=[]
  UltimaSemana= this.getSemanasByMesAnio(Anio,Mes).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

  if(UltimaSemana.length>0){
    return this.getValorSaldoFinal(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes)

  }
  else {
    return 0
  }
}

getValorCategoria(idCategoria:any,NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria.id==idCategoria
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Valor
  }
  else {
    return 0
  }


}

getValorCategoriaMensual(idCategoria:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria==idCategoria
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Valor
  }
  else {
    return 0
  }
}
getValorCategoriaAnual(idCategoria:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria.id==idCategoria
  && registro.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Valor
  }
  else {
    return 0
  }
}

getDataCategorias(){
this.DataCategorias=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
      this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${categ.id}-${sem.NumSemana}`;  //2023-2-kndkfdnfjk-7
        if (!this.DataCategorias[key]) {
          this.DataCategorias[key] =[];
        }
        if(categ.Orden==0) {
          
          this.DataCategorias[key].push({
            "Valor": this.obtenerValorSaldoInicial(sem.NumSemana,mes.NumMes,anio.Anio),
             "Tipo":this.obtenerValorSaldoInicial(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
     else if(categ.Orden==1) {
          
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoOperativo(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoOperativo(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }
      else if(categ.Orden==4) {   
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoInversion(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoInversion(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
      else if(categ.Orden==7) {         
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoFinanciero(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoFinanciero(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }
      else if(categ.Orden==10) {     
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoLibre(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoLibre(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
      else if(categ.Orden==11) {     
          this.DataCategorias[key].push({
            "Valor": this.obtenerValorSaldoFinal(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.obtenerValorSaldoFinal(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
        else {
          this.DataCategorias[key].push({
            "Valor": this.getValorCategoria(categ.id,sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getValorCategoria(categ.id,sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
          
        }

        })
      })
    })
  
});

this.getDataItems()
this.getDataItemMensual()
this.getDataItemAnual()
}


getDataCategoriasMensual(){
  this.DataCategoriasMensual=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
    this.getMesesByAnio(anio.Anio).forEach((mes:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${categ.id}`;  
        if (!this.DataCategoriasMensual[key]) {
          this.DataCategoriasMensual[key] =[];
        }
        
        if(categ.Orden==0) {
          this.DataCategoriasMensual[key].push({
            "Valor": this.obtenerValorSaldoInicialMensual(mes.NumMes,anio.Anio),
            "Tipo":this.obtenerValorSaldoInicialMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }

      else if(categ.Orden==1) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==4) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==7) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
      }

      else if(categ.Orden==10) {     
        this.DataCategoriasMensual[key].push({
          "Valor": this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio),
          "Tipo":this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1

        });
      }

      else  if(categ.Orden==11) {
          this.DataCategoriasMensual[key].push({
            "Valor": this.obtenerValorSaldoFinalMensual(mes.NumMes,anio.Anio),
            "Tipo":this.obtenerValorSaldoFinalMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }
        else {
          this.DataCategoriasMensual[key].push({
            "Valor": this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio),
            "Tipo":this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });

        }

       
      })
    })
  
});

}
getDataCategoriasAnual(){
  this.DataCategoriasAnual=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
        const key = `${anio.Anio}-${categ.id}`;  
        if (!this.DataCategoriasAnual[key]) {
          this.DataCategoriasAnual[key] =[];
        }

        if(categ.Orden==0) {
          this.DataCategoriasAnual[key].push({
            "Valor": 0,
            "Tipo":1
          });
        }

      else if(categ.Orden==1) {
          
          this.DataCategoriasAnual[key].push({
            "Valor": this.getDataFlujoOperativoAnual(anio.Anio),
            "Tipo":this.getDataFlujoOperativoAnual(anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==4) {
          
          this.DataCategoriasAnual[key].push({
            "Valor": this.getDataFlujoInversionAnual(anio.Anio),
            "Tipo":this.getDataFlujoInversionAnual(anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==7) {
          
          this.DataCategoriasAnual[key].push({
            "Valor": this.getDataFlujoFinancieroAnual(anio.Anio),
            "Tipo":this.getDataFlujoFinancieroAnual(anio.Anio)<0 ? 2 : 1
  
          });
      }

      else if(categ.Orden==10) {     
        this.DataCategoriasAnual[key].push({
          "Valor": this.getDataFlujoLibreAnual(anio.Anio),
          "Tipo":this.getDataFlujoLibreAnual(anio.Anio)<0 ? 2 : 1

        });
      }

      else  if(categ.Orden==11) {
          this.DataCategoriasAnual[key].push({
            "Valor": this.obtenerValorSaldoFinalAnual(anio.Anio),
            "Tipo":this.obtenerValorSaldoFinalAnual(anio.Anio)<0 ? 2 : 1
          });
        }
        else {
          this.DataCategoriasAnual[key].push({
            "Valor": this.getValorCategoriaAnual(categ.id,anio.Anio),
            "Tipo":this.getValorCategoriaAnual(categ.id,anio.Anio)<0 ? 2 : 1
  
          });

        }






       
    
    })
  
});

}

getValorItem(idElemento:any,NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
    && registro.NumSemana==NumSemana 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Number(Valor)
  }
  else {
    return 0
  }
}
getValorItemMensual(idElemento:any,Mes:any,Anio:any){

  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idHijo==idElemento 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });


    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
  
    return Number(Valor)
  }
  else {
    return 0
  }
}

getValorItemAnual(idElemento:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idHijo==idElemento
    && registro.AnioRegistro==Anio
    )
  
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Number(Valor)
  }
  else {
    return 0
  }
}

getValorSubItemMensual(idElemento:any,Mes:any,Anio:any){

  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idSubCuentaContable==idElemento 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    && registro.TipoCuentaSeleccionada=="Hijo"
    )
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });


    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
  
    return Number(Valor)
  }
  else {
    return 0
  }
}
getValorSubItemAnual(idElemento:any,Anio:any){

  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idSubCuentaContable==idElemento 
    && registro.AnioRegistro==Anio
    && registro.TipoCuentaSeleccionada=="Hijo"
    )
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });


    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
  
    return Number(Valor)
  }
  else {
    return 0
  }
}
getDataItemMensual(){
this.DataItemsMensual=[]

this.Items.forEach((item:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${item.id}`;  
        if (!this.DataItemsMensual[key]) {
          this.DataItemsMensual[key] =[];
        }
        this.DataItemsMensual[key].push({
          "Valor": this.getValorItemMensual(item.id,mes.NumMes,anio.Anio),
          "Tipo": this.getValorItemMensual(item.id,mes.NumMes,anio.Anio)<0 ? 2 : 1

        });

       
      })
    })
  
});
}
toggleChildExpansion(child: any) {
  child.expanded = !child.expanded;
}
getDataItemAnual(){
  this.DataItemsAnual=[]
  this.Items.forEach((item:any) => {
    this.Anios.forEach((anio:any) => {
          const key = `${anio.Anio}-${item.id}`;  
          if (!this.DataItemsAnual[key]) {
            this.DataItemsAnual[key] =[];
          }
          this.DataItemsAnual[key].push({
            "Valor": this.getValorItemAnual(item.id,anio.Anio),
            "Tipo":this.getValorItemAnual(item.id,anio.Anio)<0 ? 2 : 1
          });
      }) 
  });

this.construirItemsCatalogos()
 
    

  



  }

construirItemsCatalogos(){
  this.DataTreeTable=[] 
  this.Categorias.forEach(categ => {

    this.DataTreeTable.push({
      data: { 
         Nombre: categ.Nombre, 
         size: '200mb', 
         type: 'Folder',
         valores: {},
         idCategoria:categ.id,
         orden:categ.Orden,
         tipo: 
         (categ.Orden == 1 || categ.Orden == 4 || categ.Orden == 7 || categ.Orden == 10 ) ?'Abuelo' :
         (categ.Orden == 0 ) ?'Saldo Inicial' :
         (categ.Orden == 11 ) ?'Saldo Final' 
         :'Padre'
         },
      children:
      
      this.getItemsByCategoria(categ.id)

    })


    
    
    
    
  })
   this.construirValores()
}

getItemsByCategoria(idCategoria:string){
    let Item=this.Items.filter((it:any)=>it.idPadre==idCategoria)
    let ItemsEncontrados:any=[]
    if(Item.length>0){
      let data:any
      Item.forEach((item:any)=>{
        ItemsEncontrados.push(
          {
         data:{
           Nombre: item.Nombre, 
           idItem: item.id,
           idProyectos:item.idProyectos == undefined? []: item.idProyectos,
           idSucursales:item.idSucursales == undefined? []: item.idSucursales,
           size: '200mb', 
           type: 'Folder',
           orden:item.Orden,
           tipo:'Hijo',
           valores: {},
         },
          children: item.CuentasHijos === undefined ? [] : item.CuentasHijos.map(hijo => ({
            data:{
            ...hijo,
              valores: {},
              tipo:'Nieto',
              Orden:hijo.Orden
            }  
          }))
      });
      })
      return ItemsEncontrados
    }
    else {
      return []
    } 


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
construirValores(){
  let AniosCabecera=this.AniosSeleccionados.length>0 ? this.AniosSeleccionados:this.Anios
  let CantidadMeses:number=0
  CantidadMeses=this.MesesSeleccionados.length==0?12:this.MesesSeleccionados.length
  this.DataTreeTable.forEach(dataTree => {
    if (dataTree.data.valores !== undefined) {
      dataTree.data.valores = {}; 
    AniosCabecera.forEach(anio => {
      let totalAnual = 0;
      const claveAnual= `${dataTree.data.idCategoria}-${anio.Anio}`;
      const claveAnualPromedio= `Prom-${dataTree.data.idCategoria}-${anio.Anio}`;
      this.Semestres.forEach(semestre => {
        this.getTrimestresBySemestre(semestre.id).forEach((trim:any)=>{

          this.getMesesByTrimestre(trim.id).forEach(mes => {
            const claveMensual = `${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`;
            let key = `${mes.NumMes}-${anio.Anio}`;
            if(dataTree.data.tipo=='Saldo Inicial'){
              this.RegistrosSaldosFinalesMensuales.push({
                "key":key,
                "Anio":anio.Anio,
                "Valor":this.getValorSaldoFinal(mes.NumMes,anio.Anio) || 0
              })
              
       
              const valor = 
        
              (this.getSaldoInicialMensual(mes.NumMes,anio.Anio) || 0)
              
              const valorAnual = this.obtenerValorSaldoInicialAnual(anio.Anio) || 0
              const valorAnualPromedio =Number((valorAnual/CantidadMeses).toFixed(0))
             
             
              dataTree.data.valores[claveMensual] = 
              {
               "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valor,
               "Color": valor<0 ? '#ff3200': '#000000',
              }
    
    
              dataTree.data.valores[claveAnual] = 
               {
               "Valor": valorAnual<0 ? ('-$'+ (valorAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valorAnual,
               "Color": valorAnual<0 ? '#ff3200': '#000000',
               }
              dataTree.data.valores[claveAnualPromedio] = 
               {
               "Valor": valorAnualPromedio<0 ? ('-$'+ (valorAnualPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnualPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valorAnualPromedio,
               "Color": valorAnualPromedio<0 ? '#ff3200': '#000000',
               }
             
            }
          else if(dataTree.data.tipo=='Saldo Final'){
              // const valor = this.getValorSaldoFinal(mes.NumMes,anio.Anio) || 0
              // const valorAnual = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0
              const valor = 
              (this.DataTreeTable[0].data.valores[`0-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)+
              (this.DataTreeTable[1].data.valores[`EESGPM4hWXvDlXSRnCwA-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)+
              (this.DataTreeTable[4].data.valores[`GMzSuF04XQBsPmAkIB2C-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)+
              (this.DataTreeTable[7].data.valores[`psmpY6iyDJNkW7AKFXgK-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)
              const valorAnual = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0
            
              dataTree.data.valores[claveMensual] = 
                {
               "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valor,
               "Color": valor<0 ? '#ff3200': '#000000',
                }
              dataTree.data.valores[claveAnual] = 
              {
              "Valor": valorAnual<0 ? ('-$'+ (valorAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              "ValorNumero": valorAnual,
              "Color": valorAnual<0 ? '#ff3200': '#000000',
              }
              
             const valorAnualPromedio =
             this.DataTreeTable[0].data.valores[`Prom-0-${anio.Anio}`]?.ValorNumero+
             this.DataTreeTable[1].data.valores[`Prom-EESGPM4hWXvDlXSRnCwA-${anio.Anio}`]?.ValorNumero+
             this.DataTreeTable[4].data.valores[`Prom-GMzSuF04XQBsPmAkIB2C-${anio.Anio}`]?.ValorNumero+
             this.DataTreeTable[7].data.valores[`Prom-psmpY6iyDJNkW7AKFXgK-${anio.Anio}`]?.ValorNumero
              
              dataTree.data.valores[claveAnualPromedio] = 
               {
               "Valor": valorAnualPromedio<0 ? ('-$'+ (valorAnualPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnualPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valorAnualPromedio,
               "Color": valorAnualPromedio<0 ? '#ff3200': '#000000',
               }
             
            }
    
          else if(dataTree.data.tipo=='Abuelo'){
              if(dataTree.data.orden==1){
              const valor = this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio) || 0;
              
              dataTree.data.valores[claveMensual] = 
                {
               "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valor,
               "Color": valor<0 ? '#ff3200': '#000000',
                }
                totalAnual += valor;
    
                dataTree.data.valores[claveAnual] =
                {
                "Valor": totalAnual<0 ? ('-$'+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": totalAnual,
                "Color": totalAnual<0 ? '#ff3200': '#000000',
                } 
                const ValorPromedio=Number((totalAnual/CantidadMeses).toFixed(0))
                dataTree.data.valores[claveAnualPromedio] =
                {
                "Valor": ValorPromedio<0 ? ('-$'+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": ValorPromedio,
                "Color": ValorPromedio<0 ? '#ff3200': '#000000',
                }                  
              }
            else if(dataTree.data.orden==4){
                const valor = this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio) || 0;
                dataTree.data.valores[claveMensual] = 
                {
                "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valor,
                "Color": valor<0 ? '#ff3200': '#000000',
                }
                totalAnual += valor;
                dataTree.data.valores[claveAnual] =
                {
                "Valor": totalAnual<0 ? ('-$'+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": totalAnual,
                "Color": totalAnual<0 ? '#ff3200': '#000000',
                }
                
                const ValorPromedio=Number((totalAnual/CantidadMeses).toFixed(0))
                dataTree.data.valores[claveAnualPromedio] =
                {
                "Valor": ValorPromedio<0 ? ('-$'+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": ValorPromedio,
                "Color": ValorPromedio<0 ? '#ff3200': '#000000',
                } 
              }
            else if(dataTree.data.orden==7){
                const valor = this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio) || 0;
                dataTree.data.valores[claveMensual] =
                {
                "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valor,
                "Color": valor<0 ? '#ff3200': '#000000',
                }
                totalAnual += valor;
                dataTree.data.valores[claveAnual] =
                {
                "Valor": totalAnual<0 ? ('-$'+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": totalAnual,
                "Color": totalAnual<0 ? '#ff3200': '#000000',
                }  
    
                const ValorPromedio=Number((totalAnual/CantidadMeses).toFixed(0))
                dataTree.data.valores[claveAnualPromedio] =
                {
                "Valor": ValorPromedio<0 ? ('-$'+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": ValorPromedio,
                "Color": ValorPromedio<0 ? '#ff3200': '#000000',
                }               
              }
            else if(dataTree.data.orden==10){
                const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio) || 0;
                dataTree.data.valores[claveMensual] =
                {
                "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valor,
                "Color": valor<0 ? '#ff3200': '#000000',
                }
                totalAnual += valor;
                dataTree.data.valores[claveAnual] = 
                {
                "Valor": totalAnual<0 ? ('-$'+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": totalAnual,
                "Color": totalAnual<0 ? '#ff3200': '#000000',
                }
                
                const ValorPromedio=Number((totalAnual/CantidadMeses).toFixed(0))
                dataTree.data.valores[claveAnualPromedio] =
                {
                "Valor": ValorPromedio<0 ? ('-$'+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": ValorPromedio,
                "Color": ValorPromedio<0 ? '#ff3200': '#000000',
                } 
              }
            }
    
          else if(dataTree.data.tipo=='Padre'){
    
              const valor = this.getValorCategoriaMensual(dataTree.data.idCategoria,mes.NumMes,anio.Anio) || 0;
              dataTree.data.valores[claveMensual] = {
               "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valor,
               "Color": valor<0 ? '#ff3200': '#000000'
              }
              totalAnual += valor;
              dataTree.data.valores[claveAnual] = 
              {
              "Valor": totalAnual<0 ? ('-$ '+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              "ValorNumero": totalAnual,
              "Color": totalAnual<0 ? '#ff3200': '#000000',
              }
              const ValorPromedio=Number((totalAnual/CantidadMeses).toFixed(0))
              dataTree.data.valores[claveAnualPromedio] =
              {
                "Valor": ValorPromedio<0 ? ('-$ '+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": ValorPromedio,
                "Color": ValorPromedio<0 ? '#ff3200': '#000000',
              }   
              
              let claveAnualHijo: any
              let claveAnualNieto: any        
              let claveAnualNietoProm: any        
              let claveAnualHijoProm: any        
              dataTree.children.forEach(cuenta => {
                const claveMensualHijo = `${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`;
                claveAnualHijo= `${cuenta.data.idItem}-${anio.Anio}`;
                claveAnualHijoProm= `Prom-${cuenta.data.idItem}-${anio.Anio}`;
                const valor = this.getValorItemMensual(cuenta.data.idItem, mes.NumMes, anio.Anio) || 0;
                const valorAnual = this.getValorItemAnual(cuenta.data.idItem,anio.Anio) || 0;
                cuenta.data.valores[claveMensualHijo] = 
                {
               "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valor,
               "Color": valor<0 ? '#ff3200': '#000000'
                }
                cuenta.data.valores[claveAnualHijo] =   
                {
               "Valor": valorAnual<0 ? ('-$ '+ (valorAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
               "ValorNumero": valorAnual,
               "Color": valorAnual<0 ? '#ff3200': '#000000'
                }
    
                const ValorPromedio=Number((valorAnual/CantidadMeses).toFixed(0))
                cuenta.data.valores[claveAnualHijoProm] =
                {
                "Valor": ValorPromedio<0 ? ('-$ '+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": ValorPromedio,
                "Color": ValorPromedio<0 ? '#ff3200': '#000000',
                }               
    
                cuenta.children.forEach(subCuenta => {
            
                const claveMensualHijo = `${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`;
                claveAnualNieto= `${subCuenta.data.id}-${anio.Anio}`;
                claveAnualNietoProm= `Prom-${subCuenta.data.id}-${anio.Anio}`;
                const valorNieto = this.getValorSubItemMensual(subCuenta.data.id, mes.NumMes, anio.Anio) || 0;
                const valorNietoAnual = this.getValorSubItemAnual(subCuenta.data.id, anio.Anio) || 0;
                subCuenta.data.valores[claveMensualHijo] =                 
                  {
                  "Valor": valorNieto<0 ? ('-$ '+ (valorNieto*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valorNieto,
                  "Color": valorNieto<0 ? '#ff3200': '#000000'
                  }
    
                subCuenta.data.valores[claveAnualNieto] = 
                  {
                  "Valor": valorNietoAnual<0 ? ('-$ '+ (valorNietoAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorNietoAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valorNietoAnual,
                  "Color": valorNietoAnual<0 ? '#ff3200': '#000000'
                  }
                 const ValorPromedio=Number((valorNietoAnual/CantidadMeses).toFixed(0))  
                 subCuenta.data.valores[claveAnualNietoProm] = 
                  {
                  "Valor": ValorPromedio<0 ? ('-$ '+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": ValorPromedio,
                  "Color": ValorPromedio<0 ? '#ff3200': '#000000'
                  }
    
                });
              });
    
    
    
            }
    
    
    
    
    
          
          
          
          
          
          });
         //Datos Trimestrales 
        const claveTrimestral = `trim-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
        const claveTrimestralPromedio = `trim-prom-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
        if(dataTree.data.tipo=='Saldo Inicial'){
          let keyTrimestre= trim.id==1 ? `0-1-${anio.Anio}`: trim.id==2 ?  `0-4-${anio.Anio}` : trim.id==3 ?  `0-7-${anio.Anio}`: `0-10-${anio.Anio}`;
          let valor=this.DataTreeTable[0].data.valores[keyTrimestre]?.ValorNumero || 0
          let valorPromedio=Number((valor/3).toFixed(1))
    
          dataTree.data.valores[claveTrimestral] = 
          {
            "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valor,
            "Color": valor<0 ? '#ff3200': '#000000',
          }
          dataTree.data.valores[claveTrimestralPromedio] = 
          {
            "Valor": valorPromedio<0 ? ('-$ '+ (valorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valorPromedio,
            "Color": valorPromedio<0 ? '#ff3200': '#000000',
          }
        }  

        else if(dataTree.data.tipo=='Saldo Final'){
          let keyTrimestre = trim.id==1 ? `11-3-${anio.Anio}`: trim.id==2 ?  `11-6-${anio.Anio}` : trim.id==3 ?  `11-9-${anio.Anio}`: `11-12-${anio.Anio}`;
          let valor=this.DataTreeTable[11].data.valores[keyTrimestre]?.ValorNumero || 0
          let valorPromedio=Number((valor/3).toFixed(1))
          
          dataTree.data.valores[claveTrimestral] = 
          {
            "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valor,
            "Color": valor<0 ? '#ff3200': '#000000',
          }
          dataTree.data.valores[claveTrimestralPromedio] = 
          {
            "Valor": valorPromedio<0 ? ('-$ '+ (valorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valorPromedio,
            "Color": valorPromedio<0 ? '#ff3200': '#000000',
          }
        }

        else if(dataTree.data.tipo=='Abuelo'){

        if(dataTree.data.orden==1 || dataTree.data.orden==4 || dataTree.data.orden==7 || dataTree.data.orden==10 ){
            let ValorAcumulado=0
            let ValorAcumuladoPromedio=0
           
            this.getMesesByTrimestre(trim.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
            })
          dataTree.data.valores[claveTrimestral] = 
          {
            "Valor": ValorAcumulado<0 ? ('-$ '+ (ValorAcumulado*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumulado,
            "Color": ValorAcumulado<0 ? '#ff3200': '#000000',
          }
          ValorAcumuladoPromedio=Number((ValorAcumulado/3).toFixed(1))

          dataTree.data.valores[claveTrimestralPromedio] = 
          {
            "Valor": ValorAcumuladoPromedio<0 ? ('-$ '+ (ValorAcumuladoPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumuladoPromedio,
            "Color": ValorAcumuladoPromedio<0 ? '#ff3200': '#000000',
          }

        }
        }

        if(dataTree.data.tipo=='Padre'){
          let ValorAcumulado=0
          let ValorAcumuladoPromedio=0           
          this.getMesesByTrimestre(trim.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0         
          }) 
          dataTree.data.valores[claveTrimestral] = 
          {
            "Valor": ValorAcumulado<0 ? ('-$ '+ (ValorAcumulado*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumulado,
            "Color": ValorAcumulado<0 ? '#ff3200': '#000000'
          }
          
          ValorAcumuladoPromedio=Number((ValorAcumulado/3).toFixed(1))
          dataTree.data.valores[claveTrimestralPromedio] =
          {
            "Valor": ValorAcumuladoPromedio<0 ? ('-$ '+ (ValorAcumuladoPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumuladoPromedio,
            "Color": ValorAcumuladoPromedio<0 ? '#ff3200': '#000000',
          }
          
          //Hijos
          this.DataTreeTable[dataTree.data.orden].children.forEach(cuenta => {  
              let valorTrimestralHijo =  0;
              let valorTrimestralPromedioHijo =  0;
              const claveTrimestralHijo = `trim-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
              const clavePromedioTrimestrallHijo= `trim-Prom-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
              this.getMesesByTrimestre(trim.id).forEach((mes:any)=>{
                let ArregloHijos=this.DataTreeTable[dataTree.data.orden].children == undefined 
                || this.DataTreeTable[dataTree.data.orden].children.length ==0? []:
                this.DataTreeTable[dataTree.data.orden].children
                ArregloHijos.forEach((child:any)=>{
                 valorTrimestralHijo+=  child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
                })
              })
              
              valorTrimestralPromedioHijo= Number((valorTrimestralHijo/4).toFixed(0));

              cuenta.data.valores[claveTrimestralHijo] = 
              {
             "Valor": valorTrimestralHijo<0 ? ('-$ '+ (valorTrimestralHijo*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorTrimestralHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorTrimestralHijo,
             "Color": valorTrimestralHijo<0 ? '#ff3200': '#000000'
              }


            cuenta.data.valores[clavePromedioTrimestrallHijo] =   
              {
             "Valor": valorTrimestralPromedioHijo<0 ? ('-$ '+ (valorTrimestralPromedioHijo*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorTrimestralPromedioHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorTrimestralPromedioHijo,
             "Color": valorTrimestralPromedioHijo<0 ? '#ff3200': '#000000'
              }         
            //Nieto  
            cuenta.children.forEach(subCuenta => {
              let valorTrimestralNieto =  0;
              let valorTrimestralPromedioNieto=  0;
              const claveTrimestralHijo = `trim-${subCuenta.data.id}-${trim.id}-${anio.Anio}`;
              const clavePromedioTrimestralHijo = `Prom-nieto-trim-${subCuenta.data.id}-${trim.id}-${anio.Anio}`;              
              this.getMesesBySemestre(semestre.id).forEach((mes:any)=>{
              this.DataTreeTable[dataTree.data.orden].children.forEach((child:any)=>{               
                 child.children.forEach(nieto => {
                   valorTrimestralNieto+=
                   nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
                  
                });              
              }) 

              })

              valorTrimestralPromedioNieto= Number((valorTrimestralNieto/4).toFixed(0));

              subCuenta.data.valores[claveTrimestralHijo] =                 
              {
                "Valor": valorTrimestralNieto<0 ? ('-$ '+ (valorTrimestralNieto*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorTrimestralNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valorTrimestralNieto,
                "Color": valorTrimestralNieto<0 ? '#ff3200': '#000000'
              } 

              subCuenta.data.valores[clavePromedioTrimestralHijo] =   
              {
             "Valor": valorTrimestralPromedioNieto<0 ? ('-$ '+ (valorTrimestralPromedioNieto*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorTrimestralPromedioNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorTrimestralPromedioNieto,
             "Color": valorTrimestralPromedioNieto<0 ? '#ff3200': '#000000'
              }                           



            })
            })
        }
  

        })
      //Datos Semestrales
        const claveSemestral = `sem-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
        const claveSemestralPromedio = `sem-prom-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
        if(dataTree.data.tipo=='Saldo Inicial'){
          let keySemestre = semestre.id==1 ? `0-1-${anio.Anio}`:`0-7-${anio.Anio}`;
          let valor=this.DataTreeTable[0].data.valores[keySemestre]?.ValorNumero || 0
          let valorPromedio=valor/2
          dataTree.data.valores[claveSemestral] = 
          {
            "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valor,
            "Color": valor<0 ? '#ff3200': '#000000',
          }
          dataTree.data.valores[claveSemestralPromedio] = 
          {
            "Valor": valorPromedio<0 ? ('-$ '+ (valorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valorPromedio,
            "Color": valorPromedio<0 ? '#ff3200': '#000000',
          }
        }  

        else if(dataTree.data.tipo=='Saldo Final'){
          let keySemestre = semestre.id==1 ? `11-6-${anio.Anio}`:`11-12-${anio.Anio}`;
          let valor=this.DataTreeTable[11].data.valores[keySemestre]?.ValorNumero || 0
          let valorPromedio=valor/2
          dataTree.data.valores[claveSemestral] = 
          {
            "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valor,
            "Color": valor<0 ? '#ff3200': '#000000',
          }
          dataTree.data.valores[claveSemestralPromedio] = 
          {
            "Valor": valorPromedio<0 ? ('-$ '+ (valorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valorPromedio,
            "Color": valorPromedio<0 ? '#ff3200': '#000000',
          }
        }

        else if(dataTree.data.tipo=='Abuelo'){

        if(dataTree.data.orden==1 || dataTree.data.orden==4 || dataTree.data.orden==7 || dataTree.data.orden==10 ){
            let ValorAcumulado=0
            let ValorAcumuladoPromedio=0
           
            this.getMesesBySemestre(semestre.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
            })
          dataTree.data.valores[claveSemestral] = 
          {
            "Valor": ValorAcumulado<0 ? ('-$ '+ (ValorAcumulado*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumulado,
            "Color": ValorAcumulado<0 ? '#ff3200': '#000000',
          }
          ValorAcumuladoPromedio=ValorAcumulado/2

          dataTree.data.valores[claveSemestralPromedio] = 
          {
            "Valor": ValorAcumuladoPromedio<0 ? ('-$ '+ (ValorAcumuladoPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumuladoPromedio,
            "Color": ValorAcumuladoPromedio<0 ? '#ff3200': '#000000',
          }

        }
        }

        if(dataTree.data.tipo=='Padre'){
          let ValorAcumulado=0
          let ValorAcumuladoPromedio=0           
          this.getMesesBySemestre(semestre.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0         
          }) 
          dataTree.data.valores[claveSemestral] = 
          {
            "Valor": ValorAcumulado<0 ? ('-$ '+ (ValorAcumulado*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumulado,
            "Color": ValorAcumulado<0 ? '#ff3200': '#000000'
          }
          ValorAcumuladoPromedio=ValorAcumulado/2
          dataTree.data.valores[claveSemestralPromedio] =
          {
            "Valor": ValorAcumuladoPromedio<0 ? ('-$ '+ (ValorAcumuladoPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": ValorAcumuladoPromedio,
            "Color": ValorAcumuladoPromedio<0 ? '#ff3200': '#000000',
          }
          
          //Hijos
          this.DataTreeTable[dataTree.data.orden].children.forEach(cuenta => {  
              let valorSemestralHijo =  0;
              let valorSemestralPromedioHijo =  0;
              const claveSemestralHijo = `sem-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
              const clavePromedioSemestralHijo= `sem-Prom-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
              this.getMesesBySemestre(semestre.id).forEach((mes:any)=>{
                let ArregloHijos=this.DataTreeTable[dataTree.data.orden].children == undefined 
                || this.DataTreeTable[dataTree.data.orden].children.length ==0? []:
                this.DataTreeTable[dataTree.data.orden].children
                ArregloHijos.forEach((child:any)=>{
                 valorSemestralHijo+=  child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
                })
              })

              valorSemestralPromedioHijo= Number((valorSemestralHijo/2).toFixed(0));

              cuenta.data.valores[claveSemestralHijo] = 
              {
             "Valor": valorSemestralHijo<0 ? ('-$ '+ (valorSemestralHijo*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorSemestralHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorSemestralHijo,
             "Color": valorSemestralHijo<0 ? '#ff3200': '#000000'
              }


            cuenta.data.valores[clavePromedioSemestralHijo] =   
              {
             "Valor": valorSemestralPromedioHijo<0 ? ('-$ '+ (valorSemestralPromedioHijo*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorSemestralPromedioHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorSemestralPromedioHijo,
             "Color": valorSemestralPromedioHijo<0 ? '#ff3200': '#000000'
              }         
            //Nieto  
            cuenta.children.forEach(subCuenta => {
              let valorSemestralNieto =  0;
              let valorSemestralPromedioNieto=  0;
              const claveSemestralHijo = `sem-${subCuenta.data.id}-${semestre.id}-${anio.Anio}`;
              const clavePromedioSemestralHijo = `Prom-nieto-${subCuenta.data.id}-${semestre.id}-${anio.Anio}`;              
              this.getMesesBySemestre(semestre.id).forEach((mes:any)=>{
              this.DataTreeTable[dataTree.data.orden].children.forEach((child:any)=>{               
                 child.children.forEach(nieto => {
                   valorSemestralNieto+=
                   nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
                  
                });              
              }) 

              })

              valorSemestralPromedioNieto= Number((valorSemestralNieto/2).toFixed(0));

              subCuenta.data.valores[claveSemestralHijo] =                 
              {
                "Valor": valorSemestralNieto<0 ? ('-$ '+ (valorSemestralNieto*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorSemestralNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valorSemestralNieto,
                "Color": valorSemestralNieto<0 ? '#ff3200': '#000000'
              } 

              subCuenta.data.valores[clavePromedioSemestralHijo] =   
              {
             "Valor": valorSemestralPromedioNieto<0 ? ('-$ '+ (valorSemestralPromedioNieto*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorSemestralPromedioNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorSemestralPromedioNieto,
             "Color": valorSemestralPromedioNieto<0 ? '#ff3200': '#000000'
              }                           



            })
            })
        }

      



      });  
      
   
        

        
      });
    }
  }); 
  let DataTrimestral={
      'Cabecera':this.Cabecera,
      'Categorias':this.Categorias,
      'Items':this.Items,
      "Trimestres":this.TrimestresSeleccionados,
      "Anios":this.AniosSeleccionados,
      'DataTreeTable':this.DataTreeTable
    }
    this.conS.enviarRegistrosTrimestrales(DataTrimestral)

    let DataSemestral={
      'Cabecera':this.Cabecera,
      'Categorias':this.Categorias,
      'Items':this.Items,
      'DataTreeTable':this.DataTreeTable
      
    }
    this.conS.enviarRegistrosSemestrales(DataSemestral)
    this.cargar=false

  }


getDataItems(){
  this.DataItems=[]
  this.Items.forEach((item:any) => {
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
        this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
          const key = `${anio.Anio}-${mes.NumMes}-${item.id}-${sem.NumSemana}`;  
          if (!this.DataItems[key]) {
            this.DataItems[key] =[];
          }
          this.DataItems[key].push({
            "Valor": this.getValorItem(item.id,sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getValorItem(item.id,sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
  
          })
        })
      })
    
  });

  }
  
getDataFlujoOperativo(NumSemana:any,Mes:any,Anio:any){
    let _Data: any=[];
    _Data=this.Registros.filter((registro:any)=>
    (registro.idCategoria.Orden==2
    || registro.idCategoria.Orden==3)
    && registro.NumSemana==NumSemana
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
    if(_Data.length>0){
      let Valor:number=0
      _Data.forEach((data:any) => {
          Valor+=Number(data.Valor)
      });
  
      return Valor
    }
    else {
      return 0
    }
} 
getDataFlujoOperativoMensual(Mes:any,Anio:any){
    let _Data: any=[];
    _Data=this.Registros.filter((registro:any)=>
    (registro.idFlujo=='EESGPM4hWXvDlXSRnCwA')
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )

    if(_Data.length>0){
      let Valor:number=0
      _Data.forEach((data:any) => {
          Valor+=Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
} 

getDataFlujoOperativoAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idFlujo=='EESGPM4hWXvDlXSRnCwA')
  && registro.AnioRegistro==Anio
  )


  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
} 

getDataFlujoInversion(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==5
  || registro.idCategoria.Orden==6)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoInversionMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idFlujo=='GMzSuF04XQBsPmAkIB2C')
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoInversionAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idFlujo=='GMzSuF04XQBsPmAkIB2C')
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoFinanciero(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==9
  || registro.idCategoria.Orden==8)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoFinancieroMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idFlujo=='psmpY6iyDJNkW7AKFXgK')
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoFinancieroAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idFlujo=='psmpY6iyDJNkW7AKFXgK')
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoLibre(NumSemana:any,Mes:any,Anio:any){
return this.getDataFlujoOperativo(NumSemana,Mes,Anio) 
+ this.getDataFlujoInversion(NumSemana,Mes,Anio)
+ this.getDataFlujoFinanciero(NumSemana,Mes,Anio)
}
getDataFlujoLibreMensual(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensual(Mes,Anio) 
  + this.getDataFlujoInversionMensual(Mes,Anio)
  + this.getDataFlujoFinancieroMensual(Mes,Anio)
}
getDataFlujoLibreAnual(Anio:any){
  return this.getDataFlujoOperativoAnual(Anio) 
  + this.getDataFlujoInversionAnual(Anio)
  + this.getDataFlujoFinancieroAnual(Anio)
}

getMesesByAnio(anio:any){
  return this.Meses.filter((mes:any)=>mes.Anio==anio)
}

      // this.Semestres.forEach(semestre => {
      //   this.getTrimestresBySemestre(semestre.id).forEach((trim:any)=>{

      //     this.getMesesByTrimestre(trim.id).forEach(mes => {
construirCabecera(){

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


    //this.Cabecera=this.CabeceraBack.filter((cab:any)=>cab.Mostrar==true)
    this.Cabecera=this.CabeceraBack

 
    
    // this.DataSaldoFinal=[]
    // this.DataSaldoInicialMensual=[]
    // this.DataSaldoFinalMensual=[]
    // this.Anios.forEach((anio:any) => {
    //   this.getMesesByAnio(anio.Anio).forEach((mes:any) => {
    //     this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
    //       let _SemanaDataInicial:any=[]
    //       _SemanaDataInicial=this.DataSaldoInicial.filter((data:any)=>data.NumSemana==sem.NumSemana && data.Anio==anio.Anio && data.Mes==sem.Mes)
    //       if(_SemanaDataInicial.length==0){
    //         this.DataSaldoInicial.push({
    //           "NumSemana":sem.NumSemana,
    //           "Mes":sem.Mes,
    //           "Anio":sem.Anio,
    //           "Valor":this.getValorSaldoInicial(sem.NumSemana,sem.Mes,anio.Anio,sem.posicion)
  
    //         })

    //       }
    //       let _SemanaDataFinal:any=[]
    //       _SemanaDataFinal=this.DataSaldoFinal.filter((data:any)=>data.NumSemana==sem.NumSemana && data.Anio==anio.Anio && data.Mes==sem.Mes)
    //       if(_SemanaDataFinal.length==0){
    //         this.DataSaldoFinal.push({
    //           "NumSemana":sem.NumSemana,
    //           "Mes":sem.Mes,
    //           "Anio":sem.Anio,
    //           "Valor":this.getValorSaldoFinal(sem.NumSemana,sem.Mes)
  
    //         })

    //       }
    //     })  
    //     //DataMensual
    //     let _MesDataInicial:any=[]
    //     _MesDataInicial=this.DataSaldoInicialMensual.filter((data:any)=>data.Anio==anio.Anio && data.Mes==mes.NumMes)
    //     if(_MesDataInicial.length==0){
    //       this.DataSaldoInicialMensual.push({
    //         "Mes":mes.NumMes,
    //         "Anio":anio.Anio,
    //         "Valor":this.getSaldoInicialMensual(mes.NumMes,anio.Anio)

    //       })

    //     }    
    //     let _MesDataFinal:any=[]
    //     _MesDataFinal=this.DataSaldoFinalMensual.filter((data:any)=>data.Anio==anio.Anio && data.Mes==mes.NumMes)
    //     if(_MesDataFinal.length==0){
    //       this.DataSaldoFinalMensual.push({
    //         "Mes":mes.NumMes,
    //         "Anio":anio.Anio,
    //         "Valor":this.getSaldoFinalMensual(mes.NumMes,anio.Anio)

    //       })

    //     }    


    //   })      
    // })      
    this.getDataCategorias()
    this.getDataCategoriasMensual()
    this.getDataCategoriasAnual()
 



   }
getItems(idCategoria:any){
    let _Items:any=[]

    _Items=this.Items.filter((item:any)=>item.idPadre==idCategoria
     )
    return _Items
    }

obtenerValorSaldoInicial(NumSemana:any,Mes:any,Anio:any){
let _ValorInicial:any=[]
_ValorInicial=this.DataSaldoInicial.filter((data:any)=>data.NumSemana==NumSemana && data.Mes==Mes && data.Anio==Anio)
if(_ValorInicial.length>0){
  return _ValorInicial[0].Valor
}
else {
  return 0
}
}
obtenerValorSaldoFinal(NumSemana:any,Mes:any,Anio:any){
let _ValorFinal:any=[]
_ValorFinal=this.DataSaldoFinal.filter((data:any)=>data.NumSemana==NumSemana && data.Mes==Mes && data.Anio==Anio)
if(_ValorFinal.length>0){
  return _ValorFinal[0].Valor
}
else {
  return 0
}
}

obtenerValorSaldoInicialMensual(Mes:any,Anio:any){
  let _ValorInicialMensual:any=[]
  _ValorInicialMensual=this.DataSaldoInicialMensual.filter((data:any)=>data.Mes==Mes && data.Anio==Anio)



  if(_ValorInicialMensual.length>0){
      if(_ValorInicialMensual[0].Valor>0){
        return _ValorInicialMensual[0].Valor
      }
      else {
        return 0
      }
  }

  else {



    return 0 
  }
}
obtenerValorSaldoInicialAnual(Anio:any){
  let _ValorInicialMensual:any=[]
  let _ValorInicialesAnuales:any=[]
  let _SaldosInicialesAnual:any=[]
  _ValorInicialMensual=this.DataSaldoInicialMensual.filter((data:any)=>data.Mes==1 && data.Anio==Anio)
  _ValorInicialesAnuales=this.DataSaldoInicialMensual.filter((data:any)=>data.Anio==Anio)
  _SaldosInicialesAnual=this.SaldoInicial.filter((data:any)=>data.AnioRegistro==Anio)

  if(_ValorInicialMensual.length>0){
    return _ValorInicialMensual[0].Valor
  }
 else if(_ValorInicialesAnuales.length>0){
    return _ValorInicialesAnuales[0].Valor
  }
 else if(_SaldosInicialesAnual.length>0){
    return _SaldosInicialesAnual[0].Valor
  }
  else {
    let ValorSaldo:number=0
    let RSFM2=this.RegistrosSaldosFinalesMensuales.filter((reg:any)=>reg.Anio==Anio-1)
    if(RSFM2.length>0) {
      ValorSaldo=RSFM2[RSFM2.length-1].Valor
    }
    else {
      ValorSaldo=0
    }

    return ValorSaldo
  }
}
obtenerValorSaldoFinalMensual(Mes:any,Anio:any){
  let _ValorFinalMensual:any=[]
  _ValorFinalMensual=this.DataSaldoFinalMensual.filter((data:any)=>data.Mes==Mes && data.Anio==Anio)
  if(_ValorFinalMensual.length>0){
    return _ValorFinalMensual[0].Valor
  }
  else {
    return 0
  }
}
obtenerValorSaldoFinalAnual(Anio:any){
//   let _ValorFinalMensual:any=[]
//   _ValorFinalMensual=this.DataSaldoFinalMensual.filter((data:any)=>data.Anio==Anio)
//   if(_ValorFinalMensual.length>0){
//     return _ValorFinalMensual[0].Valor
//   }
//   else {
//     return 0
//   }
 return this.obtenerValorSaldoInicialAnual(Anio) + this.getDataFlujoLibreAnual(Anio) 
 }



}
