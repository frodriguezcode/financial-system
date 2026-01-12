import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //urlSeverMailLocal = 'http://localhost:3000/formulario/';
  urlSeverMailLocal = 'https://apisistemafinanciero.onrender.com/formulario/';
  urlMailRecoverPassw= 'https://apisistemafinanciero.onrender.com/recuperarPassw/';
  urlMailUpdatePassw= 'https://apisistemafinanciero.onrender.com/updatePassw/';
   linkApiMejorada = 'http://localhost:3000/'
  //linkApiMejorada = 'https://apisistemafinanciero.onrender.com/'
  Atributos:any=[]
  constructor(
    private afs: AngularFirestore,
    private _http: HttpClient,
    private datePipe: DatePipe
  ) {
    
  }

    private readonly TOKEN_KEY = 'token';

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserFromToken(): any | null {
    if (!this.token) return null;

    try {
      return jwtDecode<any>(this.token);
    } catch {
      return null;
    }
  }

    /** ⏳ Verifica expiración */
  isTokenExpired(): boolean {
  const user = this.getUserFromToken();
  if (!user || !user.exp) return true;

  const now = Date.now();           // milisegundos
  const exp = user.exp * 1000;      // convertir a ms

  return now >= exp;
  }



  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  validarAtributo(idAtributo:string,Atributos:any) {
    this.Atributos=[]
    this.Atributos= JSON.parse(localStorage.getItem('AtributosUsuarioFinancial_System')!);
    let _Atributo:any=[]
    _Atributo= this.Atributos.filter((atr:any)=>atr.id==idAtributo && atr.Seleccionado==true)

    if(_Atributo.length>0){
      return true
    }
    else {
      return false
    }
  } 



  obtenerRolesbyId(idEmpresa:string,idRol:string) {
 
    return this.afs
      .collection('Roles',(ref) => ref.where('idEmpresa', '==', idEmpresa).where('id', '==', idRol))
      .valueChanges();
  }

