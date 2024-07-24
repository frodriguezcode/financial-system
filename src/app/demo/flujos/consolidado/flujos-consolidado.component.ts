// angular import
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MultiSelectModule } from 'primeng/multiselect';

import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-flujo-consolidado',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule, CheckboxModule],
  templateUrl: './flujos-consolidado.component.html',
  styleUrls: ['./flujos-consolidado.component.scss']
})
export default class FlujoConsolidadoComponent implements OnInit {
  constructor(
    private conS:ConfigurationService, 
    private cdr: ChangeDetectorRef,
    private authS:AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  Categorias:any=[]
  Items:any=[]
  semanas: any[] = [];
  Meses: any = [];

  MesesSeleccionados: any = [];
  Anios: any[] = [];
  AniosSelect: any[] = [];
  AniosRegistros: any[] = [];
  AniosRegistrosBack: any[] = [];
  usuario:any
  Registros: any[] = [];
  RegistrosBack: any[] = [];
  MesesTodos: any=[];
  MesesRegistros: any=[];
  MesesRegistrosBack: any=[];
  Semanas: any=[];
  CuentasBanco:any=[]
  CuentasBancoSelect:any=[]
  Sucursales:any=[]
  SucursalesSelect:any=[]
  Usuarios:any=[]
  UsuariosSelect:any=[]
  SaldoFinalBySemana:any
  SaldoFinalByMensual:any
  Cargando:boolean=true;
  SelectMes:boolean=false;
  Criterios:any={}
  categoriasExpandidas: { [id: number]: boolean } = {};
  days: string[];
  //SaldosIniciales
  SaldoInicial:any=[]
  SaldoInicialBack:any=[]

  SaldosSemanales:any=[]
  SaldosSemanalesBack:any=[]
  SemanasHeader:any=[];

  mostrarSoloTotales: boolean = false;

 ngOnInit(): void {
  if(this.authS.validarAtributo('vTMvQD4PmBQn4fXS2h0P',[])==true){

 
  
  }
  else {
    this.router.navigate(['/registros']) 
    this.toastr.warning('', '¡Acceso Denegado!',{
      timeOut: 1000,
    });
}

  this.conS.getDaysOfMonth('Europe/London').subscribe((data: any) => {
    // Supongamos que data contiene un campo 'days' con los días del mes
    this.days = data.days;
  });


  this.Anios=[2023,2024]
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
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerSaldoInicial()
  this.obtenerUsuarios()
  this.obtenerSucursales()
  this.ObtenerCuentasBanco()
  this.obtenerCategorias()

 }
 toggleCategoria(id: number) {
  this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
}

filtrarData(){
  let Anios:any=[]
  let Meses:any=[]
  let Cuentas:any=[]
  let Usuarios:any=[]
  let Sucursales:any=[]


  if(this.MesesSeleccionados.length>0){
    this.MesesSeleccionados.forEach((element:any) => {
      Meses.push(element.Mes)
    });
    this.MesesRegistros=this.MesesSeleccionados
  
  }
  else {
    this.MesesRegistros=this.MesesRegistrosBack
  }
  if(this.AniosSelect.length>0){
    this.AniosSelect.forEach((element:any) => {
      Anios.push(element.Anio)
    });
    this.AniosRegistros=this.AniosSelect
  }
  else {
    this.Anios=this.AniosRegistrosBack
  }
  if(this.CuentasBancoSelect.length>0){
    this.CuentasBancoSelect.forEach((element:any) => {
      Cuentas.push(element.Cuenta)
    });
  }
  if(this.UsuariosSelect.length>0){
    this.UsuariosSelect.forEach((element:any) => {
      Usuarios.push(element.Usuario)
    });
  }
  if(this.SucursalesSelect.length>0){
    this.SucursalesSelect.forEach((element:any) => {
      Sucursales.push(element.id)
    });
  }


  this.Criterios=
  {
    MesRegistro: Meses ,
    AnioRegistro:Anios,
    NumCuenta: Cuentas,
    Usuario:Usuarios,
    idSucursal: Sucursales,

  }
  this.Registros= this.conS.filtradoDinamico(this.Criterios,this.RegistrosBack)

  this.SaldoInicial= this.conS.filtradoDinamico(this.Criterios,this.SaldoInicialBack)
  this.refreshSaldosSemanales();

  this.cdr.detectChanges();
}

refreshSaldosSemanales(){
  this.SaldosSemanales=[]
  this.SemanasHeader.forEach((element:any) => {
    let _ValoresSemana:any={
      "Semana":"Semana " + element.Semana,
      "NumSemana":element.Semana,
      "NumMes":element.NumMes,
      "Mes":element.Mes,
      "Anio":element.Anio,
      "Posicion":element.Posicion,
      "SaldoInicial":this.getSaldoInicial(element.Semana,element.NumMes,element.Anio),
      "SaldoFinal":this.getSaldoFinal(element.Semana,element.NumMes,element.Anio),
      "NumCuenta":this.getNumCuenta(element.Anio,element.NumMes,element.Semana)
    }
    let _ValorSemana:any=[]
    _ValorSemana=this.SaldosSemanales.filter((data:any)=>data.NumSemana==element.NumSemana 
    && data.NumMes==element.NumMes
    && element.Anio==data.Anio 
  )
  if(_ValorSemana.length==0){
    this.SaldosSemanales.push(_ValoresSemana)
  }
  });
}

 buscarPorCuentaBanco(){
  this.Registros=this.RegistrosBack
  if(this.CuentasBancoSelect.length>0){
    this.Registros= this.Registros.filter((reg:any)=>this.CuentasBancoSelect.some((cuenta: any) => cuenta.Cuenta == reg.Cuenta.Cuenta))
  }
  else {
    this.Registros=this.RegistrosBack
  }
 }
 buscarPorUsuario(){
  this.Registros=this.RegistrosBack

  if(this.UsuariosSelect.length>0){
    this.Registros= this.Registros.filter((reg:any)=>this.UsuariosSelect.some((user: any) => user.id == reg.idUsuario))
  }
  else {
    this.Registros=this.RegistrosBack
  }
 }
filterMeses(){
  if(this.MesesSeleccionados.length>0){
    this.MesesRegistros=this.MesesSeleccionados

  }
  else {
    this.MesesRegistros = this.MesesRegistrosBack
  }

}
filterAnios(){
  if(this.AniosSelect.length>0){
    this.AniosRegistros=this.AniosSelect

  }
  else {
    this.AniosRegistros = this.AniosRegistrosBack
  }


}

toggleMostrarSoloTotales() {
  this.mostrarSoloTotales = !this.mostrarSoloTotales;
  
}

 getMonthName(Fecha:string){
  return Number((Fecha.substring(5)).substring(0,2))
 }
 groupWeeksByMonth(semanas: any[]): any[] {
  const groupedByMonth:any = {};
  semanas.forEach(semana => {
    const key = semana.Mes;
    if (!groupedByMonth[key]) {
      groupedByMonth[key] = [];
    }
    groupedByMonth[key].push(semana);
  });
  return groupedByMonth;
}

obtenerRegistrosFacturas(){
  this.conS.obtenerRegistrosFacturas(this.usuario.idEmpresa).subscribe((resp:any)=>{
 
    resp.sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
      let _Registro={
        "Activo":element.Activo,
        "AnioRegistro":element.AnioRegistro,
        "Cuenta":element.Cuenta,
        "Editando":element.Editando,
        "Elemento":element.Elemento,
        "FechaRegistro":element.FechaRegistro,
        "MesRegistro":element.MesRegistro,
        "Nuevo":element.Nuevo,
        "NumMes":element.NumMes,
        "NumSemana":element.NumSemana,
        "Orden":element.Orden,
        "Semana":element.Semana,
        "Valor":element.Valor,
        "id":element.id,
        "Tipo":element.Tipo || '',
        "idCategoria":element.idCategoria,
        "idEmpresa":element.idEmpresa,
        "idFlujo":element.idFlujo,
        "idUsuario":element.idUsuario,
        "idMatriz":element.idMatriz,
        "idSocioNegocio":element.idSocioNegocio,
        "idSucursal":element.idSucursal,
        "NombreElemento":element.Elemento.label || '',
        "NumCuenta":element.Cuenta.Cuenta || '',
        "CategoriaNombre":element.idCategoria.Nombre || '',
        "SocioNegocio":element.idSocioNegocio.Nombre || '',

      }

      this.Registros.push(_Registro)
    })

  })
}

 obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    let _SemanaEncontrada:any=[]
    let MesEncontrado:any=[]
    let anioEncontrado:any=[]
    this.Registros=[]  
    resp.sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
      const FechaRegistro = new Date(element.FechaRegistro);
      this.generarUltimasSeisSemanas(FechaRegistro,element.FechaRegistro)
      let _Registro={
        "Activo":element.Activo,
        "AnioRegistro":element.AnioRegistro,
        "Cuenta":element.Cuenta,
        "Editando":element.Editando,
        "Elemento":element.Elemento,
        "FechaRegistro":element.FechaRegistro,
        "MesRegistro":element.MesRegistro,
        "Nuevo":element.Nuevo,
        "NumMes":element.NumMes,
        "NumSemana":element.NumSemana,
        "Orden":element.Orden,
        "Semana":element.Semana,
        "Valor":element.Valor,
        "id":element.id,
        "Tipo":element.Tipo || '',
        "idCategoria":element.idCategoria,
        "idEmpresa":element.idEmpresa,
        "idFlujo":element.idFlujo,
        "idUsuario":element.idUsuario,
        "idMatriz":element.idMatriz,
        "idSocioNegocio":element.idSocioNegocio,
        "idSucursal":element.idSucursal,
        "NombreElemento":element.Elemento.label || '',
        "idElemento":element.Elemento.id || '',
        "NumCuenta":element.Cuenta.Cuenta || '',
        "CategoriaNombre":element.idCategoria.Nombre || '',
        "SocioNegocio":element.idSocioNegocio.Nombre || '',

      }
      this.Registros.push(_Registro)
      //Semanas
      _SemanaEncontrada=this.Semanas
      .filter((sem:any)=>
      sem.NumSemana==element.NumSemana && 
      sem.NumMes==element.NumMes &&
      sem.Anio==element.AnioRegistro
    )
    if(_SemanaEncontrada.length==0){

      let _Semana={
      "Semana":element.Semana,
      "NumSemana":element.NumSemana,
      "NumMes":element.NumMes,
      "Anio":element.AnioRegistro,
      "Mes":element.MesRegistro

      }
      this.Semanas.push(_Semana);
    }
      //Meses
      MesEncontrado=this.MesesRegistros
      .filter((mes:any)=>
        mes.NumMes==element.NumMes &&
      mes.Anio==element.AnioRegistro
    )
    if(MesEncontrado.length==0){

      let _Mes={
      "NumMes":element.NumMes,
      "Anio":element.AnioRegistro,
      "Mes":element.MesRegistro

      }
      this.MesesRegistros.push(_Mes);
    
    }
      //Años
      anioEncontrado=this.AniosRegistros
      .filter((anio:any)=>
      anio.Anio==element.AnioRegistro
    )
    if(anioEncontrado.length==0){

      let _Anio={

      "Anio":element.AnioRegistro,


      }
      this.AniosRegistros.push(_Anio);
    }

    })
    
    this.Semanas=this.conS.ordenarSemanas(this.Semanas)
    this.MesesRegistros=this.conS.ordenarMeses(this.MesesRegistros)
    this.MesesRegistrosBack=this.conS.ordenarMeses(this.MesesRegistros)
    this.Anios=this.conS.ordenarAnios(this.AniosRegistros)
    this.AniosRegistrosBack=this.conS.ordenarAnios(this.AniosRegistros)

    

    // this.MesesRegistrosBack=this.MesesRegistros
    // this.AniosRegistros=this.AniosRegistrosBack
    
    
  
   
    let MesesEncontrados:any=[]
    let _MesEncontrado:any=[]
    this.Registros.forEach((registro:any) => {
      _MesEncontrado=MesesEncontrados.filter((mes:any)=>mes.NumMes==registro.NumMes)
      if( _MesEncontrado.length==0 ){
        let _Mes ={
          "Mes": registro.MesRegistro,
          "NumMes":registro.NumMes,
        }
        MesesEncontrados.push(_Mes)
      }

    })
    this.Meses=MesesEncontrados.sort((a:any, b:any) => b.NumMes - a.NumMes)
    this.semanas.reverse();

    this.RegistrosBack=this.Registros


