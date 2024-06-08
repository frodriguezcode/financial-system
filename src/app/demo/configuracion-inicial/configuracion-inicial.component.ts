// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import ItemsComponent from '../Items/items.component';
import BancosComponent from '../bancos/bancos.component';
import SocioNegocioComponent from '../socios/socios.component';
import EmpresasComponent from '../empresas/empresas.component';
import SucursalesComponent from '../sucursales/sucursales.component';
import { ProgressIndicatorComponent } from 'src/app/theme/shared/components/progress-indicator/progress-indicator.component';

// import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-cofiguracion-inicial',
  standalone: true,
  imports: [CommonModule, SharedModule, ItemsComponent, BancosComponent, SocioNegocioComponent, EmpresasComponent, SucursalesComponent, ProgressIndicatorComponent ],
  templateUrl: '/configuracion-inicial.html',
  styleUrls: ['/configuracion-inicial.scss']
})
export default class SamplePageComponent {


  currentStep = 1;
  totalSteps = 5;

  

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.addAnimationOut();
      setTimeout(() => {
        this.currentStep++;
        this.addAnimationIn();
      }, 200);
    }
  }
  
  
  previousStep() {
    if (this.currentStep > 1) {
      this.addAnimationOut();
      setTimeout(() => {
        this.currentStep--;
        this.addAnimationIn();
      }, 200);
    }
  }
  
  complete() {
    console.log('Stepper completado');
    
  }

  calculateProgress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  addAnimationIn() {
    const stepContent = document.querySelector('.stepper-content');
    stepContent.classList.remove('animate__fadeOut');
    stepContent.classList.add('animate__fadeIn');
  }

  addAnimationOut() {
    const stepContent = document.querySelector('.stepper-content');
    stepContent.classList.remove('animate__fadeIn');
    stepContent.classList.add('animate__fadeOut');
  }

}
