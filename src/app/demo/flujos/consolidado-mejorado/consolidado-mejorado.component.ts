// angular import
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-consolidado-mejorado',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule,TreeSelectModule],
  templateUrl: './consolidado-mejorado.component.html',
  styleUrls: ['./consolidado-mejorado.component.scss']
})
export default class ConsolidadoMejoradoComponent implements OnInit {
  constructor(
    private conS:ConfigurationService
  ) {}
  Categorias:any=[]
  categoriasExpandidas: { [id: number]: boolean } = {};
  Items:any=[]
  ItemsBack:any=[]
  Registros:any=[]
  RegistrosBackUp:any=[]
  Semanas:any=[]
  SemanasSingle:any=[]
  SemanasSeleccionadas:any=[]
  CatalogoFechas:any=[]
  Meses:any=[]
  MesesSeleccionados:any=[]
  Anios:any=[]
  AniosSeleccionados:any=[]
  Cabecera:any=[]
  CabeceraBack:any=[]
  usuario:any
  cargar:boolean=false
  MostrarTodasSemanas:boolean=false
  //Categorías
  DataCategorias:any=[]
  DataCategoriasMensual:any=[]
  DataCategoriasAnual:any=[]
  //FEO
  DataFEO:any=[]
  DataFEOMensual:any=[]
  DataFEOAnual:any=[]


  //Items
  DataItems:any=[]
  DataItemsMensual:any=[]
  DataItemsAnual:any=[]

  //SaldosIniciales
  SaldoInicial:any=[]
  SaldoInicialBack:any=[]
  DataSaldoInicial:any=[]
  DataSaldoInicialMensual:any=[]
  DataSaldoInicialAnual:any=[]
  DataSaldoFinal:any=[]
  DataSaldoFinalMensual:any=[]
  DataSaldoFinalAnual:any=[]

  Sucursales:any=[]
  SucursalSeleccionada:any=[]
  Proyectos:any=[]
  ProyectoSeleccionado:any=[]

  CuentasBancarias:any=[]
  CuentaBancariaSeleccionada:any=[]
  SemanasTodas:any=[]

