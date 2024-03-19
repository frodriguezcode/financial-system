// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-flujo-caja',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './flujos-caja.component.html',
  styleUrls: ['./flujos-caja.component.scss']
})
export default class FlujoCajaComponent {}
