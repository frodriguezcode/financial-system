// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-planeacion-financiera-mejorada',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './planeacion-financiera-mejorada.component.html',
  styleUrls: ['./planeacion-financiera-mejorada.component.scss']
})
export default class PlaneacionFinancieraMejoradaComponent implements OnInit {
catalogoFechas:any=[]
SemanasTodas:any=[]
Meses: any = [];
MesesSeleccionados: any = [];
Anios: any = [];
AniosSeleccionados: any = [];
Cabecera: any = [];
Categorias:any=[]
categoriasExpandidasHistory:any=[]
categoriasExpandidas: { [id: number]: boolean } = {};
Items:any=[]
ItemsBack:any=[]
usuario:any
Registros:any=[]
RegistrosValoresPlanesItems:any=[]
RegistrosValoresPlanesBackUp:any=[]
RegistrosValoresPlanes:any=[]
RegistrosValoresPlanesBackUpItems:any=[]
DataCategoriasMensual:any=[]
DataItemsMensual:any=[]
DataItems:any=[]
RegistrosBackUp:any=[]

DataPlanesMensual:any=[]
idTipoRegistro:any=0
cargando:boolean=true
constructor(private conS:ConfigurationService,private toastr: ToastrService){}
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.Anios=[
    {Anio:2023},
    {Anio:2024}]
  this.Meses= [

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
  this.AniosSeleccionados=this.Anios
  this.MesesSeleccionados=this.Meses
this.obtenerCategorias()  
this.obtenerRegistros()
this.obtenerValoresPlanes()
this.obtenerCategorias()
}

switchTipoRegistro(idTipo){
  if(idTipo==0){
    this.idTipoRegistro=0
    this.Registros=this.RegistrosBackUp
    this.RegistrosValoresPlanes=this.RegistrosValoresPlanesBackUp
    this.Items=this.ItemsBack
  }
  else {

    this.idTipoRegistro=idTipo
    this.Registros=this.RegistrosBackUp.filter((reg:any)=>reg.TipoRegistro==idTipo)
    this.RegistrosValoresPlanes=this.RegistrosValoresPlanesBackUp.filter((reg:any)=>reg.TipoRegistro==idTipo)
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.idTipoRegistro)

    
  }

  this.categoriasExpandidas=this.categoriasExpandidasHistory
 // this.obtenerCategorias()
}
getTableClass() {
  return (this.AniosSeleccionados.length === 1 && this.MesesSeleccionados.length === 1) ? 'table table-100 table-reduced' : 'table table-100';
}
construirCabecera(){
  this.Cabecera=[]
  this.Cabecera.push({
    "Nombre":"Naturalezas",
    "Mes":"",
    "NumMes":"",
    "Anio":"",
    "Tipo":1,
    "Mostrar":true,
    "MostrarBoton":true
  })
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
      this.Cabecera.push({
        "Nombre":"Plan " + mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":2,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre":mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":3,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre":"Diferencia",
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":4,
        "Mostrar":true,
        "MostrarBoton":true
      })

      this.Cabecera.push({
        "Nombre":"% Variación",
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":5,
        "Mostrar":true,
        "MostrarBoton":true
      })



    })
this.getDataCategoriasMensual()
this.getDataItemMensual()
this.getDataItemsMensualPlanes()
this.getDataCategoriasMensualPlanes()
  })

}

obtenerCategorias(){
  this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
    // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
    this.Categorias=[]

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

    })
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=true
      
    });
    this.obtenerItems()

  })
}
toggleCategoria(id: number) {

  this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
  this.categoriasExpandidasHistory=this.categoriasExpandidas
}
getItems(idCategoria:any){
  let _Items:any=[]
 
  _Items = this.Items.filter((item: any) => 
    item.idCategoria == idCategoria && 
    (this.idTipoRegistro === 0 || item.TipoRubro == this.idTipoRegistro)
  );  return _Items
  }
obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.Items=[]
      this.Items=resp;
      this.ItemsBack=resp
     this.obtenerRegistros()
  })
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
        "TipoRegistro":element.TipoRegistro,
        "NombreElemento":element.Elemento.label || '',
        "idElemento":element.Elemento.id || '',
        "NumCuenta":element.Cuenta.Cuenta || '',
        "CategoriaNombre":element.idCategoria.Nombre || '',
        "SocioNegocio":element.idSocioNegocio.Nombre || '',

      }
      this.Registros.push(_Registro)

      });

      this.RegistrosBackUp=this.Registros
      this.construirCabecera()
    })
}

obtenerValoresPlanes(){
  this.conS.obtenerValoresPlanes(this.usuario.idEmpresa).subscribe(resp=>{
    this.RegistrosValoresPlanes=resp
   this.RegistrosValoresPlanesBackUp=resp
  })
}


getDataItemsMensualPlanes(){
  this.DataItems=[]
  this.Items.forEach((item:any) => {
      this.Anios.forEach((anio:any) => {
        this.Meses.forEach((mes:any) => {
            const key = `${anio.Anio}-${mes.NumMes}-${item.id}`;  
            if (!this.DataItems[key]) {
              this.DataItems[key] =[];
            }
              this.DataItems[key].push({
                "Valor": item.Tipo==2 ? this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio)*-1  :this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio),
                "Diferencia":this.getValorItemMensual(item.id,mes.NumMes,anio.Anio)- this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio) ,
                "Variacion": this.calcularVariacion(this.getValorItemMensual(item.id,mes.NumMes,anio.Anio),this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio))
      
              });
    
            
    
  
          })
        })
      
    });
    this.cargando=false 

} 


getValorItemsMensualPlanes(idItem:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>registro
  .idItem==idItem
  && registro.MesRegistro==Mes
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

getDataCategoriasMensualPlanes(){
  this.DataPlanesMensual=[]
  this.Categorias.forEach((categ:any) => {
      this.Anios.forEach((anio:any) => {
        this.Meses.forEach((mes:any) => {
            const key = `${anio.Anio}-${mes.NumMes}-${categ.id}`;  
            if (!this.DataPlanesMensual[key]) {
              this.DataPlanesMensual[key] =[];
            }

           if(categ.Orden==3) {
              this.DataPlanesMensual[key].push({
                "Valor": this.getDataFlujoOperativoMensualPlanes(mes.Mes,anio.Anio),
                "Diferencia":this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio)- this.getDataFlujoOperativoMensualPlanes(mes.Mes,anio.Anio),
                "Variacion": this.calcularVariacion(this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio),this.getDataFlujoOperativoMensualPlanes(mes.Mes,anio.Anio))
              }); 
          }
          else if(categ.Orden==6) {

              this.DataPlanesMensual[key].push({
                "Valor": this.getDataFlujoInversionMensualPlanes(mes.Mes,anio.Anio),
                "Diferencia":this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio)- this.getDataFlujoInversionMensualPlanes(mes.Mes,anio.Anio),
                "Variacion": this.calcularVariacion(this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio),this.getDataFlujoInversionMensualPlanes(mes.Mes,anio.Anio))
              });    

          }
   
        else if(categ.Orden==9) {
              
          this.DataPlanesMensual[key].push({
            "Valor": this.getDataFlujoFinancieroMensualPlanes(mes.Mes,anio.Anio),
            "Diferencia":this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)- this.getDataFlujoFinancieroMensualPlanes(mes.Mes,anio.Anio),
            "Variacion": this.calcularVariacion(this.getDataFlujoFinancieroMensual(mes.Mes,anio.Anio),this.getDataFlujoFinancieroMensualPlanes(mes.Mes,anio.Anio))
          });   
        }
          else if(categ.Orden==10) { 
          
              this.DataPlanesMensual[key].push({
                "Valor": this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio),
                "Diferencia":this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)- this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio),
                "Variacion": this.calcularVariacion(this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio),this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio))
              });   
          }

            else {
              this.DataPlanesMensual[key].push({
                "Valor": this.getValorCategoriaMensualPlanes(categ.id,mes.Mes,anio.Anio),
                "Diferencia":this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)- this.getValorCategoriaMensualPlanes(categ.id,mes.Mes,anio.Anio) ,
                "Variacion": this.calcularVariacion(this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio),this.getValorCategoriaMensualPlanes(categ.id,mes.Mes,anio.Anio))
      
              });
    
            }
    
  
          })
        })
      
    });
    this.cargando=false  
} 
calcularVariacion(ValorA:any,ValorB:any){

  return ValorA==0 || ValorB==0 ? 0 :  (((ValorA / ValorB)-1))*100 
}
getDataFlujoFinancieroMensualPlanes(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==7
  || registro.Orden==8)
  && registro.MesRegistro==Mes
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

