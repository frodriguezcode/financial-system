// angular import
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-modulo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule,AccordionModule,NgSelectModule],
  templateUrl: './modulo-cuentas-contables.component.html',
  styleUrls: ['./modulo-cuentas-contables.component.scss']
})
export default class ModuloCuentasContableComponent implements OnInit {
  NombreCuentaHijo:FormControl = new FormControl('')
  NombreCuentaNieto:FormControl = new FormControl('')
  Proyectos:any=[]
  ProyectosSeleccionados:any=[]
  Sucursales:any=[]
  SucursalesSeleccionadas:any=[]
  Categorias:any=[]
  CuentasPadres:any=[]
  CuentaPadreSeleccionada:any
  CuentasHijos:any=[]
  CuentasNietos:any=[]
  usuario: any;
  idEmpresa:string=''
  DataCatalogos:any=[]
  OpcionesTipoCuenta:any=[]
  OpcionSeleccionada:any
  cargando:boolean=true
  @ViewChild('InputCuentaHijo', { static: false }) InputCuentaHijo!: ElementRef;
  constructor(
    private datePipe: DatePipe,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
   this.NombreCuentaHijo.disable();
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
    this.CuentaPadreSeleccionada=null
    this.NombreCuentaHijo.setValue('')
   this.NombreCuentaHijo.disable();
      if(this.OpcionSeleccionada==1){
        this.CuentasPadres=this.Categorias.filter((categ:any)=>categ.Tipo==1)
      }
    else if(this.OpcionSeleccionada==2){
        this.CuentasPadres=this.Categorias.filter((categ:any)=>categ.Tipo==2)
      }


     
  }

  focusInput() {
    this.NombreCuentaHijo.enable();
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

    this.cargando=false


  }
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  guardarCuentaHijo(){
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;
    let idsProyectos = this.ProyectosSeleccionados.map((proyect: any) => proyect.id)
    let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)
    console.log('CuentaPadre',this.CuentaPadreSeleccionada)
    console.log('NombreCuentaHijo',this.NombreCuentaHijo)
    let Orden: any = this.CuentasHijos.filter((it: any) => it.idPadre == this.CuentaPadreSeleccionada.id).length;    
    let Item = {
      Activo:true,
      TipoProforma:1,
      Nombre:this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1)+' '+ this.NombreCuentaHijo.value ,
      Prefijo: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1),
      PrefijoPadre: Number(this.CuentaPadreSeleccionada.idCateg),
      PrefijoHijo: Orden + 1,
      CuentaFija:false,
      TipoCuenta:this.OpcionSeleccionada,
      Alias:this.NombreCuentaHijo.value,
      FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
      HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
      Tipo: 'Hijo',
      idPadre:this.CuentaPadreSeleccionada.id,
      idsSucursales: idsSucursales,
      idsProyectos: idsProyectos,
      idAbuelo: this.CuentaPadreSeleccionada.idAbuelo,
      Customizable: true,
      Editable: false,
      Orden: Orden + 1,
      OrdenReal: this.CuentasHijos.length + 1,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz,
      Created_User: this.usuario.id
    };
    console.log('Item',Item)
  }





}