//   !Creando un usuario
  crearUsuario(user: any) {
    const id = this.afs.createId();
    return this.afs
      .collection('Usuarios')
      .doc(id)
      .ref.set(Object.assign(user, { id: id }));
  }

  guardarRolSignUp(Rol:any,idRol:any){
  
   return this.afs
   .collection('Roles')
   .doc(idRol)
   .ref.set(Object.assign(Rol, { id: idRol }));
  }
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  crearUsuarioRegistro(user: any,Atributos:any) {
    const id = this.afs.createId();
    const idEmpresa = this.afs.createId();
    const idMatriz= this.afs.createId();
    const idRol= this.afs.createId();
    let _Empresa={
      Activo:true,
      Editando:false,
      FechaCreacion:user.FechaRegistro,
      Nombre:user.Empresa,
      idMatriz:idMatriz,
      ConfigInicial:false
    }
    let _Matriz={
      Activo:true,
      Editando:false,
      FechaCreacion:user.FechaRegistro,
      Nombre:user.Matriz,
      Empresas:[_Empresa]
    }
    let _Rol={
      "Rol":"Super Usuario",
      "Atributos":Atributos,
      "idEmpresa":idEmpresa,
      "idUsuario":user.Usuario,
      "idMatriz":idMatriz,
      "Usuario":id,
      "FechaRegistro":user.FechaRegistro
    }
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;    

    let CuentasHijos = [];
    CuentasHijos.push(
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'1.1.1 Ingresos por ventas de contado' ,
            Prefijo: '1.1.1',
            PrefijoPadre: 1.1,
            PrefijoHijo:1,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por ventas de contado',
            FechaCreacion: '',
            HoraCreacion:'',
            Tipo: 'Hijo',
            idPadre:'od11V2OHVgaLG1RiXMiz',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
            Customizable: true,
            Editable: true,
            Orden:1,
            OrdenReal: 1,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'1.1.2 Ingresos por ventas a crédito' ,
            Prefijo: '1.1.2',
            PrefijoPadre: 1.1,
            PrefijoHijo:2,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por ventas a crédito',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'od11V2OHVgaLG1RiXMiz',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
            Customizable: true,
            Editable: true,
            Orden:2,
            OrdenReal: 2,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'1.1.3 Otros ingresos de operación' ,
            Prefijo: '1.1.3',
            PrefijoPadre: 1.1,
            PrefijoHijo:3,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Otros ingresos de operación',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'od11V2OHVgaLG1RiXMiz',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
            Customizable: true,
            Editable: true,
            Orden:3,
            OrdenReal: 3,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'1.2.1 Pago a proveedores (Costo de operación)' ,
            Prefijo: '1.2.1',
            PrefijoPadre: 1.2,
            PrefijoHijo:1,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Pago a proveedores (Costo de operación)',
            FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
            HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
            Tipo: 'Hijo',
            idPadre:'KtA2Cxpd79TJrW9afqR9',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
            Customizable: true,
            Editable: true,
            Orden:1,
            OrdenReal: 4,
            idEmpresa: idEmpresa,
            idCorporacion: idMatriz,
            Created_User: id
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'1.2.2 Gastos de operación' ,
            Prefijo: '1.2.2',
            PrefijoPadre: 1.2,
            PrefijoHijo:2,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Gastos de operación',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'KtA2Cxpd79TJrW9afqR9',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
            Customizable: true,
            Editable: true,
            Orden:2,
            OrdenReal: 5,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'2.1.1 Ingresos por venta de activos' ,
            Prefijo: '2.1.1',
            PrefijoPadre: 2.1,
            PrefijoHijo:1,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por venta de activos',
            FechaCreacion:'',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'JeFc3TNWBgrgubNPmDYU',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
            Customizable: true,
            Editable: true,
            Orden:1,
            OrdenReal: 6,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'2.1.2 Otros ingresos de inversión' ,
            Prefijo: '2.1.2',
            PrefijoPadre: 2.1,
            PrefijoHijo:2,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Otros ingresos de inversión',
            FechaCreacion: '',
            HoraCreacion:'',
            Tipo: 'Hijo',
            idPadre:'JeFc3TNWBgrgubNPmDYU',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
            Customizable: true,
            Editable: true,
            Orden:2,
            OrdenReal: 7,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'2.2.1 Egresos por compras de activos' ,
            Prefijo: '2.2.1',
            PrefijoPadre: 2.2,
            PrefijoHijo:1,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por compras de activos',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'KNlKzH3EbD5QcXVAnbwe',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
            Customizable: true,
            Editable: true,
            Orden:1,
            OrdenReal: 8,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'2.2.2 Otros egresos de inversión' ,
            Prefijo: '2.2.2',
            PrefijoPadre: 2.2,
            PrefijoHijo:2,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Otros egresos de inversión',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'KNlKzH3EbD5QcXVAnbwe',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
            Customizable: true,
            Editable: true,
            Orden:2,
            OrdenReal: 9,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.1 Ingresos por préstamos bancarios' ,
            Prefijo: '3.1.1',
            PrefijoPadre: 3.1,
            PrefijoHijo:1,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por préstamos bancarios',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:1,
            OrdenReal: 10,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.2 Ingresos por préstamos de accionistas' ,
            Prefijo: '3.1.2',
            PrefijoPadre: 3.1,
            PrefijoHijo:2,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por préstamos de accionistas',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:2,
            OrdenReal: 11,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.3 Ingresos por préstamos de otros acreedores' ,
            Prefijo: '3.1.3',
            PrefijoPadre: 3.1,
            PrefijoHijo:3,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por préstamos de otros acreedores',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:3,
            OrdenReal: 12,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.4 Ingresos por aportaciones de capital de accionistas' ,
            Prefijo: '3.1.4',
            PrefijoPadre: 3.1,
            PrefijoHijo:4,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por aportaciones de capital de accionistas',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:4,
            OrdenReal: 13,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.5 Ingresos por venta de acciones' ,
            Prefijo: '3.1.5',
            PrefijoPadre: 3.1,
            PrefijoHijo:5,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por venta de acciones',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:5,
            OrdenReal: 14,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.6 Ingresos por traspasos entre cuentas propias' ,
            Prefijo: '3.1.6',
            PrefijoPadre: 3.1,
            PrefijoHijo:6,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Ingresos por traspasos entre cuentas propias',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:6,
            OrdenReal: 15,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.1.7 Otros ingresos financieros' ,
            Prefijo: '3.1.7',
            PrefijoPadre: 3.1,
            PrefijoHijo:7,
            CuentaFija:false,
            TipoCuenta:1,
            Alias:'Otros ingresos financieros',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'jhtHzgzTXRPgCnWDqsUM',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:7,
            OrdenReal: 16,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.1 Egresos por pagos de préstamos bancarios' ,
            Prefijo: '3.2.1',
            PrefijoPadre: 3.2,
            PrefijoHijo:1,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por pagos de préstamos bancarios',
            FechaCreacion:'',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:1,
            OrdenReal: 17,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.2 Egresos por pagos de préstamos de accionistas' ,
            Prefijo: '3.2.2',
            PrefijoPadre: 3.2,
            PrefijoHijo:2,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por pagos de préstamos de accionistas',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:2,
            OrdenReal: 18,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.3 Egresos por pagos de préstamos de otros acreedores' ,
            Prefijo: '3.2.3',
            PrefijoPadre: 3.2,
            PrefijoHijo:3,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por pagos de préstamos de otros acreedores',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:3,
            OrdenReal: 19,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.4 Egresos por pagos de dividendos a accionistas' ,
            Prefijo: '3.2.4',
            PrefijoPadre: 3.2,
            PrefijoHijo:4,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por pagos de dividendos a accionistas',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:4,
            OrdenReal: 20,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.5 Egresos por compra de acciones' ,
            Prefijo: '3.2.5',
            PrefijoPadre: 3.2,
            PrefijoHijo:5,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por compra de acciones',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:5,
            OrdenReal: 21,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.6 Egresos por traspasos entre cuentas propias' ,
            Prefijo: '3.2.6',
            PrefijoPadre: 3.2,
            PrefijoHijo:6,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Egresos por traspasos entre cuentas propias',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:6,
            OrdenReal: 22,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
        {
            Activo:true,
            TipoProforma:1,
            Nombre:'3.2.7 Otros egresos financieros' ,
            Prefijo: '3.2.7',
            PrefijoPadre: 3.2,
            PrefijoHijo:7,
            CuentaFija:false,
            TipoCuenta:2,
            Alias:'Otros egresos financieros',
            FechaCreacion: '',
            HoraCreacion: '',
            Tipo: 'Hijo',
            idPadre:'2sAJKELNPwwAuAbU6Vlw',
            idsSucursales: [],
            idsProyectos: [],
            idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
            Customizable: true,
            Editable: true,
            Orden:7,
            OrdenReal: 23,
            idEmpresa: '',
            idCorporacion: '',
            Created_User: ''
        },
    );



    this.guardarRolSignUp(_Rol,idRol).then(resp=>{
      
    })

    this.crearMatriz(_Matriz,idMatriz).then(resp=>{
      
    })
    this.crearEmpresa(_Empresa,idEmpresa).then(resp=>{

    })

    user.idEmpresa=idEmpresa
    user.idMatriz=idMatriz
    user.idRol=idRol
    return this.afs
      .collection('Usuarios')
      .doc(id)
      .ref.set(Object.assign(user, { id: id }));
  }


  crearEmpresa(empresa: any,idEmpresa:any){

   
    return this.afs
    .collection('Empresa')
    .doc(idEmpresa)
    .ref.set(Object.assign(empresa, {id: idEmpresa,CuentasConfig:true}))
}

