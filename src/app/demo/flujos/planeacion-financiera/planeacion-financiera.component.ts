// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-planeacion-financiera',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule,ToastModule],
  templateUrl: './planeacion-financiera.component.html',
  styleUrls: ['./planeacion-financiera.component.scss']
})
export default class PlaneacionFinancieraComponent implements OnInit {
  CuentasBanco:any=[]
  CuentasBancoSelect:any=[]
  Sucursales:any=[]
  SucursalesSelect:any=[]
  Usuarios:any=[]
  UsuariosSelect:any=[]
  Meses: any = [];
  Categorias:any=[]
  Registros:any=[]
  MesesSeleccionados: any = [];
  Anios:any=[]
  AniosSeleccionados:any=[]
  AniosRegistrosBack:any=[]
  usuario:any
  Criterios:{}
  MesesRegistrosBack:any=[]
  RegistrosBack:any=[]
  RegistrosValoresPlanes:any=[]
  ValorPlan:FormControl=new FormControl(0)
  constructor(private conS:ConfigurationService,private toastr: ToastrService) { }
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
    this.MesesRegistrosBack=this.Meses
    this.AniosRegistrosBack=this.Anios
    this.obtenerValoresPlanes()
    this.ObtenerCuentasBanco()
    this.obtenerCategorias()
    this.obtenerSucursales()
    this.obtenerUsuarios()
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
      this.Meses=this.MesesSeleccionados
    
    }
    else {
      this.Meses=this.MesesRegistrosBack
    }
    if(this.AniosSeleccionados.length>0){
      this.AniosSeleccionados.forEach((element:any) => {
        Anios.push(element.Anio)
      });
      this.Anios=this.AniosSeleccionados
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
obtenerCategorias(){
  
    this.conS.obtenerCategoriasFlujos().subscribe((data)=>{
      this.Categorias=data
      //.filter((categ:any)=>categ.Calculado==false)
      this.obtenerRegistros()
    })
}
obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
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


    })
    this.RegistrosBack=this.Registros


  })

}

getValorCategoria(idCategoria:string,MesRegistro:string,AnioRegistro:any){
  let _ValoresCategoria:any=[]
  let _Valor:number=0
  _ValoresCategoria=this.Registros.filter((data:any)=>data.idCategoria.id==idCategoria 
  && data.MesRegistro==MesRegistro
  && data.AnioRegistro==AnioRegistro)
  if(_ValoresCategoria.length>0){
    _ValoresCategoria.forEach(element => {
    _Valor+=element.Valor
    });
  }
  else {
    _Valor=0
  }
  return _Valor
}


getTableClass() {
  return (this.AniosSeleccionados.length === 1 && this.MesesSeleccionados.length === 1) ? 'table table-100 table-reduced' : 'table table-100';
}
obtenerValoresPlanes(){
  this.conS.obtenerValoresPlanes(this.usuario.idEmpresa).subscribe(resp=>{
    this.RegistrosValoresPlanes=resp

  })
}
formatNumber(value: number): string {
  return value.toLocaleString().replace(/\./g, ',');
}

getValuePlan(idCategoria:string,MesRegistro:string,Anio:number){
  let ValorEncontrado:any=[]
  ValorEncontrado=this.RegistrosValoresPlanes.filter((data:any)=>
  data.idCategoria==idCategoria &&
  data.MesRegistro==MesRegistro &&
  data.AnioRegistro==Anio &&
  data.idEmpresa==this.usuario.idEmpresa &&
  data.IdSucursal==this.usuario.IdSucursal)
if(ValorEncontrado.length>0){
  return ValorEncontrado[0].Valor

}
else 
{
  return 0
}

}
getValuePlanFlujo(Categoriasid:any,MesRegistro:string,Anio:number){
  let ValorEncontrado:any=[]
  let Valor:any=0
  const categorias = Categoriasid.map(item => item.idCategoria);
  ValorEncontrado = this.RegistrosValoresPlanes.filter((data) =>
    categorias.includes(data.idCategoria) &&
    data.MesRegistro == MesRegistro &&
    data.AnioRegistro == Anio &&
    data.idEmpresa == this.usuario.idEmpresa &&
    data.IdSucursal == this.usuario.IdSucursal
  )
if(ValorEncontrado.length>0){
  ValorEncontrado.forEach((data:any) => {
    Valor+=Number(data.Valor)
  });


}
else 
{
  Valor= 0
}
return Valor
}
getValueCategoria(Categoriasid:any,MesRegistro:string,Anio:number){
  let ValorEncontrado:any=[]
  let Valor:any=0
  const categorias = Categoriasid.map(item => item.idCategoria);
  
  ValorEncontrado = this.Registros.filter((data) =>
    categorias.includes(data.idCategoria.id) &&
    data.MesRegistro == MesRegistro &&
    data.AnioRegistro == Anio &&
    data.idEmpresa == this.usuario.idEmpresa &&
    data.idSucursal == this.usuario.IdSucursal
  )
if(ValorEncontrado.length>0){
  ValorEncontrado.forEach((data:any) => {
    Valor+=data.Valor
    
  });

}
else 
{
  Valor= 0
}
return Valor
}
guardarValorPlan(Anio:any,MesRegistro:any,idCategoria:string,Valor:any){
  let ValorCategoria:any=this.getValorCategoria(idCategoria, MesRegistro, Anio)
  let ValorMargen:any= ValorCategoria=0 ? 1 : ValorCategoria/ Valor
  let _Valor:any={
    "AnioRegistro":Anio,
    "MesRegistro":MesRegistro,
    "idCategoria":idCategoria,
    "Valor": Valor,
    "ValorMargen":Number(ValorMargen.toFixed(2)),
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
    _ValorPlanEncontrado[0].Valor=Valor
    _ValorPlanEncontrado[0].ValorMargen=ValorCategoria=0 ? 1 : ValorCategoria/ Valor
  this.conS.ActualizarValorPlan(_ValorPlanEncontrado[0]).then(resp=>{
    this.toastr.success('Guardado', '¡Exito!');
  })
  }  
  else {
    
    this.conS.crearValorPlan(_Valor).then(resp=>{
      this.toastr.success('Guardado', '¡Exito!');
    })
  }
}

calcularDiferencia(idCategoria:string, Mes:string, Anio:any){
return  this.getValorCategoria(idCategoria,Mes,Anio)- this.getValuePlan(idCategoria,Mes,Anio) 
}
calcularDiferenciaFlujos(Categorias:any, Mes:string, Anio:any){
return  this.getValueCategoria(Categorias,Mes,Anio) - this.getValuePlanFlujo(Categorias,Mes,Anio) 
}
calcularMargen(idCategoria:string, Mes:string, Anio:any){
  let ValorA:any=this.getValorCategoria(idCategoria,Mes,Anio)
  let ValorB:any=this.getValuePlan(idCategoria,Mes,Anio)
  return ValorA==0 || ValorB==0 ? 0 :  ((ValorA/ ValorB)-1)*100 
}
calcularMargenFlujos(idCategoria:string, Mes:string, Anio:any){
  let ValorA:any=this.getValueCategoria(idCategoria,Mes,Anio)
  let ValorB:any=this.getValuePlanFlujo(idCategoria,Mes,Anio)
  return ValorA==0 || ValorB==0 ? 0 :  ((ValorA/ ValorB)-1)*100 



}

}