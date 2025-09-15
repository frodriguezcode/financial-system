// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-crear-cuenta-contable',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './crear-cuenta-contable.component.html',
  styleUrls: ['./crear-cuenta-contable.component.scss']
})
export default class CrearCuentaContableComponent {}