  Expandir:boolean=false
  catalogoFechas: any[] = [];
  MaestroSemanasMesAnio:any=[]
  MaestroSeleccionado:any
  ngOnInit(): void {
    this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
   
    this.obtenerSaldoInicial()
    this.obtenerSucursales()
    this.obtenerProyectos()
    this.obtenerBancos()
    this.getCatalogoFechas()

  }

ocultarMostrar(NumMes:any,Anio:any){
  this.Semanas.forEach(semana => {
    if (semana.Mes == NumMes && semana.Anio == Anio) {
      semana.Mostrar = !semana.Mostrar;
    }
  });
  this.Cabecera.forEach(cab => {
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==2)) {
      cab.Mostrar = !cab.Mostrar;
    
    }
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==3)) {
     
      cab.MostrarBotonSemanal = !cab.MostrarBotonSemanal;
    }
  });
 
}
ocultarMostrarMeses(NumMes:any,Anio:any){
  this.Anios.forEach(anio => {

    this.Meses.forEach(mes => {
      if (mes.NumMes == NumMes && anio.Anio == Anio) {
        mes.Mostrar = !mes.Mostrar;
      }
    });
    
  });

  this.Cabecera.forEach(cab => {
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==3)) {
      cab.Mostrar = !cab.Mostrar;

      if(cab.MostrarBotonSemanal==true){

        cab.MostrarBotonSemanal = !cab.MostrarBotonSemanal;
      }
      cab.MostrarSemanas= !cab.MostrarSemanas;
    
    }
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==2)) {
      if(cab.Mostrar==true){

        cab.Mostrar = !cab.Mostrar;
        cab.MostrarBotonMensual = !cab.MostrarBotonMensual;
      }
    }
 
  });

}
  filtrarMeses(numMes:any){
    let _MesEncontrado:any=[]
    _MesEncontrado=this.MesesSeleccionados.filter((mes:any)=>mes.NumMes==numMes)
   
    if(_MesEncontrado.length>0){
      return true
    }
    else {
      return false
    }
  }

  obtenerProyectos(){
    this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
      this.Proyectos=resp
      this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )

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

  getCatalogoFechas(){
    const fechaInicio = '2023-01-01';
    const dias = 365; // Número de días a generar
    let _Semanas:any=[]
    this.catalogoFechas = this.conS.generarCatalogoFechas(fechaInicio);

    let SemanasAgrupadas:any=[]
    SemanasAgrupadas=this.conS.agruparPorAnoMesSemana(this.catalogoFechas);
   
    SemanasAgrupadas.forEach((fecha:any)=>{
      _Semanas.push(
        { 
        NumSemana: fecha.semana, 
        Semana: "Semana " + fecha.semana, 
        SemanaAnio: "Semana " + fecha.semana + ' ' + '(' + fecha.año + ')', 
        Mes:fecha.numeroMes,
        NumMes:fecha.numeroMes,
        MesNombre:fecha.mes,
        Fechas:fecha.fechas,
        Anio:fecha.año
      })
    })
   this.SemanasTodas= this.conS.posicionarSemanas(_Semanas);


   }
   filtrarBySemanas(){
    let SemanasRegistros:any=[]
    let MesesRegistros:any=[]
    let AniosRegistros:any=[]
    let CriteriosRegistros:any=[]
    let CriteriosSaldos:any=[]

    if(this.MaestroSeleccionado.length>0 ){
      let MaestroSelec=this.MaestroSeleccionado.filter(obj => !('expanded' in obj));
        MaestroSelec.forEach((maestro:any) => {
        AniosRegistros.push(maestro.Anio)
        MesesRegistros.push(maestro.parent.data)
        SemanasRegistros.push(maestro.NumSemana)
      
        
      });
    
    }


    CriteriosRegistros={
      NumSemana:SemanasRegistros,
      AnioRegistro:AniosRegistros,
      MesRegistro:MesesRegistros,

    }
    CriteriosSaldos={
      SemanaNum:SemanasRegistros,
      AnioRegistro:AniosRegistros,
      MesRegistro:MesesRegistros,

    }
    this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
    this.SaldoInicial= this.conS.filtradoDinamico(CriteriosSaldos,this.SaldoInicialBack)

   this.construirCabecera()

  }

  filtrarData(){
    let SemanasRegistros:any=[]
    let Cuentas:any=[]
    let CriteriosRegistros:any=[]
    let CriteriosSaldos:any=[]
    let Sucursales:any=[]
    let Proyectos:any=[]

    // if(this.SemanasSeleccionadas.length>0){
    //   this.SemanasSeleccionadas.forEach((element:any) => {
    //     SemanasRegistros.push(element.NumSemana)
    //   });
    // }
    if(this.CuentaBancariaSeleccionada.length>0){
      this.CuentaBancariaSeleccionada.forEach((element:any) => {
        Cuentas.push(element.Cuenta)
      });
    }
    if(this.SucursalSeleccionada.length>0){
      this.SucursalSeleccionada.forEach((element:any) => {
        Sucursales.push(element.id)
      });
    }
    if(this.ProyectoSeleccionado.length>0){
      this.ProyectoSeleccionado.forEach((element:any) => {
        Proyectos.push(element.id)
      });
    }

    CriteriosRegistros={
      NumSemana:SemanasRegistros,
      NumCuenta:Cuentas,
      idProyecto:Proyectos,
      idSucursal:Sucursales

    }
    CriteriosSaldos={
      SemanaNum:SemanasRegistros,
      NumCuenta:Cuentas,
      idProyecto:Proyectos,
      idSucursal:Sucursales

    }
    this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
    this.SaldoInicial= this.conS.filtradoDinamico(CriteriosSaldos,this.SaldoInicialBack)

   this.construirCabecera()

  
  }

  obtenerSucursales(){
    this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.Sucursales=resp
    })
  }
  obtenerBancos(){
    this.conS.obtenerBancos( this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.CuentasBancarias=resp
      this.CuentasBancarias.map((c:any)=> c.CuentaNombre= c.Nombre + ' - ' + c.Cuenta)


    })
  }
  obtenerSaldoInicial(){
    this.conS.obtenerSaldoInicial( this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.SaldoInicial=resp
      this.SaldoInicialBack=resp

      this.obtenerCategorias()
    })
  }

  obtenerCategorias(){
    this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
      // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
      this.Categorias=[]
     this.Categorias.push(
      {
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Saldo Inicial en Bancos",
      "Orden":0,
      "Suma":false,
      "Tipo":0,
      "id":0,
    })
      data.forEach(categoria => {
        let _Categ={
          "Calculado":categoria.Calculado,
          "Mostrar":categoria.Mostrar,
          "Nombre":categoria.Nombre,
          "Orden":categoria.Orden,
          "Suma":categoria.Suma,
          "Tipo":categoria.Tipo,
          "id":categoria.id,
        }
        this.Categorias.push(_Categ)

        if(categoria.Orden==9){
          this.Categorias.push(
            {
            "Calculado":true,
            "Mostrar":true,
            "Nombre":"Saldo Final en Bancos",
            "Orden":11,
            "Suma":false,
            "Tipo":11,
            "id":11,
          })
        }
      })


   
    
      this.Categorias.forEach(element => {
        this.categoriasExpandidas[element.id]=true
        
      });
      this.obtenerItems()
    })
  }
  toggleCategoria(id: number) {

    this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
  }
  expandirTodo(){
    this.Expandir=!this.Expandir
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=false
      
    });
  }
  contraerTodo(){
    this.Expandir=!this.Expandir
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=true
      
    });
  }
  