const semanasIdentificadas = this.conS.identificarSemanas(this.Semanas);

this.SemanasHeader=semanasIdentificadas
this.SemanasHeader.forEach((element:any) => {
  let _ValoresSemana:any={
    "Semana":"Semana " + element.Semana,
    "NumSemana":element.Semana,
    "NumMes":element.NumMes,
    "Mes":element.Mes,
    "Anio":element.Anio,
    "Posicion":element.Posicion,
    "SaldoInicial":this.getSaldoInicial(element.Semana,element.NumMes,element.Anio),
    "SaldoFinal":this.getSaldoFinal(element.Semana,element.NumMes,element.Anio),
    "NumCuenta":this.getNumCuenta(element.Anio,element.NumMes,element.Semana)
  }
  let _ValorSemana:any=[]
  _ValorSemana=this.SaldosSemanales.filter((data:any)=>data.NumSemana==element.NumSemana 
  && data.NumMes==element.NumMes
  && element.Anio==data.Anio 
)
if(_ValorSemana.length==0){
  this.SaldosSemanales.push(_ValoresSemana)
}

});
    this.Cargando=false
  })
 }

 getNumCuenta(AnioRegistro:any,NumMes:any,SemanaNum:any){
  let CuentaEncontrada:any=[]
  CuentaEncontrada=this.SaldoInicial.filter((saldo:any)=>saldo.AnioRegistro==AnioRegistro && saldo.NumMes==NumMes && saldo.SemanaNum==SemanaNum)
  if(CuentaEncontrada.length>0){
    return CuentaEncontrada[0].NumCuenta
  }
  else {
    return 0
  }
 }

