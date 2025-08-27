// angular import
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'primeng/accordion';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import type { CellValueChangedEvent, ColDef, GridOptions, RowClassRules } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule, RowStyle, RowClassParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
ModuleRegistry.registerModules([ AllCommunityModule ]); 
@Component({
  selector: 'app-crear-registros',
  standalone: true,
  imports: [CommonModule, SharedModule,FloatLabelModule,NgSelectModule,AccordionModule,
    AgGridAngular, 
    AgGridModule,

  ],
  templateUrl: './crear-registros.component.html',
  styleUrls: ['./crear-registros.component.scss']
})
export default class CrearRegistrosComponent implements OnInit {
constructor(private conS:ConfigurationService,private toastr: ToastrService){}
Valor:number=0
Total:any
paginationPageSize = 20;
cacheBlockSize = 10;
Fecha:any
Comentarios:string=''
NumeroDocumento:string=''
Registros:any=[]
cargando:boolean=true
copiadoRegistro:boolean=false
SocioNegocios:any=[]
ColsCabecera: ColDef[] = [];
CatalogoSocios:any=[]
CatalogoSocioSeleccionado:any
CuentasBancarias:any=[]
OpcionesSociosNegocio:any=[]
opcionSocioSelect:any=[]
Categorias: any = [];
Padres: any = [];
PadreSeleccionado: any 
CuentasHijos: any = [];
CuentaHijoSeleccionado: any 
CatalogoCuentasHijos: any = [];
CuentasNietos: any = [];
CatalogoCuentasNieto: any = [];
CuentaNietoSeleccionado: any
Proyectos:any=[]
ProyectoSeleccionado:any
Sucursales:any=[]
SucursalSeleccionada:any
usuario: any;
idEmpresa:string=''
empresaID:string=''
idRegistro:string=''
columnDefs: ColDef[] = []
rowData :any=[]
 gridApi: any;
gridColumnApi: any;
localeText:any
@ViewChild('agGrid') agGrid!: AgGridAngular;
statusBar = {
  statusPanels: [
    { statusPanel: 'agTotalRowCountComponent', align: 'left' },
    { statusPanel: 'agAggregationComponent' } // 👈 aquí sale SUM, AVG, MIN, MAX
  ]
};
onGridReady(params:any) {
  this.gridApi = params.api;
}
getRowId = (params: any) => params.data.idRegistro;


ngOnInit(): void {



      Swal.fire({
        title: 'Cargando módulo...'
      });
      Swal.showLoading();
this.localeText = {
  // Textos comunes
  page: 'Página',
  more: 'Más',
  to: 'a',
  of: 'de',
  next: 'Siguiente',
  last: 'Última',
  first: 'Primera',
  previous: 'Anterior',
  loadingOoo: 'Cargando...',

  // Filtros
  equals: 'Igual',
  notEqual: 'Distinto',
  lessThan: 'Menor que',
  greaterThan: 'Mayor que',
  lessThanOrEqual: 'Menor o igual que',
  greaterThanOrEqual: 'Mayor o igual que',
  inRange: 'En rango',
  contains: 'Contiene',
  notContains: 'No contiene',
  startsWith: 'Empieza con',
  endsWith: 'Termina con',
  before:'Antes de',
  blank:'En blanco',
  notBlank:'No en blanco',
  after:'Después de',
  noRowsToShow: 'No hay datos para mostrar, seleccione un socio de negocio o cree un registro nuevo',
  // Encabezados del menú de filtro
  filterOoo: 'Filtrar...',
  applyFilter: 'Aplicar',
  resetFilter: 'Reiniciar',
  clearFilter: 'Limpiar',
  cancelFilter: 'Cancelar',

  // Columnas
  column: 'Columna',
  columns: 'Columnas',
  pinColumn: 'Fijar columna',
  valueColumns: 'Columnas de valores',
  pivotMode: 'Modo pivote',

  // Menú de columnas
  autosizeThiscolumn: 'Ajustar esta columna',
  autosizeAllColumns: 'Ajustar todas',
  groupBy: 'Agrupar por',
  ungroupBy: 'Desagrupar por',
};

this.columnDefs=
[
  {
    field: "Copiar",
    cellRenderer: () => `
     <button type="button"
     class="btn btn-success"><i class="fa-solid fa-copy"></i></button>`,
    width: 100,
    pinned: 'left',
    filter: false,
    sortable: false,
    onCellClicked: (params: any) => {
      this.onRowClicked(params.data,true);
    }
  },
  {
    field: "Editar",
    cellRenderer: () => `
     <button type="button"
     class="btn btn-info"><i class="fa-solid fa-pen-to-square"></i></button>`,
    width: 100,
    pinned: 'left',
    filter: false,
    sortable: false,
    onCellClicked: (params: any) => {
      this.onRowClicked(params.data,false);
    }
  },
  { field: "Socio de Negocio", },
  { field: "Cuenta Contable" },
  { field: "Sub Cuenta Contable" },
  { field: "Cuenta Nieto" },
  { field: "Num Documento o Factura" },
  {
    field: "Valor",
    cellStyle: params => {
      if (params.value && params.value.toString().startsWith("-$")) {
        return { color: "red"};
      }
      return { color: "black" };
    }
  },
  { field: "Fecha" },
  { field: "Proyecto" },
  { field: "Sucursal" },
]

this.OpcionesSociosNegocio.push(
  {
    "Nombre":'Proveedor',
    "Tipo":1,
    "Seleccionado":true
  },
  {
    "Nombre":'Cliente',
    "Tipo":2,
    "Seleccionado":false
  },
  {
    "Nombre":'Cuenta Banc.',
    "Tipo":3,
    "Seleccionado":false
  },
)

this.conS.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      } else {
        this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }

      if (this.empresaID != '') {
        this.idEmpresa = this.empresaID;
      } else {
        this.idEmpresa = this.usuario.idEmpresa;
      }
      this.obtenerCuentasBancarias()

      

});


  
}



getCuentaPadre(idCuentaPadre:any){
 let _cuentaPadre= this.Padres.filter((padre:any)=>padre.id==idCuentaPadre)[0]
 if (_cuentaPadre){
  return _cuentaPadre
 }
 else {
  return {}
 }

}
getCuentaHijo(idCuentaHijo:any){
 let _cuentaHijo= this.CatalogoCuentasHijos.filter((hijo:any)=>hijo.id==idCuentaHijo)[0]
 if (_cuentaHijo){
  return _cuentaHijo
 }
 else {
  return {}
 }

}
getCuentaNieto(idCuentaNieto:any){
 let _cuentaNieto= this.CatalogoCuentasNieto.filter((nieto:any)=>nieto.id==idCuentaNieto)[0]
 if (_cuentaNieto){
  return _cuentaNieto
 }
 else {
  return {}
 }

}

getSucursal(idSucursal:string){
  let _Sucursal=this.Sucursales.filter((suc:any)=>suc.id==idSucursal)[0]
  if(_Sucursal){
    return _Sucursal
  }
  else {
    return {}
  }
}
getProyecto(idProyecto:string){
  let _Proyecto=this.Proyectos.filter((proyecto:any)=>proyecto.id==idProyecto)[0]
  if(_Proyecto){
    return _Proyecto
  }
  else {
    return {}
  }
}

