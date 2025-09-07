// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import CatalogoCuentasContablesComponent from './catalogo-cuentas-contables/catalogo-cuentas-contables.component';
@Component({
  selector: 'app-modulo-catalogos',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule,CardModule,CatalogoCuentasContablesComponent],
  templateUrl: './modulo-catalogos.component.html',
  styleUrls: ['./modulo-catalogos.component.scss']
})
export default class ModuloCatalogosComponent implements OnInit {
  constructor(private rutaActiva: ActivatedRoute){}
  idEmpresa:any
  Catalogos:any=[]
  ngOnInit(): void {
    this.idEmpresa=this.rutaActiva.snapshot.paramMap.get('idEmpresa')!;
    console.log('idEmpresa',this.idEmpresa)

    this.Catalogos.push(
    {
      "Nombre":'Usuarios',
      'icon': 'fa fa-user card-icon',
      'Descripcion': 'Ver informacion de tus usuarios',
      'id':1,
      'url': '/modulo-cuentas-contables'

    },
    {
      "Nombre":'Roles',
      'icon': 'fa-solid fa-lock card-icon',
      'Descripcion': 'Ver informacion de los roles creados en tu empresa',
      'id':2,
      'url': '/modulo-cuentas-contables'
    },
    {
      "Nombre":'Sucursales',
      'icon': 'fa-solid fa-building card-icon',
      'Descripcion': 'Ver informacion de tus sucursales',
      'id':2,
    },
    {
      "Nombre":'Proyectos',
      'icon': 'fa-solid fa-diagram-project card-icon',
      'Descripcion': 'Ver informacion de tus proyectos',
      'id':2,
    },
    {
      "Nombre":'Cuentas Contables',
      'icon': 'fa-solid fa-list card-icon',
      'Descripcion': 'Ver informacion de tus cuentas contables',
      'id':2,
      'url': '/modulo-cuentas-contables'
    },
    {
      "Nombre":'Cuentas Bancarias',
      'icon': 'fa-solid fa-list-ol card-icon',
      'Descripcion': 'Ver informacion de tus cuentas bancarias',
      'id':2,
    },
    {
      "Nombre":'Socios de Negocio',
      'icon': 'fa-solid fa-users-line card-icon',
      'Descripcion': 'Ver informacion de tus socios de negocio',
      'id':2,
    },
    )
  }
}
