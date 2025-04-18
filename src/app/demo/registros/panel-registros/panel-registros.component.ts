// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import CrearRegistroComponent from '../crear-registro/crear-registro.component';
import PagoCobroComponent from '../crear-pago-cobro/pago-cobro.component';
import ItemsComponent from '../../Items/items.component';
import BancosComponent from '../../bancos/bancos.component';
import SocioNegocioComponent from '../../socios/socios.component';
import SucursalesComponent from '../../sucursales/sucursales.component';
import EmpresasComponent from '../../empresas/empresas.component';
import CrearUsuarioComponent from '../../crear-usuario/crear-usuario.component';
import ProyectosComponent from '../../proyectos/proyectos.component';
import { TabMenuModule } from 'primeng/tabmenu';
@Component({
  selector: 'app-panel-registros',
  standalone: true,
  imports: [
  CommonModule, 
  SharedModule,
  TabViewModule,
  ButtonModule,
  CrearRegistroComponent,
  PagoCobroComponent,
  ItemsComponent,
  BancosComponent,
  SocioNegocioComponent,
  EmpresasComponent,
  SucursalesComponent,
  CrearUsuarioComponent,
  ProyectosComponent,
  TabMenuModule
  ],
  templateUrl: './panel-registros.component.html',
  styleUrls: ['./panel-registros.component.scss']
})
export default class PanelRegistrosComponent {
  activeIndex: number = 0;
  idTipo: number = 1;
  items: any[] | undefined;
  activeItem: any | undefined;
  ngOnInit() {
    this.items = [
        { label: 'Sucursales', icon: 'pi pi-home' },
        { label: 'Proyectos', icon: 'pi pi-chart-line' },
    ];

    this.activeItem = this.items[0];
}
onActiveItemChange(event: any) {
  this.activeItem = event;
}
  elegirTipo(idtipo:any){
    console.log('idTipo',this.idTipo)
    this.idTipo=idtipo
  }
  onTabChange(event: any) {
    console.log("Tab cambiado:", event);
    const index = event.index;
    if (index === 0) {
      this.elegirTipo(1); // Sucursales
    } else if (index === 1) {
      this.elegirTipo(2); // Proyectos
    }
  }
}