onRowClicked(registro: any,copiar:any) {
  this.copiadoRegistro=copiar

  if(this.copiadoRegistro==true){
    this.toastr.success('Si guarda este registro se creará como nuevo', '!Registro copiado!', {
      timeOut: 3000,
      positionClass: 'toast-center-center'
    }); 
  }
  else{
    this.toastr.success('Si guarda este registro se editarán sus valores', '!Registro copiado!', {
      timeOut: 3000,
      positionClass: 'toast-center-center'
    });     
  }


  if(registro.TipoSocioNegocio==1){
    this.opcionSocioSelect='Cliente'
    this.CatalogoSocios=this.SocioNegocios.filter((r:any)=>r.Tipo=='1')
    this.CatalogoSocioSeleccionado=this.CatalogoSocios.filter((cat:any)=>cat.id==registro.idSocioNegocio)[0]
  }
 else if(registro.TipoSocioNegocio==2){
  this.opcionSocioSelect='Proveedor'
    this.CatalogoSocios=this.SocioNegocios.filter((r:any)=>r.Tipo=='2')
    this.CatalogoSocioSeleccionado=
    this.CatalogoSocios.filter((cat:any)=>cat.id==registro.idSocioNegocio)[0]
  }
 else if(registro.TipoSocioNegocio==3){
  this.opcionSocioSelect='Cuenta Banc.'
    this.CatalogoSocios=this.CuentasBancarias
    this.CatalogoSocioSeleccionado=this.CatalogoSocios.filter((cat:any)=>cat.id==registro.idSocioNegocio)[0]
  }

  this.CatalogoCuentasHijos=this.CuentasHijos.filter((cuenta:any)=>cuenta.idPadre==registro.idCuentaPadre)
  this.CatalogoCuentasNieto=this.CuentasNietos.filter((cuenta:any)=>cuenta.idHijo==registro.idCuentaHijo)
  this.PadreSeleccionado=this.getCuentaPadre(registro.idCuentaPadre)
  this.CuentaHijoSeleccionado=this.getCuentaHijo(registro.idCuentaHijo)

  this.CuentaNietoSeleccionado=this.getCuentaNieto(registro.idCuentaNieto)
  this.Valor=registro.ValorNumero
  this.Fecha=registro.Fecha
  this.Comentarios=registro.Comentarios || ''
  this.ProyectoSeleccionado=this.getProyecto(registro.idProyecto)
  this.SucursalSeleccionada=this.getProyecto(registro.idsucursal)
  this.NumeroDocumento=registro.NumeroDocumento
  this.idRegistro=registro.idRegistro





 
}

obtenerRegistros(){
  this.conS.obtenerRegistros(this.idEmpresa).subscribe((resp:any)=>{
  this.Registros=resp 
  let Total:number=0
this.Registros.forEach(reg => {
  this.rowData.push(
{
    "Socio de Negocio": reg.Cliente!='' ? reg.Cliente : reg.Proveedor !='' ? reg.Proveedor : reg.CuentaBancaria!='' ? reg.CuentaBancaria:   '-',
    "idSocioNegocio": reg.idCliente!='' ? reg.idCliente : reg.idProveedor !='' ? reg.idProveedor : reg.idCuentaBancaria!='' ? reg.idCuentaBancaria:'-',
    "Cuenta Contable":this.getNombreCuentaContable(reg.idCuentaContablePadre!=''? reg.idCuentaContablePadre : ''),
    "Sub Cuenta Contable": this.getNombreSubCuentaContable(reg.idCuentaContableHijo),
    "Cuenta Nieto": this.getNombreCuentaContableNieto(reg.idCuentaContableNieto), 
    "Valor": reg.TipoRegistro == 1 ? '$ ' + reg.Valor.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-$ ' + reg.Valor.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    "ValorNumero": reg.Valor,    
    "NumeroDocumento": reg.NumeroDocumento,       
    "TipoRegistro": reg.TipoRegistro,           
    "Comentarios": reg.Comentarios,           
    "TipoSocioNegocio": reg.TipoSocioNegocio,           
    "Num Documento o Factura": reg.NumeroDocumento,
    "Fecha": reg.Fecha,
    "idProyecto": reg.idProyecto,
    "idSucursal": reg.idSucursal,
    "Proyecto":this.getNombreProyecto(reg.idProyecto) ,
    "Sucursal": this.getNombreSucursal(reg.idSucursal) ,
    "idRegistro":reg.id,
    "idCuentaPadre":reg.idCuentaContablePadre,
    "idCuentaHijo":reg.idCuentaContableHijo,
    "idCuentaNieto":reg.idCuentaContableNieto,
}
)
Total+=reg.TipoRegistro == 1 ?  (reg.Valor) : (reg.Valor*-1)
});
this.Total=Total<0? 

{
  'Valor':'-$ ' + (Total*-1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  'Color':'red'
  
}:

{
  'Valor':'$ ' + (Total).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  'Color':'black'
  
}


// const total = this.rowData.reduce((acc, fila) => acc + (fila.ValorNumero || 0), 0);

//   this.rowData.push({
//     idRegistro: 'TOTAL',
//     "Socio de Negocio": "TOTAL",
//     "Cuenta Contable": "",
//     "Sub Cuenta Contable": "",
//     "Cuenta Nieto": "",
//     "Num Documento o Factura": "",
//     "Valor": "$ " + total.toLocaleString(),
//     "Fecha": "",
//     "Proyecto": "",
//     "Sucursal": ""
//   });


Swal.close();
this.cargando=false
  })

}
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }

guardarRegistro() {



    Swal.fire({
        title: 'Cargando...'
      });
      Swal.showLoading();
  if(!this.CatalogoSocioSeleccionado){
          this.toastr.warning('Debe seleccionar un socio de negocios o cuenta bancaria', '¡Alerta!', {
            timeOut: 2000,
            positionClass: 'toast-center-center'
          }); 
          Swal.close();
        }

else  if(!this.PadreSeleccionado){
    this.toastr.warning('Debe seleccionar una cuenta contable', '¡Alerta!', {
      timeOut: 2000,
      positionClass: 'toast-center-center'
    }); 
    Swal.close();
  }
else  if(!this.CuentaHijoSeleccionado){
    this.toastr.warning('Debe seleccionar una sub cuenta contable', '¡Alerta!', {
      timeOut: 2000,
      positionClass: 'toast-center-center'
    });
    Swal.close(); 
  }
else  if(this.Valor==0){
    this.toastr.warning('Debe colocar un valor diferente de cero', '¡Alerta!', {
      timeOut: 2000,
      positionClass: 'toast-center-center'
    }); 
    Swal.close();
  }

  else {
  if(this.copiadoRegistro==true){
    this.idRegistro=''
  }
    const index = this.Registros.findIndex((reg: any) => reg.id === this.idRegistro);
     if (index !== -1) {
   
      this.Registros[index].Cliente=this.CatalogoSocioSeleccionado?.Tipo == '1' ? this.CatalogoSocioSeleccionado.Nombre : ''
      this.Registros[index].Comentarios=this.Comentarios
      this.Registros[index].CuentaBancaria=this.CatalogoSocioSeleccionado?.Tipo == '3' ? this.CatalogoSocioSeleccionado.Cuenta : ''
      this.Registros[index].Fecha=this.Fecha
      this.Registros[index].NumeroDocumento=this.NumeroDocumento
      this.Registros[index].Proveedor=this.CatalogoSocioSeleccionado?.Tipo == '2' ? this.CatalogoSocioSeleccionado.Nombre : ''
      this.Registros[index].TipoRegistro=this.PadreSeleccionado.Tipo
      this.Registros[index].TipoSocioNegocio=this.opcionSocioSelect=='Proveedor' ? 2: this.opcionSocioSelect=='Cliente' ? 1 : 3 
      this.Registros[index].Valor=Number(Math.abs(this.Valor))
      this.Registros[index].idCliente=this.CatalogoSocioSeleccionado?.Tipo == '1' ? this.CatalogoSocioSeleccionado.id : ''
      this.Registros[index].idCuentaBancaria=this.CatalogoSocioSeleccionado?.Tipo == '3' ? this.CatalogoSocioSeleccionado.id : ''
      this.Registros[index].idCuentaContableHijo=this.CuentaHijoSeleccionado?.id || ''
      this.Registros[index].idCuentaContableNieto=this.CuentaNietoSeleccionado?.id || ''
      this.Registros[index].idCuentaContablePadre=this.PadreSeleccionado?.id || ''
      this.Registros[index].idProveedor=this.CatalogoSocioSeleccionado?.Tipo == '2' ? this.CatalogoSocioSeleccionado.id : ''
      this.Registros[index].idProyecto=this.ProyectoSeleccionado?.id || ''
      this.Registros[index].idSucursal=this.SucursalSeleccionada?.id || ''
      
      this.conS.updateRegistro(this.Registros[index]).then(resp=>{
  
      const filaGrid = {
             "Socio de Negocio": this.Registros[index].Cliente!='' ? this.Registros[index].Cliente : this.Registros[index].Proveedor !='' ? this.Registros[index].Proveedor : this.Registros[index].CuentaBancaria!='' ? this.Registros[index].CuentaBancaria:   '-',
             "idSocioNegocio": this.Registros[index].idCliente!='' ? this.Registros[index].idCliente : this.Registros[index].idProveedor !='' ? this.Registros[index].idProveedor : this.Registros[index].idCuentaBancaria!='' ? this.Registros[index].idCuentaBancaria:'-',
             "Cuenta Contable":this.getNombreCuentaContable(this.Registros[index].idCuentaContablePadre!=''? this.Registros[index].idCuentaContablePadre : ''),
             "Sub Cuenta Contable": this.getNombreSubCuentaContable(this.Registros[index].idCuentaContableHijo),
             "Cuenta Nieto": this.getNombreCuentaContableNieto(this.Registros[index].idCuentaContableNieto), 
             "Valor": this.Registros[index].TipoRegistro == 1 ? '$ ' + this.Registros[index].Valor.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-$ ' + this.Registros[index].Valor.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
             "ValorNumero": Math.abs(this.Registros[index].Valor),    
             "NumeroDocumento": this.Registros[index].NumeroDocumento,       
             "TipoRegistro": this.Registros[index].TipoRegistro,           
             "Comentarios": this.Registros[index].Comentarios,           
             "TipoSocioNegocio": this.Registros[index].TipoSocioNegocio,           
             "Num Documento o Factura": this.Registros[index].NumeroDocumento,
             "Fecha": this.Registros[index].Fecha,
             "idProyecto": this.Registros[index].idProyecto,
             "idSucursal": this.Registros[index].idSucursal,
             "Proyecto":this.getNombreProyecto(this.Registros[index].idProyecto) ,
             "Sucursal": this.getNombreSucursal(this.Registros[index].idSucursal) ,
             "idRegistro":this.idRegistro,
             "idCuentaPadre":this.Registros[index].idCuentaContablePadre,
             "idCuentaHijo":this.Registros[index].idCuentaContableHijo,
             "idCuentaNieto":this.Registros[index].idCuentaContableNieto,
        };
  
  
      this.gridApi.applyTransaction({ update: [filaGrid] });
      Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
             timeOut: 1000,
             positionClass: 'toast-center-center'
        });  
  
      })
      
     }
     else {
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;    
       const nuevo:any = {
         "Valor": Number(this.Valor),
         "idCuentaContablePadre": this.PadreSeleccionado?.id || '',
         "idCuentaContableHijo": this.CuentaHijoSeleccionado?.id || '',
         "idCuentaContableNieto": this.CuentaNietoSeleccionado?.id || '',
         "Fecha": this.Fecha,
         "AnioRegistro":new Date(this.Fecha).getFullYear(),
         "Hora": formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
         "Orden":this.Registros.length+1,
         "NumeroDocumento":this.NumeroDocumento,
         "idUsuario":this.usuario.id,
         "TipoRegistro":this.PadreSeleccionado.Tipo,
         "TipoSocioNegocio":this.opcionSocioSelect=='Proveedor' ? 2: this.opcionSocioSelect=='Cliente' ? 1 : 3 ,
         "idEmpresa":this.idEmpresa,
         "idMatriz":this.usuario.idMatriz,
         "Comentarios": this.Comentarios,
         "idProyecto": this.ProyectoSeleccionado?.id || '',
         "idSucursal": this.SucursalSeleccionada?.id || '',
         "CuentaBancaria": this.CatalogoSocioSeleccionado?.Tipo == '3' ? this.CatalogoSocioSeleccionado.Cuenta : '',
         "idCuentaBancaria": this.CatalogoSocioSeleccionado?.Tipo == '3' ? this.CatalogoSocioSeleccionado.id : '',
         "Cliente": this.CatalogoSocioSeleccionado?.Tipo == '1' ? this.CatalogoSocioSeleccionado.Nombre : '',
         "idCliente": this.CatalogoSocioSeleccionado?.Tipo == '1' ? this.CatalogoSocioSeleccionado.id : '',
         "Proveedor": this.CatalogoSocioSeleccionado?.Tipo == '2' ? this.CatalogoSocioSeleccionado.Nombre : '',
         "idProveedor": this.CatalogoSocioSeleccionado?.Tipo == '2' ? this.CatalogoSocioSeleccionado.id : ''
       };
       this.conS.crearRegistro(nuevo).then((id:any)=>{ 
            nuevo.id=id
          
           this.Registros.push(nuevo);
           const filaGrid = {
             "Socio de Negocio": nuevo.Cliente!='' ? nuevo.Cliente : nuevo.Proveedor !='' ? nuevo.Proveedor : nuevo.CuentaBancaria!='' ? nuevo.CuentaBancaria:   '-',
             "idSocioNegocio": nuevo.idCliente!='' ? nuevo.idCliente : nuevo.idProveedor !='' ? nuevo.idProveedor : nuevo.idCuentaBancaria!='' ? nuevo.idCuentaBancaria:'-',
             "Cuenta Contable":this.getNombreCuentaContable(nuevo.idCuentaContablePadre!=''? nuevo.idCuentaContablePadre : ''),
             "Sub Cuenta Contable": this.getNombreSubCuentaContable(nuevo.idCuentaContableHijo),
             "Cuenta Nieto": this.getNombreCuentaContableNieto(nuevo.idCuentaContableNieto), 
             "Valor": nuevo.TipoRegistro == 1 ? '$ ' + nuevo.Valor.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-$ ' + nuevo.Valor.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
             "ValorNumero": nuevo.Valor,    
             "NumeroDocumento": nuevo.NumeroDocumento,       
             "TipoRegistro": nuevo.TipoRegistro,           
             "Comentarios": nuevo.Comentarios,           
             "TipoSocioNegocio": nuevo.TipoSocioNegocio,           
             "Num Documento o Factura": nuevo.NumeroDocumento,
             "Fecha": nuevo.Fecha,
             "idProyecto": nuevo.idProyecto,
             "idSucursal": nuevo.idSucursal,
             "Proyecto":this.getNombreProyecto(nuevo.idProyecto) ,
             "Sucursal": this.getNombreSucursal(nuevo.idSucursal) ,
             "idRegistro":id,
             "idCuentaPadre":nuevo.idCuentaContablePadre,
             "idCuentaHijo":nuevo.idCuentaContableHijo,
             "idCuentaNieto":nuevo.idCuentaContableNieto,
           };
           this.gridApi.applyTransaction({ add: [filaGrid] });
           Swal.close();
           this.toastr.success('Cuenta actualizada', '¡Éxito!', {
             timeOut: 1000,
             positionClass: 'toast-center-center'
           });
  
       })
     }
  let Total:number=0
  Total=this.Registros.reduce((acc, fila) => acc + ( fila.TipoRegistro == 1? fila.ValorNumero :(fila.ValorNumero*-1) || 0), 0);
  this.Total=Total<0? 

