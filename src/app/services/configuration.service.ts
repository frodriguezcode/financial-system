import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registro } from '../models/registro';
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = 'http://worldtimeapi.org/api/timezone';
  private usuarioSource = new BehaviorSubject<any>(null)
  usuario$ = this.usuarioSource.asObservable();
  private RegistrosTrimestrales = new BehaviorSubject<any>(null);
  RegistrosTrimestrales$ = this.RegistrosTrimestrales.asObservable();

  private RegistrosSemestrales = new BehaviorSubject<any>(null);
  RegistrosSemestrales$ = this.RegistrosSemestrales.asObservable();

  private idEmpresaSource = new BehaviorSubject<any>(null)

 
  idEmpresa$ = this.idEmpresaSource.asObservable();
  constructor( private afs: AngularFirestore,private http: HttpClient, private datePipe:DatePipe) { 
    moment.updateLocale('es', {
      week: {
        dow: 0, // Sunday is the first day of the week
        doy: 6  // The week that contains Jan 1st is the first week of the year.
      }
    });
  }

  enviarRegistrosTrimestrales(data: any) {
    this.RegistrosTrimestrales.next(data);
  }
  enviarRegistrosSemestrales(data: any) {
    this.RegistrosSemestrales.next(data);
  }
  setUsuario(usuario: any) {
    this.usuarioSource.next(usuario);
  }
  setIdEmpresa(idEmpresa: any) {
    this.idEmpresaSource.next(idEmpresa);
  }


  getCalendario(){
    let _Calendario:[
      
    ]
  }
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  posicionarSemanas(semanas:any){
    semanas.sort((a, b) => {
      if (a.Anio !== b.Anio) return a.Anio - b.Anio;
      if (a.Mes !== b.Mes) return a.Mes - b.Mes;
      return a.NumSemana - b.NumSemana;
  });
  
  // Paso 2: Encontrar las semanas iniciales y finales por mes
  const semanasConPosicion = semanas.map((semana, index, array) => {
    const esPrimeraSemana = index === 0 || semana.Anio !== array[index - 1].Anio || semana.Mes !== array[index - 1].Mes;
    const esUltimaSemana = index === array.length - 1 || semana.Anio !== array[index + 1].Anio || semana.Mes !== array[index + 1].Mes;


    let posicion = 3;
    if (semana.Mes === 1 && semana.NumSemana === 52) {
      posicion = 1;
    } 

   else if (esPrimeraSemana && esUltimaSemana) {
        posicion = 0; // Si es la única semana del mes, es "inicial"
    } else if (esPrimeraSemana) {
        posicion = 1;
    } else if (esUltimaSemana) {
        posicion = 2;
    }

    return {
        ...semana,
        posicion
    };
});
  return semanasConPosicion
  }
  agruparPorAnoMesSemana(catalogoFechas: any[]): any {
    const agrupado = catalogoFechas.reduce((acc, current) => {
      const clave = `${current.año}-${current.numeroMes}-Semana${current.semana}`;
      if (!acc[clave]) {
        acc[clave] = {
          año: current.año,
          mes: current.mes,
          numeroMes: current.numeroMes,
          semana: current.numSemana,
          fechas: []
        };
      }
      acc[clave].fechas.push(current.fecha);
      return acc;
    }, {});

    return Object.values(agrupado);
  }
  generarCatalogoFechas(fechaInicio: string): any[] {
    const catalogoFechas = [];
    let fecha = moment(fechaInicio);
    const hoy = moment();  // Fecha de hoy

    while (fecha.isSameOrBefore(hoy)) {
      catalogoFechas.push({
        fecha: fecha.format('YYYY-MM-DD'),
        mes:this.capitalizeFirstLetter(fecha.format('MMMM')),
        numSemana: fecha.isoWeek(),
       // numSemana: fecha.week(),
        numeroMes:Number(fecha.format('MM')),
        semana:"Semana "+ fecha.isoWeek(),
        año: Number(fecha.format('YYYY'))
      });
      fecha.add(1, 'days');
    }

    return catalogoFechas;
  }
  getDaysOfMonth(timezone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${timezone}`);
  }
  filtradoDinamico(Criterios:any,datos:any){

    const ArregloFiltrado = datos.filter((item: any) => {
      for (const key in Criterios) {
        if (Array.isArray(Criterios[key])) {
          if (Criterios[key].length > 0 && !Criterios[key].includes(item[key])) {
            return false;
          }
        } else {
          if (key !== 'idCliente' && Criterios[key] !== '' && item[key] !== Criterios[key]) {
            return false;
          }
        }
      }
      return true;
    });
  
        return ArregloFiltrado
  
    
    }
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

getNumMes(Fecha:any){
return  Number((Fecha.substring(5)).substring(0,2))
}

generarMesesAgrupadosPorAnio(fechaInicio: string, fechaFinal: string): any {
  let inicio :any = new Date( `${fechaInicio}T00:00:00`); // Fecha de inicio
console.log('inicio',inicio)
  const final = new Date(`${fechaFinal}T00:00:00`); // Fecha de finalización
  const resultado: { [anio: number]: { numero: number, nombre: string }[] } = {};
  while (inicio <= final) {
    const anio = inicio.getFullYear(); // Año de la fecha actual
    const mesNumero = inicio.getMonth()+1; // Mes de la fecha actual (de 1 a 12)
    const mesNombre = this.capitalizarMes(inicio.toLocaleDateString('es-ES', { month: 'long' })); // Nombre del mes capitalizado
    
    // Si el año no está en el objeto, lo inicializamos
    if (!resultado[anio]) {
      resultado[anio] = [];
    }

    // Agregamos el mes al arreglo
    resultado[anio].push({
      numero: mesNumero,
      nombre: mesNombre
    });
    
    // Incrementamos el mes
    inicio.setMonth(inicio.getMonth() + 1);
  }

  return resultado;
}

capitalizarMes(mes: string): string {
  return mes.charAt(0).toUpperCase() + mes.slice(1);
}


obtenerUsuarios(idEmpresa:any) {
  return this.afs
  .collection('Usuarios',(ref)=>ref.where('idEmpresa','==',idEmpresa))
  .valueChanges();
}

crearTipoOperacion(tipo: any) {
  const id = this.afs.createId();
  return this.afs
    .collection('TiposOperacion')
    .doc(id)
    .ref.set(Object.assign(tipo, { id: id }));
}

obtenerTiposOperacionByEmpresa(idEmpresa) {
  return this.afs
  .collection('TiposOperacion',(ref)=>ref.where('idEmpresa','==',idEmpresa))
  .valueChanges();
}
obtenerTiposOperacionByMatriz(idMatriz) {
  return this.afs
  .collection('TiposOperacion',(ref)=>ref.where('idMatriz','==',idMatriz))
  .valueChanges();
}

ActualizarTipo(tipo: any) {
  return this.afs
    .collection('TiposOperacion')
    .doc(tipo.id)
    .ref.update(tipo);
}

ActualizarTipoEstado(Tipo: any,Activo:boolean) {
  return this.afs
    .collection('TiposOperacion')
    .doc(Tipo.id)
    .ref.update({Activo:Activo});
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
  // !Obtener planes
  obtenerPlanes() {
    return this.afs
    .collection('Planes')
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
  obtenerSucursalesByMatriz(idMatriz:any) {
    return this.afs
    .collection('Sucursales',(ref)=>ref.where('idMatriz','==',idMatriz))
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

      return this.afs
      .collection('Empresa',(ref)=>ref.where('idMatriz','==',idMatriz))
      .valueChanges();
    }

  ActualizarEmpresa(idEmpresa:string) {
      return this.afs
    .collection('Empresa')
    .doc(idEmpresa)
    .ref.update({ConfigInicial:true});
}

    //?------------SUCURSALES------------
    obtenerAniosPlaneacion(idEmpresa:any) {
      return this.afs
      .collection('AniosPlaneacion',(ref)=>ref.where('idEmpresa','==',idEmpresa))
      .valueChanges();
    }
    crearAniosPlaneacion(Anios:any) {
      const id = this.afs.createId();
      return this.afs
        .collection('AniosPlaneacion')
        .doc(id)
        .ref.set(Object.assign(Anios, { id: id }));
    }
    ActualizarAniosPlaneacion(AnioPlaneacion: any) {
      return this.afs
        .collection('AniosPlaneacion')
        .doc(AnioPlaneacion.id)
        .ref.update(AnioPlaneacion);
    }

        //?------------PROYECTOS------------

  
  obtenerProyectos(idEmpresa:any) {
    return this.afs
    .collection('Proyectos',(ref)=>ref.where('idEmpresa','==',idEmpresa))
    .valueChanges();
  }
  obtenerProyectosByMatriz(idMatriz:any) {
    return this.afs
    .collection('Proyectos',(ref)=>ref.where('idMatriz','==',idMatriz))
    .valueChanges();
  }
  ActualizarUsuario(usuario: any) {
     this.afs
      .collection('Usuarios')
      .doc(usuario.id)
      .ref.update(usuario);
  }
  crearProyecto(proyecto:any) {
    const id = this.afs.createId();
    proyecto.Usuarios.forEach(user => {
      if( !user.Proyectos){
        user.Proyectos = []
      }
      user.Proyectos.push(id)
      this.ActualizarUsuario(user)
    });
    delete proyecto.Usuarios
    return this.afs
      .collection('Proyectos')
      .doc(id)
      .ref.set(Object.assign(proyecto, { id: id }));
  }

  ActualizarProyecto(proyecto: any) {
    return this.afs
      .collection('Proyectos')
      .doc(proyecto.id)
      .ref.update(proyecto);
  }

  ActualizaEstadoProyecto(Proyecto: any,Activo:boolean) {
    return this.afs
      .collection('Proyectos')
      .doc(Proyecto.id)
      .ref.update({Activo:Activo});
  }



    //?------------PROYECTOS------------


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
    obtenerSaldoInicial(idEmpresa) {
      return this.afs
      .collection('SaldosIniciales',(ref)=>ref.where('idEmpresa','==',idEmpresa))
      .valueChanges();
    }
    crearSaldoInicial(saldo:any) {
      const id = this.afs.createId();
      return this.afs
        .collection('SaldosIniciales')
        .doc(id)
        .ref.set(Object.assign(saldo, { id: id }));
    }

    ActualizarSaldo(saldo: any) {
      return this.afs
        .collection('SaldosIniciales')
        .doc(saldo.id)
        .ref.update(saldo);
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
    crearRegistro(Registro: any): Promise<string> {
   
      return this.afs
        .collection('Registro')
        .doc(Registro.id)
        .ref.set({ ...Registro}) // Usa spread operator para añadir el id al objeto
        .then(() => Registro.id); // Retorna el ID una vez que se complete la operación
    }
    copiarRegistro(Registro: any) {
      return this.afs
        .collection('Registro')
        .doc(Registro.id)
        .ref.set(Object.assign(Registro, { id: Registro.id }));
    }
    
    crearRegistroFactura(Registro: any) {
      const id = this.afs.createId();
      return this.afs
        .collection('RegistrosFacturas')
        .doc(id)
        .ref.set(Object.assign(Registro, { id: id }));
    }

    obtenerRegistros(idEmpresa:any): Observable<Registro[]> {
      return this.afs
      .collection('Registro',(ref)=>ref.where('idEmpresa','==',idEmpresa).orderBy('FechaRegistro','desc'))
      .valueChanges();
    }
    obtenerRegistrosbyCuenta(idElemento:any) {
      return this.afs
      .collection('Registro',(ref)=>ref.where('Elemento.id','==',idElemento))
      .valueChanges();
    }

    getElementsFromMultipleCollections(idElemento:any): Observable<any[]> {
      const collection1$ = this.afs.collection('Registro', ref =>
        ref.where('Elemento.id', '==', idElemento)
      ).valueChanges();
  
      const collection2$ = this.afs.collection('PlanificacionValores', ref =>
        ref.where('idItem', '==', idElemento)
      ).valueChanges();
  
      // Combina los resultados de ambas colecciones
      return combineLatest([collection1$, collection2$]).pipe(
        map(([result1, result2]) => [...result1, ...result2])
      );
    }
    obtenerRegistrosByMatriz(idMatriz:any): Observable<Registro[]> {
      return this.afs
      .collection('Registro',(ref)=>ref.where('idMatriz','==',idMatriz).orderBy('FechaRegistro','desc'))
      .valueChanges();
    }
    obtenerRegistrosByProyecto(idProyecto:any): Observable<any[]> {
      return this.afs
      .collection('Registro',(ref)=>ref.where('idProyecto','==',idProyecto))
      .valueChanges();
    }
    obtenerRegistrosTipo(idEmpresa:any,Tipo:string): Observable<Registro[]> {
      return this.afs
      .collection('Registro',(ref)=>ref.where('idEmpresa','==',idEmpresa).where('TipoRegistro','==',Tipo).orderBy('Orden','desc'))
      .valueChanges();
    }
    obtenerRegistrosFacturas(idEmpresa:any): Observable<any[]> {
      return this.afs
      .collection('RegistrosFacturas',(ref)=>ref.where('idEmpresa','==',idEmpresa).orderBy('Orden','desc'))
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


 
    updateRegistro(Registro: any) {
      return this.afs
        .collection('Registro')
        .doc(Registro.id)
        .ref.update(Registro);
    }
    ActualizarPagoFactura(Registro: any) {
      return this.afs
        .collection('RegistrosFacturas')
        .doc(Registro.id)
        .ref.update(Registro);
    }
    borrarRegistro(id: string) {
      return this.afs.collection('Registro').doc(id).delete();
    }
    borrarItem(id: string) {
      return this.afs.collection('Items').doc(id).delete();
    }
    borrarRegistroFactura(id: string) {
      return this.afs.collection('RegistrosFacturas').doc(id).delete();
    }
    DesactivarRegistro(IdRegistro: any) {
      return this.afs
        .collection('Registro')
        .doc(IdRegistro)
        .ref.update({Activo:false});
    }



    
  identificarSemanas(semanas: any[]): any[] {
    const grupos: { [key: string]: any  [] } = semanas.reduce((acc, semana) => {
      const key = `${semana.Anio}-${semana.NumMes}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(semana);
      return acc;
    }, {});

    for (const key in grupos) {
      const semanasDelMes = grupos[key];
      semanasDelMes.sort((a, b) => a.NumSemana - b.NumSemana); // Asegurarse de que estén ordenadas
      semanasDelMes.forEach((semana, index) => {
        if (index === 0) {
          semana.Posicion = 'Inicial';
        } else if (index === semanasDelMes.length - 1) {
          semana.Posicion = 'Final';
        } else {
          semana.Posicion = 'En medio';
        }
      });
    }
    return semanas;
  }

