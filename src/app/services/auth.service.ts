import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //urlSeverMailLocal = 'http://localhost:3000/formulario/';
  urlSeverMailLocal = 'https://apisistemafinanciero.onrender.com/formulario/';
  Atributos:any=[]
  constructor(
    private afs: AngularFirestore,
    private _http: HttpClient
  ) {
    
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
      "Usuario":id,
      "FechaRegistro":user.FechaRegistro
    }

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
  obtenerRoles(idEmpresa:string) {
 
    return this.afs
      .collection('Roles',(ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }

  actualizarRol(Rol:any){
    return  this.afs
     .collection('Roles')
     .doc(Rol.id)
     .ref.update(Rol);
  }
}