obtenerItems(){
      this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
        this.Items=[]
          this.Items=resp;
          this.ItemsBack=resp;
      
         this.obtenerRegistros()
      })
}

filtrarCuentas(TipoRubro:any){

  if(TipoRubro==1){

    if( this.SucursalSeleccionada.length==0){
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro)
    }
    else {
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro
      &&  item.Sucursales.some(sucursal=>this.SucursalSeleccionada.some(sucursalSelect=>sucursalSelect.id==sucursal.id))
      )

    }
    
  }
  else {
    if( this.ProyectoSeleccionado.length==0){
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro)
    }
    else {

      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro
      &&   this.ProyectoSeleccionado.some((proy: any) => proy.id === item.Proyecto.id)
      )
    }
  }


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
            "Tipo":element.Tipo || '',
            "idCategoria":element.idCategoria,
            "idEmpresa":element.idEmpresa,
            "idFlujo":element.idFlujo,
            "idUsuario":element.idUsuario,
            "idMatriz":element.idMatriz,
            "idSocioNegocio":element.idSocioNegocio,
            "idSucursal":element.idSucursal,
            "idProyecto":element.idProyecto,
            "NombreElemento":element.Elemento.label || '',
            "idElemento":element.Elemento.id || '',
            "NumCuenta":element.Cuenta.Cuenta || '',
            "CategoriaNombre":element.idCategoria.Nombre || '',
            "SocioNegocio":element.idSocioNegocio.Nombre || '',
    
          }
          this.Registros.push(_Registro)
          });
          this.RegistrosBackUp=this.Registros
       
          const uniqueMesNumMesSet = new Set(this.Registros.map(item => JSON.stringify({ Mes: item.MesRegistro, NumMes: item.NumMes})));
          this.SaldoInicial.forEach(item => {
            JSON.stringify({ Mes: item.MesRegistro, NumMes: Number(item.NumMes) })
          });
          const uniqueMesNumMes = Array.from(uniqueMesNumMesSet).map((item:any) => JSON.parse(item));

          const uniqueNumSemanaSet = new Set(this.Registros.map(item => JSON.stringify({ 
            NumSemana: item.NumSemana,
            Semana: "Semana " + item.NumSemana, 
            SemanaAnio: "Semana " + item.NumSemana + ' ' + '(' + item.AnioRegistro + ')', 
            Mes:item.NumMes,
         
            Anio:item.AnioRegistro  })));
          this.SaldoInicial.forEach(item => {
            uniqueNumSemanaSet.add(JSON.stringify({ NumSemana: item.SemanaNum, 
              Semana: "Semana " + item.SemanaNum, 
            
              SemanaAnio: "Semana " + item.SemanaNum + ' ' + '(' + item.AnioRegistro + ')', 
              Mes:Number(item.NumMes),Anio:item.AnioRegistro }));
          });         
          const uniqueNumSemana = Array.from(uniqueNumSemanaSet).map((item:any) => JSON.parse(item));


          const uniqueAniosSet = new Set(this.Registros.map(item => JSON.stringify({ Anio: item.AnioRegistro})));
          this.SaldoInicial.forEach(item => {
            uniqueAniosSet.add(JSON.stringify({Anio:item.AnioRegistro }));
          });   
          const uniqueAnios= Array.from(uniqueAniosSet).map((item:any) => JSON.parse(item));
     

          const semanasIdentificadas = this.conS.posicionarSemanas(uniqueNumSemana);
          //this.Semanas=uniqueNumSemana.sort((a:any, b:any) => a.NumSemana- b.NumSemana)
          this.Semanas=semanasIdentificadas
          this.Semanas.map((sem:any)=>{sem.Mostrar=true,sem.MostrarBoton=true})
          
          this.Meses=uniqueMesNumMes.sort((a:any, b:any) => a.NumMes- b.NumMes)
          this.Anios=uniqueAnios.sort((a:any, b:any) => a.Anio- b.Anio)
          this.Anios.map((anio:any)=>{anio.Mostrar=true,anio.MostrarBoton=true})
          this.Meses.map((mes:any)=>{mes.Mostrar=true,mes.MostrarBoton=true})

          this.MesesSeleccionados=this.Meses
    
     
          

          this.construirCabecera()
});
}

