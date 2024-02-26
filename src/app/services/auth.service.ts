import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afs: AngularFirestore,
    private _http: HttpClient
  ) {}

//   !Creando un usuario
  crearUsuario(user: any) {
    const id = this.afs.createId();
    return this.afs
      .collection('Usuarios')
      .doc(id)
      .ref.set(Object.assign(user, { id: id }));
  }
}