//  getSaldoInicial(NumSemana:number,NumMes:number,Anio:number){
//   let _ValorSemana:any=[]
//   let Valor:number=0
//   _ValorSemana=this.SaldoInicial.filter((data:any)=>data.SemanaNum==NumSemana && data.NumMes==NumMes && data.AnioRegistro==Anio)
// if(_ValorSemana.length>0){
//   _ValorSemana.forEach((dataValor:any) => {
//     Valor+=dataValor.Valor
//   });
// }
// else {
//   Valor=this.SaldoFinalBySemana
  
// }
// return Valor
//  }


getSaldoInicial(NumSemana: number, NumMes: number, Anio: number): number {
  let _ValorSemana: any[] = [];
  let Valor: number = 0; // Valor predeterminado

  // Asegúrate de que this.SaldoInicial sea un array válido
  if (Array.isArray(this.SaldoInicial)) {
    _ValorSemana = this.SaldoInicial.filter((data: any) => data.SemanaNum == NumSemana && data.NumMes == NumMes && data.AnioRegistro == Anio);
  }

  if (_ValorSemana.length > 0) {
    _ValorSemana.forEach((dataValor: any) => {
      Valor += dataValor.Valor;
    });
  } else {
    // Verifica que this.SaldoFinalBySemana tenga un valor válido
    if (typeof this.SaldoFinalBySemana === 'number') {
      Valor = this.SaldoFinalBySemana;
    } else {
      // Si this.SaldoFinalBySemana no es un número, establece un valor predeterminado
      Valor = 0;
    }
  }

  return Valor;
}


 getSaldoFinal(NumSemana:number,NumMes:number,Anio:number){
  let Valor:number=0
  Valor=this.getSaldoInicial(NumSemana,NumMes,Anio) + this.getDataFlujoLibre(NumSemana,NumMes,Anio)
  this.SaldoFinalBySemana=Valor
  return Valor
 }