getDataFlujoOperativoMensualPlanes(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==2
  || registro.Orden==1)
  && registro.MesRegistro==Mes
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

getDataFlujoInversionMensualPlanes(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==4
  || registro.Orden==5)
  && registro.MesRegistro==Mes
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

getDataFlujoLibreMensualPlanes(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensualPlanes(Mes,Anio) 
  + this.getDataFlujoInversionMensualPlanes(Mes,Anio)
  + this.getDataFlujoFinancieroMensualPlanes(Mes,Anio)
}


getValorCategoriaMensualPlanes(idCategoria:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>registro
  .idCategoria==idCategoria
  && registro.MesRegistro==Mes
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

verifyValue(categoriaTipo:any,Monto:any){

  if(categoriaTipo==2 && Number(Monto)>0)
    {
      return [{Estado:false,Mensaje:'El valor debe ser negativo'}]  
    }
   else if (categoriaTipo==1 && Number(Monto)<0 ) 
    {
      return [{Estado:false,Mensaje:'El valor debe ser positivo'}]  
    }
    else {
      return [{Estado:true,Mensaje:'Excelente'}]  
    }

}

guardarValorPlan(Anio:any,MesRegistro:any,idCategoria:string,idItem:string,Valor:any,TipoCategoria:any,Orden:any){
  if(this.verifyValue(TipoCategoria,Number(Valor))[0].Estado==false){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: `${this.verifyValue(TipoCategoria,Number(Valor))[0].Mensaje}`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
  
    let _Valor:any={
      "AnioRegistro":Anio,
      "MesRegistro":MesRegistro,
      "Orden":Orden,
      "idCategoria":idCategoria,
      "idItem":idItem,
      "TipoCategoria":TipoCategoria,
      "TipoRegistro":this.idTipoRegistro,
      "Valor": Number(Valor.replace(',', '')),
      "idEmpresa":this.usuario.idEmpresa,
      "IdSucursal":this.usuario.IdSucursal
    }
  
    let _ValorPlanEncontrado:any=[]
    _ValorPlanEncontrado=this.RegistrosValoresPlanes.filter((data:any)=>
      data.idCategoria==idCategoria &&
      data.MesRegistro==MesRegistro &&
      data.AnioRegistro==Anio &&
      data.idEmpresa==this.usuario.idEmpresa &&
      data.IdSucursal==this.usuario.IdSucursal)
    if(_ValorPlanEncontrado.length>0){

      _ValorPlanEncontrado[0].Valor=Number(Valor.replace(',', ''))

    this.conS.ActualizarValorPlan(_ValorPlanEncontrado[0]).then(resp=>{
      this.toastr.success('Guardado', '¡Exito!');
      this.getDataItemsMensualPlanes()
      this.getDataCategoriasMensual()
      this.getDataCategoriasMensualPlanes()
    })
    }  
    
    else {
      
      this.conS.crearValorPlan(_Valor).then(resp=>{
        this.toastr.success('Guardado', '¡Exito!');
        this.getDataItemsMensualPlanes()
        this.getDataCategoriasMensual()
        this.getDataCategoriasMensualPlanes()
      })

}


  }
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

           if(categ.Orden==3) {
              
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
          else if(categ.Orden==9) {
              
              this.DataCategoriasMensual[key].push({
                "Valor": this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)
      
              });
          }
          else if(categ.Orden==10) {
              
              this.DataCategoriasMensual[key].push({
                "Valor": this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)
      
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
 this.getDataItemMensual()
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
getDataFlujoLibreMensual(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensual(Mes,Anio) 
  + this.getDataFlujoInversionMensual(Mes,Anio)
  + this.getDataFlujoFinancieroMensual(Mes,Anio)
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
}
