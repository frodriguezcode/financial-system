// angular import
import { Component, OnInit,HostListener,ElementRef, Renderer2 } from '@angular/core';
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
    // FlujoBancosComponent,
    // FlujoCajaComponent,
    // FlujoConsolidadoComponent,
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
  scale = 1;
  height :any
  visible: boolean = false;
  width: number = window.innerWidth;
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.adjustZoom();
    window.addEventListener('resize', () => this.adjustZoom());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustZoom();
  }
  showDialog() {  
    this.visible = true;
}
// Swal.fire({
//       position: 'center',
//       icon: 'success',
//       title: `${this.width} ${this.height} `,
//       showConfirmButton: true
//       })

adjustZoom() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;

  if (this.width >=1000 && this.width <= 1300) {
  
    (document.body.style as any).zoom = '0.7';  // Aplicar zoom al 70%
  } else {
    (document.body.style as any).zoom = '1';  // Mantener zoom normal
  }
}
}
