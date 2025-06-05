// angular import
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
@Component({
  selector: 'consolidado-mejorado-trimestral',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule,
    TableModule,
    ButtonModule,
    TreeTableModule,
    ],
  templateUrl: './consolidado-mejorado-trimestral.html',
  styleUrls: ['./consolidado-mejorado-trimestral.scss']
})
export default class ConsolidadoMejoradoTrimesralComponent implements OnInit {
constructor(private conS:ConfigurationService){}
@ViewChild('dt') table: Table; 
Anios: any[] = [];
AnioSeleccionados: any[] = [];
Trimestres: any[] = [];
Meses: any[] = [];
Cabecera: any[] = [];
Registros: any[] = [];
Items: any[] = [];
SaldoInicial: any[] = [];
Categorias: any[] = [];
DataTreeTableTrimestral=[]
DataTreeTable=[]
usuario:any
cargando:boolean=true
RegistrosSaldosFinalesTrimestrales=[]
TrimestresSeleccionados: any[] = [];
ExpandirCuentas:boolean=false
Expandir:boolean=false
cargar:boolean=true
maxCategoryLength: number = 0;

ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.Anios=[
    {Anio:2023,
    Mostrar: true
    },
    {Anio:2024,
    Mostrar: true

    },
    {Anio:2025,
    Mostrar: true

    },
  ]
  this.Meses= [
    {
      Mes: 'Enero',
      NumMes:1,
      Trimestre:1,
      seleccionado: false
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      Trimestre:1,
      seleccionado: false
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      Trimestre:1,
      seleccionado: false
    },
    {
      Mes: 'Abril',
      NumMes:4,
      Trimestre:2,
      seleccionado: false
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      Trimestre:2,
      seleccionado: false
    },
    {
      Mes: 'Junio',
      NumMes:6,
      Trimestre:2,
      seleccionado: false
    },
    {
      Mes: 'Julio',
      NumMes:7,
      Trimestre:3,
      seleccionado: false
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      Trimestre:3,
      seleccionado: false
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      Trimestre:3,
      seleccionado: false
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      Trimestre:4,
      seleccionado: false
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      Trimestre:4,
      seleccionado: false
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      Trimestre:4,
      seleccionado: false
    },
  
  ]
  this.Trimestres=[
  {
        Trimestre:"Trimestre 1",
        Nombre:"Trimestre 1",
        id:1
  },
  {
    Trimestre:"Trimestre 2",
    Nombre:"Trimestre 2",
    id:2
  },
  {
    Trimestre:"Trimestre 3",
    Nombre:"Trimestre 3",
    id:3
  },
  {
    Trimestre:"Trimestre 4",
    Nombre:"Trimestre 4",
    id:4
  }
  ]
  this.construirCabecera()
  this.conS.RegistrosTrimestrales$.subscribe((data:any)=>{
    this.DataTreeTable=data.DataTreeTable
    this.Categorias=data.Categorias
    this.Items=data.Items
    this.DataTreeTableTrimestral=[]
    this.Categorias.forEach(categ => {
    this.DataTreeTableTrimestral.push({
      data: { 
         Nombre: categ.Nombre, 
         size: '200mb', 
         type: 'Folder',
         valores: {},
         idCategoria:categ.id,
         orden:categ.Orden,
         tipo: 
         (categ.Orden == 1 || categ.Orden == 4 || categ.Orden == 7 || categ.Orden == 10 ) ?'Abuelo' :
         (categ.Orden == 0 ) ?'Saldo Inicial' :
         (categ.Orden == 11 ) ?'Saldo Final' 
         :'Padre'
         },
      children:
      
      this.getItemsByCategoria(categ.id)
  
    })
  
    
    
    
    
  })
  this.construirValores()
  
  this.maxCategoryLength = this.findLongestCategory();

  })

}

  getItemsByCategoria(idCategoria:string){
    let Item=this.Items.filter((it:any)=>it.idPadre==idCategoria)
    let ItemsEncontrados:any=[]
    if(Item.length>0){
      let data:any
      Item.forEach((item:any)=>{
        ItemsEncontrados.push(
          {
         data:{
           Nombre: item.Nombre, 
           idItem: item.id,
           size: '200mb', 
           type: 'Folder',
           orden:item.Orden,
           tipo:'Hijo',
           valores: {},
         },
          children: item.CuentasHijos === undefined ? [] : item.CuentasHijos.map(hijo => ({
            data:{
            ...hijo,
              valores: {},
              tipo:'Nieto',
              Orden:hijo.Orden
            }  
          }))
      });
      })
      return ItemsEncontrados
    }
    else {
      return []
    } 


  }