{
  'Valor':'-$ ' + (Total*-1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  'Color':'red'
  
}:

{
  'Valor':'$ ' + (Total).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  'Color':'black'
  
}

  }
}



getNombreCuentaContable(idCuenta:string){
  let _CuentaContable=this.Padres.filter((padre:any)=>padre.id==idCuenta)[0]
  if(_CuentaContable){
    return _CuentaContable.Nombre
  }
  else {
    return '-'
  }
}
getNombreSubCuentaContable(idCuenta:string){
  let _CuentaContable=this.CuentasHijos.filter((hijo:any)=>hijo.id==idCuenta)[0]
  if(_CuentaContable){
    return _CuentaContable.Nombre
  }
  else {
    return '-'
  }
}
getNombreCuentaContableNieto(idCuenta:string){
  let _CuentaContable=this.CuentasNietos.filter((nieto:any)=>nieto.id==idCuenta)[0]
  if(_CuentaContable){
    return _CuentaContable.Nombre
  }
  else {
    return '-'
  }
}

getNombreSucursal(idSucursal:string){
  let _Sucursal=this.Sucursales.filter((suc:any)=>suc.id==idSucursal)[0]
  if(_Sucursal){
    return _Sucursal.Nombre
  }
  else {
    return '-'
  }
}
getNombreProyecto(idProyecto:string){
  let _Proyecto=this.Proyectos.filter((proyecto:any)=>proyecto.id==idProyecto)[0]
  if(_Proyecto){
    return _Proyecto.Nombre
  }
  else {
    return '-'
  }
}

