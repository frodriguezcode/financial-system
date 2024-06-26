import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})

export class EmpresasService {
    constructor (private afs: AngularFirestore){}


    //*Creamos una empresa
    crearEmpresa(empresa: any){
        const id = this.afs.createId();
        return this.afs
        .collection('Empresa')
        .doc(id)
        .ref.set(Object.assign(empresa, {id: id}))
    }

    //*Obtenemos las empresas
    obtenerEmpresa(idMatriz:string){
        return this.afs
        .collection('Empresa',(ref)=>ref.where('idMatriz','==',idMatriz))
        .valueChanges();
    }

    //~Actualizar Empresa
    actualizarEmpresa(empresa: any){
        return this.afs
        .collection('Empresa')
        .doc(empresa.id)
        .ref.update(empresa)
    }

    // ~Actualizar estado Empresa
    ActualizarEmpresaEstado(empresa: any,Activo:boolean) {
        return this.afs
          .collection('Empresa')
          .doc(empresa.id)
          .ref.update({Activo:Activo});
      }

}