actualizarConfigInicialEmpresa(idEmpresa:any){
    return this.afs
     .collection('Empresa')
     .doc(idEmpresa)
     .ref.update({ConfigInicial:true});
  }

  obtenerNombresUsuario() {
    return this.afs
      .collection('NombresUsuarios')
      .valueChanges();
  }

  crearEmpresabyMatriz(empresa: any) {
    const id = this.afs.createId();
  
    // Añadimos el id al objeto antes de guardarlo
    const empresaConId = Object.assign(empresa, { id: id });
  
    // Retornamos un objeto que incluye el id y la promesa
    return {
      id: id,
      result: this.afs.collection('Empresa').doc(id).set(empresaConId)
    };
  }
  crearMatriz(Matriz: any,idMatriz:any){
   
    return this.afs
    .collection('Corporaciones')
    .doc(idMatriz)
    .ref.set(Object.assign(Matriz, {id: idMatriz}))
}

obtenerEmpresas(idMatriz:string) {
  return this.afs
    .collection('Empresa',(ref) => ref.where('idMatriz', '==', idMatriz).orderBy('Activo','desc'))
    .valueChanges();
}

  
  sendMail(usuario:any): Observable<any>{
    return this._http.post<any>(this.urlSeverMailLocal,usuario);
  }
  sendMailRecoverPassw(usuario:any): Observable<any>{
    return this._http.post<any>(this.urlMailRecoverPassw,usuario);
  }
  sendMailUpdatePassw(usuario:any): Observable<any>{
    return this._http.post<any>(this.urlMailUpdatePassw,usuario);
  }

 async crearCatalogoCuentasHijo(){
  //   let CuentasHijos = [];
  //   CuentasHijos.push(
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'1.1.1 Ingresos por ventas de contado' ,
  //           Prefijo: '1.1.1',
  //           PrefijoPadre: 1.1,
  //           PrefijoHijo:1,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por ventas de contado',
  //           FechaCreacion: '',
  //           HoraCreacion:'',
  //           Tipo: 'Hijo',
  //           idPadre:'od11V2OHVgaLG1RiXMiz',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:1,
  //           OrdenReal: 1,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'1.1.2 Ingresos por ventas a crédito' ,
  //           Prefijo: '1.1.2',
  //           PrefijoPadre: 1.1,
  //           PrefijoHijo:2,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por ventas a crédito',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'od11V2OHVgaLG1RiXMiz',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:2,
  //           OrdenReal: 2,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'1.1.3 Otros ingresos de operación' ,
  //           Prefijo: '1.1.3',
  //           PrefijoPadre: 1.1,
  //           PrefijoHijo:3,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Otros ingresos de operación',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'od11V2OHVgaLG1RiXMiz',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:3,
  //           OrdenReal: 3,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'1.2.1 Pago a proveedores (Costo de operación)' ,
  //           Prefijo: '1.2.1',
  //           PrefijoPadre: 1.2,
  //           PrefijoHijo:1,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Pago a proveedores (Costo de operación)',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'KtA2Cxpd79TJrW9afqR9',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:1,
  //           OrdenReal: 4,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'1.2.2 Gastos de operación' ,
  //           Prefijo: '1.2.2',
  //           PrefijoPadre: 1.2,
  //           PrefijoHijo:2,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Gastos de operación',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'KtA2Cxpd79TJrW9afqR9',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:2,
  //           OrdenReal: 5,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'2.1.1 Ingresos por venta de activos' ,
  //           Prefijo: '2.1.1',
  //           PrefijoPadre: 2.1,
  //           PrefijoHijo:1,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por venta de activos',
  //           FechaCreacion:'',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'JeFc3TNWBgrgubNPmDYU',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:1,
  //           OrdenReal: 6,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'2.1.2 Otros ingresos de inversión' ,
  //           Prefijo: '2.1.2',
  //           PrefijoPadre: 2.1,
  //           PrefijoHijo:2,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Otros ingresos de inversión',
  //           FechaCreacion: '',
  //           HoraCreacion:'',
  //           Tipo: 'Hijo',
  //           idPadre:'JeFc3TNWBgrgubNPmDYU',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:2,
  //           OrdenReal: 7,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'2.2.1 Egresos por compras de activos' ,
  //           Prefijo: '2.2.1',
  //           PrefijoPadre: 2.2,
  //           PrefijoHijo:1,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por compras de activos',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'KNlKzH3EbD5QcXVAnbwe',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:1,
  //           OrdenReal: 8,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'2.2.2 Otros egresos de inversión' ,
  //           Prefijo: '2.2.2',
  //           PrefijoPadre: 2.2,
  //           PrefijoHijo:2,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Otros egresos de inversión',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'KNlKzH3EbD5QcXVAnbwe',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'GMzSuF04XQBsPmAkIB2C',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:2,
  //           OrdenReal: 9,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.1 Ingresos por préstamos bancarios' ,
  //           Prefijo: '3.1.1',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:1,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por préstamos bancarios',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:1,
  //           OrdenReal: 10,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.2 Ingresos por préstamos de accionistas' ,
  //           Prefijo: '3.1.2',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:2,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por préstamos de accionistas',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:2,
  //           OrdenReal: 11,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.3 Ingresos por préstamos de otros acreedores' ,
  //           Prefijo: '3.1.3',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:3,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por préstamos de otros acreedores',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:3,
  //           OrdenReal: 12,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.4 Ingresos por aportaciones de capital de accionistas' ,
  //           Prefijo: '3.1.4',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:4,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por aportaciones de capital de accionistas',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:4,
  //           OrdenReal: 13,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.5 Ingresos por venta de acciones' ,
  //           Prefijo: '3.1.5',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:5,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por venta de acciones',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:5,
  //           OrdenReal: 14,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.6 Ingresos por traspasos entre cuentas propias' ,
  //           Prefijo: '3.1.6',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:6,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Ingresos por traspasos entre cuentas propias',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:6,
  //           OrdenReal: 15,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.1.7 Otros ingresos financieros' ,
  //           Prefijo: '3.1.7',
  //           PrefijoPadre: 3.1,
  //           PrefijoHijo:7,
  //           CuentaFija:false,
  //           TipoCuenta:1,
  //           Alias:'Otros ingresos financieros',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'jhtHzgzTXRPgCnWDqsUM',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:7,
  //           OrdenReal: 16,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.1 Egresos por pagos de préstamos bancarios' ,
  //           Prefijo: '3.2.1',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:1,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por pagos de préstamos bancarios',
  //           FechaCreacion:'',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:1,
  //           OrdenReal: 17,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.2 Egresos por pagos de préstamos de accionistas' ,
  //           Prefijo: '3.2.2',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:2,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por pagos de préstamos de accionistas',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:2,
  //           OrdenReal: 18,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.3 Egresos por pagos de préstamos de otros acreedores' ,
  //           Prefijo: '3.2.3',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:3,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por pagos de préstamos de otros acreedores',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:3,
  //           OrdenReal: 19,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.4 Egresos por pagos de dividendos a accionistas' ,
  //           Prefijo: '3.2.4',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:4,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por pagos de dividendos a accionistas',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:4,
  //           OrdenReal: 20,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.5 Egresos por compra de acciones' ,
  //           Prefijo: '3.2.5',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:5,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por compra de acciones',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:5,
  //           OrdenReal: 21,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.6 Egresos por traspasos entre cuentas propias' ,
  //           Prefijo: '3.2.6',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:6,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Egresos por traspasos entre cuentas propias',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:6,
  //           OrdenReal: 22,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //       {
  //           Activo:true,
  //           TipoProforma:1,
  //           Nombre:'3.2.7 Otros egresos financieros' ,
  //           Prefijo: '3.2.7',
  //           PrefijoPadre: 3.2,
  //           PrefijoHijo:7,
  //           CuentaFija:false,
  //           TipoCuenta:2,
  //           Alias:'Otros egresos financieros',
  //           FechaCreacion: '',
  //           HoraCreacion: '',
  //           Tipo: 'Hijo',
  //           idPadre:'2sAJKELNPwwAuAbU6Vlw',
  //           idsSucursales: [],
  //           idsProyectos: [],
  //           idAbuelo: 'psmpY6iyDJNkW7AKFXgK',
  //           Customizable: true,
  //           Editable: true,
  //           Orden:7,
  //           OrdenReal: 23,
  //           idEmpresa: '',
  //           idCorporacion: '',
  //           Created_User: ''
  //       },
  //   );
  //  const batch = this.afs.firestore.batch();
  //  const collectionRef = this.afs.collection("CatalogCuentasHijo").ref; 

  //   CuentasHijos.forEach(cuenta => {
  //     const id = this.afs.createId();
      
      

  //     const docRef = collectionRef.doc(id);
      

  //     const cuentaConId = { ...cuenta, id: id };
      

  //     batch.set(docRef, cuentaConId);
  //   });

  //   try {
    
  //     await batch.commit();
  //     console.log('Lote guardado exitosamente');
  //   } catch (error) {
  //     console.error('Error al guardar el lote: ', error);
  //     throw error;
  //   }



  //  let CuentaNieto=[]
  //  CuentaNieto.push(
  //    {
  //      Activo:true,
  //      Nombre:'1.1.2.1 Facturas vencidas en el mes',
  //      Prefijo: '1.1.2.1',
  //      PrefijoPadre: '1.1',
  //      PrefijoHijo: '2',
  //      Alias: 'Facturas vencidas en el mes',
  //      CuentaFija:false,
  //      FechaCreacion:'',
  //      HoraCreacion: '',
  //      Tipo: 'Nieto',
  //      idPadre: 'od11V2OHVgaLG1RiXMiz',
  //      idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //      idHijo: 'Edq095ucaDYIe1GnRuuA',
  //      idsProyectos: [],
  //      idsSucursales: [],
  //      Editable: false,
  //      Orden: 1,
  //      OrdenReal: 1,
  //      idEmpresa: '',
  //      idCorporacion: '',
  //      Created_User: ''
  //     },
  //    {
  //      Activo:true,
  //      Nombre:'1.1.2.2 Facturas vencidas en meses anteriores',
  //      Prefijo: '1.1.2.2',
  //      PrefijoPadre: '1.1',
  //      PrefijoHijo: '2',
  //      Alias: 'Facturas vencidas en meses anteriores',
  //      CuentaFija:false,
  //      FechaCreacion:'',
  //      HoraCreacion: '',
  //      Tipo: 'Nieto',
  //      idPadre: 'od11V2OHVgaLG1RiXMiz',
  //      idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //      idHijo: 'Edq095ucaDYIe1GnRuuA',
  //      idsProyectos: [],
  //      idsSucursales: [],
  //      Editable: false,
  //      Orden: 2,
  //      OrdenReal: 2,
  //      idEmpresa: '',
  //      idCorporacion: '',
  //      Created_User: ''
  //     },
  //     {
  //       Activo:true,
  //       Nombre:'1.1.2.3 Facturas con vencimiento en meses futuros',
  //       Prefijo: '1.1.2.3',
  //       PrefijoPadre: '1.1',
  //       PrefijoHijo: '2',
  //       Alias: 'Facturas con vencimiento en meses futuros',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'od11V2OHVgaLG1RiXMiz',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'Edq095ucaDYIe1GnRuuA',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 3,
  //       OrdenReal: 3,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //     {
  //       Activo:true,
  //       Nombre:'1.2.1.1 Facturas vencidas en el mes',
  //       Prefijo: '1.2.1.1',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '1',
  //       Alias: 'Facturas vencidas en el mes',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: '6SIzJkBkRa54SxsvyDhD',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 1,
  //       OrdenReal: 4,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.1.2 Facturas vencidas en meses anteriores',
  //       Prefijo: '1.2.1.2',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '1',
  //       Alias: 'Facturas vencidas en meses anteriores',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: '6SIzJkBkRa54SxsvyDhD',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 2,
  //       OrdenReal: 5,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.1.3 Facturas con vencimiento en meses futuros',
  //       Prefijo: '1.2.1.3',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '1',
  //       Alias: 'Facturas con vencimiento en meses futuros',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: '6SIzJkBkRa54SxsvyDhD',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 3,
  //       OrdenReal: 6,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.1 Egresos por pagos de nóminas, comisiones y bonos',
  //       Prefijo: '1.2.2.1',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de nóminas, comisiones y bonos',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 1,
  //       OrdenReal: 7,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.2 Egresos por pagos de seguridad social',
  //       Prefijo: '1.2.2.2',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de seguridad social',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 2,
  //       OrdenReal: 8,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.3 Egresos por pagos de arrendamientos',
  //       Prefijo: '1.2.2.3',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de arrendamientos',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 3,
  //       OrdenReal: 9,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.4 Egresos por pagos de servicios profesionales',
  //       Prefijo: '1.2.2.4',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de servicios profesionales',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 4,
  //       OrdenReal: 10,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.5 Egresos por pagos de intereses',
  //       Prefijo: '1.2.2.5',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de intereses',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 5,
  //       OrdenReal: 11,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.6 Egresos por pagos de impuestos',
  //       Prefijo: '1.2.2.6',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de impuestos',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 6,
  //       OrdenReal: 12,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.7 Egresos por pagos de servicios (luz, agua, telecomunicaciones)',
  //       Prefijo: '1.2.2.7',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Egresos por pagos de servicios (luz, agua, telecomunicaciones)',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 7,
  //       OrdenReal: 13,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },
  //       {
  //       Activo:true,
  //       Nombre:'1.2.2.8 Otros egresos de operación',
  //       Prefijo: '1.2.2.8',
  //       PrefijoPadre: '1.2',
  //       PrefijoHijo: '2',
  //       Alias: 'Otros egresos de operación',
  //       CuentaFija:false,
  //       FechaCreacion:'',
  //       HoraCreacion: '',
  //       Tipo: 'Nieto',
  //       idPadre: 'KtA2Cxpd79TJrW9afqR9',
  //       idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
  //       idHijo: 'hGcpIfdc7HMt6Z8bcsM5',
  //       idsProyectos: [],
  //       idsSucursales: [],
  //       Editable: false,
  //       Orden: 8,
  //       OrdenReal: 14,
  //       idEmpresa: '',
  //       idCorporacion: '',
  //       Created_User: ''
  //       },

  //  ) 
  //  const batch = this.afs.firestore.batch();
  //  const collectionRef = this.afs.collection("CatalogCuentasNieto").ref; 

  //   CuentaNieto.forEach(cuenta => {
  //     const id = this.afs.createId();
      
  //     const docRef = collectionRef.doc(id);
      

  //     const cuentaConId = { ...cuenta, id: id };
      

  //     batch.set(docRef, cuentaConId);
  //   });

  //   try {
    
  //     await batch.commit();
  //     console.log('Lote guardado exitosamente');
  //   } catch (error) {
  //     console.error('Error al guardar el lote: ', error);
  //     throw error;
  //   }    

  }


  construirCatalogoCuentas(CatalogoCuentas:any){
    const id = this.afs.createId();
    return this.afs
    .collection('CatalogoCuentasEmpresa')
    .doc(id)
    .ref.set(Object.assign(CatalogoCuentas, {id: id}))
  }


  iniciarSesion(usuario:string,password:string){


   
   return this._http.post<any>( `${this.linkApiMejorada + 'login/' }`, { usuario, password })
    .pipe(
      tap((resp:any) => {
        localStorage.setItem('token', resp.token);
      })
    );   
  }
  obtenerUsuarioLogin(usuario:string,password:string) {
    
    return this.afs
      .collection('Usuarios',(ref) => ref.where('Usuario', '==', usuario).where('Password', '==', password))
      .valueChanges();
  }
  obtenerUsuarios(idEmpresa:string) {
    return this.afs
      .collection('Usuarios',(ref) => ref.where('idEmpresa', '==', idEmpresa).orderBy('Activo','desc'))
      .valueChanges();
  }
  obtenerUsuariosByMatriz(idMatriz:string) {
    return this.afs
      .collection('Usuarios',(ref) => ref.where('idMatriz', '==', idMatriz).orderBy('Activo','desc'))
      .valueChanges();
  }
  obtenerUsuariosbyCorreo(Correo:string) {
    return this.afs
      .collection('Usuarios',(ref) => ref.where('Correo', '==', Correo))
      .valueChanges();
  }
  obtenerUsuariosbyId(id:string) {
    return this.afs
      .collection('Usuarios',(ref) => ref.where('id', '==', id))
      .valueChanges();
  }
  ActualizarUsuario(usuario: any) {
    return this.afs
      .collection('Usuarios')
      .doc(usuario.id)
      .ref.update(usuario);
  }

  ActualizarPassw(Usuario: any) {
    return this.afs
      .collection('Usuarios')
      .doc(Usuario.id)
      .ref.update({Password:Usuario.Password});
  }
  ActualizarUsuarioEstado(Usuario: any,Activo:boolean) {
    return this.afs
      .collection('Usuarios')
      .doc(Usuario.id)
      .ref.update({Activo:Activo});
  }

  obtenerModulos() {
    return this.afs
      .collection('Modulos')
      .valueChanges();
  }
  obtenerAtributos() {
    return this.afs
      .collection('Atributos')
      .valueChanges();
  }
guardarRol(rol: any): Promise<string> {
  const id = this.afs.createId();
  return this.afs
    .collection('Roles')
    .doc(id)
    .ref.set(Object.assign(rol, { id: id }))
    .then(() => id); // Retorna el ID después de guardar
}
  obtenerRoles(idEmpresa:string) {
 
    return this.afs
      .collection('Roles',(ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }
  obtenerRolesByMatriz(idMatriz:string) {
 
    return this.afs
      .collection('Roles',(ref) => ref.where('idMatriz', '==', idMatriz))
      .valueChanges();
  }

  actualizarRol(Rol:any){
    return  this.afs
     .collection('Roles')
     .doc(Rol.id)
     .ref.update(Rol);
  }
}
