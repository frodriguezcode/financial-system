// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-modulo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './modulo-cuentas-contables.component.html',
  styleUrls: ['./modulo-cuentas-contables.component.scss']
})
export default class ModuloCuentasContableComponent {}
