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
  usuario:any
  Registros: any[] = [];
  Cargando:boolean=true;
 ngOnInit(): void {
  this.generarUltimasSeisSemanas();
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerCategorias()
 }
 obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Registros=[]
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
    console.log("Registros", this.Registros)
    this.Cargando=false
  })
 }
 generarUltimasSeisSemanas() {
  const hoy = new Date(); // Fecha actual

  // Iterar retrocediendo 6 semanas desde la fecha actual
  for (let i = 0; i < 6; i++) {
    const fechaSemana = new Date(hoy);
    fechaSemana.setDate(hoy.getDate() - (i * 7)); // Retroceder i semanas

    const numeroSemana = this.obtenerNumeroSemana(fechaSemana);
    let _semana ={
      "Anio":fechaSemana.getFullYear(),
      "Semana":numeroSemana
    }
    this.semanas.push(_semana);
  }

  // Invertir el orden de las semanas para mostrarlas en orden ascendente
  this.semanas.reverse();
  console.log('semanas',this.semanas)
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
  console.log('Categorias',this.Categorias)
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
      console.log('Items',this.Items)
      this. obtenerRegistros()
  })
 }

}