findLongestCategory(): number {
  let maxLen = 0;
  // Recorre las filas principales
  for (const row of this.DataTreeTable) {
    const text = row.data.categoria || '';
    if (text.length > maxLen) {
      maxLen = text.length;
    }
    // Recorre los children
    if (row.data.children) {
      for (const child of row.data.children) {
        const childText = child.data.categoria || '';
        if (childText.length > maxLen) {
          maxLen = childText.length;
        }
      }
    }
  }
  return maxLen;
}

/**
 * Convierte la longitud de texto en px 
 * (aprox. 7px por carácter, puedes ajustar).
 */
calcColumnWidthPx(): number {
  const factor = 7; // ~7px por carácter
  return this.maxCategoryLength * factor;
}

construirCabecera(){

  this.Cabecera=[]
  let AniosCabecera=this.AnioSeleccionados.length>0 ? this.AnioSeleccionados:this.Anios
  let Trimestres=this.TrimestresSeleccionados.length>0 ? this.TrimestresSeleccionados:this.Trimestres
  
  AniosCabecera.forEach((anio:any) => {
    Trimestres.forEach((trim:any) => {
  
        this.Cabecera.push({
          "Nombre":trim.Trimestre + ' - ' + anio.Anio,
          "Trimestre":trim.Trimestre,
          "NumTrimestre":trim.id,
          "Anio":anio.Anio,
          "Tipo":3
        })

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
    this.Cabecera.push({
      "Nombre":"Promedio",
      "Mes":"",
      "NumMes":"",
      "Anio":anio.Anio,
      "Tipo":5,
      "Mostrar":true,
      "MostrarBoton":true
    })
  });

 }

 toggleAllRows() {
  if (this.table) {
    // Si hay filas expandidas, contraerlas todas
    if (Object.keys(this.table.expandedRowKeys).length > 0) {
      this.ExpandirCuentas=false
      this.table.expandedRowKeys = {}; // Contraer todas las filas
    } else {
      // Expandir todas las filas
      const expandedKeys = {};
      this.table.value.forEach((row) => {
        expandedKeys[row.key] = true; // Marcar todas las filas como expandidas
      });
      this.table.expandedRowKeys = expandedKeys;
      this.ExpandirCuentas=true
    }
  }
}
getMesesByTrimestre(idTrimestre:any){
  return this.Meses.filter((mes:any)=>mes.Trimestre==idTrimestre)
}
construirValores(){
  let AniosCabecera=this.AnioSeleccionados.length>0 ? this.AnioSeleccionados:this.Anios
  let Trimestres=this.TrimestresSeleccionados.length>0 ? this.TrimestresSeleccionados:this.Trimestres   
  this.DataTreeTableTrimestral.forEach(dataTree => {
    if (dataTree.data.valores !== undefined) {
      dataTree.data.valores = {};

    AniosCabecera.forEach(anio => {
      let totalAnual = 0;
      let PromedioTrimestral = 0;
      const claveAnual= `${dataTree.data.idCategoria}-${anio.Anio}`;
      const claveTrimestralPromedio= `Prom-${dataTree.data.idCategoria}-${anio.Anio}`;
        Trimestres.forEach(trim => {
          const claveTrimestral = `${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
        if(dataTree.data.tipo=='Saldo Inicial'){
 
          this.DataTreeTable[1].data.valores[`0-1-${anio.Anio}`]?.ValorNumero
            let valor = 0

            if(trim.id==1){
              valor=this.DataTreeTable[0].data.valores[`0-1-${anio.Anio}`]?.ValorNumero || 0
            
            }
            else if(trim.id==2){
              valor=this.DataTreeTable[0].data.valores[`0-4-${anio.Anio}`]?.ValorNumero || 0
            }
            else if(trim.id==3){
              valor=this.DataTreeTable[0].data.valores[`0-7-${anio.Anio}`]?.ValorNumero || 0
            }
            else if(trim.id==4){
              valor=this.DataTreeTable[0].data.valores[`0-10-${anio.Anio}`]?.ValorNumero || 0
            }
            
            dataTree.data.valores[claveTrimestral] = 
            {
              "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              "ValorNumero": valor,
              "Color": valor<0 ? '#ff3200': '#000000',
            }
            
            totalAnual=this.DataTreeTable[0].data.valores[`0-${anio.Anio}`]?.ValorNumero || 0
            dataTree.data.valores[claveAnual] = 
             {
             "Valor": totalAnual<0 ? ('-$'+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": totalAnual,
             "Color": totalAnual<0 ? '#ff3200': '#000000',
             }

             
            PromedioTrimestral=Number((totalAnual/3).toFixed(0))
            dataTree.data.valores[claveTrimestralPromedio] = 
             {
             "Valor": PromedioTrimestral<0 ? ('-$'+ (PromedioTrimestral*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (PromedioTrimestral)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": PromedioTrimestral,
             "Color": PromedioTrimestral<0 ? '#ff3200': '#000000',
             }

           
        }
        else if(dataTree.data.tipo=='Saldo Final'){
            let valor = 0
            let valorAnual = 0
            let valorPromedio = 0
            
           valor+=
           this.DataTreeTableTrimestral[0].data.valores[`0-${trim.id}-${anio.Anio}`]?.ValorNumero || 0 +
           this.DataTreeTableTrimestral[1].data.valores[`EESGPM4hWXvDlXSRnCwA-${trim.id}-${anio.Anio}`]?.ValorNumero || 0 +
           this.DataTreeTableTrimestral[4].data.valores[`GMzSuF04XQBsPmAkIB2C-${trim.id}-${anio.Anio}`]?.ValorNumero || 0 +
           this.DataTreeTableTrimestral[7].data.valores[`psmpY6iyDJNkW7AKFXgK-${trim.id}-${anio.Anio}`]?.ValorNumero

            dataTree.data.valores[claveTrimestral] = 
              {
             "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valor,
             "Color": valor<0 ? '#ff3200': '#000000',
              }

            valorAnual=this.DataTreeTableTrimestral[11].data.valores[`11-4-${anio.Anio}`]?.ValorNumero || 0    
            dataTree.data.valores[claveAnual] = 
            {
            "Valor": valorAnual<0 ? ('-$'+ (valorAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": valorAnual,
            "Color": valorAnual<0 ? '#ff3200': '#000000',
            }


           valorPromedio=
           this.DataTreeTableTrimestral[0].data.valores[`Prom-0-${anio.Anio}`]?.ValorNumero+
           this.DataTreeTableTrimestral[1].data.valores[`Prom-EESGPM4hWXvDlXSRnCwA-${anio.Anio}`]?.ValorNumero || 0+
           this.DataTreeTableTrimestral[4].data.valores[`Prom-GMzSuF04XQBsPmAkIB2C-${anio.Anio}`]?.ValorNumero || 0 +
           this.DataTreeTableTrimestral[7].data.valores[`Prom-psmpY6iyDJNkW7AKFXgK-${anio.Anio}`]?.ValorNumero
            
           dataTree.data.valores[claveTrimestralPromedio] = 
            {
            "Valor": Number((valorPromedio).toFixed(0))<0 ? ('-$'+ (Number((valorPromedio).toFixed(0))*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (Number((valorPromedio).toFixed(0)))).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": Number((valorPromedio).toFixed(0)),
            "Color": Number((valorPromedio).toFixed(0))<0 ? '#ff3200': '#000000',
            }

           
          }

        if(dataTree.data.tipo=='Abuelo'){
            let valor = 0
            let valorPromedioTrimestral = 0
            this.getMesesByTrimestre(trim.id).forEach((mes:any)=>{
            valor+=
            this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
            })  

            //Trimestre
            dataTree.data.valores[claveTrimestral] = 
            {
             "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valor,
             "Color": valor<0 ? '#ff3200': '#000000',
            }

            //Anual
            totalAnual += valor;
            dataTree.data.valores[claveAnual] =
            {
            "Valor": totalAnual<0 ? ('-$'+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": totalAnual,
            "Color": totalAnual<0 ? '#ff3200': '#000000',
            } 

            //PromedioTrimestral
            valorPromedioTrimestral=Number((totalAnual/3).toFixed(0))
            dataTree.data.valores[claveTrimestralPromedio] = 
            {
             "Valor": valorPromedioTrimestral<0 ? ('-$ '+ (valorPromedioTrimestral*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorPromedioTrimestral)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorPromedioTrimestral,
             "Color": valorPromedioTrimestral<0 ? '#ff3200': '#000000',
            } 

        }

          if(dataTree.data.tipo=='Padre'){

            let valor =  0;
            this.getMesesByTrimestre(trim.id).forEach((mes:any)=>{
            valor+=
            this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
            })
            dataTree.data.valores[claveTrimestral] = {
             "Valor": valor<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valor,
             "Color": valor<0 ? '#ff3200': '#000000'
            }
            totalAnual += valor;
            dataTree.data.valores[claveAnual] = 
            {
            "Valor": totalAnual<0 ? ('-$ '+ (totalAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "ValorNumero": totalAnual,
            "Color": totalAnual<0 ? '#ff3200': '#000000',
            }
            const ValorPromedio=Number((totalAnual/3).toFixed(0))
            dataTree.data.valores[claveTrimestralPromedio] =
            {
              "Valor": ValorPromedio<0 ? ('-$ '+ (ValorPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              "ValorNumero": ValorPromedio,
              "Color": ValorPromedio<0 ? '#ff3200': '#000000',
            }   
            



            let claveAnualHijo: any
            let claveAnualNieto: any        
            let clavePromedioTrimestralHijo: any  
            this.DataTreeTableTrimestral[dataTree.data.orden].children.forEach(cuenta => {
              
              const claveTrimestralHijo = `${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
              claveAnualHijo= `${cuenta.data.idItem}-${anio.Anio}`;
              clavePromedioTrimestralHijo= `Prom-${cuenta.data.idItem}-${anio.Anio}`;
              let valorTrimestralHijo =  0;
              let valorAnualHijo =  0;
              let valorPromedioHijo =  0;
              this.getMesesByTrimestre(trim.id).forEach((mes:any)=>{
                let ArregloHijos=this.DataTreeTable[dataTree.data.orden].children == undefined 
                || this.DataTreeTable[dataTree.data.orden].children.length ==0? []:
                this.DataTreeTable[dataTree.data.orden].children
                ArregloHijos.forEach((child:any)=>{
                 valorTrimestralHijo+=  child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
                 valorAnualHijo=  child.data.valores[`${cuenta.data.idItem}-${anio.Anio}`]?.ValorNumero || 0 
                })
              })

              cuenta.data.valores[claveTrimestralHijo] = 
              {
             "Valor": valorTrimestralHijo<0 ? ('-$ '+ (valor*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorTrimestralHijo,
             "Color": valorTrimestralHijo<0 ? '#ff3200': '#000000'
              }

              
              cuenta.data.valores[claveAnualHijo] =   
              {
             "Valor": valorAnualHijo<0 ? ('-$ '+ (valorAnualHijo*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorAnualHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorAnualHijo,
             "Color": valorAnualHijo<0 ? '#ff3200': '#000000'
              }

              valorPromedioHijo= Number((valorAnualHijo/3).toFixed(0));
              cuenta.data.valores[clavePromedioTrimestralHijo] =   
              {
             "Valor": valorPromedioHijo<0 ? ('-$ '+ (valorPromedioHijo*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorPromedioHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
             "ValorNumero": valorPromedioHijo,
             "Color": valorPromedioHijo<0 ? '#ff3200': '#000000'
              }
              
              
              let valorNietoAnual = 0;
              let valorNietoPromedio = 0;
              cuenta.children.forEach(subCuenta => {
                let valorTrimestralNieto = 0;
              const claveTrimestralHijo = `${subCuenta.data.id}-${trim.id}-${anio.Anio}`;
              const clavePromedioTrimestralHijo = `Prom-${subCuenta.data.id}-${anio.Anio}`;
              const claveAnualNieto= `${subCuenta.data.id}-${anio.Anio}`;
              this.getMesesByTrimestre(trim.id).forEach((mes:any)=>{

              this.DataTreeTable[dataTree.data.orden].children.forEach((child:any)=>{               
                 child.children.forEach(nieto => {
                   valorTrimestralNieto+=
                   nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0 
                   valorNietoAnual=nieto.data.valores[`${subCuenta.data.id}-${anio.Anio}`]?.ValorNumero || 0 
                  
                });              
              })    
              })

              subCuenta.data.valores[claveTrimestralHijo] =                 
                {
                "Valor": valorTrimestralNieto<0 ? ('-$ '+ (valorTrimestralNieto*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorTrimestralNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valorTrimestralNieto,
                "Color": valorTrimestralNieto<0 ? '#ff3200': '#000000'
                }

   
              subCuenta.data.valores[claveAnualNieto] = 
                {
                "Valor": valorNietoAnual<0 ? ('-$ '+ (valorNietoAnual*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorNietoAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valorNietoAnual,
                "Color": valorNietoAnual<0 ? '#ff3200': '#000000'
                }

                
              valorNietoPromedio=Number((valorNietoAnual/3).toFixed(0))
              subCuenta.data.valores[clavePromedioTrimestralHijo] = 
                {
                "Valor": valorNietoPromedio<0 ? ('-$ '+ (valorNietoPromedio*-1)).replace(/\B(?=(\d{3})+(?!\d))/g, ","): ('$ '+ (valorNietoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                "ValorNumero": valorNietoPromedio,
                "Color": valorNietoPromedio<0 ? '#ff3200': '#000000'
                }

              });
            });



          }





        });


        
      });
    }
  }); 
  this.cargar=false

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

descargarExcel(){
  let _Cabecera:any=[]
 _Cabecera=this.Cabecera.filter((cab:any)=>cab.Mostrar==true)
  const headerRow: any[] = [];
  _Cabecera.forEach((element: any) => {
    headerRow.push(element.Nombre);
  });
  let Data: any[] = [];
  let Contador:number=1
  this.Categorias.forEach((categ: any) => {
    let fila: any[] = [`${Contador}- ${categ.Nombre}`];
    Contador+=1
    _Cabecera.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {
      const indexItemTrimesral = `${cab.NumTrimestre}-${cab.Anio}`;
      const indexAnual = `${cab.Anio}`;
      let valor = 0;
      const categoriaEncontrada = this.DataTreeTable.find((dataT: any) => dataT.data.id_categoria === categ.id);
      if (categoriaEncontrada) {
        if (cab.Tipo === 2) {
          valor = categoriaEncontrada.data.values?.[indexItemTrimesral] ?? 0;
        } else if (cab.Tipo === 3) {
          valor = categoriaEncontrada.data.values?.[indexAnual] ?? 0;
        }
      }
      else {
        valor=0
      }

  fila.push(valor);
    })
    Data.push(fila);
    this.getItems(categ.id).forEach((item: any) => {
  let filaItem: any[] = [item.Nombre];
  _Cabecera.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {
    const indexItemTrimesral = `${cab.NumTrimestre}-${cab.Anio}`;
    const indexItemAnual = `${cab.Anio}`;
    let valorItem = 0;
 if (cab.Tipo == 2) {
  valorItem = this.DataTreeTable.filter((dataT: any) => dataT.data.id_categoria == categ.id).length === 0
  ? 0
  : this.DataTreeTable.filter(
      (dataT: any) =>
        dataT.data.id_categoria == categ.id &&
        dataT.data.children.some((child: any) => child.data.id_item == item.id)
    ).length === 0
  ? 0
  : this.DataTreeTable
      .flatMap((dataT: any) => dataT.data.children) // Aplanar los children
      .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemTrimesral] || 0;

  }
  else if (cab.Tipo == 3) {
    valorItem = this.DataTreeTable.filter((dataT: any) => dataT.data.id_categoria == categ.id).length === 0
    ? 0
    : this.DataTreeTable.filter(
        (dataT: any) =>
          dataT.data.id_categoria == categ.id &&
          dataT.data.children.some((child: any) => child.data.id_item == item.id)
      ).length === 0
    ? 0
    : this.DataTreeTable
        .flatMap((dataT: any) => dataT.data.children) // Aplanar los children
        .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemAnual] || 0;
}
filaItem.push(valorItem);

  })
  Data.push(filaItem);
    })

  })

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Datos');
const headerRowData = worksheet.addRow(headerRow);

headerRowData.eachCell((cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '71bd9e' } // Fondo amarillo
  };
  cell.font = {
    bold: true,
    color: { argb: 'ffffff' } // Texto azul
  };
  cell.alignment = {
    horizontal: 'left',
    vertical: 'middle'
  };
  cell.border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  };
});

Data.forEach((row: any, index: any) => {
  const dataRow = worksheet.addRow(row);


  if(row[0].startsWith('1-') || row[0].startsWith('12-') 
  ){
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b4b4b4' },
      };
    });
  }
 else  if( 
     row[0].startsWith('3-') 
    || row[0].startsWith('4-')  
    || row[0].startsWith('6-') 
    || row[0].startsWith('7-')  
    || row[0].startsWith('9-')  
    || row[0].startsWith('10-')  
  ){
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' }, 
      };
    });
  }
else  if(row[0].startsWith('2-') 
    || row[0].startsWith('5-')
    || row[0].startsWith('8-') 
    || row[0].startsWith('10-')  
    || row[0].startsWith('11-')  
  )
  {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'afeffb' },
      };
    });
  }
else 
  {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' }, 
      };
    });
  }

  dataRow.eachCell((cell: any, colNumber: number) => {
    if (colNumber === 1) {
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle'
      };
    } else {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
    }
  });
});

worksheet.columns.forEach((column:any) => {
  const maxLength = column.values.reduce((acc: number, curr: any) => {
    return curr && curr.toString().length > acc ? curr.toString().length : acc;
  }, 10);
  column.width = maxLength + 2; // Ajustar el ancho de la columna
});
workbook.xlsx.writeBuffer().then((buffer: any) => {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'datos.xlsx');
});

}

}
