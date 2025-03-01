// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'consolidado-mejorado-trimestral',
  standalone: true,
  imports: [CommonModule, SharedModule,TableModule,ButtonModule],
  templateUrl: './consolidado-mejorado-trimestral.html',
  styleUrls: ['./consolidado-mejorado-trimestral.scss']
})
export default class ConsolidadoMejoradoTrimesralComponent implements OnInit {
constructor(private conS:ConfigurationService){}
Anios: any[] = [];
AnioSeleccionados: any[] = [];
Trimestres: any[] = [];
Cabecera: any[] = [];
Registros: any[] = [];
Items: any[] = [];
SaldoInicial: any[] = [];
Categorias: any[] = [];
DataTreeTable=[]
usuario:any
cargando:boolean=true
RegistrosSaldosFinalesTrimestrales=[]
TrimestresSeleccionados: any[] = [];
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);

  this.conS.RegistrosTrimestrales$.subscribe((data:any)=>{

  
    console.log('data',data)
    this.Trimestres=data.Trimestres.sort((a:any, b:any) => a.NumTrimestre - b.NumTrimestre)
    this.Anios=data.Anios
    this.Categorias=data.Categorias
    this.Items=data.Items
    this.Registros=data.Registros
    this.SaldoInicial=data.SaldoInicial
    this.construirCabecera()
  })
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
    this.getTrimestresByAnio(anio.Anio).forEach((trim:any) => {
  
        this.Cabecera.push({
          "Nombre":trim.Trimestre + ' - ' + anio.Anio,
          "Trimestre":trim.Trimestre,
          "NumTrimestre":trim.NumTrimestre,
          "Anio":anio.Anio,
          "Tipo":2,
          "Mostrar":true,
          "MostrarBoton":true,
          "MostrarBotonSemanal":true,
          "MostrarBotonMensual":true,
          "MostrarSemanas":true,
        })

    });
    this.Cabecera.push({
      "Nombre":"Total " + anio.Anio,
      "Mes":"",
      "NumMes":"",
      "Anio":anio.Anio,
      "Tipo":3,
      "Mostrar":true,
      "MostrarBoton":true
    })
  });





  console.log('Cabecera',this.Cabecera)
  this.construirData()
 }

construirData(){
  
  let indexCategoria:number=0
  let indexItem:number=0
  this.DataTreeTable=[]
  this.Categorias.forEach(categ => {
    indexCategoria+=1
    let newRow: any = {
      key: `${indexCategoria}`,
      data: {
        id_categoria: categ.id, // O el campo relevante de Categorias
        categoria: categ.Nombre, // O el campo relevante de Categorias
        values: {}, // Aquí guardaremos los valores por mes-año
        children: [],
        tipo:0
      }
    }

    this.Anios.forEach((anio:any) => {
      this.getTrimestresByAnio(anio.Anio).forEach((trim:any) => {
        let key = `${trim.NumTrimestre}-${anio.Anio}`;
        newRow.data.tipo=categ.Tipo
        if(categ.Orden==0) {
          this.RegistrosSaldosFinalesTrimestrales.push({
            "key":key,
            "Anio":anio.Anio,
            "Valor":this.getValorSaldoFinalTrimestral(trim.NumTrimestre,anio.Anio) || 0
          })
          newRow.data.values[key] = this.getSaldoInicialTrimestral(trim.NumTrimestre,anio.Anio) || 0;
         

        }
        else if(categ.Orden==1) {
          newRow.data.values[key] = this.getDataFlujoOperativoTrimestral(trim.NumTrimestre,anio.Anio) || 0;         
        }
        else if(categ.Orden==4) {
          newRow.data.values[key] = this.getDataFlujoInversionTrimestral(trim.NumTrimestre,anio.Anio) || 0;
        }

        else if(categ.Orden==7) {
          newRow.data.values[key] = this.getDataFlujoFinancieroTrimestre(trim.NumTrimestre,anio.Anio) || 0;

        }

        else if(categ.Orden==10) {
          newRow.data.values[key] = this.getDataFlujoLibreTrimestral(trim.NumTrimestre,anio.Anio) || 0;
        }

        else if(categ.Orden==11) {
          newRow.data.values[key] = this.getValorSaldoFinalTrimestral(trim.NumTrimestre,anio.Anio) || 0;
        }

        else {
          newRow.data.values[key] = this.getValorCategoriaTrimestral(categ.id,trim.NumTrimestre,anio.Anio) || 0;
        }

      })

      let key = `${anio.Anio}`;

      if(categ.Orden==0) {
        newRow.data.values[key] = this.obtenerValorSaldoInicialAnual(anio.Anio);
       

      }
      else if(categ.Orden==1) {
        newRow.data.values[key] = this.getDataFlujoOperativoAnual(anio.Anio) || 0;
   

      }
      else if(categ.Orden==4) {
        newRow.data.values[key] = this.getDataFlujoInversionAnual(anio.Anio) || 0;


      }
      else if(categ.Orden==7) {
        newRow.data.values[key] = this.getDataFlujoFinancieroAnual(anio.Anio) || 0;

      }
      else if(categ.Orden==10) {
        newRow.data.values[key] = this.getDataFlujoLibreAnual(anio.Anio) || 0;


      }
      else if(categ.Orden==11) {
        newRow.data.values[key] = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0;
  

      }
      else {
        newRow.data.values[key] = this.getValorCategoriaAnual(categ.id,anio.Anio) || 0;
      }
  
    })

    this.getItems(categ.id).forEach(item => {
      let newItem: any = {
        key: `${indexCategoria}-${indexItem}`,
        data: {
          id_item: item.id, // Nombre del item
          categoria: item.Nombre, // Nombre del item
          values: {}
        }
      };
      this.Anios.forEach((anio:any) => {
        this.getTrimestresByAnio(anio.Anio).forEach((trim:any) => {
          indexItem+=1
          let key = `${trim.NumTrimestre}-${anio.Anio}`;
       
            newItem.data.values[key] = this.getValorItemTrimestral(item.id, trim.NumTrimestre, anio.Anio) || 0;
          
    
        
      })
      let keyAnio = `${anio.Anio}`;
        newItem.data.values[keyAnio] = this.getValorItemAnual(item.id,anio.Anio) || 0;
      })
      newRow.data.children.push(newItem);
    })
  
    this.DataTreeTable.push(newRow)
  })

  console.log('DataTreeTable',this.DataTreeTable)
this.cargando=false
} 

