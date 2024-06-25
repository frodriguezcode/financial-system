import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  urlSeverMailLocal = 'http://localhost:3000/formulario/';

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


  sendMail(usuario:any): Observable<any>{
    return this._http.post<any>(this.urlSeverMailLocal,usuario);
  }


}
