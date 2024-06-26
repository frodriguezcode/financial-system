import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  ActualizarUsuario(usuario: any) {
    return this.afs
      .collection('Usuarios')
      .doc(usuario.id)
      .ref.update(usuario);
  }

  ActualizarUsuarioEstado(Usuario: any,Activo:boolean) {
    return this.afs
      .collection('Usuarios')
      .doc(Usuario.id)
      .ref.update({Activo:Activo});
  }
}
