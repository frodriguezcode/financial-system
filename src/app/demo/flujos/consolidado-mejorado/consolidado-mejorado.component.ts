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
  selector: 'app-consolidado-mejorado',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './consolidado-mejorado.component.html',
  styleUrls: ['./consolidado-mejorado.component.scss']
})
export default class ConsolidadoMejoradoComponent implements OnInit {
  constructor(
    private conS:ConfigurationService, 
    private cdr: ChangeDetectorRef,
    private authS:AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  Categorias:any=[]
  categoriasExpandidas: { [id: number]: boolean } = {};
  Items:any=[]
  Registros:any=[]
  Semanas:any=[]
  Meses:any=[]
  Anios:any=[]
  Cabecera:any=[]
  usuario:any
  cargar:boolean=false
  //Categorías
  DataCategorias:any=[]
  DataCategoriasMensual:any=[]
  DataCategoriasAnual:any=[]
  //Items
  DataItems:any=[]
  DataItemsMensual:any=[]
  DataItemsAnual:any=[]
  ngOnInit(): void {
    this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    this.obtenerCategorias()
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
  toggleCategoria(id: number) {
    this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
  }
  
     obtenerItems(){
      this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
          this.Items=resp;
          console.log('Items',this.Items)
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
            "NombreElemento":element.Elemento.label || '',
            "idElemento":element.Elemento.id || '',
            "NumCuenta":element.Cuenta.Cuenta || '',
            "CategoriaNombre":element.idCategoria.Nombre || '',
            "SocioNegocio":element.idSocioNegocio.Nombre || '',
    
          }
          this.Registros.push(_Registro)
          });
       
          console.log('Registros',this.Registros)
          const uniqueMesNumMesSet = new Set(this.Registros.map(item => JSON.stringify({ Mes: item.MesRegistro, NumMes: item.NumMes })));
          const uniqueMesNumMes = Array.from(uniqueMesNumMesSet).map((item:any) => JSON.parse(item));
          const uniqueNumSemanaSet = new Set(this.Registros.map(item => JSON.stringify({ NumSemana: item.NumSemana, Semana: "Semana " + item.NumSemana, Mes:item.NumMes,Anio:item.AnioRegistro  })));
          const uniqueNumSemana = Array.from(uniqueNumSemanaSet).map((item:any) => JSON.parse(item));
          const uniqueAniosSet = new Set(this.Registros.map(item => JSON.stringify({ Anio: item.AnioRegistro})));
          const uniqueAnios= Array.from(uniqueAniosSet).map((item:any) => JSON.parse(item));

          this.Semanas=uniqueNumSemana.sort((a:any, b:any) => a.NumSemana- b.NumSemana)
          this.Meses=uniqueMesNumMes.sort((a:any, b:any) => a.NumMes- b.NumMes)
          this.Anios=uniqueAnios.sort((a:any, b:any) => a.Anio- b.Anio)
          this.construirCabecera()
          });
   }

getSemanasByMesAnio(Anio:any,NumMes:any){
  return this.Semanas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)
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
        this.DataCategorias[key].push({
          "Valor": this.getValorCategoria(categ.id,sem.NumSemana,mes.NumMes,anio.Anio)

        });

        })
      })
    })
  
});
console.log('DataCategorias',this.DataCategorias)
this.getDataItems()
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
        this.DataCategoriasMensual[key].push({
          "Valor": this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)

        });

       
      })
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
  this.cargar=true
  }
  



   construirCabecera(){
    this.Cabecera=[]
    this.Cabecera.push({
      "Nombre":"Concepto",
      "Mes":"",
      "NumMes":"",
      "Anio":"",
      "Tipo":1
    })
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
        this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
          this.Cabecera.push({
            "Nombre":sem.Semana + ' '+ mes.Mes + ' ' + anio.Anio,
            "Mes":mes.Mes,
            "NumMes":mes.NumMes,
            "Anio":anio.Anio,
            "Tipo":2
          })
          
        });
        if(this.getSemanasByMesAnio(anio.Anio,mes.NumMes).length>0){
          this.Cabecera.push({
            "Nombre":"Total "+ mes.Mes + ' ' + anio.Anio,
            "Mes":mes.Mes,
            "NumMes":mes.NumMes,
            "Anio":anio.Anio,
            "Tipo":3
          })

        }
      });
      this.Cabecera.push({
        "Nombre":"Total " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Tipo":4
      })
    });
    console.log('Cabecera',this.Cabecera)
    this.getDataCategorias()
   
   }
   getItems(idCategoria:any){
    let _Items:any=[]
    _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria)
    return _Items
    }
}