getValorItemTrimestral(idElemento:any,Trim:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
    && registro.Trimestre==Trim
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

getItems(idCategoria:any){
  let _Items:any=[]

  _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria
  && item.idUsuarios.some((user:any) => user == this.usuario.id)

   )
  return _Items
  }

getSaldoInicialTrimestral(NumTrim:any,Anio:any){

  let _Data: any=[];
  let _DataSaldoFinal: any=[];
  _Data=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.Trimestre==NumTrim
  && saldo.AnioRegistro==Anio
  )

  _DataSaldoFinal=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.Trimestre==NumTrim-1
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
    let key=`${NumTrim-1}-${Anio}`
    let ValorSaldo:number=0

    let RSFM=this.RegistrosSaldosFinalesTrimestrales.filter((reg:any)=>reg.key==key)
    let RSFM2=this.RegistrosSaldosFinalesTrimestrales.filter((reg:any)=>reg.Anio==Anio-1)

    if(RSFM.length>0){
      ValorSaldo=RSFM[0].Valor
    }
    else if(RSFM2.length>0) {
      ValorSaldo=RSFM2[RSFM2.length-1].Valor
    }
    else {
      ValorSaldo=0
    }



      return ValorSaldo


  }
}

getValorSaldoFinalTrimestral(NumTrim:any,Anio:any){
  return  this.getSaldoInicialTrimestral(NumTrim,Anio) + 
  this.getDataFlujoLibreTrimestral(NumTrim,Anio)
}

getDataFlujoOperativoTrimestral(NumTrim:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==2
  || registro.idCategoria.Orden==3)
  && registro.Trimestre==NumTrim
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

getDataFlujoInversionTrimestral(NumTrim:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==5
  || registro.idCategoria.Orden==6)
  && registro.Trimestre==NumTrim
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

getDataFlujoFinancieroTrimestre(NumTrim:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==9
  || registro.idCategoria.Orden==8)
  && registro.Trimestre==NumTrim
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
getDataFlujoLibreTrimestral(NumTrim:any,Anio:any){
  return this.getDataFlujoOperativoTrimestral(NumTrim,Anio) 
  + this.getDataFlujoInversionTrimestral(NumTrim,Anio)
  + this.getDataFlujoFinancieroTrimestre(NumTrim,Anio)
}

getTrimestresByAnio(anio:any){
  return this.Trimestres.filter((trim:any)=>trim.Anio==anio)
}

getValorCategoriaTrimestral(idCategoria:any,NumTrim:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria.id==idCategoria
  && registro.Trimestre==NumTrim
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

obtenerValorSaldoInicialAnual(Anio:any){
  let _ValorInicialTrimestral:any=[]
  let _ValorInicialesAnuales:any=[]
  let _SaldosInicialesAnual:any=[]
  _ValorInicialTrimestral=this.SaldoInicial.filter((data:any)=>data.Trimestre==1 && data.Anio==Anio)
  _ValorInicialesAnuales=this.SaldoInicial.filter((data:any)=>data.Anio==Anio)
  _SaldosInicialesAnual=this.SaldoInicial.filter((data:any)=>data.AnioRegistro==Anio)

  if(_ValorInicialTrimestral.length>0){
    let Valor:number=0
    _ValorInicialTrimestral.forEach((data:any)=>{
      Valor+=data.Valor
    })
    return Valor
  }
 else if(_ValorInicialesAnuales.length>0){
    return _ValorInicialesAnuales[0].Valor
  }
 else if(_SaldosInicialesAnual.length>0){
    return _SaldosInicialesAnual[0].Valor
  }
  else {
    let ValorSaldo:number=0
    let RSFM2=this.RegistrosSaldosFinalesTrimestrales.filter((reg:any)=>reg.Anio==Anio-1)
    if(RSFM2.length>0) {
      ValorSaldo=RSFM2[RSFM2.length-1].Valor
    }
    else {
      ValorSaldo=0
    }

    return ValorSaldo
  }
}

getDataFlujoOperativoAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==2
  || registro.idCategoria.Orden==3)
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
  (registro.idCategoria.Orden==5
  || registro.idCategoria.Orden==6)
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
  (registro.idCategoria.Orden==9
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
  + this.getDataFlujoInversionAnual(Anio)
  + this.getDataFlujoFinancieroAnual(Anio)
}

obtenerValorSaldoFinalAnual(Anio:any){
  //   let _ValorFinalMensual:any=[]
  //   _ValorFinalMensual=this.DataSaldoFinalMensual.filter((data:any)=>data.Anio==Anio)
  //   if(_ValorFinalMensual.length>0){
  //     return _ValorFinalMensual[0].Valor
  //   }
  //   else {
  //     return 0
  //   }
   return this.obtenerValorSaldoInicialAnual(Anio) + this.getDataFlujoLibreAnual(Anio) 
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

}
