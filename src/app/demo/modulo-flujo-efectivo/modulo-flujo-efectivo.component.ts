// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import type { CellValueChangedEvent, ColDef, GridOptions, RowClassRules } from 'ag-grid-community';
import { ConfigurationService } from 'src/app/services/configuration.service';
ModuleRegistry.registerModules([ AllCommunityModule]); 
import { TreeTableModule } from 'primeng/treetable';
@Component({
  selector: 'app-modulo-flujo-efectivo',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeTableModule, 
    AgGridModule],
  templateUrl: './modulo-flujo-efectivo.component.html',
  styleUrls: ['./modulo-flujo-efectivo.component.scss']
})
export default class FlujoEfectivoComponent implements OnInit {
CabeceraBack:any=[]
ColsCabecera:any=[]
Meses:any=[]
MesesSeleccionados:any=[]
Anios:any=[]
AniosSeleccionados:any=[]  
Items:any=[]
ItemsBack:any=[]
Cabecera:any=[]
Sucursales:any=[]
SucursalesSeleccionadas:any=[]
Usuarios:any=[]
UsuariosSeleccionados:any=[]
Proyectos:any=[]
ProyectoSeleccionado:any=[]
CuentasBancarias:any=[]
CuentaBancariaSeleccionada:any=[]
CuentasContables:any=[]
DataByMatriz:any=[]
DataByEmpresa:any=[]
Naturalezas:any=[]
Registros:any=[]
Trimestres:any=[]
TrimestresSeleccionados:any=[]
Semestres:any=[]
SemestresSeleccionados:any=[]
rowData:any=[]
idEmpresa:string=''
Usuario:any
cargar:boolean=true
constructor(private conS:ConfigurationService){}
Categorias:any=[]
Cuentas:any=[]
columnDefs: any[]
DataTreeTable: any=[]
autoGroupColumnDef = {
  headerName: 'Cuenta Contable',
  cellRendererParams: {
    suppressCount: true // No mostrar conteo de hijos
  }
};
ngOnInit(): void {
this.Usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
 this.conS.usuario$.subscribe(usuario => {
  if (usuario) {
      this.Usuario=usuario
  }
  else 
  {
      this.Usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  }
      this.idEmpresa=this.Usuario.idEmpresa
      this.obtenerDataEmpresa()
 }) 
}

obtenerDataEmpresa(){
  this.cargar=true
  this.conS.obtenerDataEmpresa(this.Usuario.idMatriz).subscribe(resp=>{
    this.DataByMatriz=resp
  
    this.construirData()
  })
}

construirData(){
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
  this.DataByEmpresa=this.DataByMatriz.filter((data:any)=>data.idEmpresa==this.idEmpresa)[0]
  this.Naturalezas=this.DataByEmpresa.Categorias
  this.Cuentas=this.DataByEmpresa._CuentasContables
  this.Proyectos=this.DataByEmpresa.Proyectos
  this.Sucursales=this.DataByEmpresa.Sucursales
  this.Registros=this.DataByEmpresa.Registros
  console.log('Registros',this.Registros)
  this.CuentasBancarias=this.DataByEmpresa.CuentasBancarias

  this.construirColCabecera()
}
getTrimestresBySemestre(idSemestre:any){
  let TrimestresCabecera = this.TrimestresSeleccionados.length > 0 ? this.TrimestresSeleccionados : this.Trimestres;
  return TrimestresCabecera.filter((trim:any)=>trim.idSemestre==idSemestre)
}
getMesesByTrimestre(idTrimestre:any){
  let MesesCabecera = this.MesesSeleccionados.length > 0 ? this.MesesSeleccionados : this.Meses;
  return MesesCabecera.filter((mes:any)=>mes.Trimestre==idTrimestre)
}
getMesesBySemestre(idSemestre:any){
  return this.Meses.filter((mes:any)=>mes.Semestre==idSemestre)
}

construirColCabecera(){
this.DataTreeTable.push(
      {
       key: '000',
       data:{
        name:'Saldo Inicial',
        strong:false,
        id:'000',
        valores:{}
       } 
      }
  )  
this.Naturalezas
  .filter((naturaleza:any)=>naturaleza.Tipo==3)
  .forEach((cuenta:any) => {
    this.DataTreeTable.push(
      {
       key: cuenta.id,
       data:{
        name:cuenta.Nombre,
        tipo:'Abuelo',
        strong:false,
        id:cuenta.id,
        valores:{}
       },
       children: this.getPadres(cuenta.id)  
      }
  )
  if(cuenta.Orden==1){
    this.DataTreeTable.push(
      {
       key: '001',       
       data:{
        id:'001',
        tipo:'Abuelo',
        strong:true,
        name:'Factor de conversión a efectivo operativo',
        valores:{}
       } 
      }
  )

  }
  if(cuenta.Orden==7){
    this.DataTreeTable.push(
      {
       key: '004',     
       data:{
        id:'004',
        tipo:'Saldo Inicial',
        strong:false,
        name:'Saldo Final',
        valores:{}
       } 
      }
  )

  }
  if(cuenta.Orden==10){
    this.DataTreeTable.push(
      {
       key: '005',     
       data:{
        id:'005',
        tipo:'Abuelo',
        strong:true,
        name:'Factor de conversión a efectivo libre',
        valores:{}
       } 
      }
  )

  }

    

  })
this.construirCabeceras()
}

construirCabeceras(){

  // this.ColsCabecera = [];
  // this.ColsCabecera.push({
  //   "Nombre":"Saldo Inicial en Bancos",
  //   "Nivel":1,
  //   "Orden":1,
  //   "Tipo":1,
  //   "id":"001",
  //   "children":[]

  // })
  // this.Naturalezas
  // .filter((naturaleza:any)=>naturaleza.Tipo==3)
  // .forEach((cuenta:any) => {
  // this.ColsCabecera.push({
  //   "Nombre":cuenta.Nombre,
  //   "Nivel":1,
  //   "Orden":this.ColsCabecera.length+1,
  //   "Tipo":2,
  //   "id":cuenta.id
  // })
  // if(cuenta.Orden==1){
  // this.getPadres(cuenta.id)  


  // this.ColsCabecera.push()
  // this.ColsCabecera.push({
  //   "Nombre":"% de los ingresos para pagar a proveedores",
  //   "Nivel":2,
  //   "Orden":this.ColsCabecera.length+1,
  //   "Tipo":2,
  //   "id":"003",
  //   "children":[]
  // })
  // this.ColsCabecera.push({
  //   "Nombre":"Factor de conversión a efectivo operativo",
  //   "Nivel":2,
  //   "Orden":this.ColsCabecera.length+1,
  //   "Tipo":2,
  //   "id":"004",
  //   "children":[]
  // })

  // }
  // if(cuenta.Orden==10){
  // this.ColsCabecera.push({
  //   "Nombre":"% de los ingresos para pagar a proveedores",
  //   "Nivel":2,
  //   "Orden":this.ColsCabecera.length+1,
  //   "Tipo":2,
  //   "id":"005",
  //   "children":[]
  // })

  // this.ColsCabecera.push({
  //   "Nombre":"Saldo Final en Bancos",
  //   "Nivel":1,
  //   "Orden":1,
  //   "Tipo":0,
  //   "id":"006",
  //   "children":[]

  // })
  // }
   
  // });



  let AniosCabecera = this.AniosSeleccionados.length > 0 ? this.AniosSeleccionados : this.Anios;
  let SemestresCabecera = this.SemestresSeleccionados.length > 0 ? this.SemestresSeleccionados : this.Semestres;
  
  this.CabeceraBack.push({
    "Nombre":"Concepto",
    "Mes":'',
    "NumMes":'',
    "Anio":'',
    "Color":'#F9FAFB',
    "Tipo":0,
    "Mostrar":true
  })
  AniosCabecera.forEach((anio:any) => {
    SemestresCabecera.forEach(semestre => {
        this.getTrimestresBySemestre(semestre.id).forEach((trim:any)=>{
          this.getMesesByTrimestre(trim.id).forEach((mes:any) => {
               this.CabeceraBack.push({
                "Nombre":mes.Mes + ' ' + anio.Anio,
                "Mes":mes.Mes,
                "NumMes":mes.NumMes,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":3,
                "Mostrar":true
              })
            if(mes.NumMes==3){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 1" + ' (' + anio.Anio + ')',
                "NumTrim":1,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 1" + ' (' + anio.Anio + ')',
                "NumTrim":1,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":8,
                "Mostrar":false
              })
            }
            else if(mes.NumMes==6){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 2" + ' (' + anio.Anio + ')',
                "NumTrim":2,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 2" + ' (' + anio.Anio + ')',
                "NumTrim":2,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":8,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Total Semestre 1" + ' (' + anio.Anio + ')',
                "NumSem":1,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":7,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Semestre 1" + ' (' + anio.Anio + ')',
                "NumSem":1,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":9,
                "Mostrar":false
              })
            } 
            else if(mes.NumMes==9){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 3" + ' (' + anio.Anio + ')',
                "NumTrim":3,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":6,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 3" + ' (' + anio.Anio + ')',
                "NumTrim":3,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":8,
                "Mostrar":false
              })
            }
            else if(mes.NumMes==12){
              this.CabeceraBack.push({
                "Nombre":"Total Trimestre 4" + ' (' + anio.Anio + ')',
                "NumTrim":4,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":6,
                "Mostrar":false
              })
    
              this.CabeceraBack.push({
                "Nombre":"Promedio Trimestre 4" + ' (' + anio.Anio + ')',
                "NumTrim":4,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":8,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Total Semestre 2" + ' (' + anio.Anio + ')',
                "NumSem":2,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":7,
                "Mostrar":false
              })
              this.CabeceraBack.push({
                "Nombre":"Promedio Semestre 2" + ' (' + anio.Anio + ')', 
                "NumSem":2,
                "Anio":anio.Anio,
                "Color":'#F9FAFB',
                "Tipo":9,
                "Mostrar":false
              })
    
              
            }           

          })          
      })          
    })   
      this.CabeceraBack.push({
        "Nombre":"Total " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Color":'#F9FAFB',
        "Tipo":4,
        "Mostrar":true
      })
      this.CabeceraBack.push({
        "Nombre":"Promedio " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Color":'#F9FAFB',
        "Anio":anio.Anio,
        "Tipo":5,
        "Mostrar":true
      })       
  })  
  
  this.Cabecera=this.CabeceraBack
  console.log('Cabecera',this.Cabecera)
  console.log('DataTree',this.DataTreeTable)
  this.cargar=false
}

