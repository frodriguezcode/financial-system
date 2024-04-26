// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import CrearRegistroComponent from '../crear-registro/crear-registro.component';
@Component({
  selector: 'app-panel-registros',
  standalone: true,
  imports: [CommonModule, SharedModule,TabViewModule,ButtonModule,CrearRegistroComponent],
  templateUrl: './panel-registros.component.html',
  styleUrls: ['./panel-registros.component.scss']
})
export default class PanelRegistrosComponent {
  activeIndex: number = 0;
}
