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
  crearUsuarioRegistro(user: any) {
    const id = this.afs.createId();
    const idEmpresa = this.afs.createId();
    const idMatriz= this.afs.createId();
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

    this.crearMatriz(_Matriz,idMatriz).then(resp=>{
      
    })
    this.crearEmpresa(_Empresa,idEmpresa).then(resp=>{

    })

    user.idEmpresa=idEmpresa
    user.idMatriz=idMatriz

    return this.afs
      .collection('Usuarios')
      .doc(id)
      .ref.set(Object.assign(user, { id: id }));
  }


  crearEmpresa(empresa: any,idEmpresa:any){
   
    return this.afs
    .collection('Empresa')
    .doc(idEmpresa)
    .ref.set(Object.assign(empresa, {id: idEmpresa}))
}
  crearMatriz(Matriz: any,idMatriz:any){
   
    return this.afs
    .collection('Corporaciones')
    .doc(idMatriz)
    .ref.set(Object.assign(Matriz, {id: idMatriz}))
}

  
  sendMail(usuario:any): Observable<any>{
    return this._http.post<any>(this.urlSeverMailLocal,usuario);
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
  guardarRol(Rol:any){
    var id = this.afs.createId();
   return this.afs
   .collection('Roles')
   .doc(id)
   .ref.set(Object.assign(Rol, { id: id }));
  }
}
