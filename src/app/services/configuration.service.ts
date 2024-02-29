import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor( private afs: AngularFirestore,) { }

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
}
