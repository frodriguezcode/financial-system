// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import ItemsComponent from '../Items/items.component';
import BancosComponent from '../bancos/bancos.component';
import SocioNegocioComponent from '../socios/socios.component';
import EmpresasComponent from '../empresas/empresas.component';
import SucursalesComponent from '../sucursales/sucursales.component';
import { ProgressIndicatorComponent } from 'src/app/theme/shared/components/progress-indicator/progress-indicator.component';
import AjusteSaldoComponent from '../ajuste-saldos/ajuste-saldo.component';
import CrearUsuarioComponent from '../crear-usuario/crear-usuario.component';
import { EmpresasService } from 'src/app/services/empresa.service';
import { RouterModule,Router } from '@angular/router';
import Swal from 'sweetalert2'
// import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-cofiguracion-inicial',
  standalone: true,
  imports: [CommonModule, 
  SharedModule, 
  ItemsComponent, 
  BancosComponent,
  SocioNegocioComponent, 
  EmpresasComponent, 
  SucursalesComponent, 
  ProgressIndicatorComponent,
  AjusteSaldoComponent,
  CrearUsuarioComponent
],
  templateUrl: '/configuracion-inicial.component.html',
  styleUrls: ['/configuracion-inicial.component.scss']
})
export default class ConfiguracionInicialComponent implements OnInit {
usuario:any
constructor(private emS:EmpresasService,private readonly router: Router){}
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
}

  currentStep = 1;
  totalSteps = 7;

  

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
    Swal.fire({
      title: "¿Desea terminar la configuración inicial?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.emS.ActualizarEmpresaConfigInicial(this.usuario.idEmpresa).then(resp=>{
          this.router.navigate(['/analytics'])
        })
      }
    });

    
  }

  calculateProgress(): number {
    return Math.ceil((this.currentStep / this.totalSteps) * 100);
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
