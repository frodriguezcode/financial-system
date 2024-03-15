import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor( private afs: AngularFirestore,) { }

  
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
  obtenerBancos() {
    return this.afs
    .collection('Bancos')
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
      .collection('Categoria',(ref)=>ref.where('Calculado','==',false))
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

   
}


