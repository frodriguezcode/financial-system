// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-planeacion-financiera',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule],
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
  constructor(private conS:ConfigurationService) { }
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
    console.log('Registros',this.Registros)

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

}