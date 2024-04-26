import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registro } from '../models/registro';
import { error } from 'console';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor( private afs: AngularFirestore,) { }
ordenarSemanas(semanas){

  semanas.sort((a, b) => {
    // Ordenar por año
    if (a.Anio !== b.Anio) {
      return a.Anio - b.Anio;
    }
    // Si el año es el mismo, ordenar por número de mes
    if (a.NumMes !== b.NumMes) {
      return a.NumMes - b.NumMes;
    }
    // Si el año y el número de mes son iguales, ordenar por número de semana
    return a.NumSemana - b.NumSemana;
    
  });
  return semanas
}
ordenarMeses(meses){

  meses.sort((a, b) => {
    // Ordenar por año
    if (a.Anio !== b.Anio) {
      return a.Anio - b.Anio;
    }
    // Si el año es el mismo, ordenar por número de mes
    else if (a.NumMes !== b.NumMes) {
      return a.NumMes - b.NumMes;
    }
    return a.NumMes - b.NumMes;
 

    
  });
  return meses
}
ordenarAnios(anios){

  anios.sort((a, b) => {
    // Ordenar por año
    if (a.Anio !== b.Anio) {
      return a.Anio - b.Anio;
    }
  
    return a.Anio - b.Anio;
 

    
  });
  return anios
}

ObtenerCobrosCreditoFacturasVencidasMes(){
let Item={
"Activo":true,
"Editando":false,
"FechaCreacion":"2024-02-02",
"Nombre":"Cobros por ventas a crédito - Facturas vencidas en el mes",
"Orden":0,
"Tipo":1,
"idCategoria":"od11V2OHVgaLG1RiXMiz",
"id":"CobrosCreditoFacturasVencidasMesXMiz"
}
return Item

}
ObtenerCobrosAnticipados(){
let Item={
"Activo":true,
"Editando":false,
"FechaCreacion":"2024-02-02",
"Nombre":"Cobros por ventas a crédito - Cobros anticipados",
"Orden":0,
"Tipo":1,
"idCategoria":"od11V2OHVgaLG1RiXMiz",
"id":"CobrosAnticipadosXMiz"
}
return Item

}
ObtenerCobrosCreditoFacturasVencidasMesAnteriores(){
  let Item={
  "Activo":true,
  "Editando":false,
  "FechaCreacion":"2024-02-02",
  "Nombre":"Cobros por ventas a crédito - Facturas vencidas en meses anteriores",
  "Orden":0,
  "Tipo":1,
  "idCategoria":"od11V2OHVgaLG1RiXMiz",
  "id":"CobrosCreditoFacturasVencidasMesAnterioresXMiz"
  }
  return Item
  
  }
ObtenerPagoProveedoresMes(){
  let Item={
  "Activo":true,
  "Editando":false,
  "FechaCreacion":"2024-02-02",
  "Nombre":"Pago a Proveedores - Facturas vencidas en el mes",
  "Orden":0,
  "Tipo":2,
  "idCategoria":"KtA2Cxpd79TJrW9afqR9",
  "id":"ObtenerPagoProveedoresMesfqR9"
  }
  return Item
  
}
ObtenerPagosAnticipados(){
  let Item={
  "Activo":true,
  "Editando":false,
  "FechaCreacion":"2024-02-02",
  "Nombre":"Pago a Proveedores - Pagos anticipados",
  "Orden":0,
  "Tipo":2,
  "idCategoria":"KtA2Cxpd79TJrW9afqR9",
  "id":"PagosAnticipadosfqR9"
  }
  return Item
  
}
ObtenerPagosFacturasVencidasMesAnteriores(){
  let Item={
  "Activo":true,
  "Editando":false,
  "FechaCreacion":"2024-02-02",
  "Nombre":"Pago a Proveedores - Facturas vencidas en meses anteriores",
  "Orden":0,
  "Tipo":2,
  "idCategoria":"KtA2Cxpd79TJrW9afqR9",
  "id":"PagosFacturasVencidasMesAnterioresfqR9"
  }
  return Item
  
}

obtenerUsuarios(idEmpresa:any) {
  return this.afs
  .collection('Usuarios',(ref)=>ref.where('idEmpresa','==',idEmpresa))
  .valueChanges();
}
  //*------------BANCOS------------
  //   !Creando un banco
  crearBanco(banco: any) {
    const id = this.afs.createId();
    return this.afs
      .collection('Bancos')
      .doc(id)
      .ref.set(Object.assign(banco, { id: id }));
  }
  // !Obtener las monedas
  obtenerMonedas() {
    return this.afs
    .collection('Monedas')
    .valueChanges();
  }
  // !Obtener los bancos
  obtenerBancos(idEmpresa:any) {
    return this.afs
    .collection('Bancos',(ref)=>ref.where('idEmpresa','==',idEmpresa))
    .valueChanges();
  }
  