//Planificación
crearValorPlan(Valor: any) {
  const id = this.afs.createId();
  return this.afs
    .collection('PlanificacionValores')
    .doc(id)
    .ref.set(Object.assign(Valor, { id: id }));
}
ActualizarValorPlan(Valor: any) {

  return this.afs
    .collection('PlanificacionValores')
    .doc(Valor.id)
    .ref.update(Valor);
}

//Store Manager Recapt

async guardarOModificarRegistro(Registro: any) {
  try {
    const snapshot = await firstValueFrom(
      this.afs.collection('StoreManagerRecapt', ref =>
        ref.where('AnioRegistro', '==', Registro.AnioRegistro)
           .where('NumMesRegistro', '==', Registro.NumMesRegistro)
           .where('idElemento', '==', Registro.idElemento)
           .where('idEmpresa', '==', Registro.idEmpresa)
      ).get()
    );

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      return this.afs.collection('StoreManagerRecapt').doc(docId).update({
        Valor: Number(Registro.Valor),
        FechaActualizacion:this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd')
      });
    } else {
      const id = this.afs.createId();
      return this.afs.collection('StoreManagerRecapt').doc(id).set({
        ...Registro,
        id: id
      });
    }
  } catch (error) {
    console.error('Error al guardar o modificar Meta:', error);
    throw error;
  }
}

