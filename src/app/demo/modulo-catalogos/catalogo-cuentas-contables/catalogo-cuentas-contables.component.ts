// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';

@Component({
  selector: 'app-catalogo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule,OrganizationChartModule],
  templateUrl: './catalogo-cuentas-contables.component.html',
  styleUrls: ['./catalogo-cuentas-contables.component.scss']
})
export default class CatalogoCuentasContablesComponent implements OnInit {
  CuentasContables:any=[]
  Proyectos:any=[]
  Sucursales:any=[]
  Abuelos:any=[]
  Padres:any=[]
  Items:any=[]
  CuentasNietos:any=[]
  idEmpresa:any
  data: any[] = []
  dataCatalogos: any = []
  constructor(private rutaActiva: ActivatedRoute,private conS:ConfigurationService){}
  ngOnInit(): void {
    this.idEmpresa=this.rutaActiva.snapshot.paramMap.get('idEmpresa')!;
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
    Nombre:abuelo.Nombre,
    Padres:this.getPadreByAbuelo(abuelo.id)
  })
  
  
 });

   console.log('data',this.data)
  }
getPadreByAbuelo(idAbuelo:any){
  let _Padre= []
  this.Padres.filter((padre:any)=>padre.idAbuelo==idAbuelo)
  .forEach((element:any) => {
    _Padre.push(
      {
      Nombre:element.Nombre,
      Hijos:this.getHijosByPadre(element.id)

      }
    )
    
  });

return _Padre
  
}
getHijosByPadre(idPadre:any){
    let _Hijo= []
  this.Items.filter((padre:any)=>padre.idPadre==idPadre)
  .forEach((element:any) => {
    _Hijo.push(
      {
      Nombre:element.Nombre,
      Nietos:this.getNietosByHijo(element.id)
      }
    )
    
  });
return _Hijo
}

getNietosByHijo(idHijo:any){
    let _Nieto= []
  this.CuentasNietos.filter((padre:any)=>padre.idHijo==idHijo)
  .forEach((element:any) => {
    _Nieto.push(
      {
      Nombre:element.Nombre,
     
      }
    )
    
  });
return _Nieto
}


}
