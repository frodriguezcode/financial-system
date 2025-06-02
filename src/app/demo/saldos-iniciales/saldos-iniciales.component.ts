// angular import
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-saldos-iniciales',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule],
  templateUrl: './saldos-iniciales.component.html',
  styleUrls: ['./saldos-iniciales.component.scss']
})
export default class SaldosInicialesComponent implements OnInit {
idEmpresaCreada: string = '';
cargando:boolean=true
@Input() empresaID:string=''
@Output() saldoInicialCreado = new EventEmitter<any>();
SaldosIniciales:any=[]
usuario:any
idEmpresa:string=''
SaldoInicialValor:FormControl=new FormControl(0)
AnioSaldoInicial:FormControl=new FormControl(0)
Sucursales: any = [];
SucursalesSeleccionadas: any = [];
Proyectos: any = [];
ProyectosSeleccionados: any = [];
Meses:any=[]
MesSeleccionado:any
Fecha:any= new Date();
constructor( 
private datePipe: DatePipe,private conS:ConfigurationService,   
    private toastr: ToastrService,
    private authS: AuthService){}
ngOnInit(): void {
  this.Meses= [
    {
      Mes: 'Enero',
      id:1,
      seleccionado: false
    },
    {
      Mes: 'Febrero',
      id:2,
      seleccionado: false
    },
    {
      Mes: 'Marzo',
      id:3,
      seleccionado: false
    },
    {
      Mes: 'Abril',
      id:4,
      seleccionado: false
    },
    {
      Mes: 'Mayo',
      id:5,
      seleccionado: false
    },
    {
      Mes: 'Junio',
      id:6,
      seleccionado: false
    },
    {
      Mes: 'Julio',
      id:7,
      seleccionado: false
    },
    {
      Mes: 'Agosto',
      id:8,
      seleccionado: false
    },
    {
      Mes: 'Septiembre',
      id:9,
      seleccionado: false
    },
    {
      Mes: 'Octubre',
      id:10,
      seleccionado: false
    },
    {
      Mes: 'Noviembre',
      id:11,
      seleccionado: false
    },
    {
      Mes: 'Diciembre',
      id:12,
      seleccionado: false
    },
  
  ]  
    this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    if(this.empresaID!=''){
        this.idEmpresa=this.empresaID
    }

    else {
        this.idEmpresa=this.usuario.idEmpresa
    }
    this.obtenerSucursales()
    })
}

getSaldosIniciales(){
  let Subscribe:Subscription
   Subscribe= this.conS.obtenerSaldoInicial(this.idEmpresa).subscribe(resp=>{
   Subscribe.unsubscribe()
    this.SaldosIniciales=resp
    this.SaldosIniciales.map((saldo:any)=>saldo.NombreProyectos=
    this.getProyectosNombresBySaldo(saldo.idProyecto)).ProyectosNombres
    this.SaldosIniciales.map((saldo:any)=>saldo.NombreSucursales=
    this.getSucursalesNombresBySaldo(saldo.idSucursal)).SucursalesNombres
    this.cargando=false
    console.log('SaldosIniciales',this.SaldosIniciales)
  })
}
obtenerSucursales(){
  let Subscribe:Subscription
   Subscribe= this.conS.obtenerSucursales(this.idEmpresa).subscribe(resp=>{
   Subscribe.unsubscribe()
    this.Sucursales=resp
    this.obtenerProyectos()
  })
}
obtenerProyectos(){
  let Subscribe:Subscription
   Subscribe= this.conS.obtenerProyectos(this.idEmpresa).subscribe(resp=>{
   Subscribe.unsubscribe()
    this.Proyectos=resp
    this.getSaldosIniciales()
  })
}

getProyectosNombresBySaldo(idProyectos:any){
  let ProyectosEncontrados = []
  ProyectosEncontrados= this.Proyectos.filter(proyecto =>
  idProyectos.includes(proyecto.id))
  let ProyectosNombres=ProyectosEncontrados.map(proyect => proyect.Nombre + " ")
  return ProyectosNombres.length==0 ? 'No tiene proyectos asignados':ProyectosNombres
}
getSucursalesNombresBySaldo(idSucursales:any){
  let SucursalesEncontradas = []
  SucursalesEncontradas= this.Sucursales.filter(sucursal =>
  idSucursales.includes(sucursal.id))
  let SucursalesNombres=SucursalesEncontradas.map(sucursal => sucursal.Nombre + " ")
  return SucursalesNombres.length==0 ? 'No tiene sucursales asignadas': SucursalesNombres
}
 getMonthNumber(MesNombre:string){
  return this.Meses.filter((mes:any)=>mes.Mes==MesNombre)[0].id
 }
crearSaldoInicial(){
  let Fecha=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
  let SaldoInicial={
  "AnioRegistro":this.AnioSaldoInicial.value,
  "Editando":false,
  "FechaRegistro":Fecha,
  "MesRegistro":this.MesSeleccionado,
  "NumMes":this.getMonthNumber(this.MesSeleccionado),
  "Valor":this.SaldoInicialValor.value,
  "idEmpresa":this.idEmpresa,
  "idMatriz":this.usuario.idMatriz,
  "idProyecto":this.ProyectosSeleccionados.map(proyecto => proyecto.id) || [],
  "idSucursal":this.SucursalesSeleccionadas.map(sucursal => sucursal.id) || []
  }
  this.conS.crearSaldoInicial(SaldoInicial).then(resp=>{
    this.saldoInicialCreado.emit(SaldoInicial);
    this.SaldosIniciales.push(SaldoInicial)
    this.SaldosIniciales.map((saldo:any)=>saldo.NombreProyectos=
    this.getProyectosNombresBySaldo(saldo.idProyecto)).ProyectosNombres
    this.SaldosIniciales.map((saldo:any)=>saldo.NombreSucursales=
    this.getSucursalesNombresBySaldo(saldo.idSucursal)).SucursalesNombres
    this.toastr.success('Saldo Inicial', '¡Exito!');
  })
}

}
