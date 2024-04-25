// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-flujo-consolidado',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule],
  templateUrl: './flujos-consolidado.component.html',
  styleUrls: ['./flujos-consolidado.component.scss']
})
export default class FlujoConsolidadoComponent implements OnInit {
  constructor(private conS:ConfigurationService ) {}
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
  Usuarios:any=[]
  UsuariosSelect:any=[]
  Cargando:boolean=true;
 ngOnInit(): void {
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
  this.obtenerUsuarios()
  this.ObtenerCuentasBanco()
  this.obtenerCategorias()
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
  console.log('UsuariosSelect',this.UsuariosSelect)
  console.log('Registros',this.Registros)
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
  console.log('MesesSeleccionados',this.MesesSeleccionados)

}
filterAnios(){
  if(this.AniosSelect.length>0){
    this.AniosRegistros=this.AniosSelect

  }
  else {
    this.AniosRegistros = this.AniosRegistrosBack
  }
  console.log('MesesSeleccionados',this.MesesSeleccionados)

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
 obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Registros=[]   
    let _SemanaEncontrada:any=[]
    let MesEncontrado:any=[]
    let anioEncontrado:any=[]
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
    this.Cargando=false
  })
 }

 getSemanasByMonth(NumMes:any,Anio:any){
  let _SemanasMes:any=[];
  _SemanasMes=this.Semanas
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
getDataCategoria(NumSemana:any,idCategoria:any,Mes:any,Anio:any){
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
getDataMensualCategoria(idCategoria:any,Mes:any,Anio:any){
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
getDataAnualCategoria(idCategoria:any,Anio:any){
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
obtenerUsuarios(){
  this.conS.obtenerUsuarios(this.usuario.idEmpresa).subscribe(resp=>{
  this.Usuarios=resp
  })
}
obtenerCategorias(){
this.conS.obtenerCategoriasFlujos().subscribe((data)=>{
  // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
  this.Categorias=data

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
      this. obtenerRegistros()
  })
 }

}
