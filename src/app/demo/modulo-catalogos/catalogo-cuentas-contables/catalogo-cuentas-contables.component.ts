// angular import
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-catalogo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeModule],
  templateUrl: './catalogo-cuentas-contables.component.html',
  styleUrls: ['./catalogo-cuentas-contables.component.scss']
})
export default class CatalogoCuentasContablesComponent implements OnInit {
  @Input() idEmpresa: any;
  CuentasContables:any=[]
  Proyectos:any=[]
  Sucursales:any=[]
  Abuelos:any=[]
  Padres:any=[]
  Items:any=[]
  CuentasNietos:any=[]

  data: any[] = []
  dataCatalogos: any = []
  constructor(private rutaActiva: ActivatedRoute,private conS:ConfigurationService){}
  ngOnInit(): void {
    this.obtenerProyectos() 
  }

  obtenerProyectos() {
    let Subscribe: Subscription
    Subscribe = this.conS.obtenerProyectos(this.idEmpresa).subscribe((resp: any) => {
      Subscribe.unsubscribe()
      this.Proyectos = resp
      this.obtenerSucursales()
    })
  }
  obtenerSucursales() {
    let Subscribe: Subscription
    Subscribe = this.conS.obtenerSucursales(this.idEmpresa).subscribe((resp: any) => {
      this.Sucursales = resp
      Subscribe.unsubscribe()
      this.obtenerAbuelos() 
   
    })
  }

  obtenerAbuelos() {
    this.conS.obtenerCategoriasFlujos().subscribe((resp: any) => {
      this.Abuelos = resp.filter((r: any) => r.id != 'VmmQpdpunMTqkoSjhzzj');
      this.obtenerCuentasNietos();
    });
  }
  obtenerCuentasNietos() {
    let Subscripcion: Subscription;
    Subscripcion = this.conS.obtenerCuentasNietos(this.idEmpresa).subscribe((cuentas: any) => {
      Subscripcion.unsubscribe();
      this.CuentasNietos = cuentas;
      this.obtenerItems();
    });
  }

  obtenerItems() {
    let Subscripcion: Subscription;
    Subscripcion = this.conS.obtenerItems(this.idEmpresa).subscribe((items: any) => {
      Subscripcion.unsubscribe();
      this.Items = items; 
      this.obtenerPadres()
    });
  }

  obtenerPadres(){
    this.Abuelos.filter((padre:any)=>padre.Tipo==1 || padre.Tipo==2)
    .forEach(padre2 =>{
    this.Padres.push(padre2)
    });
   
    this.construirJerarquia()
  
  }

  construirJerarquia(){
 console.log('Padres',this.Padres)
 console.log('Abuelos',this.Abuelos)

 this.Abuelos
 .filter((abuelo:any)=>abuelo.Tipo==3)
 .forEach((abuelo:any) => {

  this.data.push({
    key: abuelo.id,
    label: abuelo.Nombre,
    data: '',
    icon: 'pi pi-list',
    children:this.getPadreByAbuelo(abuelo.id)
  })
  
  
 });

   console.log('data',this.data)
   console.log('Proyectos',this.Proyectos)
   console.log('Sucursales',this.Sucursales)
  }
getPadreByAbuelo(idAbuelo:any){
  let _Padre= []
  this.Padres.filter((padre:any)=>padre.idAbuelo==idAbuelo)
  .forEach((element:any) => {
    _Padre.push(
   { 
    key: idAbuelo + '-' + _Padre.length + 1,
    label: element.Nombre,
    data: '',
    icon: 'pi pi-list',
    children:this.getHijosByPadre(element.id,idAbuelo + '-' + _Padre.length + 1)
    },
    )
    
  });

return _Padre
  
}
getHijosByPadre(idPadre:any,key:any){
    let _Hijo= []
  this.Items.filter((padre:any)=>padre.idPadre==idPadre)
  .forEach((element:any) => {
    _Hijo.push(
      {
      key: key + '-' + _Hijo.length + 1,
      label: element.Nombre,
      data: '',
      icon: 'pi pi-list',
      'Proyectos':this.getProyectosByCuentas(element.idsProyectos),
      children:this.getNietosByHijo(element.id,key + '-' + _Hijo.length + 1)
      }
    )
    
  });
return _Hijo
}

getNietosByHijo(idHijo:any,key:any){
    let _Nieto= []
  this.CuentasNietos.filter((padre:any)=>padre.idHijo==idHijo)
  .forEach((element:any) => {
    _Nieto.push(
      {
      key: key + '-' + _Nieto.length + 1,
      label: element.Nombre,
      data: '',
      icon: 'pi pi-list',
     
      }
    )
    
  });
return _Nieto
}

getProyectosByCuentas(idsProyectos:any){

  let Proyectos:any=[]
  Proyectos=this.Proyectos.filter((proy:any)=> idsProyectos.includes(proy.id))
  if(Proyectos.length>0){
    return Proyectos.map((proyecto:any)=>proyecto.Nombre)
  }
  return 'No tiene proyectos asignados'
}


}
