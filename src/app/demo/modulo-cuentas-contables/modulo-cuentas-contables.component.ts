// angular import
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modulo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule,AccordionModule,NgSelectModule],
  templateUrl: './modulo-cuentas-contables.component.html',
  styleUrls: ['./modulo-cuentas-contables.component.scss']
})
export default class ModuloCuentasContableComponent implements OnInit {
  Proyectos:any=[]
  ProyectosSeleccionados:any=[]
  Sucursales:any=[]
  SucursalesSeleccionadas:any=[]
  Categorias:any=[]
  CuentasPadres:any=[]
  CuentaPadreSeleccionada:any=[]
  CuentasHijos:any=[]
  CuentasNietos:any=[]
  usuario: any;
  idEmpresa:string=''
  DataCatalogos:any=[]
  OpcionesTipoCuenta:any=[]
  OpcionSeleccionada:any
  @ViewChild('InputCuentaHijo', { static: false }) InputCuentaHijo!: ElementRef;
  constructor(
    private datePipe: DatePipe,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.OpcionesTipoCuenta=
    [
      {
        "Nombre":'Ingreso',
        "id":1,
        "Seleccionado":true
      },
      {
        "Nombre":'Egreso',
        "id":2,
        "Seleccionado":false
      },
    ]
  this.conS.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      } else {
        this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }

   
        this.idEmpresa = this.usuario.idEmpresa;
      

      this.getCatalogos()


    });
  }

  getCatalogos(){
    this.conS.obtenerDataCatalogosEmpresa(this.usuario.idMatriz).subscribe((data:any)=>{
      this.DataCatalogos=data
      this.construirData()
    })
  }

  getCuentasPadres(){
      if(this.OpcionSeleccionada==1){
        this.CuentasPadres=this.Categorias.filter((categ:any)=>categ.Tipo==1)
      }
    else if(this.OpcionSeleccionada==2){
        this.CuentasPadres=this.Categorias.filter((categ:any)=>categ.Tipo==2)
      }


     
  }

  focusInput() {
  setTimeout(() => {
    if (this.InputCuentaHijo?.nativeElement) {
      this.InputCuentaHijo.nativeElement.focus();
    }
  });
}

  construirData(){
    let DataEmpresa=this.DataCatalogos.filter((data:any)=>data.idEmpresa==this.idEmpresa)[0]
    console.log('DataEmpresa',DataEmpresa)
    this.Categorias=DataEmpresa.Categorias
    this.Proyectos=DataEmpresa.Proyectos
    this.Sucursales=DataEmpresa.Sucursales
    this.CuentasHijos=DataEmpresa._CuentasContables
    this.CuentasHijos.forEach((cuenta:any) => {
      cuenta.CuentasNieto.forEach((cuentaNieto:any) => {
        this.CuentasNietos.push(cuentaNieto)
        
      });

    });

  console.log('Proyectos',this.Proyectos)
  console.log('Sucursales',this.Sucursales)
  }


}
