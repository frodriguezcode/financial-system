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
  Items:any=[]
  CuentasNietos:any=[]
  idEmpresa:any
  
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
      this.  construirJerarquia()
    });
  }

  construirJerarquia(){
    
  }



}