getPadres(idAbuelo:string){
  let CuentasPadres=[]
  this.Naturalezas
  .filter((naturaleza:any)=>(naturaleza.Tipo==1 || naturaleza.Tipo==2) && naturaleza.idAbuelo==idAbuelo )
  .forEach(cuenta => {
    CuentasPadres.push(
    {
       key: idAbuelo+'-'+cuenta.id,
       id:cuenta.id,
       data:{
        id:cuenta.id,
        tipo:'Padre',
        strong:false,
        name:cuenta.Nombre,
        valores:{}
       },
       children: this.getHijos(cuenta.id,idAbuelo)  
    }
    )
    if(cuenta.Orden==3){
    
    CuentasPadres.push(
    {
      key: idAbuelo+'-'+'002',
      id:'002',
      data:{
      id:'002',
      tipo:'Padre',
      strong:true,
      name:'% de los ingresos para operar',
      valores:{}
      }
 
    }) 
    CuentasPadres.push(
    {
      key: idAbuelo+'-'+'003',
      id:'003',
      data:{
      id:'003',
      tipo:'Padre',
      strong:true,
      name:'% de los ingresos para pagar a proveedores',
      valores:{}
      }
 
    }) 

    }
    

  });
  return CuentasPadres
}
getHijos(idPadre:string,idAbuelo:string){
  let CuentasHijos=[]
  this.Cuentas
  .filter((cuentaHijo:any)=>cuentaHijo.idPadre==idPadre )
  .forEach(cuenta => {
    CuentasHijos.push(
    {
       key: idAbuelo+'-'+idPadre+'-'+cuenta.id,
       id:cuenta.id,
       data:{
        id:cuenta.id,
        tipo:'Hijo',
        strong:false,
        name:cuenta.Nombre,
        valores:{}
       },
       children: this.getNietos(cuenta.id,cuenta.CuentasNieto,idAbuelo,idPadre)  
    }
    )   
  });
  return CuentasHijos
}
getNietos(idHijo:string,cuentasNietos:any,idAbuelo:string,idPadre:string){
  let CuentasNietos=[]
  cuentasNietos
  .filter((cuentaNieto:any)=>cuentaNieto.idHijo==idHijo )
  .forEach(cuenta => {
    CuentasNietos.push(
    {
       key: idAbuelo+'-'+idPadre+'-'+idHijo+'-'+cuenta.id,
       id:cuenta.id,
       data:{
        id:cuenta.id,
        tipo:'Nieto',
        strong:false,
        name:cuenta.Nombre,
        valores:{}
       },
 
    }
    )   
  });

  return CuentasNietos
}
getDataPath = (data: any) => {
  // Aquí puedes usar un array con los niveles para que forme la jerarquía
  return this.buildPath(data);
}
buildPath(data: any) {
  let path = [data.Nombre];
  let parent = data.parent;
  while (parent) {
    path.unshift(parent.Nombre);
    parent = parent.parent;
  }
  return path;
}




}
