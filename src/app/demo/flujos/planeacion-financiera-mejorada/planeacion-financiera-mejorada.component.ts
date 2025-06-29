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
Sucursales:any=[]
SucursalSeleccionada:any=[]
Proyectos:any=[]
ProyectoSeleccionado:any=[]
Registros:any=[]
RegistrosBackUp:any=[]
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
 
    this.obtenerAniosPlaneacion()
    
    this.construirCabecera()
    
 
  });



}

obtenerProyectos(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
      _subscribe.unsubscribe()
      this.Proyectos=resp
      this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )
     
      this.obtenerSucursales()
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
obtenerSucursales(){
    let _subscribe:Subscription
   _subscribe= this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe((resp:any)=>{
    _subscribe.unsubscribe()
    this.Sucursales=resp.filter((suc:any)=>suc.Activo==true)
    this.obtenerCategorias()
})
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
      console.log('Semestres',this.getMesesByTrimestre(trim.id))
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
    this.obtenerRegistros()
 console.log('Cabecera',this.Cabecera)   
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
  
  this.obtenerItems()
  })
}


obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.Items=[]
      this.Items=resp.filter((item:any)=>item.Activo==true
    
      );
      this.ItemsBack=resp.filter((item:any)=>item.Activo==true);
      this.construirItemsCatalogos()
  })
}

construirItemsCatalogos(){
    this.DataTreeTableReal=[]
  this.Categorias.
  filter((cat:any)=>cat.Orden!=19)
  .forEach(categ => {

    this.DataTreeTableReal.push({
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

getItemsByCategoria(idCategoria: string) {
  let Item = this.Items.filter((it: any) => it.idPadre == idCategoria);
  let ItemsEncontrados: any[] = [];

  if (Item.length > 0) {
    let idsProyectosSeleccionados = this.ProyectoSeleccionado.map(p => p.id);
    let idsSucursalesSeleccionadas = this.SucursalSeleccionada.map(s => s.id);

    Item.forEach((item: any) => {

      // Si ambos catálogos están vacíos, no se filtra nada
      if (this.ProyectoSeleccionado.length === 0 && this.SucursalSeleccionada.length === 0) {
        ItemsEncontrados.push(this.formatearItem(item));
      }
      else {
        // Verifica si el item tiene coincidencia con los catálogos
        const coincideProyecto = idsProyectosSeleccionados.some(id => item.idProyectos.includes(id));
        const coincideSucursal = idsSucursalesSeleccionadas.some(id => item.idSucursales.includes(id));

        // Si coincide con al menos uno de los catálogos, se incluye
        if (coincideProyecto || coincideSucursal) {
          ItemsEncontrados.push(this.formatearItem(item));
        }
      }
    });

    return ItemsEncontrados;
  } else {
    return [];
  }
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

          this.obtenerProyectos()
        })
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
console.log('DataTreeTableReal',this.DataTreeTableReal)
  CantidadMeses=this.MesesSeleccionados.length==0?12:this.MesesSeleccionados.length
  this.DataTreeTableReal.forEach(dataTree => {
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
            if(dataTree.data.tipo=='Abuelo'){
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
              });
    
    
    
            }

          });
         //Datos Trimestrales 
        const claveTrimestral = `trim-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
        const claveTrimestralPromedio = `trim-prom-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
         if(dataTree.data.tipo=='Abuelo'){

          if(dataTree.data.orden==1 || dataTree.data.orden==4 || dataTree.data.orden==7 || dataTree.data.orden==10 ){
            let ValorAcumulado=0
            let ValorAcumuladoPromedio=0
           
            this.getMesesByTrimestre(trim.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTableReal[1].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
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

       else if(dataTree.data.tipo=='Padre'){
          let ValorAcumulado=0
          let ValorAcumuladoPromedio=0           
          this.getMesesByTrimestre(trim.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTableReal[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0         
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
          

          if(dataTree.data.orden!=20) {
            this.DataTreeTableReal[dataTree.data.orden].children.forEach(cuenta => {  
                let valorTrimestralHijo =  0;
                let valorTrimestralPromedioHijo =  0;
                const claveTrimestralHijo = `trim-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
                const clavePromedioTrimestrallHijo= `trim-Prom-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
                this.getMesesByTrimestre(trim.id).forEach((mes:any)=>{
                  let ArregloHijos=this.DataTreeTableReal[dataTree.data.orden].children == undefined 
                  || this.DataTreeTableReal[dataTree.data.orden].children.length ==0? []:
                  this.DataTreeTableReal[dataTree.data.orden].children
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
  
            })

          }
        }
  

        })
      //Datos Semestrales
        const claveSemestral = `sem-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
        const claveSemestralPromedio = `sem-prom-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
         if(dataTree.data.tipo=='Abuelo'){

        if(dataTree.data.orden==1 || dataTree.data.orden==4 || dataTree.data.orden==7 || dataTree.data.orden==10 ){
            let ValorAcumulado=0
            let ValorAcumuladoPromedio=0
           
            this.getMesesBySemestre(semestre.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTableReal[1].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
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

        else if(dataTree.data.tipo=='Padre'){
          let ValorAcumulado=0
          let ValorAcumuladoPromedio=0           
          this.getMesesBySemestre(semestre.id).forEach(mes => {
              ValorAcumulado+=this.DataTreeTableReal[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0         
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
          if(dataTree.data.orden!=20) {
            this.DataTreeTableReal[dataTree.data.orden].children.forEach(cuenta => {  
                let valorSemestralHijo =  0;
                let valorSemestralPromedioHijo =  0;
                const claveSemestralHijo = `sem-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
                const clavePromedioSemestralHijo= `sem-Prom-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
                this.getMesesBySemestre(semestre.id).forEach((mes:any)=>{
                  let ArregloHijos=this.DataTreeTableReal[dataTree.data.orden].children == undefined 
                  || this.DataTreeTableReal[dataTree.data.orden].children.length ==0? []:
                  this.DataTreeTableReal[dataTree.data.orden].children
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
  
              })

          }
        }

      



      });  
      
   
        

        
      });
    }
  }); 
    console.log('DataTreeTableReal',this.DataTreeTableReal)
    this.cargando=false

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


buidDataPlanesGeneral(){

}












}
