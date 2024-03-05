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
    obtenerEmpresa(){
        return this.afs
        .collection('Empresa')
        .valueChanges();
    }

    //~Actualizar Empresa
    actualizarEmpresa(empresa: any){
        return this.afs
        .collection('Empresa')
        .doc(empresa.id)
        .ref.update(empresa)
    }

}