getSemanas(Anio:any,Mes:any){
  let semanas: any= [];
  this.Semanas.filter((sem:any)=>sem.Mes==Mes && sem.Anio==Anio).forEach((semana:any) => {
    semanas.push({ 
      key: '0-0-0'+semana.NumSemana, 
      label: semana.Semana, 
      Mes:semana.Mes,
      Anio:semana.Anio,
      posicion:semana.posicion,
      NumSemana:semana.NumSemana,
      icon: 'pi pi-calendar', 
      data: semana.Semana },)
  });

  return semanas.sort((a:any, b:any) => a.NumSemana - b.NumSemana)

}

VerTodasSemanas(){
  this.MostrarTodasSemanas=!this.MostrarTodasSemanas

  this.construirCabecera()
}
getSemanasByMesAnio(Anio:any,NumMes:any){

  return this.Semanas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)

   // return this.SemanasTodas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)
  



  
}

getValorSaldoInicial(NumSemana:any,Mes:any,Anio:any,Posicion:any){
if(Posicion==0 || Posicion==1){
  let _Data: any=[];
  _Data=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.SemanaNum==NumSemana
  && saldo.NumMes==Mes
  && saldo.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    let UltimaSemana:any=[]
    if(Mes==1){
      UltimaSemana= this.getSemanasByMesAnio(Anio-1,12).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

    }
    else{
      UltimaSemana= this.getSemanasByMesAnio(Anio,(Mes-1)).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

    }
  
    if(UltimaSemana.length>0){
      return this.getValorSaldoFinal(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes,UltimaSemana[0].Anio,UltimaSemana[0].posicion)
  
    }
    else {
      return 0
    }


   
  }

}
else if (Posicion == 2) {
  let DataSaldoFinal:any=[]
  let Valor:any
  DataSaldoFinal=this.DataSaldoFinal.filter((saldo:any)=>saldo.Mes==Mes && saldo.Anio==Anio && saldo.NumSemana==NumSemana - 1)
  if (DataSaldoFinal.length >= 1) {
   Valor=DataSaldoFinal[0].Valor
  } else {
    Valor= 0; // Condición de terminación cuando NumSemana es menor o igual a 1
  }
  return Valor
} else {
  let DataSaldoFinal:any=[]
  let Valor:any
  DataSaldoFinal=this.DataSaldoFinal.filter((saldo:any)=>saldo.Mes==Mes && saldo.Anio==Anio && saldo.NumSemana==NumSemana - 1)
  if (DataSaldoFinal.length >= 1) {
   Valor=DataSaldoFinal[0].Valor
  } else {
    Valor= 0; // Condición de terminación cuando NumSemana es menor o igual a 1
  }
  return Valor
}


}

