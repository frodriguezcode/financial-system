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
import RolesComponent from '../roles/roles.component';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
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
  CrearUsuarioComponent,
  RolesComponent
],
  templateUrl: '/configuracion-inicial.component.html',
  styleUrls: ['/configuracion-inicial.component.scss']
})
export default class ConfiguracionInicialComponent implements OnInit {
usuario:any
showText: boolean = true;
showComponent: boolean = false;
Empresas:any=[]
Sucursales:any=[]
Roles:any=[]
Usuarios:any=[]
SociosNegocio:any=[]
CuentasBancarias:any=[]
CuentasContables:any=[]
SaldosIniciales:any=[]
idMenu:any=1
currentStep:any = 1;
textoInfo:string='Bienvenidos al sistema financiero, a continuación empezaremos la configuración inicial'
constructor(
private emS:EmpresasService,
private conS:ConfigurationService,
private readonly router: Router,
private authS:AuthService){}
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  if(localStorage.getItem('idMenu')!=null)
    {
      this.currentStep =Number(localStorage.getItem('idMenu'));
    }
    if(localStorage.getItem('TextoConfigInicial')!=null)
    {
      this.textoInfo =localStorage.getItem('TextoConfigInicial');
    }
  this.obtenerEmpresas()
  this.obtenerRoles()
  this.obtenerSociosNegocio()
  this.obtenerCuentasBancarias()
  this.obtenerCuentasContables()
  this.obtenerSaldosIniciales()
  setTimeout(() => {
    this.hideText();
    this.showComponent = true;
  }, 5000);
}
obtenerEmpresas(){
  this.emS.obtenerEmpresa(this.usuario.idMatriz).subscribe((res:any) => {
    this.Empresas=res
  })
}
obtenerRoles(){
  this.authS.obtenerRoles(this.usuario.idEmpresa).subscribe((res:any) => {
    this.Roles=res
    console.log('Roles',this.Roles)
  })
}
obtenerSociosNegocio(){
  this.conS.obtenerSocios(this.usuario.idEmpresa).subscribe((res:any) => {
    this.SociosNegocio=res
  })
}
obtenerCuentasBancarias(){
  this.conS.obtenerBancos(this.usuario.idEmpresa).subscribe((res:any) => {
    this.CuentasBancarias=res
  })
}
obtenerCuentasContables(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe((res:any) => {
    this.CuentasContables=res
  })
}
obtenerSaldosIniciales(){
  this.conS.obtenerSaldoInicial(this.usuario.idEmpresa).subscribe((res:any) => {
    this.SaldosIniciales=res
  })
}


  totalSteps = 8;
  hideText() {
    const element = document.getElementById('animatedText');
    if (element) {
      element.classList.add('animate__fadeOut');
      setTimeout(() => {
        this.showText = false;
        
      }, 1000); // Duración de la animación de salida (ajusta según tu preferencia)
    }
  }
  

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      
      this.addAnimationOut();
      setTimeout(() => {
        this.showComponent = false;

        if(this.currentStep==1){
          this.currentStep++;
          this.textoInfo='Bien, ahora crearemos las sucursales, sino es necesario puedes pasar al siguiente módulo'
          localStorage.setItem('idMenu', this.currentStep)
          localStorage.setItem('TextoConfigInicial',this.textoInfo)
          this.showText=true
          this.showText=true
          
          setTimeout(() => {
            this.hideText();
            this.showComponent = true;
          }, 2000);
        }
     else   if(this.currentStep==2){
          this.currentStep++;
          this.textoInfo='A continuación crearemos los roles y accesos del sistema'
          localStorage.setItem('idMenu', this.currentStep)
          localStorage.setItem('TextoConfigInicial',this.textoInfo)
          this.showText=true
          
          setTimeout(() => {
            this.hideText();
            this.showComponent = true;
          }, 2000);
        }


     else if(this.currentStep==3){
           if(this.Roles.length==0){
            this.showComponent = true;
             Swal.fire({
               position: "center",
               icon: "warning",
               title: "Debe ingresar al menos 1 rol",
               showConfirmButton: false,
               timer: 1500
             });

           }
           else {
             this.currentStep++;
             this.textoInfo='Bien, ahora crearemos los usuarios de tu empresa'
             localStorage.setItem('idMenu', this.currentStep)
             localStorage.setItem('TextoConfigInicial',this.textoInfo)
             this.showText=true
             
             setTimeout(() => {
               this.hideText();
               this.showComponent = true;
             }, 2000);
           }
        
      }

   else   if(this.currentStep==4){
        this.currentStep++;
        this.textoInfo='En esta sección crearemos los socios de negocio (clientes y proveedores)'
        localStorage.setItem('idMenu', this.currentStep)
        localStorage.setItem('TextoConfigInicial',this.textoInfo)
        this.showText=true
        
        setTimeout(() => {
          this.hideText();
          this.showComponent = true;
        }, 2000);
      }

      else if(this.currentStep==5){
        if(this.SociosNegocio.length==0){
         this.showComponent = true;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Debe ingresar al menos 1 socio de negocio",
            showConfirmButton: false,
            timer: 1500
          });

        }
        else {
          this.currentStep++;
          this.textoInfo='Bien, ahora crearemos las cuentas bancarias de tu empresa'
          localStorage.setItem('idMenu', this.currentStep)
          localStorage.setItem('TextoConfigInicial',this.textoInfo)
          this.showText=true
          
          setTimeout(() => {
            this.hideText();
            this.showComponent = true;
          }, 2000);
        }
     
   }
      else if(this.currentStep==6){
        if(this.CuentasBancarias.length==0){
         this.showComponent = true;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Debe ingresar al menos 1 cuenta bancaria",
            showConfirmButton: false,
            timer: 1500
          });

        }
        else {
          this.currentStep++;
          this.textoInfo='En esta sección crearemos las cuentas contables de tu empresa'
          localStorage.setItem('idMenu', this.currentStep)
          localStorage.setItem('TextoConfigInicial',this.textoInfo)
          this.showText=true
          
          setTimeout(() => {
            this.hideText();
            this.showComponent = true;
          }, 2000);
        }
     
   }
      else if(this.currentStep==7){
        if(this.CuentasContables.length==0){
         this.showComponent = true;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Debe ingresar al menos 1 cuenta contable",
            showConfirmButton: false,
            timer: 1500
          });

        }
        else {
          this.currentStep++;
          this.textoInfo='Llegamos a la parte final, la creación de saldos iniciales'
          localStorage.setItem('idMenu', this.currentStep)
          localStorage.setItem('TextoConfigInicial',this.textoInfo)
          this.showText=true
          
          setTimeout(() => {
            this.hideText();
            this.showComponent = true;
          }, 2000);
        }
     
   }





        this.addAnimationIn();
      }, 200);



    }
  }
  
  
  previousStep() {
    if (this.currentStep > 1) {
      this.addAnimationOut();
      setTimeout(() => {
        this.currentStep--;
        localStorage.setItem('idMenu', this.currentStep)
        this.addAnimationIn();
      }, 200);
    }
  }
  
  complete() {

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
          let _RolesEmpresa:any=[]
          _RolesEmpresa=this.Roles.filter((rol:any)=>rol.idEmpresa==this.usuario.idEmpresa)
          localStorage.setItem('AtributosUsuarioFinancial_System', JSON.stringify(_RolesEmpresa[0].Atributos));
          this.router.navigate(['/analytics'])
          localStorage.removeItem("idMenu")
          localStorage.removeItem("TextoConfigInicial")
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