// getSaldoInicialMensual(NumMes:number,Anio:number){
//   let _ValorSemana:any=[]
//   let Valor:number=0
//   _ValorSemana=this.SaldoInicial.filter((data:any)=> data.NumMes==NumMes && data.AnioRegistro==Anio)
// if(_ValorSemana.length>0){
//   _ValorSemana.forEach((dataValor:any) => {
//     Valor+=dataValor.Valor
//   });
// }
// else {
//   let _ValorMensual:any=[]
//   _ValorMensual=this.SaldosSemanales.filter((data:any)=>data.NumMes==NumMes && data.Anio==Anio && data.Posicion=='Inicial' )



//   Valor=_ValorMensual[0].SaldoInicial
// }
// return Valor
//  }

getSaldoInicialMensual(NumMes: number, Anio: number): number {
  let _ValorSemana: any[] = [];
  let Valor: number = 0; // Valor predeterminado

  // Asegúrate de que this.SaldoInicial sea un array válido
  if (Array.isArray(this.SaldoInicial)) {
    _ValorSemana = this.SaldoInicial.filter((data: any) => data.NumMes == NumMes && data.AnioRegistro == Anio);
  }

  if (_ValorSemana.length > 0) {
    _ValorSemana.forEach((dataValor: any) => {
      Valor += dataValor.Valor;
    });
  } else {
    let _ValorMensual: any[] = [];
    
    // Asegúrate de que this.SaldosSemanales sea un array válido
    if (Array.isArray(this.SaldosSemanales)) {
      _ValorMensual = this.SaldosSemanales.filter((data: any) => data.NumMes == NumMes && data.Anio == Anio && data.Posicion == 'Inicial');
    }

    if (_ValorMensual.length > 0) {
      Valor = _ValorMensual[0].SaldoInicial;
    } else {
      // Si no se encuentra un valor válido, establece un valor predeterminado
      Valor = 0;
    }
  }

  return Valor;
}



 getSaldoFinalMensual(NumMes:number,Anio:number){
  let Valor:number=0
  Valor=this.getSaldoInicialMensual(NumMes,Anio) + this.getDataFlujoLibreMensual(NumMes,Anio)
  this.SaldoFinalByMensual=Valor
  return Valor
 }



 getSemanasByMonth(NumMes:any,Anio:any){

  let _SemanasMes:any=[];
  _SemanasMes=this.SaldosSemanales
  .filter((sem:any)=>
  sem.NumMes==NumMes && 
  sem.Anio==Anio
)

if(_SemanasMes.length>0){
  return _SemanasMes
}
else {
  return []
}
 }
 generarUltimasSeisSemanas(FechaRegistro:any,Fecha:any) {
  const fechaSemana = new Date(FechaRegistro);
 
     // Retroceder i semanas
   let _SemanaEncontrada: any=[]
   const numeroSemana = this.obtenerNumeroSemana(fechaSemana);
   _SemanaEncontrada=this.semanas.filter( (semana:any) => semana.Semana==numeroSemana)
   if(_SemanaEncontrada.length==0){
     let _semana ={
       "Anio":fechaSemana.getFullYear(),
       "Semana":numeroSemana,
       "NumMes":this.getMonthName(Fecha),
       "Mes":this.MesesTodos[this.getMonthName(Fecha)].Mes,
     }
   this.semanas.push(_semana);


   }


}




