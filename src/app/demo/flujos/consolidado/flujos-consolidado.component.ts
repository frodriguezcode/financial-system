// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-flujo-consolidado',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './flujos-consolidado.component.html',
  styleUrls: ['./flujos-consolidado.component.scss']
})
export default class FlujoConsolidadoComponent {}