getValorSaldoFinal(NumSemana:any,Mes:any,Anio:any,Posicion:any){

  return  this.getValorSaldoInicial(NumSemana,Mes,Anio,Posicion) + this.getDataFlujoLibre(NumSemana,Mes,Anio)

}
getSaldoInicialMensual(Mes:any,Anio:any){
  let UltimaSemana:any=[]
  UltimaSemana= this.getSemanasByMesAnio(Anio,Mes).filter((sem:any)=>(sem.posicion==0 || sem.posicion==1))

  if(UltimaSemana.length>0){
    return this.getValorSaldoInicial(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes,UltimaSemana[0].Anio,UltimaSemana[0].posicion)

  }
  else {
    return 0
  }
}
getSaldoFinalMensual(Mes:any,Anio:any){
  let UltimaSemana:any=[]
  UltimaSemana= this.getSemanasByMesAnio(Anio,Mes).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

  if(UltimaSemana.length>0){
    return this.getValorSaldoFinal(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes,UltimaSemana[0].Anio,UltimaSemana[0].posicion)

  }
  else {
    return 0
  }
}

getValorCategoria(idCategoria:any,NumSemana:any,Mes:any,Anio:any){
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

getValorCategoriaMensual(idCategoria:any,Mes:any,Anio:any){
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
getValorCategoriaAnual(idCategoria:any,Anio:any){
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

getDataCategorias(){
this.DataCategorias=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
      this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${categ.id}-${sem.NumSemana}`;  //2023-2-kndkfdnfjk-7
        if (!this.DataCategorias[key]) {
          this.DataCategorias[key] =[];
        }
        if(categ.Orden==0) {
          
          this.DataCategorias[key].push({
            "Valor": this.obtenerValorSaldoInicial(sem.NumSemana,mes.NumMes,anio.Anio)
  
          });
        }
     else if(categ.Orden==3) {
          
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoOperativo(sem.NumSemana,mes.NumMes,anio.Anio)
  
          });
        }
      else if(categ.Orden==6) {   
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoInversion(sem.NumSemana,mes.NumMes,anio.Anio)
  
          });
        }
      else if(categ.Orden==9) {         
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoFinanciero(sem.NumSemana,mes.NumMes,anio.Anio)
          });
        }
      else if(categ.Orden==10) {     
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoLibre(sem.NumSemana,mes.NumMes,anio.Anio)
  
          });
        }
      else if(categ.Orden==11) {     
          this.DataCategorias[key].push({
            "Valor": this.obtenerValorSaldoFinal(sem.NumSemana,mes.NumMes,anio.Anio)
  
          });
        }
        else {
          this.DataCategorias[key].push({
            "Valor": this.getValorCategoria(categ.id,sem.NumSemana,mes.NumMes,anio.Anio) 
          });
          
        }

        })
      })
    })
  
});

this.getDataItems()
this.getDataItemMensual()
this.getDataItemAnual()
}


getDataCategoriasMensual(){
  this.DataCategoriasMensual=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${categ.id}`;  
        if (!this.DataCategoriasMensual[key]) {
          this.DataCategoriasMensual[key] =[];
        }
        
        if(categ.Orden==0) {
          this.DataCategoriasMensual[key].push({
            "Valor": this.obtenerValorSaldoInicialMensual(mes.NumMes,anio.Anio)
          });
        }

      else if(categ.Orden==3) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio)
  
          });
      }
      else if(categ.Orden==6) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio)
  
          });
      }
      else if(categ.Orden==9) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)
  
          });
      }

      else  if(categ.Orden==11) {
          this.DataCategoriasMensual[key].push({
            "Valor": this.obtenerValorSaldoFinalMensual(mes.NumMes,anio.Anio)
          });
        }
        else {
          this.DataCategoriasMensual[key].push({
            "Valor": this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)
  
          });

        }

       
      })
    })
  
});

}
getDataCategoriasAnual(){
  this.DataCategoriasAnual=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
        const key = `${anio.Anio}-${categ.id}`;  
        if (!this.DataCategoriasAnual[key]) {
          this.DataCategoriasAnual[key] =[];
        }
        this.DataCategoriasAnual[key].push({
          "Valor": this.getValorCategoriaAnual(categ.id,anio.Anio)

        });

       
    
    })
  
});

}