getDataItem(NumSemana:any,NombreElemento:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.NombreElemento==NombreElemento 
    && registro.NumSemana==NumSemana 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Number(Valor)
  }
  else {
    return 0
  }
}
getDataMensualItem(NombreElemento:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.NombreElemento==NombreElemento 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
    if(_Data.length>0){
      _Data.forEach((element:any) => {
        Valor+=Number(element.Valor);
      });
      if(_Data[0].Tipo=='Egreso')
        {
          Valor=Valor*-1;
        }
        
      return Number(Valor)
    }
    else {
      return 0
    }
}
getDataAnualItem(NombreElemento:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.NombreElemento==NombreElemento 
    && registro.AnioRegistro==Anio
    )
    if(_Data.length>0){
      _Data.forEach((element:any) => {
        Valor+=Number(element.Valor);
      });
      if(_Data[0].Tipo=='Egreso')
        {
          Valor=Valor*-1;
        }
        
      return Number(Valor)
    }
    else {
      return 0
    }
}
getDataCategoria(NumSemana:any,idCategoria:any,Mes:any,Anio:any,Orden:any){
  if(Orden==3){

   return this.getDataFlujoOperativo(NumSemana,Mes,Anio)
  }
  else if(Orden==6){

   return this.getDataFlujoInversion(NumSemana,Mes,Anio)
  }
  else if(Orden==9){

   return this.getDataFlujoFinanciero(NumSemana,Mes,Anio)
  }
 
  else {
    let _Data: any=[];
    _Data=this.Registros.filter((registro:any)=>registro
    .idCategoria.id==idCategoria
    && registro.NumSemana==NumSemana
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
    if(_Data.length>0){
      let Valor:number=0
      _Data.forEach((data:any) => {
          Valor+=Number(data.Valor)
      });
      if(_Data[0].Tipo=='Egreso')
        {
          Valor=Valor*-1;
        }
      return Valor
    }
    else {
      return 0
    }

  }
}

getDataFlujoOperativo(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==2
  || registro.idCategoria.Orden==1)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoInversion(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==4
  || registro.idCategoria.Orden==5)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoFinanciero(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==7
  || registro.idCategoria.Orden==8)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoLibre(NumSemana:any,Mes:any,Anio:any){
return this.getDataFlujoOperativo(NumSemana,Mes,Anio) 
+ this.getDataFlujoInversion(NumSemana,Mes,Anio)
+ this.getDataFlujoFinanciero(NumSemana,Mes,Anio)
}

getDataMensualCategoria(idCategoria:any,Mes:any,Anio:any,Orden:any){
  if(Orden==3){

    return this.getDataFlujoOperativoMensual(Mes,Anio)
  }
  else if(Orden==6){

    return this.getDataFlujoInversionMensual(Mes,Anio)
  }
  else if(Orden==9){

    return this.getDataFlujoFinancieroMensual(Mes,Anio)
  }
   else {
     let _Data: any=[];
     _Data=this.Registros.filter((registro:any)=>registro
     .idCategoria.id==idCategoria
     && registro.NumMes==Mes
     && registro.AnioRegistro==Anio
     )
     if(_Data.length>0){
       let Valor:number=0
       _Data.forEach((data:any) => {
           Valor+=Number(data.Valor)
       });
       if(_Data[0].Tipo=='Egreso')
         {
           Valor=Valor*-1;
         }
       return Valor
     }
     else {
       return 0
     }


   }
}

getDataFlujoOperativoMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==2
  || registro.idCategoria.Orden==1)
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoInversionMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==4
  || registro.idCategoria.Orden==5)
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoFinancieroMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==7
  || registro.idCategoria.Orden==8)
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoLibreMensual(Mes:any,Anio:any){

  return this.getDataFlujoOperativoMensual(Mes,Anio) 
  + this.getDataFlujoInversionMensual(Mes,Anio)
  + this.getDataFlujoFinancieroMensual(Mes,Anio)
  }
  
  SeleccionarMes(){
    this.SelectMes=!this.SelectMes
  }

  