cambiarTipoSocio(){
  this.CatalogoSocioSeleccionado={}
  if(this.opcionSocioSelect=='Proveedor'){
    this.CatalogoSocios=this.SocioNegocios.filter((r:any)=>r.Tipo=='2')

    this.Padres=this.Categorias.filter((padre:any)=> padre.Tipo==2)
  }
  else if(this.opcionSocioSelect=='Cliente'){
    this.CatalogoSocios=this.SocioNegocios.filter((r:any)=>r.Tipo=='1')
    this.Padres=this.Categorias.filter((padre:any)=> padre.Tipo==1)


  }
  else {
    this.CatalogoSocios=this.CuentasBancarias
    this.Padres=this.Categorias.filter((padre:any)=>padre.Tipo==1 || padre.Tipo==2)
    
  }
}

obtenerProyectos()
{
  this.conS.obtenerProyectos(this.idEmpresa).subscribe((resp:any)=>{
    this.Proyectos=resp
      this.obtenerSucursales()

  })

}
obtenerSucursales()
{
  this.conS.obtenerSucursales(this.idEmpresa).subscribe((resp:any)=>{
    this.Sucursales=resp
    this.obtenerRegistros()    
  })

}
obtenerSociosNegocios(){
  this.conS.obtenerSocios(this.idEmpresa).subscribe((resp:any)=>{
    this.SocioNegocios=resp
    this.CatalogoSocios=resp.filter((r:any)=>r.Tipo=='2')
 
  
  })
}