getValorItem(idElemento:any,NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
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
getValorItemMensual(idElemento:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
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

getValorItemAnual(idElemento:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
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
getDataItemMensual(){
this.DataItemsMensual=[]
this.Items.forEach((item:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${item.id}`;  
        if (!this.DataItemsMensual[key]) {
          this.DataItemsMensual[key] =[];
        }
        this.DataItemsMensual[key].push({
          "Valor": this.getValorItemMensual(item.id,mes.NumMes,anio.Anio)

        });

       
      })
    })
  
});
}

getDataItemAnual(){
  this.DataItemsAnual=[]
  this.Items.forEach((item:any) => {
    this.Anios.forEach((anio:any) => {
          const key = `${anio.Anio}-${item.id}`;  
          if (!this.DataItemsAnual[key]) {
            this.DataItemsAnual[key] =[];
          }
          this.DataItemsAnual[key].push({
            "Valor": this.getValorItemAnual(item.id,anio.Anio)
          });
      }) 
  });

  this.cargar=true
  }

getDataItems(){
  this.DataItems=[]
  this.Items.forEach((item:any) => {
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
        this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
          const key = `${anio.Anio}-${mes.NumMes}-${item.id}-${sem.NumSemana}`;  
          if (!this.DataItems[key]) {
            this.DataItems[key] =[];
          }
          this.DataItems[key].push({
            "Valor": this.getValorItem(item.id,sem.NumSemana,mes.NumMes,anio.Anio)
  
          });
  
          })
        })
      })
    
  });

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

getDataFlujoLibre(NumSemana:any,Mes:any,Anio:any){
return this.getDataFlujoOperativo(NumSemana,Mes,Anio) 
+ this.getDataFlujoInversion(NumSemana,Mes,Anio)
+ this.getDataFlujoFinanciero(NumSemana,Mes,Anio)
}
getDataFlujoLibreMensual(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensual(Mes,Anio) 
  + this.getDataFlujoInversionMensual(Mes,Anio)
  + this.getDataFlujoFinancieroMensual(Mes,Anio)
  }


   construirCabecera(){

    this.Cabecera=[]
    this.Cabecera.push({
      "Nombre":"Concepto",
      "Mes":"",
      "NumMes":"",
      "Anio":"",
      "Tipo":1,
      "Mostrar":true,
      "MostrarBoton":true
    })
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
        this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
          this.Cabecera.push({
            "Nombre":sem.Semana + ' '+ mes.Mes + ' ' + anio.Anio,
            "Mes":mes.Mes,
            "NumMes":mes.NumMes,
            "Anio":anio.Anio,
            "Tipo":2,
            "NumSemana":sem.NumSemana,
            "Mostrar":true,
            "MostrarBoton":true
            
          
          })
          
        });
        if(this.getSemanasByMesAnio(anio.Anio,mes.NumMes).length>0){
          this.Cabecera.push({
            "Nombre":"Total "+ mes.Mes + ' ' + anio.Anio,
            "Mes":mes.Mes,
            "NumMes":mes.NumMes,
            "Anio":anio.Anio,
            "Tipo":3,
            "Mostrar":true,
            "MostrarBoton":true,
            "MostrarBotonSemanal":true,
            "MostrarBotonMensual":true,
            "MostrarSemanas":true,
          })

        }
      });
      this.Cabecera.push({
        "Nombre":"Total " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Tipo":4,
        "Mostrar":true,
        "MostrarBoton":true
      })
    });

    this.CabeceraBack=this.Cabecera
 
    this.DataSaldoInicial=[]
    this.DataSaldoFinal=[]
    this.DataSaldoInicialMensual=[]
    this.DataSaldoFinalMensual=[]
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
        this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
          let _SemanaDataInicial:any=[]
          _SemanaDataInicial=this.DataSaldoInicial.filter((data:any)=>data.NumSemana==sem.NumSemana && data.Anio==anio.Anio && data.Mes==sem.Mes)
          if(_SemanaDataInicial.length==0){
            this.DataSaldoInicial.push({
              "NumSemana":sem.NumSemana,
              "Mes":sem.Mes,
              "Anio":sem.Anio,
              "Valor":this.getValorSaldoInicial(sem.NumSemana,sem.Mes,anio.Anio,sem.posicion)
  
            })

          }
          let _SemanaDataFinal:any=[]
          _SemanaDataFinal=this.DataSaldoFinal.filter((data:any)=>data.NumSemana==sem.NumSemana && data.Anio==anio.Anio && data.Mes==sem.Mes)
          if(_SemanaDataFinal.length==0){
            this.DataSaldoFinal.push({
              "NumSemana":sem.NumSemana,
              "Mes":sem.Mes,
              "Anio":sem.Anio,
              "Valor":this.getValorSaldoFinal(sem.NumSemana,sem.Mes,anio.Anio,sem.posicion)
  
            })

          }
        })  
        //DataMensual
        let _MesDataInicial:any=[]
        _MesDataInicial=this.DataSaldoInicialMensual.filter((data:any)=>data.Anio==anio.Anio && data.Mes==mes.NumMes)
        if(_MesDataInicial.length==0){
          this.DataSaldoInicialMensual.push({
            "Mes":mes.NumMes,
            "Anio":anio.Anio,
            "Valor":this.getSaldoInicialMensual(mes.NumMes,anio.Anio)

          })

        }    

        let _MesDataFinal:any=[]
        _MesDataFinal=this.DataSaldoFinalMensual.filter((data:any)=>data.Anio==anio.Anio && data.Mes==mes.NumMes)
        if(_MesDataFinal.length==0){
          this.DataSaldoFinalMensual.push({
            "Mes":mes.NumMes,
            "Anio":anio.Anio,
            "Valor":this.getSaldoFinalMensual(mes.NumMes,anio.Anio)

          })

        }    


      })      
    })      
    this.getDataCategorias()
    this.getDataCategoriasMensual()
    this.getDataCategoriasAnual()
  
   }
   getItems(idCategoria:any){
    let _Items:any=[]

    _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria)
    return _Items
    }

obtenerValorSaldoInicial(NumSemana:any,Mes:any,Anio:any){
let _ValorInicial:any=[]
_ValorInicial=this.DataSaldoInicial.filter((data:any)=>data.NumSemana==NumSemana && data.Mes==Mes && data.Anio==Anio)
if(_ValorInicial.length>0){
  return _ValorInicial[0].Valor
}
else {
  return 0
}
}
obtenerValorSaldoFinal(NumSemana:any,Mes:any,Anio:any){
let _ValorFinal:any=[]
_ValorFinal=this.DataSaldoFinal.filter((data:any)=>data.NumSemana==NumSemana && data.Mes==Mes && data.Anio==Anio)
if(_ValorFinal.length>0){
  return _ValorFinal[0].Valor
}
else {
  return 0
}
}

obtenerValorSaldoInicialMensual(Mes:any,Anio:any){
  let _ValorInicialMensual:any=[]
  _ValorInicialMensual=this.DataSaldoInicialMensual.filter((data:any)=>data.Mes==Mes && data.Anio==Anio)
  if(_ValorInicialMensual.length>0){
    return _ValorInicialMensual[0].Valor
  }
  else {
    return 0
  }
}
obtenerValorSaldoFinalMensual(Mes:any,Anio:any){
  let _ValorFinalMensual:any=[]
  _ValorFinalMensual=this.DataSaldoFinalMensual.filter((data:any)=>data.Mes==Mes && data.Anio==Anio)
  if(_ValorFinalMensual.length>0){
    return _ValorFinalMensual[0].Valor
  }
  else {
    return 0
  }
}

}