getDataAnualCategoria(idCategoria:any,Anio:any,Orden:any){
  if(Orden==3){

    return this.getDataFlujoOperativoAnual(Anio)
   }
 else if(Orden==6){

    return this.getDataFlujoInversionAnual(Anio)
   }
 else if(Orden==9){

    return this.getDataFlujoInversionAnual(Anio)
   }
   else {
     let _Data: any=[];
     _Data=this.Registros.filter((registro:any)=>registro
     .idCategoria.id==idCategoria
     && registro.AnioRegistro==Anio
     )
   
     if(_Data.length>0){
       let Valor:number=0
       _Data.forEach((data:any) => {
           Valor+=Number(data.Valor)
       });
       if(_Data[0].Tipo=='Egreso')
         {
           Valor=Valor*-1;
         }
       return Valor
     }
     else {
       return 0
     }


   }
}

getDataFlujoOperativoAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==2
  || registro.idCategoria.Orden==1)
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoFinancieroAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==4
  || registro.idCategoria.Orden==5)
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoInversionAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==7
  || registro.idCategoria.Orden==8)
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoLibreAnual(Anio:any){
  return this.getDataFlujoOperativoAnual(Anio) 
  + this.getDataFlujoFinancieroAnual(Anio)
  + this.getDataFlujoInversionAnual(Anio)
  }

obtenerNumeroSemana(fecha: Date): number {
  const inicioAnio = new Date(fecha.getFullYear(), 0, 1);
  const tiempoTranscurrido = fecha.getTime() - inicioAnio.getTime();
  const semana = Math.ceil(tiempoTranscurrido / (7 * 24 * 60 * 60 * 1000));
  return semana;
}

ObtenerCuentasBanco(){
  this.conS.obtenerBancos(this.usuario.idEmpresa).subscribe(resp=>{
  this.CuentasBanco=resp
  })
}
obtenerSucursales(){
  this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe(resp=>{
  this.Sucursales=resp
  })
}
obtenerUsuarios(){
  this.conS.obtenerUsuarios(this.usuario.idEmpresa).subscribe(resp=>{
  this.Usuarios=resp
  })
}
obtenerSaldoInicial(){
  this.conS.obtenerSaldoInicial(this.usuario.idEmpresa).subscribe(resp=>{
  this.SaldoInicial=resp
  this.SaldoInicialBack=resp

  })
}
//ValoresSaldos





formatValue(valor: number): string {
  return "$ " + valor.toString();
}



obtenerCategorias(){
this.conS.obtenerCategoriasFlujos().subscribe((data)=>{
  // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
  this.Categorias=data


this.Categorias.forEach(categoria => {
  this.toggleCategoria(categoria.id)
});

  this.obtenerItems()

})
 }

 getItems(idCategoria:any){
 let _Items:any=[]
 _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria)
 return _Items
 }

 obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
      this.Items=resp;


      this.obtenerRegistros()
  })
 }

}