ActualizarBanco(banco: any) {
  return this.afs
    .collection('Bancos')
    .doc(banco.id)
    .ref.update(banco);
}
ActualizarBancoEstado(Banco: any,Activo:boolean) {
  return this.afs
    .collection('Bancos')
    .doc(Banco.id)
    .ref.update({Activo:Activo});
}
    //*------------BANCOS------------


    //?------------SUCURSALES------------

  // !Obtener las sucursales
  obtenerSucursales(idEmpresa:any) {
    return this.afs
    .collection('Sucursales',(ref)=>ref.where('idEmpresa','==',idEmpresa))
    .valueChanges();
  }
  crearSucursal(sucursal:any) {
    const id = this.afs.createId();
    return this.afs
      .collection('Sucursales')
      .doc(id)
      .ref.set(Object.assign(sucursal, { id: id }));
  }

  ActualizarSucursal(sucursal: any) {
    return this.afs
      .collection('Sucursales')
      .doc(sucursal.id)
      .ref.update(sucursal);
  }

  ActualizaEstadoSucursal(Sucursal: any,Activo:boolean) {
    return this.afs
      .collection('Sucursales')
      .doc(Sucursal.id)
      .ref.update({Activo:Activo});
  }

    // !Obtener las empresas
    obtenerEmpresas(idMatriz:any) {
      console.log('idMatriz',idMatriz)
      return this.afs
      .collection('Empresa',(ref)=>ref.where('idMatriz','==',idMatriz))
      .valueChanges();
    }

    //?------------SUCURSALES------------


     //!------------DEPARTAMENTOS------------

     //   !Creando un departamento
  crearDepartamento(departamento: any) {
    const id = this.afs.createId();
    return this.afs
      .collection('Departamentos')
      .doc(id)
      .ref.set(Object.assign(departamento, { id: id }));
  }

    // !Obtener los departamentos
    obtenerDepartamentos() {
      return this.afs
      .collection('Departamentos')
      .valueChanges();
    }
    


     //!------------DEPARTAMENTOS------------



    obtenerCategorias() {
      return this.afs
      .collection('Naturalezas',(ref)=>ref.orderBy('Orden','asc').where('Calculado','==',false))
      .valueChanges();
    }

    obtenerCategoriasFlujos() {
      return this.afs
      .collection('Naturalezas',(ref)=>ref.orderBy('Orden','asc'))
      .valueChanges();
    }

 //!------------Items------------
    crearItem(Item: any) {
      const id = this.afs.createId();
      return this.afs
        .collection('Items')
        .doc(id)
        .ref.set(Object.assign(Item, { id: id }));
    }

    obtenerItems(idEmpresa:any) {
      return this.afs
      .collection('Items',(ref)=>ref.where('idEmpresa','==',idEmpresa).orderBy('Orden','asc'))
      .valueChanges();
    }
    obtenerCuentas(idEmpresa:any) {
      return this.afs
      .collection('Bancos',(ref)=>ref.where('idEmpresa','==',idEmpresa))
      .valueChanges();
    }

    ActualizarItem(items: any) {
      return this.afs
        .collection('Items')
        .doc(items.id)
        .ref.update(items);
    }
    ActualizarItemEstado(Items: any,Activo:boolean) {
      return this.afs
        .collection('Items')
        .doc(Items.id)
        .ref.update({Activo:Activo});
    }

    // !Socios de negocios
    crearSocio(Socio: any) {
      const id = this.afs.createId();
      return this.afs
        .collection('Socios')
        .doc(id)
        .ref.set(Object.assign(Socio, { id: id }));
    }

    obtenerSocios(idEmpresa:any) {
      return this.afs
      .collection('Socios',(ref)=>ref.where('idEmpresa','==',idEmpresa))
      .valueChanges();
    }

   
    // obtenerSocios() {
    //   return this.afs
    //   .collection('Socios')
    //   .valueChanges();
    // }

    ActualizarSocio(socio: any) {
      return this.afs
        .collection('Socios')
        .doc(socio.id)
        .ref.update(socio);
    }


    ActualizarSocioEstado(socios: any,Activo:boolean) {
      return this.afs
        .collection('Socios')
        .doc(socios.id)
        .ref.update({Activo:Activo});
    }



    // !Registros
    crearRegistro(Registro: any) {
      const id = this.afs.createId();
      return this.afs
        .collection('Registro')
        .doc(id)
        .ref.set(Object.assign(Registro, { id: id }));
    }

    obtenerRegistros(idEmpresa:any): Observable<Registro[]> {
      return this.afs
      .collection('Registro',(ref)=>ref.where('idEmpresa','==',idEmpresa).orderBy('Orden','desc'))
      .valueChanges();
    }
    obtenerRegistrosTipo(idEmpresa:any,Tipo:string): Observable<Registro[]> {
      return this.afs
      .collection('Registro',(ref)=>ref.where('idEmpresa','==',idEmpresa).where('TipoRegistro','==',Tipo).orderBy('Orden','desc'))
      .valueChanges();
    }

    obtenerRegistrosPromise(idEmpresa: any): Promise<Registro[]> {
      return new Promise<Registro[]>((resolve, reject) => {
        this.obtenerRegistros(idEmpresa).subscribe(
          (data: Registro[]) => resolve(data),
          (error) => reject(error)
        );
      });
    }


    ActualizarRegistro(Registro: any) {
      return this.afs
        .collection('Registro')
        .doc(Registro.id)
        .ref.update(Registro);
    }
    borrarRegistro(id: string) {
      return this.afs.collection('Registro').doc(id).delete();
    }
    DesactivarRegistro(IdRegistro: any) {
      return this.afs
        .collection('Registro')
        .doc(IdRegistro)
        .ref.update({Activo:false});
    }
   
}


