// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'primeng/accordion';
import { ConfigurationService } from 'src/app/services/configuration.service';
@Component({
  selector: 'app-crear-registros',
  standalone: true,
  imports: [CommonModule, SharedModule,FloatLabelModule,NgSelectModule,AccordionModule],
  templateUrl: './crear-registros.component.html',
  styleUrls: ['./crear-registros.component.scss']
})
export default class CrearRegistrosComponent implements OnInit {
constructor(private conS:ConfigurationService){}
SocioNegocios:any=[]
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
ngOnInit(): void {
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
  
}

guardarRegistro(){

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
  this.CuentasBancarias.map((cuenta:any)=>cuenta.Nombre=cuenta.Nombre + ' ' + cuenta.Cuenta)
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
console.log('PadreSeleccionado',this.PadreSeleccionado)
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