obtenerRegistrosStoreManagerRecapt(idEmpresa:any) {

  const StoreManagerRecapt$ = this.afs.collection('StoreManagerRecapt',(ref)=>ref.where('idEmpresa','==',idEmpresa)).valueChanges();
  const Registros$ = this.afs.collection('Registro',(ref)=>ref.where('idEmpresa','==',idEmpresa)).valueChanges();
  const SaldosIniciales$ = this.afs.collection('SaldosIniciales',(ref)=>ref.where('idEmpresa','==',idEmpresa)).valueChanges();

  return combineLatest([ StoreManagerRecapt$,Registros$,SaldosIniciales$  ]).pipe(
    map(([RegistrosSMR, Registros,SaldosIniciales]) => {
  
      return [RegistrosSMR, Registros,SaldosIniciales];
    })
  );

}





obtenerValoresPlanes(idEmpresa:any): Observable<any[]> {
  return this.afs
  .collection('PlanificacionValores',(ref)=>ref.where('idEmpresa','==',idEmpresa))
  .valueChanges();
}

crearValorPlanItem(Valor: any) {
  const id = this.afs.createId();
  return this.afs
    .collection('PlanificacionValoresItems')
    .doc(id)
    .ref.set(Object.assign(Valor, { id: id }));
}
ActualizarValorPlanItem(Valor: any) {

  return this.afs
    .collection('PlanificacionValoresItems')
    .doc(Valor.id)
    .ref.update(Valor);
}

