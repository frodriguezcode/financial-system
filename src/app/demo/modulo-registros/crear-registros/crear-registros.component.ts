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
constructor(private conS:ConfigurationService){}
Valor:number=0
Fecha:any
Comentarios:string=''
Registros:any=[]

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
columnDefs: ColDef[] = []
rowData :any=[]
 gridApi: any;
gridColumnApi: any;
localeText:any
@ViewChild('agGrid') agGrid!: AgGridAngular;

onGridReady(params:any) {
  this.gridApi = params.api;
}
ngOnInit(): void {
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
  { field: "Socio de Negocio" },
  { field: "Cuenta Contable" },
  { field: "Sub Cuenta Contable" },
  { field: "Cuenta Nieto" },
  { field: "Valor" },
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
      this.obtenerProyectos()
      this.obtenerSucursales()
      

});

this.Registros.forEach(reg => {
  this.rowData.push(
    {
    "Socio de Negocio": reg.Cliente!='' ? reg.Cliente : reg.Proveedor !='' ? reg.Proveedor : '-',
    "Cuenta Contable": 
    this.getNombreCuentaContable(reg.idCuentaContablePadre!=''? reg.idCuentaContablePadre : ''),
    "Sub Cuenta Contable":
    this.getNombreSubCuentaContable(reg.idCuentaContableHijo),
    "Cuenta Nieto": 
    this.getNombreCuentaContableNieto(reg.idCuentaContableNieto),
    "Valor": reg.Valor,
    "Fecha": reg.Fecha,
    "Proyecto": reg.idProyecto,
    "Sucursal": reg.idSucursal
    }
)
  
});
  
}

guardarRegistro() {
  const nuevo = {
    "Valor": Number(this.Valor),
    "idCuentaContablePadre": this.PadreSeleccionado?.id || '',
    "idCuentaContableHijo": this.CuentaHijoSeleccionado?.id || '',
    "idCuentaContableNieto": this.CuentaNietoSeleccionado?.id || '',
    "Fecha": this.Fecha,
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

  // Guardar en la lista "real"
  this.Registros.push(nuevo);

  // Convertir al formato de la grid
  const filaGrid = {
    "Socio de Negocio": nuevo.Cliente != '' ? nuevo.Cliente : nuevo.Proveedor != '' ? nuevo.Proveedor : '-',
    "Cuenta Contable":this.getNombreCuentaContable(nuevo.idCuentaContablePadre!=''? nuevo.idCuentaContablePadre : ''),
    "Sub Cuenta Contable": this.getNombreSubCuentaContable(nuevo.idCuentaContableHijo),
    "Cuenta Nieto": nuevo.idCuentaContableNieto,
    "Valor": nuevo.Valor,
    "Fecha": nuevo.Fecha,
    "Proyecto": nuevo.idProyecto,
    "Sucursal": nuevo.idSucursal
  };

  console.log('filaGrid',filaGrid)
  // Insertar directamente en la grid
  this.gridApi.applyTransaction({ add: [filaGrid] });
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
  })

}
obtenerSucursales()
{
  this.conS.obtenerSucursales(this.idEmpresa).subscribe((resp:any)=>{
    this.Sucursales=resp
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
