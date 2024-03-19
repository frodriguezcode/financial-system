// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-flujo-bancos',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './flujos-bancos.component.html',
  styleUrls: ['./flujos-bancos.component.scss']
})
export default class FlujoBancosComponent {}
