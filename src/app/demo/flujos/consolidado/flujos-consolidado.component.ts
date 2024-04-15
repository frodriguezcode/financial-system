// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-flujo-consolidado',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './flujos-consolidado.component.html',
  styleUrls: ['./flujos-consolidado.component.scss']
})
export default class FlujoConsolidadoComponent implements OnInit {
  constructor(private conS:ConfigurationService ) {}
  Categorias:any=[]
  Items:any=[]
  semanas: any[] = [];
  Meses: any = [];
  Anios: any[] = [];
  usuario:any
  Registros: any[] = [];
  MesesTodos: any=[];
  Cargando:boolean=true;
 ngOnInit(): void {
  this.MesesTodos= [

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
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerCategorias()
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
        "idCategoria":element.idCategoria,
        "idEmpresa":element.idEmpresa,
        "idFlujo":element.idFlujo,
        "idMatriz":element.idMatriz,
        "idSocioNegocio":element.idSocioNegocio,
        "idSucursal":element.idSucursal,
        "NombreElemento":element.Elemento.Nombre || '',
        "NumCuenta":element.Cuenta.Cuenta || '',
        "CategoriaNombre":element.idCategoria.Nombre || '',
        "SocioNegocio":element.idSocioNegocio.Nombre || '',

      }
      this.Registros.push(_Registro)
    })
    console.log('Registros',this.Registros)
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
    console.log('Meses',this.Meses)

    this.Cargando=false
  })
 }
 generarUltimasSeisSemanas(FechaRegistro:any,Fecha:any) {
  const fechaSemana = new Date(FechaRegistro);
    console.log('fechaSemana',fechaSemana.getMonth()+1)
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

getDataItem(NumSemana:any,NombreElemento:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro.NombreElemento==NombreElemento && registro.NumSemana==NumSemana )
  if(_Data.length>0){
    return Number(_Data[0].Valor)
  }
  else {
    return 0
  }
}
getDataCategoria(NumSemana:any,idCategoria:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro.idCategoria.id==idCategoria && registro.NumSemana==NumSemana )

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

obtenerNumeroSemana(fecha: Date): number {
  const inicioAnio = new Date(fecha.getFullYear(), 0, 1);
  const tiempoTranscurrido = fecha.getTime() - inicioAnio.getTime();
  const semana = Math.ceil(tiempoTranscurrido / (7 * 24 * 60 * 60 * 1000));
  return semana;
}
obtenerCategorias(){
this.conS.obtenerCategorias().subscribe((data)=>{
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