obtenerValoresPlanesItems(idEmpresa:any): Observable<any[]> {
  return this.afs
  .collection('PlanificacionValoresItems',(ref)=>ref.where('idEmpresa','==',idEmpresa))
  .valueChanges();
}

obtenerColecciones(idMatriz:any) {
const Roles$ = this.afs.collection('Roles',(ref)=>ref.where('idMatriz','==',idMatriz)).valueChanges();
const Usuarios$ = this.afs.collection('Usuarios',(ref)=>ref.where('idMatriz','==',idMatriz)).valueChanges();
const SaldosIniciales$ = this.afs.collection('SaldosIniciales',(ref)=>ref.where('idMatriz','==',idMatriz)).valueChanges();
const Sucursales$ = this.afs.collection('Sucursales',(ref)=>ref.where('idMatriz','==',idMatriz)).valueChanges();
const Proyectos$ = this.afs.collection('Proyectos',(ref)=>ref.where('idMatriz','==',idMatriz)).valueChanges();

return combineLatest([ Roles$,Usuarios$,SaldosIniciales$,Sucursales$,Proyectos$]).pipe(
   
    map(([Roles, Usuarios,SaldosIniciales,Sucursales,Proyectos]) => {
  
      return [Roles, Usuarios,SaldosIniciales,Sucursales,Proyectos];
    })
);

}


   
}


