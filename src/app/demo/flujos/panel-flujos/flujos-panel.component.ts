// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import FlujoBancosComponent from '../bancos/flujos-bancos.component';
import FlujoCajaComponent from '../caja/flujos-caja.component';
import FlujoConsolidadoComponent from '../consolidado/flujos-consolidado.component';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import AjusteSaldoComponent from '../../ajuste-saldos/ajuste-saldo.component';
import ConsolidadoMejoradoComponent from '../consolidado-mejorado/consolidado-mejorado.component';
@Component({
  selector: 'app-flujos-panel',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FlujoBancosComponent,
    FlujoCajaComponent,
    FlujoConsolidadoComponent,
    TabViewModule,
    ButtonModule,
    StyleClassModule,
    DialogModule,
    AjusteSaldoComponent,
    ConsolidadoMejoradoComponent
  ],
  templateUrl: './flujos-panel.component.html',
  styleUrls: ['./flujos-panel.component.scss']
})
export default class FlujosPanelComponent implements OnInit {
  activeIndex: number = 0;
  visible: boolean = false;
  ngOnInit(): void {}
  showDialog() {
    this.visible = true;
}
}
