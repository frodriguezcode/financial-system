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
  CrearUsuarioComponent
  
  ],
  templateUrl: './panel-registros.component.html',
  styleUrls: ['./panel-registros.component.scss']
})
export default class PanelRegistrosComponent {
  activeIndex: number = 0;
  
}