obtenerCuentasBancarias(){
  this.conS.obtenerBancos(this.idEmpresa).subscribe((resp:any)=>{
  this.obtenerSociosNegocios()
  this.CuentasBancarias=resp
  this.CuentasBancarias.map((cuenta:any)=>{cuenta.Nombre=cuenta.Nombre + ' ' + cuenta.Cuenta,cuenta.Tipo='3'})
  this.obtenerCategoriasCuenta()
  })
}

obtenerCategoriasCuenta(){
  this.conS.obtenerCategoriasFlujos().subscribe((resp: any) => {
    this.Categorias=resp
    this.Padres=resp.filter((padre:any)=>padre.Tipo==1 || padre.Tipo==2)
    this.obtenerCuentasHijos()
    this.obtenerCuentasNieto()
  })
}

obtenerCuentasHijos(){
  this.conS.obtenerItems(this.idEmpresa).subscribe((resp: any) => {
    this.CuentasHijos=resp
    

  })
}
obtenerCuentasNieto(){
  this.conS.obtenerCuentasNietos(this.idEmpresa).subscribe((resp: any) => {
    this.CuentasNietos=resp
      this.obtenerProyectos()

    

  })
}

obtenerCuentasHijosByPadre(){
this.CuentaHijoSeleccionado={}  
if(this.PadreSeleccionado){
  this.CatalogoCuentasHijos=this.CuentasHijos.filter((cuenta:any)=>cuenta.idPadre==this.PadreSeleccionado.id)
}
else {
  this.CatalogoCuentasHijos=[]

}
}
obtenerCuentasNietoByHijo(){
this.CuentaNietoSeleccionado={}  
if(this.CuentaHijoSeleccionado){
  this.CatalogoCuentasNieto=this.CuentasNietos.filter((cuenta:any)=>cuenta.idHijo==this.CuentaHijoSeleccionado.id)
}
else {
  this.CatalogoCuentasNieto=[]

}
}





}
