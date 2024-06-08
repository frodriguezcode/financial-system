// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-cofiguracion-inicial',
  standalone: true,
  imports: [CommonModule, SharedModule ],
  templateUrl: '/configuracion-inicial.html',
  styleUrls: ['/configuracion-inicial.scss']
})
export default class SamplePageComponent {}
