// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ajuste-saldo',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './ajuste-saldo.component.html',
  styleUrls: ['./ajuste-saldo.component.scss']
})
export default class AjusteSaldoComponent implements OnInit {
MesesTodos: any=[];
Cuentas: any=[];
SaldosIniciales: any=[];
Proyectos: any=[];
usuario:any
Sucursales:any=[]
Valor:FormControl=new FormControl(0)
Anio:FormControl=new FormControl(0)
Mes:FormControl=new FormControl('0')
Semana:FormControl=new FormControl()
Cuenta:FormControl=new FormControl('')
Flujo:FormControl=new FormControl('')
idSucursal:FormControl=new FormControl('')
idProyecto:FormControl=new FormControl('')
Fecha:any= new Date();
idTipoRegistro:number=0

constructor(private conS:ConfigurationService,private datePipe: DatePipe,private toastr: ToastrService){}
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.MesesTodos= [

    {
      Mes: 'Enero',
      NumMes:1,
      seleccionado: false
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      seleccionado: false
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      seleccionado: false
    },
    {
      Mes: 'Abril',
      NumMes:4,
      seleccionado: false
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      seleccionado: false
    },
    {
      Mes: 'Junio',
      NumMes:6,
      seleccionado: false
    },
    {
      Mes: 'Julio',
      NumMes:7,
      seleccionado: false
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      seleccionado: false
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      seleccionado: false
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      seleccionado: false
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      seleccionado: false
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      seleccionado: false
    },
  
  ]
  this.obtenerSucursales()
  this.obtenerProyectos()
  this.obtenerBancos()
  this.obtenerSaldoInicial()
}
getMonthName(Fecha:string){
  return Number((Fecha.substring(5)).substring(0,2))
 }
obtenerBancos(){
  this.conS.obtenerBancos(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Cuentas=resp

  })
}

verifyIdSucursal(){
 
  if(this.idSucursal.value!= '' && this.idSucursal.value!='0'){
      console.log('idSucursal:', this.idSucursal.value);
      this.idProyecto.disable();
      this.idTipoRegistro=1
    }
    else {
      this.idProyecto.enable();
      this.idTipoRegistro=0
    }


}
verifyIdProyecto(){
 
  if(this.idProyecto.value!= '' && this.idProyecto.value!='0'){
      this.idSucursal.disable();
      this.idTipoRegistro=2
    }
    else {
      this.idSucursal.enable();
      this.idTipoRegistro=0
    }


}

obtenerSaldoInicial(){
  this.conS.obtenerSaldoInicial(this.usuario.idEmpresa).subscribe(resp=>{
  this.SaldosIniciales=resp


  })
}

obtenerSucursales(){
  this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe(resp=>{
    this.Sucursales=resp
 
  })
}
obtenerProyectos(){
  this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )
    console.log('Proyectos',this.Proyectos)
 
  })
}

getNameSucursal(idSucursal:any){
  if(idSucursal=='0'){
    return 'General'
  }
  else {
    let sucursal = this.Sucursales.filter((suc: any) => suc.id==idSucursal)
    if(sucursal.length){
      return sucursal[0].Sucursal
    }
    else{
      return 'General'
    }
  }
}

getMes(NumMes:number){
  let _MesEncontrado:any=[]
  _MesEncontrado=this.MesesTodos.filter((mes:any)=>mes.NumMes==NumMes)
  if(_MesEncontrado.length){
    return _MesEncontrado[0].Mes
  }
  else{
    return 0
  }
}
getIdCuenta(Cuenta:string){
  let _CuentaEncontrada:any=[]
  _CuentaEncontrada=this.Cuentas.filter((c:any)=>c.Cuenta==Cuenta)
  if(_CuentaEncontrada.length){
    return _CuentaEncontrada[0].id
  }
  else{
    return '0'
  }
}

guuardarAjuste(){
  if(this.idTipoRegistro==0){
    this.toastr.warning('Debe elegir una sucursal o proyecto', 'Alerta!');
  }
  else {
    let _Ajuste={
      "AnioRegistro":this.Anio.value,
      "FechaRegistro":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
      "MesRegistro":this.getMes(this.Mes.value),
      "NumCuenta":this.Cuenta.value,
      "idCuenta":this.getIdCuenta(this.Cuenta.value),
      "NumMes":Number(this.Mes.value),
      "SemanaNum":this.Semana.value,
      "Valor":this.Valor.value,
      "Flujo":this.Flujo.value,
      "idEmpresa":this.usuario.idEmpresa,
      "TipoRegistro":this.idTipoRegistro,
      "idMatriz":this.usuario.idMatriz,
      "idSucursal":this.idSucursal.value,
      "idProyecto":this.idProyecto.value,
    }
  
    this.conS.crearSaldoInicial(_Ajuste).then(resp=>{
      this.resetCampos()
      this.toastr.success('Saldo editado', '¡Exito!');
    })

  }
}
resetCampos(){
  this.Anio.setValue(0)
  this.Mes.setValue('')
  this.Cuenta.setValue('')
  this.Valor.setValue(0)
  this.Semana.setValue(0)
  this.Flujo.setValue('')
  this.idSucursal.setValue('')

}

toggleEdicion(Saldo: any) {

  Saldo.Editando = !Saldo.Editando;
}

actualizarSaldo(saldo:any){
  let _saldo:any= this.SaldosIniciales;
  const saldoEncontrado = _saldo.filter((banc:any) => banc.id == saldo.id);
  saldoEncontrado[0].Valor=saldo.Valor
  saldoEncontrado[0].NumCuenta=saldo.NumCuenta
  saldoEncontrado[0].NumMes=saldo.NumMes
  saldoEncontrado[0].MesRegistro= this.getMes(saldo.NumMes)
  saldoEncontrado[0].idCuenta=this.getIdCuenta(saldo.NumCuenta)
  saldoEncontrado[0].SemanaNum=saldo.SemanaNum
  saldoEncontrado[0].Editando = !saldo.Editando;

  this.conS.ActualizarSaldo(saldoEncontrado[0]).then(resp=>{
    this.toastr.success('Saldo editado', '¡Exito!');
  })
}
}
