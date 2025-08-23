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

  private dataPlaneadoFinanciera = new BehaviorSubject<any>(null);
  dataPlaneadoFinanciera$ = this.dataPlaneadoFinanciera.asObservable();

  private idEmpresaSource = new BehaviorSubject<any>(null)
  //linkApiMejorada = 'http://localhost:3000/'
  linkApiMejorada = 'https://apisistemafinanciero.onrender.com/'
  DataTreeTable: any = []
  Semestres: any = []
  SemestresBack: any = []
  Trimestres: any = []
  TrimestresBack: any = []
  Anios: any = []
  AniosBack: any = []
  Meses: any = []
  SaldoInicial: any = []
  RegistrosSaldosFinalesMensuales: any = []
  DataSaldoFinalMensual: any = []
  DataSaldoInicialMensual: any = []
  idEmpresa$ = this.idEmpresaSource.asObservable();
  constructor(private afs: AngularFirestore, private http: HttpClient, private datePipe: DatePipe) {
    this.Semestres = [
      {
        Semestre: "Semestre 1",
        Nombre: "Semestre 1",
        id: 1
      },
      {
        Trimestre: "Semestre 2",
        Nombre: "Semestre 2",
        id: 2
      }

    ]
    this.SemestresBack = this.Semestres
    this.Trimestres = [
      {
        Trimestre: "Trimestre 1",
        Nombre: "Trimestre 1",
        id: 1,
        idSemestre: 1
      },
      {
        Trimestre: "Trimestre 2",
        Nombre: "Trimestre 2",
        id: 2,
        idSemestre: 1
      },
      {
        Trimestre: "Trimestre 3",
        Nombre: "Trimestre 3",
        id: 3,
        idSemestre: 2
      },
      {
        Trimestre: "Trimestre 4",
        Nombre: "Trimestre 4",
        id: 4,
        idSemestre: 2
      }
    ]
    this.TrimestresBack = this.Trimestres
    this.Anios = [
      {
        Anio: 2023,
        Mostrar: true
      },
      {
        Anio: 2024,
        Mostrar: true

      },
      {
        Anio: 2025,
        Mostrar: true

      },
    ]
    this.AniosBack = this.Anios
    this.Meses = [

      {
        Mes: 'Enero',
        NumMes: 1,
        Trimestre: 1,
        Semestre: 1,
        seleccionado: false
      },
      {
        Mes: 'Febrero',
        NumMes: 2,
        Trimestre: 1,
        Semestre: 1,
        seleccionado: false
      },
      {
        Mes: 'Marzo',
        NumMes: 3,
        Trimestre: 1,
        Semestre: 1,
        seleccionado: false
      },
      {
        Mes: 'Abril',
        NumMes: 4,
        Trimestre: 2,
        Semestre: 1,
        seleccionado: false
      },
      {
        Mes: 'Mayo',
        NumMes: 5,
        Trimestre: 2,
        Semestre: 1,
        seleccionado: false
      },
      {
        Mes: 'Junio',
        NumMes: 6,
        Trimestre: 2,
        Semestre: 1,
        seleccionado: false
      },
      {
        Mes: 'Julio',
        NumMes: 7,
        Trimestre: 3,
        Semestre: 2,
        seleccionado: false
      },
      {
        Mes: 'Agosto',
        NumMes: 8,
        Trimestre: 3,
        Semestre: 2,
        seleccionado: false
      },
      {
        Mes: 'Septiembre',
        NumMes: 9,
        Trimestre: 3,
        Semestre: 2,
        seleccionado: false
      },
      {
        Mes: 'Octubre',
        NumMes: 10,
        Trimestre: 4,
        Semestre: 2,
        seleccionado: false
      },
      {
        Mes: 'Noviembre',
        NumMes: 11,
        Trimestre: 4,
        Semestre: 2,
        seleccionado: false
      },
      {
        Mes: 'Diciembre',
        NumMes: 12,
        Trimestre: 4,
        Semestre: 2,
        seleccionado: false
      },

    ]



    moment.updateLocale('es', {
      week: {
        dow: 0, // Sunday is the first day of the week
        doy: 6  // The week that contains Jan 1st is the first week of the year.
      }
    });
  }

  obtenerDataEmpresa(idCorporacion: any) {
    return this.http.get(`${this.linkApiMejorada + 'obtenerDataByEmpresa/' + idCorporacion}`);
  }


  construirItemsCatalogos(
    real: boolean,
    Categorias: any,
    CantMeses: any,
    AniosSeleccionados: any,
    Registros: any,
    DataFlujoEfectivo: any,
    SaldosIniciales: any,
    Items: any
  ) {
    this.DataTreeTable = []
    this.SaldoInicial = SaldosIniciales
    Categorias.forEach(categ => {

      this.DataTreeTable.push({
        OrdenData:
          categ.Orden == 2 ? 1 :
            categ.Orden == 3 ? 2 :
              categ.Orden == 5 ? 3 :
                categ.Orden == 6 ? 4 :
                  categ.Orden == 8 ? 5 :
                    categ.Orden == 9 ? 6 :
                      categ.Orden == 1 ? 7 :
                        categ.Orden == 4 ? 8 :
                          categ.Orden == 7 ? 9 :
                            categ.Orden == 10 ? 10 :
                              categ.Orden == 0 ? 11 :
                                categ.Orden == 11 ? 12 :
                                  categ.Orden == 13 ? 14 : 15,
        data: {
          Nombre: categ.Nombre,
          size: '200mb',
          type: 'Folder',
          valores: {},
          idCategoria: categ.id,
          idAbuelo: categ.idAbuelo || '',
          orden: categ.Orden,
          tipo:
            (categ.Orden == 1 || categ.Orden == 4 || categ.Orden == 7 || categ.Orden == 10) ? 'Abuelo' :
              (categ.Orden == 0) ? 'Saldo Inicial' :
                (categ.Orden == 11) ? 'Saldo Final' :
                  (categ.Orden == 13 || categ.Orden == 14) ? 'Comparativa'
                    : 'Padre'
        },
        children:

          this.getItemsByCategoria(categ.id, Items, categ.Tipo)

      })

    })

    if (real == true) {
      return this.construirValores(AniosSeleccionados, CantMeses, Registros,DataFlujoEfectivo)

    }
    else {
      return this.construirValoresPlaneado(AniosSeleccionados, CantMeses, Registros, DataFlujoEfectivo)
    }


  }

  construirValoresPlaneado(AniosSeleccionados: any, MesesSeleccionados: any, Registros: any, DataFlujoEfectivo: any) {
    let AniosCabecera = AniosSeleccionados.length > 0 ? AniosSeleccionados : this.Anios
    let CantidadMeses: number = 0
    CantidadMeses = MesesSeleccionados
    this.RegistrosSaldosFinalesMensuales = []
    let DataTreeTable = [...this.DataTreeTable]
    DataTreeTable
      .sort((a: any, b: any) => a.OrdenData - b.OrdenData)
      .forEach(dataTree => {
        if (dataTree.data.valores !== undefined) {
          dataTree.data.valores = {};
          AniosCabecera.forEach(anio => {
            let totalAnual = 0;
            const claveAnual = `${dataTree.data.idCategoria}-${anio.Anio}`;
            const claveAnualPromedio = `Prom-${dataTree.data.idCategoria}-${anio.Anio}`;
            this.Semestres.forEach(semestre => {
              this.getTrimestresBySemestre(semestre.id).forEach((trim: any) => {

                this.getMesesByTrimestre(trim.id).forEach(mes => {
                  const claveMensual = `${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`;
                  let key = `${mes.NumMes}-${anio.Anio}`;
                  if (dataTree.data.tipo == 'Saldo Inicial') {
                    this.RegistrosSaldosFinalesMensuales.push({
                      "key": key,
                      "Anio": anio.Anio,
                      "Valor":
                        this.getValorSaldoFinal(mes.NumMes, anio.Anio, Registros) || 0
                    })



                    const valor =

                      (this.getSaldoInicialMensual(mes.NumMes, anio.Anio) || 0)

                    const valorAnual = this.obtenerValorSaldoInicialAnual(anio.Anio) || 0
                    const valorAnualPromedio = Number((valorAnual / CantidadMeses).toFixed(0))


                    dataTree.data.valores[claveMensual] =
                    {
                      "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valor,
                      "Color": valor < 0 ? '#ff3200' : '#000000',
                    }


                    dataTree.data.valores[claveAnual] =
                    {
                      "Valor": valorAnual < 0 ? ('-$' + (valorAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnual,
                      "Color": valorAnual < 0 ? '#ff3200' : '#000000',
                    }
                    dataTree.data.valores[claveAnualPromedio] =
                    {
                      "Valor": valorAnualPromedio < 0 ? ('-$' + (valorAnualPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnualPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnualPromedio,
                      "Color": valorAnualPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }
                  else if (dataTree.data.tipo == 'Saldo Final') {
                    // const valor = this.getValorSaldoFinal(mes.NumMes,anio.Anio) || 0
                    // const valorAnual = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0
                    const valor =
                      (this.DataTreeTable[0].data.valores[`0-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)
                      +
                      (this.DataTreeTable[1].data.valores[`EESGPM4hWXvDlXSRnCwA-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0) +
                      (this.DataTreeTable[4].data.valores[`GMzSuF04XQBsPmAkIB2C-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0) +
                      (this.DataTreeTable[7].data.valores[`psmpY6iyDJNkW7AKFXgK-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)


                    const valorAnual = this.obtenerValorSaldoFinalAnual(anio.Anio, Registros) || 0

                    dataTree.data.valores[claveMensual] =
                    {
                      "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valor,
                      "Color": valor < 0 ? '#ff3200' : '#000000',
                    }
                    dataTree.data.valores[claveAnual] =
                    {
                      "Valor": valorAnual < 0 ? ('-$' + (valorAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnual,
                      "Color": valorAnual < 0 ? '#ff3200' : '#000000',
                    }

                    const valorAnualPromedio =
                      this.DataTreeTable[0].data.valores[`Prom-0-${anio.Anio}`]?.ValorNumero +
                      this.DataTreeTable[1].data.valores[`Prom-EESGPM4hWXvDlXSRnCwA-${anio.Anio}`]?.ValorNumero +
                      this.DataTreeTable[4].data.valores[`Prom-GMzSuF04XQBsPmAkIB2C-${anio.Anio}`]?.ValorNumero +
                      this.DataTreeTable[7].data.valores[`Prom-psmpY6iyDJNkW7AKFXgK-${anio.Anio}`]?.ValorNumero

                    dataTree.data.valores[claveAnualPromedio] =
                    {
                      "Valor": valorAnualPromedio < 0 ? ('-$' + (valorAnualPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnualPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnualPromedio,
                      "Color": valorAnualPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }

                  else if (dataTree.data.tipo == 'Abuelo' || dataTree.data.tipo == 'Comparativa') {
                    let valor = 0
                    if (dataTree.data.orden == 1) {
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 1 || data.OrdenData == 2)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;

                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }
                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 4) {
                      let valor = 0
                      // let valor = this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio,Registros) || 0;         
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 3 || data.OrdenData == 4)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 7) {
                      let valor = 0
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 5 || data.OrdenData == 6)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });
                      //const valor = this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 10) {
                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let valor = 0
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 7 || data.OrdenData == 8 || data.OrdenData == 9)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });

                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 11) {
                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let valor = 0
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 13) {
                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let Mes: number = 0
                      let Anio: number = 0
                      if (mes.NumMes == 1) {
                        Mes = 12
                        Anio = anio.Anio - 1
                      }
                      else {
                        Mes = mes.NumMes - 1
                        Anio = anio.Anio
                      }
                      let ValorFlujoEfectivo = (this.DataTreeTable[10].data.valores[`VmmQpdpunMTqkoSjhzzj-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)
                      let ValorAcumuladoMesAnterior = (this.DataTreeTable[12].data.valores[`13-${Mes}-${Anio}`]?.ValorNumero || 0)
                      let valor = ValorFlujoEfectivo + ValorAcumuladoMesAnterior
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 14) {

                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let valor =
                        (this.DataTreeTable[10].data.valores[`VmmQpdpunMTqkoSjhzzj-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0) -
                        (DataFlujoEfectivo[`VmmQpdpunMTqkoSjhzzj-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0)
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }

                  }

                  else if (dataTree.data.tipo == 'Padre') {

                    let claveAnualHijo: any
                    let claveAnualNieto: any
                    let claveAnualNietoProm: any
                    let claveAnualHijoProm: any
                    dataTree.children.forEach(cuenta => {
                      const claveMensualHijo = `${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`;
                      claveAnualHijo = `${cuenta.data.idItem}-${anio.Anio}`;
                      claveAnualHijoProm = `Prom-${cuenta.data.idItem}-${anio.Anio}`;
                      const valor = this.getValorItemMensualReal(cuenta.data.idItem, mes.NumMes, anio.Anio, Registros) || 0;
                      const valorAnual = this.getValorItemAnualReal(cuenta.data.idItem, anio.Anio, Registros) || 0;
                      cuenta.data.valores[claveMensualHijo] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000'
                      }
                      cuenta.data.valores[claveAnualHijo] =
                      {
                        "Valor": valorAnual < 0 ? ('-$ ' + (valorAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valorAnual,
                        "Color": valorAnual < 0 ? '#ff3200' : '#000000'
                      }

                      const ValorPromedio = Number((valorAnual / CantidadMeses).toFixed(0))
                      cuenta.data.valores[claveAnualHijoProm] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$ ' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }



                      if (cuenta.children != undefined) {
                        cuenta.children.forEach(subCuenta => {

                          const claveMensualHijo = `${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`;
                          claveAnualNieto = `${subCuenta.data.id}-${anio.Anio}`;
                          claveAnualNietoProm = `Prom-${subCuenta.data.id}-${anio.Anio}`;
                          const valorNieto = 0;
                          const valorNietoAnual = 0;
                          subCuenta.data.valores[claveMensualHijo] =
                          {
                            "Valor": valorNieto < 0 ? ('-$ ' + (valorNieto * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            "ValorNumero": valorNieto,
                            "Color": valorNieto < 0 ? '#ff3200' : '#000000'
                          }

                          subCuenta.data.valores[claveAnualNieto] =
                          {
                            "Valor": valorNietoAnual < 0 ? ('-$ ' + (valorNietoAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorNietoAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            "ValorNumero": valorNietoAnual,
                            "Color": valorNietoAnual < 0 ? '#ff3200' : '#000000'
                          }
                          const ValorPromedio = Number((valorNietoAnual / CantidadMeses).toFixed(0))
                          subCuenta.data.valores[claveAnualNietoProm] =
                          {
                            "Valor": ValorPromedio < 0 ? ('-$ ' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            "ValorNumero": ValorPromedio,
                            "Color": ValorPromedio < 0 ? '#ff3200' : '#000000'
                          }

                        });

                      }
                    });
                    let ValorAcumulado: number = 0
                    dataTree.children
                      .filter((children: any) => children.data.idCategoria == dataTree.data.idCategoria)
                      .forEach(child => {
                        ValorAcumulado += child.data.valores[`${child.data.idItem}-${mes.NumMes}-${anio.Anio}`].ValorNumero
                      });


                    // const valor = this.getValorCategoriaMensual(dataTree.data.idCategoria,mes.NumMes,anio.Anio,Registros) || 0;
                    const valor = ValorAcumulado || 0;
                    dataTree.data.valores[claveMensual] = {
                      "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valor,
                      "Color": valor < 0 ? '#ff3200' : '#000000'
                    }
                    totalAnual += valor;
                    dataTree.data.valores[claveAnual] =
                    {
                      "Valor": totalAnual < 0 ? ('-$ ' + (totalAnual * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": totalAnual,
                      "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                    }
                    const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                    dataTree.data.valores[claveAnualPromedio] =
                    {
                      "Valor": ValorPromedio < 0 ? ('-$ ' + (ValorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorPromedio,
                      "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }

                });

                //Datos Trimestrales 
                const claveTrimestral = `trim-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
                const claveTrimestralPromedio = `trim-prom-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
                if (dataTree.data.tipo == 'Saldo Inicial') {
                  let keyTrimestre = trim.id == 1 ? `0-1-${anio.Anio}` : trim.id == 2 ? `0-4-${anio.Anio}` : trim.id == 3 ? `0-7-${anio.Anio}` : `0-10-${anio.Anio}`;
                  let valor = this.DataTreeTable[0].data.valores[keyTrimestre]?.ValorNumero || 0
                  let valorPromedio = Number((valor / 3).toFixed(1))

                  dataTree.data.valores[claveTrimestral] =
                  {
                    "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valor,
                    "Color": valor < 0 ? '#ff3200' : '#000000',
                  }
                  dataTree.data.valores[claveTrimestralPromedio] =
                  {
                    "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorPromedio,
                    "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                  }
                }

                else if (dataTree.data.tipo == 'Saldo Final') {
                  let keyTrimestre = trim.id == 1 ? `11-3-${anio.Anio}` : trim.id == 2 ? `11-6-${anio.Anio}` : trim.id == 3 ? `11-9-${anio.Anio}` : `11-12-${anio.Anio}`;
                  let valor = this.DataTreeTable[11].data.valores[keyTrimestre]?.ValorNumero || 0
                  let valorPromedio = Number((valor / 3).toFixed(1))

                  dataTree.data.valores[claveTrimestral] =
                  {
                    "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valor,
                    "Color": valor < 0 ? '#ff3200' : '#000000',
                  }
                  dataTree.data.valores[claveTrimestralPromedio] =
                  {
                    "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorPromedio,
                    "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                  }
                }


                else if (dataTree.data.tipo == 'Abuelo' || dataTree.data.tipo == 'Comparativa') {

                  if (dataTree.data.orden == 14) {
                    let ValorAcumulado = 0
                    let ValorAcumuladoPromedio = 0

                    this.getMesesByTrimestre(trim.id).forEach(mes => {
                      ValorAcumulado +=
                        this.DataTreeTable[13] == undefined ? 0 :
                          this.DataTreeTable[13].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                    })

                    dataTree.data.valores[claveTrimestral] =
                    {
                      "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumulado,
                      "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                    }
                    ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))

                    dataTree.data.valores[claveTrimestralPromedio] =
                    {
                      "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumuladoPromedio,
                      "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                    }
                  }
                  else if (dataTree.data.orden == 13) {
                    let ValorAcumulado = 0
                    let ValorAcumuladoPromedio = 0

                    this.getMesesByTrimestre(trim.id).forEach(mes => {
                      ValorAcumulado +=
                        this.DataTreeTable[12] == undefined ? 0 :
                          this.DataTreeTable[12].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                    })

                    dataTree.data.valores[claveTrimestral] =
                    {
                      "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumulado,
                      "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                    }
                    ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))

                    dataTree.data.valores[claveTrimestralPromedio] =
                    {
                      "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumuladoPromedio,
                      "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                    }
                  }
                  else if (dataTree.data.orden == 1
                    || dataTree.data.orden == 4
                    || dataTree.data.orden == 7
                    || dataTree.data.orden == 10
                    || dataTree.data.orden == 11
                  ) {
                    let ValorAcumulado = 0
                    let ValorAcumuladoPromedio = 0

                    this.getMesesByTrimestre(trim.id).forEach(mes => {
                      ValorAcumulado +=
                        this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                          this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                    })

                    dataTree.data.valores[claveTrimestral] =
                    {
                      "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumulado,
                      "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                    }
                    ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))

                    dataTree.data.valores[claveTrimestralPromedio] =
                    {
                      "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumuladoPromedio,
                      "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }
                }


                if (dataTree.data.tipo == 'Padre') {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0
                  this.getMesesByTrimestre(trim.id).forEach(mes => {
                    this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                  })
                  dataTree.data.valores[claveTrimestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000'
                  }

                  ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))
                  dataTree.data.valores[claveTrimestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                  //Hijos

                  this.DataTreeTable[dataTree.data.orden].children.forEach(cuenta => {
                    let valorTrimestralHijo = 0;
                    let valorTrimestralPromedioHijo = 0;
                    const claveTrimestralHijo = `trim-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
                    const clavePromedioTrimestrallHijo = `trim-Prom-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
                    this.getMesesByTrimestre(trim.id).forEach((mes: any) => {
                      let ArregloHijos = this.DataTreeTable[dataTree.data.orden].children == undefined
                        || this.DataTreeTable[dataTree.data.orden].children.length == 0 ? [] :
                        this.DataTreeTable[dataTree.data.orden].children
                      ArregloHijos.forEach((child: any) => {
                        valorTrimestralHijo += child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                      })
                    })

                    valorTrimestralPromedioHijo = Number((valorTrimestralHijo / 4).toFixed(0));



                    cuenta.data.valores[claveTrimestralHijo] =
                    {
                      "Valor": valorTrimestralHijo < 0 ? ('-$ ' + (valorTrimestralHijo * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorTrimestralHijo,
                      "Color": valorTrimestralHijo < 0 ? '#ff3200' : '#000000'
                    }


                    cuenta.data.valores[clavePromedioTrimestrallHijo] =
                    {
                      "Valor": valorTrimestralPromedioHijo < 0 ? ('-$ ' + (valorTrimestralPromedioHijo * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralPromedioHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorTrimestralPromedioHijo,
                      "Color": valorTrimestralPromedioHijo < 0 ? '#ff3200' : '#000000'
                    }
                    //Nieto  
                    if (cuenta.children != undefined) {

                      cuenta.children.forEach(subCuenta => {
                        let valorTrimestralNieto = 0;
                        let valorTrimestralPromedioNieto = 0;
                        const claveTrimestralHijo = `trim-${subCuenta.data.id}-${trim.id}-${anio.Anio}`;
                        const clavePromedioTrimestralHijo = `Prom-nieto-trim-${subCuenta.data.id}-${trim.id}-${anio.Anio}`;
                        this.getMesesBySemestre(semestre.id).forEach((mes: any) => {
                          this.DataTreeTable[dataTree.data.orden].children.forEach((child: any) => {
                            child.children.forEach(nieto => {
                              valorTrimestralNieto +=
                                nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                            });
                          })

                        })

                        valorTrimestralPromedioNieto = Number((valorTrimestralNieto / 4).toFixed(0));

                        subCuenta.data.valores[claveTrimestralHijo] =
                        {
                          "Valor": valorTrimestralNieto < 0 ? ('-$ ' + (valorTrimestralNieto * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                          "ValorNumero": valorTrimestralNieto,
                          "Color": valorTrimestralNieto < 0 ? '#ff3200' : '#000000'
                        }

                        subCuenta.data.valores[clavePromedioTrimestralHijo] =
                        {
                          "Valor": valorTrimestralPromedioNieto < 0 ? ('-$ ' + (valorTrimestralPromedioNieto * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralPromedioNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                          "ValorNumero": valorTrimestralPromedioNieto,
                          "Color": valorTrimestralPromedioNieto < 0 ? '#ff3200' : '#000000'
                        }



                      })
                    }
                  })


                }


              })
              //Datos Semestrales
              const claveSemestral = `sem-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
              const claveSemestralPromedio = `sem-prom-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
              if (dataTree.data.tipo == 'Saldo Inicial') {
                let keySemestre = semestre.id == 1 ? `0-1-${anio.Anio}` : `0-7-${anio.Anio}`;
                let valor = this.DataTreeTable[0].data.valores[keySemestre]?.ValorNumero || 0
                let valorPromedio = valor / 2
                dataTree.data.valores[claveSemestral] =
                {
                  "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valor,
                  "Color": valor < 0 ? '#ff3200' : '#000000',
                }
                dataTree.data.valores[claveSemestralPromedio] =
                {
                  "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valorPromedio,
                  "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                }
              }

              else if (dataTree.data.tipo == 'Saldo Final') {
                let keySemestre = semestre.id == 1 ? `11-6-${anio.Anio}` : `11-12-${anio.Anio}`;
                let valor = this.DataTreeTable[11].data.valores[keySemestre]?.ValorNumero || 0
                let valorPromedio = valor / 2
                dataTree.data.valores[claveSemestral] =
                {
                  "Valor": valor < 0 ? ('-$ ' + (valor * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valor,
                  "Color": valor < 0 ? '#ff3200' : '#000000',
                }
                dataTree.data.valores[claveSemestralPromedio] =
                {
                  "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valorPromedio,
                  "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                }
              }

              else if (dataTree.data.tipo == 'Abuelo' || dataTree.data.tipo == 'Comparativa') {

                if (dataTree.data.orden == 14) {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0

                  this.getMesesBySemestre(semestre.id).forEach(mes => {
                    this.DataTreeTable[13] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[13].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                  })
                  dataTree.data.valores[claveSemestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                  }
                  ValorAcumuladoPromedio = ValorAcumulado / 2

                  dataTree.data.valores[claveSemestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                }

                else if (dataTree.data.orden == 13) {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0

                  this.getMesesBySemestre(semestre.id).forEach(mes => {
                    this.DataTreeTable[12] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[12].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                  })
                  dataTree.data.valores[claveSemestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                  }
                  ValorAcumuladoPromedio = ValorAcumulado / 2

                  dataTree.data.valores[claveSemestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                }
                else if (dataTree.data.orden == 1 || dataTree.data.orden == 4 || dataTree.data.orden == 7 || dataTree.data.orden == 10 || dataTree.data.orden == 11) {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0

                  this.getMesesBySemestre(semestre.id).forEach(mes => {
                    this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                  })
                  dataTree.data.valores[claveSemestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                  }
                  ValorAcumuladoPromedio = ValorAcumulado / 2

                  dataTree.data.valores[claveSemestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                }
              }

              else if (dataTree.data.tipo == 'Padre') {
                let ValorAcumulado = 0
                let ValorAcumuladoPromedio = 0
                this.getMesesBySemestre(semestre.id).forEach(mes => {
                  this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                    ValorAcumulado += this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                })
                dataTree.data.valores[claveSemestral] =
                {
                  "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": ValorAcumulado,
                  "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000'
                }
                ValorAcumuladoPromedio = ValorAcumulado / 2
                dataTree.data.valores[claveSemestralPromedio] =
                {
                  "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": ValorAcumuladoPromedio,
                  "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                }

                //Hijos
                this.DataTreeTable[dataTree.data.orden].children.forEach(cuenta => {
                  let valorSemestralHijo = 0;
                  let valorSemestralPromedioHijo = 0;
                  const claveSemestralHijo = `sem-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
                  const clavePromedioSemestralHijo = `sem-Prom-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
                  this.getMesesBySemestre(semestre.id).forEach((mes: any) => {
                    let ArregloHijos = this.DataTreeTable[dataTree.data.orden].children == undefined
                      || this.DataTreeTable[dataTree.data.orden].children.length == 0 ? [] :
                      this.DataTreeTable[dataTree.data.orden].children
                    ArregloHijos.forEach((child: any) => {
                      valorSemestralHijo += child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                    })
                  })

                  valorSemestralPromedioHijo = Number((valorSemestralHijo / 2).toFixed(0));

                  cuenta.data.valores[claveSemestralHijo] =
                  {
                    "Valor": valorSemestralHijo < 0 ? ('-$ ' + (valorSemestralHijo * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorSemestralHijo,
                    "Color": valorSemestralHijo < 0 ? '#ff3200' : '#000000'
                  }


                  cuenta.data.valores[clavePromedioSemestralHijo] =
                  {
                    "Valor": valorSemestralPromedioHijo < 0 ? ('-$ ' + (valorSemestralPromedioHijo * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralPromedioHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorSemestralPromedioHijo,
                    "Color": valorSemestralPromedioHijo < 0 ? '#ff3200' : '#000000'
                  }
                  //Nieto  
                  if (cuenta.children != undefined) {
                    cuenta.children.forEach(subCuenta => {
                      let valorSemestralNieto = 0;
                      let valorSemestralPromedioNieto = 0;
                      const claveSemestralHijo = `sem-${subCuenta.data.id}-${semestre.id}-${anio.Anio}`;
                      const clavePromedioSemestralHijo = `Prom-nieto-${subCuenta.data.id}-${semestre.id}-${anio.Anio}`;
                      this.getMesesBySemestre(semestre.id).forEach((mes: any) => {
                        this.DataTreeTable[dataTree.data.orden].children.forEach((child: any) => {
                          child.children.forEach(nieto => {
                            valorSemestralNieto +=
                              nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                          });
                        })

                      })

                      valorSemestralPromedioNieto = Number((valorSemestralNieto / 2).toFixed(0));

                      subCuenta.data.valores[claveSemestralHijo] =
                      {
                        "Valor": valorSemestralNieto < 0 ? ('-$ ' + (valorSemestralNieto * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valorSemestralNieto,
                        "Color": valorSemestralNieto < 0 ? '#ff3200' : '#000000'
                      }

                      subCuenta.data.valores[clavePromedioSemestralHijo] =
                      {
                        "Valor": valorSemestralPromedioNieto < 0 ? ('-$ ' + (valorSemestralPromedioNieto * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralPromedioNieto)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valorSemestralPromedioNieto,
                        "Color": valorSemestralPromedioNieto < 0 ? '#ff3200' : '#000000'
                      }



                    })
                  }
                })
              }





            });





          });
        }
      });

    return this.DataTreeTable


  }

  construirValores(AniosSeleccionados: any, MesesSeleccionados: any, Registros: any,DataFlujoEfectivo:any) {
    let AniosCabecera = AniosSeleccionados.length > 0 ? AniosSeleccionados : this.Anios
    let CantidadMeses: number = 0
    CantidadMeses = MesesSeleccionados
    this.RegistrosSaldosFinalesMensuales = []
    let DataTreeTable = [...this.DataTreeTable]
    DataTreeTable
      .sort((a: any, b: any) => a.OrdenData - b.OrdenData)
      .forEach(dataTree => {
        if (dataTree.data.valores !== undefined) {
          dataTree.data.valores = {};
          AniosCabecera.forEach(anio => {
            let totalAnual = 0;
            const claveAnual = `${dataTree.data.idCategoria}-${anio.Anio}`;
            const claveAnualPromedio = `Prom-${dataTree.data.idCategoria}-${anio.Anio}`;
            this.Semestres.forEach(semestre => {
              this.getTrimestresBySemestre(semestre.id).forEach((trim: any) => {

                this.getMesesByTrimestre(trim.id).forEach(mes => {
                  const claveMensual = `${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`;
                  let key = `${mes.NumMes}-${anio.Anio}`;
                  if (dataTree.data.tipo == 'Saldo Inicial') {
                    this.RegistrosSaldosFinalesMensuales.push({
                      "key": key,
                      "Anio": anio.Anio,
                      "Valor":
                        this.getValorSaldoFinal(mes.NumMes, anio.Anio, Registros) || 0
                    })



                    const valor =

                      (this.getSaldoInicialMensual(mes.NumMes, anio.Anio) || 0)

                    const valorAnual = this.obtenerValorSaldoInicialAnual(anio.Anio) || 0
                    const valorAnualPromedio = Number((valorAnual / CantidadMeses).toFixed(0))


                    dataTree.data.valores[claveMensual] =
                    {
                      "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valor,
                      "Color": valor < 0 ? '#ff3200' : '#000000',
                    }


                    dataTree.data.valores[claveAnual] =
                    {
                      "Valor": valorAnual < 0 ? ('-$' + (valorAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnual,
                      "Color": valorAnual < 0 ? '#ff3200' : '#000000',
                    }
                    dataTree.data.valores[claveAnualPromedio] =
                    {
                      "Valor": valorAnualPromedio < 0 ? ('-$' + (valorAnualPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnualPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnualPromedio,
                      "Color": valorAnualPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }
                  else if (dataTree.data.tipo == 'Saldo Final') {
                    // const valor = this.getValorSaldoFinal(mes.NumMes,anio.Anio) || 0
                    // const valorAnual = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0
                    const valor =
                      (this.DataTreeTable[0].data.valores[`0-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)
                      +
                      (this.DataTreeTable[1].data.valores[`EESGPM4hWXvDlXSRnCwA-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0) +
                      (this.DataTreeTable[4].data.valores[`GMzSuF04XQBsPmAkIB2C-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0) +
                      (this.DataTreeTable[7].data.valores[`psmpY6iyDJNkW7AKFXgK-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)


                    const valorAnual = this.obtenerValorSaldoFinalAnual(anio.Anio, Registros) || 0

                    dataTree.data.valores[claveMensual] =
                    {
                      "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valor,
                      "Color": valor < 0 ? '#ff3200' : '#000000',
                    }
                    dataTree.data.valores[claveAnual] =
                    {
                      "Valor": valorAnual < 0 ? ('-$' + (valorAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnual,
                      "Color": valorAnual < 0 ? '#ff3200' : '#000000',
                    }

                    const valorAnualPromedio =
                      this.DataTreeTable[0].data.valores[`Prom-0-${anio.Anio}`]?.ValorNumero +
                      this.DataTreeTable[1].data.valores[`Prom-EESGPM4hWXvDlXSRnCwA-${anio.Anio}`]?.ValorNumero +
                      this.DataTreeTable[4].data.valores[`Prom-GMzSuF04XQBsPmAkIB2C-${anio.Anio}`]?.ValorNumero +
                      this.DataTreeTable[7].data.valores[`Prom-psmpY6iyDJNkW7AKFXgK-${anio.Anio}`]?.ValorNumero

                    dataTree.data.valores[claveAnualPromedio] =
                    {
                      "Valor": valorAnualPromedio < 0 ? ('-$' + (valorAnualPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnualPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorAnualPromedio,
                      "Color": valorAnualPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }

                  else if (dataTree.data.tipo == 'Abuelo' || dataTree.data.tipo == 'Comparativa') {
                    let valor = 0
                  
                   if (dataTree.data.orden == 1) {
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 1 || data.OrdenData == 2)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });

                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;

                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }
                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 4) {

                      let valor = 0

                      // let valor = this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio,Registros) || 0;

                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 3 || data.OrdenData == 4)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });


                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 7) {
                      let valor = 0
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 5 || data.OrdenData == 6)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });
                      //const valor = this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 10) {
                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let valor = 0
                      let DataTreeTableHijo = this.DataTreeTable
                        .filter((data: any) => data.OrdenData == 7 || data.OrdenData == 8 || data.OrdenData == 9)
                      DataTreeTableHijo.forEach(dataHijo => {
                        valor += dataHijo.data.valores[`${dataHijo.data.idCategoria}-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0
                      });

                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    else if (dataTree.data.orden == 14) {
                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let valor =
                      (this.DataTreeTable[10].data.valores[`VmmQpdpunMTqkoSjhzzj-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0) - 
                      (DataFlujoEfectivo[`VmmQpdpunMTqkoSjhzzj-${mes.NumMes}-${anio.Anio}`].ValorNumero || 0)
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }  
                    else if (dataTree.data.orden == 13) {
                      //const valor = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio,Registros) || 0;
                      let Mes: number = 0
                      let Anio: number = 0
                      if (mes.NumMes == 1) {
                        Mes = 12
                        Anio = anio.Anio - 1
                      }
                      else {
                        Mes = mes.NumMes - 1
                        Anio = anio.Anio
                      }
                      let ValorFlujoEfectivo = (this.DataTreeTable[10].data.valores[`VmmQpdpunMTqkoSjhzzj-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0)
                      let ValorAcumuladoMesAnterior = (this.DataTreeTable[12].data.valores[`13-${Mes}-${Anio}`]?.ValorNumero || 0)
                      let valor = ValorFlujoEfectivo + ValorAcumuladoMesAnterior
                      dataTree.data.valores[claveMensual] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000',
                      }
                      totalAnual += valor;
                      dataTree.data.valores[claveAnual] =
                      {
                        "Valor": totalAnual < 0 ? ('-$' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": totalAnual,
                        "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                      }

                      const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                      dataTree.data.valores[claveAnualPromedio] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }
                    }
                    



                  }

                  else if (dataTree.data.tipo == 'Padre') {

                    let claveAnualHijo: any
                    let claveAnualNieto: any
                    let claveAnualNietoProm: any
                    let claveAnualHijoProm: any
                    dataTree.children.forEach(cuenta => {
                      const claveMensualHijo = `${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`;
                      claveAnualHijo = `${cuenta.data.idItem}-${anio.Anio}`;
                      claveAnualHijoProm = `Prom-${cuenta.data.idItem}-${anio.Anio}`;
                      const valor = this.getValorItemMensual(cuenta.data.idItem, mes.NumMes, anio.Anio, Registros) || 0;
                      const valorAnual = this.getValorItemAnual(cuenta.data.idItem, anio.Anio, Registros) || 0;
                      cuenta.data.valores[claveMensualHijo] =
                      {
                        "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valor,
                        "Color": valor < 0 ? '#ff3200' : '#000000'
                      }
                      cuenta.data.valores[claveAnualHijo] =
                      {
                        "Valor": valorAnual < 0 ? ('-$ ' + (valorAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valorAnual,
                        "Color": valorAnual < 0 ? '#ff3200' : '#000000'
                      }

                      const ValorPromedio = Number((valorAnual / CantidadMeses).toFixed(0))
                      cuenta.data.valores[claveAnualHijoProm] =
                      {
                        "Valor": ValorPromedio < 0 ? ('-$ ' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": ValorPromedio,
                        "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                      }



                      if (cuenta.children != undefined) {
                        cuenta.children.forEach(subCuenta => {

                          const claveMensualHijo = `${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`;
                          claveAnualNieto = `${subCuenta.data.id}-${anio.Anio}`;
                          claveAnualNietoProm = `Prom-${subCuenta.data.id}-${anio.Anio}`;
                          const valorNieto = this.getValorSubItemMensual(subCuenta.data.id, mes.NumMes, anio.Anio, Registros) || 0;
                          const valorNietoAnual = this.getValorSubItemAnual(subCuenta.data.id, anio.Anio, Registros) || 0;
                          subCuenta.data.valores[claveMensualHijo] =
                          {
                            "Valor": valorNieto < 0 ? ('-$ ' + (valorNieto * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorNieto).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            "ValorNumero": valorNieto,
                            "Color": valorNieto < 0 ? '#ff3200' : '#000000'
                          }

                          subCuenta.data.valores[claveAnualNieto] =
                          {
                            "Valor": valorNietoAnual < 0 ? ('-$ ' + (valorNietoAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorNietoAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            "ValorNumero": valorNietoAnual,
                            "Color": valorNietoAnual < 0 ? '#ff3200' : '#000000'
                          }
                          const ValorPromedio = Number((valorNietoAnual / CantidadMeses).toFixed(0))
                          subCuenta.data.valores[claveAnualNietoProm] =
                          {
                            "Valor": ValorPromedio < 0 ? ('-$ ' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            "ValorNumero": ValorPromedio,
                            "Color": ValorPromedio < 0 ? '#ff3200' : '#000000'
                          }

                        });

                      }
                    });
                    let ValorAcumulado: number = 0
                    // if(anio.Anio==2025 && mes.NumMes==5 && dataTree.data.idCategoria=='od11V2OHVgaLG1RiXMiz' ){
                    //   console.log('dataChildren',dataTree.children)
                    //   dataTree.children.forEach(child => {
                    //         ValorAcumulado+=child.data.valores[`${child.data.idItem}-${mes.NumMes}-${anio.Anio}`].ValorNumero
                    //       });  
                    // }
                    dataTree.children
                      .filter((children: any) => children.data.idCategoria == dataTree.data.idCategoria)
                      .forEach(child => {
                        ValorAcumulado += child.data.valores[`${child.data.idItem}-${mes.NumMes}-${anio.Anio}`].ValorNumero
                      });


                    // const valor = this.getValorCategoriaMensual(dataTree.data.idCategoria,mes.NumMes,anio.Anio,Registros) || 0;
                    const valor = ValorAcumulado || 0;
                    dataTree.data.valores[claveMensual] = {
                      "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valor,
                      "Color": valor < 0 ? '#ff3200' : '#000000'
                    }
                    totalAnual += valor;
                    dataTree.data.valores[claveAnual] =
                    {
                      "Valor": totalAnual < 0 ? ('-$ ' + (totalAnual * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (totalAnual).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": totalAnual,
                      "Color": totalAnual < 0 ? '#ff3200' : '#000000',
                    }
                    const ValorPromedio = Number((totalAnual / CantidadMeses).toFixed(0))
                    dataTree.data.valores[claveAnualPromedio] =
                    {
                      "Valor": ValorPromedio < 0 ? ('-$ ' + (ValorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorPromedio,
                      "Color": ValorPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }

                });
                //Datos Trimestrales 
                const claveTrimestral = `trim-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
                const claveTrimestralPromedio = `trim-prom-${dataTree.data.idCategoria}-${trim.id}-${anio.Anio}`;
                if (dataTree.data.tipo == 'Saldo Inicial') {
                  let keyTrimestre = trim.id == 1 ? `0-1-${anio.Anio}` : trim.id == 2 ? `0-4-${anio.Anio}` : trim.id == 3 ? `0-7-${anio.Anio}` : `0-10-${anio.Anio}`;
                  let valor = this.DataTreeTable[0].data.valores[keyTrimestre]?.ValorNumero || 0
                  let valorPromedio = Number((valor / 3).toFixed(1))

                  dataTree.data.valores[claveTrimestral] =
                  {
                    "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valor,
                    "Color": valor < 0 ? '#ff3200' : '#000000',
                  }
                  dataTree.data.valores[claveTrimestralPromedio] =
                  {
                    "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorPromedio,
                    "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                  }
                }

                else if (dataTree.data.tipo == 'Saldo Final') {
                  let keyTrimestre = trim.id == 1 ? `11-3-${anio.Anio}` : trim.id == 2 ? `11-6-${anio.Anio}` : trim.id == 3 ? `11-9-${anio.Anio}` : `11-12-${anio.Anio}`;
                  let valor = this.DataTreeTable[11].data.valores[keyTrimestre]?.ValorNumero || 0
                  let valorPromedio = Number((valor / 3).toFixed(1))

                  dataTree.data.valores[claveTrimestral] =
                  {
                    "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valor,
                    "Color": valor < 0 ? '#ff3200' : '#000000',
                  }
                  dataTree.data.valores[claveTrimestralPromedio] =
                  {
                    "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorPromedio,
                    "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                  }
                }


                else if (dataTree.data.tipo == 'Abuelo' || dataTree.data.tipo == 'Comparativa') {

                  if (dataTree.data.orden == 1 || dataTree.data.orden == 4 || dataTree.data.orden == 7 || dataTree.data.orden == 10) {
                    let ValorAcumulado = 0
                    let ValorAcumuladoPromedio = 0

                    this.getMesesByTrimestre(trim.id).forEach(mes => {
                      ValorAcumulado +=
                        this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                          this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                    })

                    dataTree.data.valores[claveTrimestral] =
                    {
                      "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumulado,
                      "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                    }
                    ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))

                    dataTree.data.valores[claveTrimestralPromedio] =
                    {
                      "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumuladoPromedio,
                      "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                    }

                  }
                  
                  if (dataTree.data.orden == 14) {
                    let ValorAcumulado = 0
                    let ValorAcumuladoPromedio = 0

                    this.getMesesByTrimestre(trim.id).forEach(mes => {
                      ValorAcumulado +=
                        this.DataTreeTable[13] == undefined ? 0 :
                          this.DataTreeTable[13].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                    })

                    dataTree.data.valores[claveTrimestral] =
                    {
                      "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumulado,
                      "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                    }
                    ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))

                    dataTree.data.valores[claveTrimestralPromedio] =
                    {
                      "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumuladoPromedio,
                      "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                    }
                  }
                  else if (dataTree.data.orden == 13) {
                    let ValorAcumulado = 0
                    let ValorAcumuladoPromedio = 0

                    this.getMesesByTrimestre(trim.id).forEach(mes => {
                      ValorAcumulado +=
                        this.DataTreeTable[12] == undefined ? 0 :
                          this.DataTreeTable[12].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                    })

                    dataTree.data.valores[claveTrimestral] =
                    {
                      "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumulado,
                      "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                    }
                    ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))

                    dataTree.data.valores[claveTrimestralPromedio] =
                    {
                      "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": ValorAcumuladoPromedio,
                      "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                    }
                  }
                }

                if (dataTree.data.tipo == 'Padre') {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0
                  this.getMesesByTrimestre(trim.id).forEach(mes => {
                    this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                  })
                  // if(anio.Anio==2025 && trim.id==2 && dataTree.data.idCategoria=='od11V2OHVgaLG1RiXMiz' ){
                  //   console.log('ValorAcumulado',ValorAcumulado)
                  //     console.log('DataTreeTable',this.DataTreeTable[dataTree.data.orden])

                  //   }


                  dataTree.data.valores[claveTrimestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000'
                  }

                  ValorAcumuladoPromedio = Number((ValorAcumulado / 3).toFixed(1))
                  dataTree.data.valores[claveTrimestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                  //Hijos
                  this.DataTreeTable[dataTree.data.orden].children.forEach(cuenta => {
                    let valorTrimestralHijo = 0;
                    let valorTrimestralPromedioHijo = 0;
                    const claveTrimestralHijo = `trim-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
                    const clavePromedioTrimestrallHijo = `trim-Prom-${cuenta.data.idItem}-${trim.id}-${anio.Anio}`;
                    this.getMesesByTrimestre(trim.id).forEach((mes: any) => {
                      let ArregloHijos = this.DataTreeTable[dataTree.data.orden].children == undefined
                        || this.DataTreeTable[dataTree.data.orden].children.length == 0 ? [] :
                        this.DataTreeTable[dataTree.data.orden].children
                      ArregloHijos.forEach((child: any) => {
                        valorTrimestralHijo += child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                      })
                    })

                    valorTrimestralPromedioHijo = Number((valorTrimestralHijo / 4).toFixed(0));

                    cuenta.data.valores[claveTrimestralHijo] =
                    {
                      "Valor": valorTrimestralHijo < 0 ? ('-$ ' + (valorTrimestralHijo * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralHijo).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorTrimestralHijo,
                      "Color": valorTrimestralHijo < 0 ? '#ff3200' : '#000000'
                    }


                    cuenta.data.valores[clavePromedioTrimestrallHijo] =
                    {
                      "Valor": valorTrimestralPromedioHijo < 0 ? ('-$ ' + (valorTrimestralPromedioHijo * -1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralPromedioHijo)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                      "ValorNumero": valorTrimestralPromedioHijo,
                      "Color": valorTrimestralPromedioHijo < 0 ? '#ff3200' : '#000000'
                    }
                    //Nieto  
                    if (cuenta.children != undefined) {

                      cuenta.children.forEach(subCuenta => {
                        let valorTrimestralNieto = 0;
                        let valorTrimestralPromedioNieto = 0;
                        const claveTrimestralHijo = `trim-${subCuenta.data.id}-${trim.id}-${anio.Anio}`;
                        const clavePromedioTrimestralHijo = `Prom-nieto-trim-${subCuenta.data.id}-${trim.id}-${anio.Anio}`;
                        this.getMesesBySemestre(semestre.id).forEach((mes: any) => {
                          this.DataTreeTable[dataTree.data.orden].children.forEach((child: any) => {
                            child.children.forEach(nieto => {
                              valorTrimestralNieto +=
                                nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                            });
                          })

                        })

                        valorTrimestralPromedioNieto = Number((valorTrimestralNieto / 4).toFixed(0));

                        subCuenta.data.valores[claveTrimestralHijo] =
                        {
                          "Valor": valorTrimestralNieto < 0 ? ('-$ ' + (valorTrimestralNieto * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralNieto).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                          "ValorNumero": valorTrimestralNieto,
                          "Color": valorTrimestralNieto < 0 ? '#ff3200' : '#000000'
                        }

                        subCuenta.data.valores[clavePromedioTrimestralHijo] =
                        {
                          "Valor": valorTrimestralPromedioNieto < 0 ? ('-$ ' + (valorTrimestralPromedioNieto * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorTrimestralPromedioNieto).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                          "ValorNumero": valorTrimestralPromedioNieto,
                          "Color": valorTrimestralPromedioNieto < 0 ? '#ff3200' : '#000000'
                        }



                      })
                    }
                  })
                }


              })
              //Datos Semestrales
              const claveSemestral = `sem-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
              const claveSemestralPromedio = `sem-prom-${dataTree.data.idCategoria}-${semestre.id}-${anio.Anio}`;
              if (dataTree.data.tipo == 'Saldo Inicial') {
                let keySemestre = semestre.id == 1 ? `0-1-${anio.Anio}` : `0-7-${anio.Anio}`;
                let valor = this.DataTreeTable[0].data.valores[keySemestre]?.ValorNumero || 0
                let valorPromedio = valor / 2
                dataTree.data.valores[claveSemestral] =
                {
                  "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valor,
                  "Color": valor < 0 ? '#ff3200' : '#000000',
                }
                dataTree.data.valores[claveSemestralPromedio] =
                {
                  "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valorPromedio,
                  "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                }
              }

              else if (dataTree.data.tipo == 'Saldo Final') {
                let keySemestre = semestre.id == 1 ? `11-6-${anio.Anio}` : `11-12-${anio.Anio}`;
                let valor = this.DataTreeTable[11].data.valores[keySemestre]?.ValorNumero || 0
                let valorPromedio = valor / 2
                dataTree.data.valores[claveSemestral] =
                {
                  "Valor": valor < 0 ? ('-$ ' + (valor * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valor).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valor,
                  "Color": valor < 0 ? '#ff3200' : '#000000',
                }
                dataTree.data.valores[claveSemestralPromedio] =
                {
                  "Valor": valorPromedio < 0 ? ('-$ ' + (valorPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": valorPromedio,
                  "Color": valorPromedio < 0 ? '#ff3200' : '#000000',
                }
              }

              else if (dataTree.data.tipo == 'Abuelo' || dataTree.data.tipo == 'Comparativa') {

                if (dataTree.data.orden == 1 || dataTree.data.orden == 4 || dataTree.data.orden == 7 || dataTree.data.orden == 10) {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0

                  this.getMesesBySemestre(semestre.id).forEach(mes => {
                    this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                  })
                  dataTree.data.valores[claveSemestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                  }
                  ValorAcumuladoPromedio = ValorAcumulado / 2

                  dataTree.data.valores[claveSemestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                }

                if (dataTree.data.orden == 14) {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0

                  this.getMesesBySemestre(semestre.id).forEach(mes => {
                    this.DataTreeTable[13] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[13].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                  })
                  dataTree.data.valores[claveSemestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                  }
                  ValorAcumuladoPromedio = ValorAcumulado / 2

                  dataTree.data.valores[claveSemestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                }

                else if (dataTree.data.orden == 13) {
                  let ValorAcumulado = 0
                  let ValorAcumuladoPromedio = 0

                  this.getMesesBySemestre(semestre.id).forEach(mes => {
                    this.DataTreeTable[12] == undefined ? 0 :
                      ValorAcumulado += this.DataTreeTable[12].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                  })
                  dataTree.data.valores[claveSemestral] =
                  {
                    "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumulado,
                    "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000',
                  }
                  ValorAcumuladoPromedio = ValorAcumulado / 2

                  dataTree.data.valores[claveSemestralPromedio] =
                  {
                    "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": ValorAcumuladoPromedio,
                    "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                  }

                }
              }

              if (dataTree.data.tipo == 'Padre') {
                let ValorAcumulado = 0
                let ValorAcumuladoPromedio = 0
                this.getMesesBySemestre(semestre.id).forEach(mes => {
                  this.DataTreeTable[dataTree.data.orden] == undefined ? 0 :
                    ValorAcumulado += this.DataTreeTable[dataTree.data.orden].data.valores[`${dataTree.data.idCategoria}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                })
                dataTree.data.valores[claveSemestral] =
                {
                  "Valor": ValorAcumulado < 0 ? ('-$ ' + (ValorAcumulado * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumulado).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": ValorAcumulado,
                  "Color": ValorAcumulado < 0 ? '#ff3200' : '#000000'
                }
                ValorAcumuladoPromedio = ValorAcumulado / 2
                dataTree.data.valores[claveSemestralPromedio] =
                {
                  "Valor": ValorAcumuladoPromedio < 0 ? ('-$ ' + (ValorAcumuladoPromedio * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (ValorAcumuladoPromedio).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "ValorNumero": ValorAcumuladoPromedio,
                  "Color": ValorAcumuladoPromedio < 0 ? '#ff3200' : '#000000',
                }

                //Hijos
                this.DataTreeTable[dataTree.data.orden].children.forEach(cuenta => {
                  let valorSemestralHijo = 0;
                  let valorSemestralPromedioHijo = 0;
                  const claveSemestralHijo = `sem-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
                  const clavePromedioSemestralHijo = `sem-Prom-${cuenta.data.idItem}-${semestre.id}-${anio.Anio}`;
                  this.getMesesBySemestre(semestre.id).forEach((mes: any) => {
                    let ArregloHijos = this.DataTreeTable[dataTree.data.orden].children == undefined
                      || this.DataTreeTable[dataTree.data.orden].children.length == 0 ? [] :
                      this.DataTreeTable[dataTree.data.orden].children
                    ArregloHijos.forEach((child: any) => {
                      valorSemestralHijo += child.data.valores[`${cuenta.data.idItem}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0
                    })
                  })

                  valorSemestralPromedioHijo = Number((valorSemestralHijo / 2).toFixed(0));

                  cuenta.data.valores[claveSemestralHijo] =
                  {
                    "Valor": valorSemestralHijo < 0 ? ('-$ ' + (valorSemestralHijo * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralHijo).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorSemestralHijo,
                    "Color": valorSemestralHijo < 0 ? '#ff3200' : '#000000'
                  }


                  cuenta.data.valores[clavePromedioSemestralHijo] =
                  {
                    "Valor": valorSemestralPromedioHijo < 0 ? ('-$ ' + (valorSemestralPromedioHijo * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralPromedioHijo).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "ValorNumero": valorSemestralPromedioHijo,
                    "Color": valorSemestralPromedioHijo < 0 ? '#ff3200' : '#000000'
                  }
                  //Nieto  
                  if (cuenta.children != undefined) {
                    cuenta.children.forEach(subCuenta => {
                      let valorSemestralNieto = 0;
                      let valorSemestralPromedioNieto = 0;
                      const claveSemestralHijo = `sem-${subCuenta.data.id}-${semestre.id}-${anio.Anio}`;
                      const clavePromedioSemestralHijo = `Prom-nieto-${subCuenta.data.id}-${semestre.id}-${anio.Anio}`;
                      this.getMesesBySemestre(semestre.id).forEach((mes: any) => {
                        this.DataTreeTable[dataTree.data.orden].children.forEach((child: any) => {
                          child.children.forEach(nieto => {
                            valorSemestralNieto +=
                              nieto.data.valores[`${subCuenta.data.id}-${mes.NumMes}-${anio.Anio}`]?.ValorNumero || 0

                          });
                        })

                      })

                      valorSemestralPromedioNieto = Number((valorSemestralNieto / 2).toFixed(0));

                      subCuenta.data.valores[claveSemestralHijo] =
                      {
                        "Valor": valorSemestralNieto < 0 ? ('-$ ' + (valorSemestralNieto * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralNieto).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valorSemestralNieto,
                        "Color": valorSemestralNieto < 0 ? '#ff3200' : '#000000'
                      }

                      subCuenta.data.valores[clavePromedioSemestralHijo] =
                      {
                        "Valor": valorSemestralPromedioNieto < 0 ? ('-$ ' + (valorSemestralPromedioNieto * -1).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ('$ ' + (valorSemestralPromedioNieto).toFixed(0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        "ValorNumero": valorSemestralPromedioNieto,
                        "Color": valorSemestralPromedioNieto < 0 ? '#ff3200' : '#000000'
                      }



                    })
                  }
                })
              }





            });





          });
        }
      });

    return this.DataTreeTable


  }




  getItemsByCategoria(idCategoria: string, Items: any, TipoCateg: any) {
    let Item = Items.filter((it: any) => it.idPadre == idCategoria)
    let ItemsEncontrados: any = []
    if (Item.length > 0) {
      let data: any
      Item.forEach((item: any) => {
        ItemsEncontrados.push(
          {
            data: {
              Nombre: item.Nombre,
              idItem: item.id,
              idProyectos: item.idProyectos == undefined ? [] : item.idProyectos,
              idSucursales: item.idSucursales == undefined ? [] : item.idSucursales,
              size: '200mb',
              type: 'Folder',
              idCategoria: idCategoria,
              orden: item.Orden,
              TipoCateg: TipoCateg,
              tipo: 'Hijo',
              valores: {},
            },
            children:
              item.CuentasHijos === undefined ? [] : item.CuentasHijos.map(hijo => ({
                data: {
                  ...hijo,
                  idPadre: item.id,
                  valores: {},
                  tipo: 'Nieto',
                  Orden: hijo.Orden
                }
              }))
          });
      })
      return ItemsEncontrados
    }
    else {
      return []
    }


  }

  getTrimestresBySemestre(idSemestre: any) {
    return this.Trimestres.filter((trim: any) => trim.idSemestre == idSemestre)
  }
  getMesesByTrimestre(idTrimestre: any) {
    return this.Meses.filter((mes: any) => mes.Trimestre == idTrimestre)
  }
  getMesesBySemestre(idSemestre: any) {
    return this.Meses.filter((mes: any) => mes.Semestre == idSemestre)
  }
  getValorSaldoFinal(Mes: any, Anio: any, Registros: any) {

    return this.getSaldoInicialMensual(Mes, Anio) +
      this.getDataFlujoLibreMensual(Mes, Anio, Registros)

  }

  getDataFlujoLibreMensual(Mes: any, Anio: any, Registros: any) {
    return (this.DataTreeTable[1].data.valores[`EESGPM4hWXvDlXSRnCwA-${Mes}-${Anio}`]?.ValorNumero || 0) +
      (this.DataTreeTable[4].data.valores[`GMzSuF04XQBsPmAkIB2C-${Mes}-${Anio}`]?.ValorNumero || 0) +
      (this.DataTreeTable[7].data.valores[`psmpY6iyDJNkW7AKFXgK-${Mes}-${Anio}`]?.ValorNumero || 0)
  }
  getDataFlujoInversionMensual(Mes: any, Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) =>
      (registro.idFlujo == 'GMzSuF04XQBsPmAkIB2C')
      && registro.NumMes == Mes
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
  }
  getDataFlujoOperativoMensual(Mes: any, Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) =>
      (registro.idFlujo == 'EESGPM4hWXvDlXSRnCwA')
      && registro.NumMes == Mes
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
  }

  getSaldoInicialMensual(Mes: any, Anio: any) {
    let _Data: any = [];
    let _DataSaldoFinal: any = [];
    _Data = this.SaldoInicial.filter((saldo: any) => saldo
      && saldo.NumMes == Mes
      && saldo.AnioRegistro == Anio
    )

    _DataSaldoFinal = this.SaldoInicial.filter((saldo: any) => saldo
      && saldo.NumMes == Mes - 1
      && saldo.AnioRegistro == Anio
    )



    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }

    else if (_DataSaldoFinal.length > 0) {
      let Valor: number = 0
      _DataSaldoFinal.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }

    else {
      let key = `${Mes - 1}-${Anio}`
      let ValorSaldo: number = 0

      let RSFM = this.RegistrosSaldosFinalesMensuales.filter((reg: any) => reg.key == key)
      let RSFM2 = this.RegistrosSaldosFinalesMensuales.filter((reg: any) => reg.Anio == Anio - 1)



      if (RSFM.length > 0) {
        ValorSaldo = RSFM[RSFM.length - 1].Valor || 0
      }
      else if (RSFM2.length > 0) {
        ValorSaldo = RSFM2[RSFM2.length - 1].Valor || 0
      }
      else {
        ValorSaldo = 0
      }


      return ValorSaldo


    }
  }
  getDataFlujoFinancieroMensual(Mes: any, Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) =>
      (registro.idFlujo == 'psmpY6iyDJNkW7AKFXgK')
      && registro.NumMes == Mes
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
  }

  obtenerValorSaldoInicialAnual(Anio: any) {
    let _ValorInicialMensual: any = []
    let _ValorInicialesAnuales: any = []
    let _SaldosInicialesAnual: any = []
    _ValorInicialMensual = this.DataSaldoInicialMensual.filter((data: any) => data.Mes == 1 && data.Anio == Anio)
    _ValorInicialesAnuales = this.DataSaldoInicialMensual.filter((data: any) => data.Anio == Anio)
    _SaldosInicialesAnual = this.SaldoInicial.filter((data: any) => data.AnioRegistro == Anio)

    if (_ValorInicialMensual.length > 0) {
      return _ValorInicialMensual[0].Valor
    }
    else if (_ValorInicialesAnuales.length > 0) {
      return _ValorInicialesAnuales[0].Valor
    }
    else if (_SaldosInicialesAnual.length > 0) {
      return _SaldosInicialesAnual[0].Valor
    }
    else {
      let ValorSaldo: number = 0
      let RSFM2 = this.RegistrosSaldosFinalesMensuales.filter((reg: any) => reg.Anio == Anio - 1)
      if (RSFM2.length > 0) {
        ValorSaldo = RSFM2[RSFM2.length - 1].Valor
      }
      else {
        ValorSaldo = 0
      }

      return ValorSaldo
    }
  }
  obtenerValorSaldoFinalMensual(Mes: any, Anio: any) {
    let _ValorFinalMensual: any = []
    _ValorFinalMensual = this.DataSaldoFinalMensual.filter((data: any) => data.Mes == Mes && data.Anio == Anio)
    if (_ValorFinalMensual.length > 0) {
      return _ValorFinalMensual[0].Valor
    }
    else {
      return 0
    }
  }

  getValorCategoriaMensual(idCategoria: any, Mes: any, Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) => registro
      .idCategoria == idCategoria
      && registro.NumMes == Mes
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });
      if (_Data[0].Tipo == 'Egreso') {
        Valor = Valor * -1;
      }
      return Valor
    }
    else {
      return 0
    }
  }

  getValorItemMensual(idElemento: any, Mes: any, Anio: any, Registros: any) {

    let _Data: any = [];
    let Valor: number = 0
    _Data = Registros.filter((registro: any) =>
      registro.idHijo == idElemento
      && registro.NumMes == Mes
      && registro.AnioRegistro == Anio
    )
    if (_Data.length > 0) {
      _Data.forEach((element: any) => {
        Valor += Number(element.Valor);
      });


      if (_Data[0].Tipo == 'Egreso') {
        Valor = Valor * -1;
      }

      return Number(Valor)
    }
    else {
      return 0
    }
  }
  getValorItemMensualReal(idElemento: any, Mes: any, Anio: any, Registros: any) {

    let _Data: any = [];
    let Valor: number = 0
    _Data = Registros.filter((registro: any) =>
      registro.idItem == idElemento
      && registro.NumMes == Mes
      && registro.Anio == Anio
    )
    if (_Data.length > 0) {
      _Data.forEach((element: any) => {
        Valor += Number(element.Valor);
      });
      return Number(Valor)
    }
    else {
      return 0
    }
  }

  getValorItemAnual(idElemento: any, Anio: any, Registros: any) {
    let _Data: any = [];
    let Valor: number = 0
    _Data = Registros.filter((registro: any) =>
      registro.idHijo == idElemento
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      _Data.forEach((element: any) => {
        Valor += Number(element.Valor);
      });
      if (_Data[0].Tipo == 'Egreso') {
        Valor = Valor * -1;
      }
      return Number(Valor)
    }
    else {
      return 0
    }
  }
  getValorItemAnualReal(idElemento: any, Anio: any, Registros: any) {
    let _Data: any = [];
    let Valor: number = 0
    _Data = Registros.filter((registro: any) =>
      registro.idItem == idElemento
      && registro.Anio == Anio
    )

    if (_Data.length > 0) {
      _Data.forEach((element: any) => {
        Valor += Number(element.Valor);
      });
      if (_Data[0].Tipo == 'Egreso') {
        Valor = Valor * -1;
      }
      return Number(Valor)
    }
    else {
      return 0
    }
  }

  getValorSubItemMensual(idElemento: any, Mes: any, Anio: any, Registros: any) {

    let _Data: any = [];
    let Valor: number = 0
    _Data = Registros.filter((registro: any) =>
      registro.idSubCuentaContable == idElemento
      && registro.NumMes == Mes
      && registro.AnioRegistro == Anio
      && registro.TipoCuentaSeleccionada == "Hijo"
    )
    if (_Data.length > 0) {
      _Data.forEach((element: any) => {
        Valor += Number(element.Valor);
      });


      if (_Data[0].Tipo == 'Egreso') {
        Valor = Valor * -1;
      }

      return Number(Valor)
    }
    else {
      return 0
    }
  }
  getValorSubItemAnual(idElemento: any, Anio: any, Registros: any) {

    let _Data: any = [];
    let Valor: number = 0
    _Data = Registros.filter((registro: any) =>
      registro.idSubCuentaContable == idElemento
      && registro.AnioRegistro == Anio
      && registro.TipoCuentaSeleccionada == "Hijo"
    )
    if (_Data.length > 0) {
      _Data.forEach((element: any) => {
        Valor += Number(element.Valor);
      });


      if (_Data[0].Tipo == 'Egreso') {
        Valor = Valor * -1;
      }

      return Number(Valor)
    }
    else {
      return 0
    }
  }

  obtenerValorSaldoFinalAnual(Anio: any, Registros: any) {
    return this.obtenerValorSaldoInicialAnual(Anio) +
      this.getDataFlujoLibreAnual(Anio, Registros)
  }

  getDataFlujoLibreAnual(Anio: any, Registros: any) {
    return this.getDataFlujoOperativoAnual(Anio, Registros)
      + this.getDataFlujoInversionAnual(Anio, Registros)
      + this.getDataFlujoFinancieroAnual(Anio, Registros)
  }

  getDataFlujoOperativoAnual(Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) =>
      (registro.idFlujo == 'EESGPM4hWXvDlXSRnCwA')
      && registro.AnioRegistro == Anio
    )


    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
  }

  getDataFlujoInversionAnual(Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) =>
      (registro.idFlujo == 'GMzSuF04XQBsPmAkIB2C')
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
  }

  getDataFlujoFinancieroAnual(Anio: any, Registros: any) {
    let _Data: any = [];
    _Data = Registros.filter((registro: any) =>
      (registro.idFlujo == 'psmpY6iyDJNkW7AKFXgK')
      && registro.AnioRegistro == Anio
    )

    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
  }

  filtrarDatos(
    real: boolean,
    DataTreeTable: any,
    AniosSeleccionados: any,
    CantMeses: any,
    Registros: any,
    SaldosIniciales: any
  ) {
    this.DataTreeTable = DataTreeTable

    this.SaldoInicial = SaldosIniciales
    if(real==true){
      return this.construirValores(AniosSeleccionados, CantMeses, Registros,[])
    }
    else{     
      return this.construirValoresPlaneado(AniosSeleccionados, CantMeses, Registros, [])   
    }
  }


  enviarRegistrosTrimestrales(data: any) {
    this.RegistrosTrimestrales.next(data);
  }
  enviarRegistrosSemestrales(data: any) {
    this.RegistrosSemestrales.next(data);
  }
  enviarDataPlaneadoFinanciera(data: any) {
    this.dataPlaneadoFinanciera.next(data);
  }
  setUsuario(usuario: any) {
    this.usuarioSource.next(usuario);
  }
  setIdEmpresa(idEmpresa: any) {
    this.idEmpresaSource.next(idEmpresa);
  }


  getCalendario() {
    let _Calendario: [

    ]
  }
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  posicionarSemanas(semanas: any) {
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
        mes: this.capitalizeFirstLetter(fecha.format('MMMM')),
        numSemana: fecha.isoWeek(),
        // numSemana: fecha.week(),
        numeroMes: Number(fecha.format('MM')),
        semana: "Semana " + fecha.isoWeek(),
        año: Number(fecha.format('YYYY'))
      });
      fecha.add(1, 'days');
    }

    return catalogoFechas;
  }
  getDaysOfMonth(timezone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${timezone}`);
  }
  filtradoDinamico(Criterios: any, datos: any) {

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
  ordenarSemanas(semanas) {

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
  ordenarMeses(meses) {

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
  ordenarAnios(anios) {

    anios.sort((a, b) => {
      // Ordenar por año
      if (a.Anio !== b.Anio) {
        return a.Anio - b.Anio;
      }

      return a.Anio - b.Anio;



    });
    return anios
  }

  getNumMes(Fecha: any) {
    return Number((Fecha.substring(5)).substring(0, 2))
  }

  generarMesesAgrupadosPorAnio(fechaInicio: string, fechaFinal: string): any {
    let inicio: any = new Date(`${fechaInicio}T00:00:00`); // Fecha de inicio
    const final = new Date(`${fechaFinal}T00:00:00`); // Fecha de finalización
    const resultado: { [anio: number]: { numero: number, nombre: string }[] } = {};
    while (inicio <= final) {
      const anio = inicio.getFullYear(); // Año de la fecha actual
      const mesNumero = inicio.getMonth() + 1; // Mes de la fecha actual (de 1 a 12)
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


  obtenerUsuarios(idEmpresa: any) {
    return this.afs
      .collection('Usuarios', (ref) => ref.where('idEmpresa', '==', idEmpresa))
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
      .collection('TiposOperacion', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }
  obtenerTiposOperacionByMatriz(idMatriz) {
    return this.afs
      .collection('TiposOperacion', (ref) => ref.where('idMatriz', '==', idMatriz))
      .valueChanges();
  }

  ActualizarTipo(tipo: any) {
    return this.afs
      .collection('TiposOperacion')
      .doc(tipo.id)
      .ref.update(tipo);
  }

  ActualizarTipoEstado(Tipo: any, Activo: boolean) {
    return this.afs
      .collection('TiposOperacion')
      .doc(Tipo.id)
      .ref.update({ Activo: Activo });
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
  obtenerBancos(idEmpresa: any) {
    return this.afs
      .collection('Bancos', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }

  ActualizarBanco(banco: any) {
    return this.afs
      .collection('Bancos')
      .doc(banco.id)
      .ref.update(banco);
  }
  ActualizarBancoEstado(Banco: any, Activo: boolean) {
    return this.afs
      .collection('Bancos')
      .doc(Banco.id)
      .ref.update({ Activo: Activo });
  }
  //*------------BANCOS------------


  //?------------SUCURSALES------------

  // !Obtener las sucursales
  obtenerSucursales(idEmpresa: any) {
    return this.afs
      .collection('Sucursales', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }
  obtenerSucursalesByMatriz(idMatriz: any) {
    return this.afs
      .collection('Sucursales', (ref) => ref.where('idMatriz', '==', idMatriz))
      .valueChanges();
  }
  crearSucursal(sucursal: any) {
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

  ActualizaEstadoSucursal(Sucursal: any, Activo: boolean) {
    return this.afs
      .collection('Sucursales')
      .doc(Sucursal.id)
      .ref.update({ Activo: Activo });
  }

  // !Obtener las empresas
  obtenerEmpresas(idMatriz: any) {

    return this.afs
      .collection('Empresa', (ref) => ref.where('idMatriz', '==', idMatriz))
      .valueChanges();
  }

  ActualizarEmpresa(idEmpresa: string) {
    return this.afs
      .collection('Empresa')
      .doc(idEmpresa)
      .ref.update({ ConfigInicial: true });
  }
  ActualizarConfigEmpresa(idEmpresa: string) {
    return this.afs
      .collection('Empresa')
      .doc(idEmpresa)
      .ref.update({ CuentasConfig: true });
  }

  //?------------SUCURSALES------------
  obtenerAniosPlaneacion(idEmpresa: any) {
    return this.afs
      .collection('AniosPlaneacion', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }
  crearAniosPlaneacion(Anios: any) {
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


  obtenerProyectos(idEmpresa: any) {
    return this.afs
      .collection('Proyectos', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }
  obtenerProyectosByMatriz(idMatriz: any) {
    return this.afs
      .collection('Proyectos', (ref) => ref.where('idMatriz', '==', idMatriz))
      .valueChanges();
  }
  ActualizarUsuario(usuario: any) {
    this.afs
      .collection('Usuarios')
      .doc(usuario.id)
      .ref.update(usuario);
  }
  crearProyecto(proyecto: any) {
    const id = this.afs.createId();
    proyecto.Usuarios.forEach(user => {
      if (!user.Proyectos) {
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

  ActualizaEstadoProyecto(Proyecto: any, Activo: boolean) {
    return this.afs
      .collection('Proyectos')
      .doc(Proyecto.id)
      .ref.update({ Activo: Activo });
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
      .collection('Naturalezas', (ref) => ref.orderBy('Orden', 'asc').where('Calculado', '==', false))
      .valueChanges();
  }

  obtenerCategoriasFlujos() {
    return this.afs
      .collection('Naturalezas', (ref) => ref.orderBy('Orden', 'asc'))
      .valueChanges();
  }
  obtenerSaldoInicial(idEmpresa) {
    return this.afs
      .collection('SaldosIniciales', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }
  crearSaldoInicial(saldo: any) {
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
    Item.idHijo=id
    return this.afs
      .collection('CuentasHijos')
      .doc(id)
      .ref.set(Object.assign(Item, { id: id }));
  }

  async guardarCuentasEnLote(cuentasHijos: any[],idEmpresa:any): Promise<void> {
  try {
    let CuentasNietos=[]
    // Crear un batch
    const batch = this.afs.firestore.batch();
    
    // Referencia a la colección
    const collectionRef = this.afs.collection('CuentasHijos').ref;
    
    // Agregar cada documento al batch
    cuentasHijos.forEach(cuenta => {
      // Crear un ID único para cada documento
      const id = this.afs.createId();
      if(cuenta.Prefijo== "1.2.1"){
      CuentasNietos.push(
        {
          Nombre: "1.2.1.1 Facturas vencidas en el mes",
          Alias: "Facturas vencidas en el mes",
          Prefijo: "1.2.1.1",
          FechaCreacion: cuenta.FechaCreacion,
          HoraCreacion: cuenta.HoraCreacion, 
          idHijo: id,
          idPadre: "KtA2Cxpd79TJrW9afqR9",
          PrefijoPadre: 1.2,
          PrefijoHijo: 1,
          Editable: false,
          Orden: 1,
          OrdenReal: 1,
          idAbuelo: "od11V2OHVgaLG1RiXMiz",
          Tipo: 'Nieto',
          idEmpresa: cuenta.idEmpresa,
          idCorporacion: cuenta.idCorporacion
        },
        {
          Nombre: "1.2.1.2 Facturas vencidas en meses anteriores",
          Alias: "Facturas vencidas en meses anteriores",
          Prefijo: "1.2.1.2",
          FechaCreacion: cuenta.FechaCreacion,
          HoraCreacion: cuenta.HoraCreacion, 
          idHijo: id,
          idPadre: "KtA2Cxpd79TJrW9afqR9",
          PrefijoPadre: 1.2,
          PrefijoHijo: 1,
          Editable: false,
          Orden: 2,
          OrdenReal: 2,
          idAbuelo: "od11V2OHVgaLG1RiXMiz",
          Tipo: 'Nieto',
          idEmpresa: cuenta.idEmpresa,
          idCorporacion: cuenta.idCorporacion
        },
        {
          Nombre: "1.2.1.3 Facturas con vencimientos en meses futuros",
          Alias: "Facturas con vencimientos en meses futuros",
          Prefijo: "1.2.1.3",
          idHijo: id,
          FechaCreacion: cuenta.FechaCreacion,
          HoraCreacion: cuenta.HoraCreacion,          
          idPadre: "KtA2Cxpd79TJrW9afqR9",
          PrefijoPadre: 1.2,
          PrefijoHijo: 1,
          Editable: false,
          Orden: 3,
          OrdenReal: 4,
          idAbuelo: "od11V2OHVgaLG1RiXMiz",
          Tipo: 'Nieto',
          idEmpresa: cuenta.idEmpresa,
          idCorporacion: cuenta.idCorporacion
        }
       
        )

    }
      
      // Crear la referencia del documento con el ID generado
      const docRef = collectionRef.doc(id);
      
      // Agregar el campo id al objeto y luego guardar
      const cuentaConId = { ...cuenta, id: id,idHijo:id };
      
      // Agregar la operación de escritura al batch
      batch.set(docRef, cuentaConId);
    });
    
    // Ejecutar el batch
    await batch.commit();
    this.guardarCuentasNietosEnLote(CuentasNietos,idEmpresa).then(resp=>{

    })
    
    console.log('Todas las cuentas se guardaron exitosamente en lote');
  } catch (error) {
    console.error('Error al guardar en lote:', error);
    throw error;
  }
}

  async guardarCuentasNietosEnLote(cuentasHijos: any[],idEmpresa:any): Promise<void> {
  try {
    // Crear un batch
    const batch = this.afs.firestore.batch();
    
    // Referencia a la colección
    const collectionRef = this.afs.collection('CuentasNietos').ref;
    
    // Agregar cada documento al batch
    cuentasHijos.forEach(cuenta => {
      // Crear un ID único para cada documento
      const id = this.afs.createId();
      
      
      // Crear la referencia del documento con el ID generado
      const docRef = collectionRef.doc(id);
      
      // Agregar el campo id al objeto y luego guardar
      const cuentaConId = { ...cuenta, id: id,idNieto:id };
      
      // Agregar la operación de escritura al batch
      batch.set(docRef, cuentaConId);
    });
    
    // Ejecutar el batch
    await batch.commit();

    this.ActualizarConfigEmpresa(idEmpresa).then((resp:any)=>{

    })
    
    console.log('Todas las cuentas se guardaron exitosamente en lote');
  } catch (error) {
    console.error('Error al guardar en lote:', error);
    throw error;
  }
}
  crearCuentaNieto(Item: any) {
    const id = this.afs.createId();
    Item.idNieto=id
    return this.afs
      .collection('CuentasNietos')
      .doc(id)
      .ref.set(Object.assign(Item, { id: id }));
  }

  obtenerItems(idEmpresa: any) {
    return this.afs
      .collection('CuentasHijos', (ref) => ref.where('idEmpresa', '==', idEmpresa).orderBy('Orden', 'asc'))
      .valueChanges();
  }
  obtenerCuentasNietos(idEmpresa: any) {
    return this.afs
      .collection('CuentasNietos', (ref) => ref.where('idEmpresa', '==', idEmpresa).orderBy('Orden', 'asc'))
      .valueChanges();
  }
  obtenerCuentas(idEmpresa: any) {
    return this.afs
      .collection('Bancos', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }

  ActualizarItem(items: any) {
    return this.afs
      .collection('CuentasHijos')
      .doc(items.id)
      .ref.update(items);
  }
  ActualizarCuentaNieto(cuenta: any) {
    return this.afs
      .collection('CuentasNietos')
      .doc(cuenta.id)
      .ref.update(cuenta);
  }
  ActualizarItemEstado(Items: any, Activo: boolean) {
    return this.afs
      .collection('CuentasHijos')
      .doc(Items.id)
      .ref.update({ Activo: Activo });
  }

  // !Socios de negocios
  crearSocio(Socio: any) {
    const id = this.afs.createId();
    return this.afs
      .collection('Socios')
      .doc(id)
      .ref.set(Object.assign(Socio, { id: id }));
  }

  obtenerSocios(idEmpresa: any) {
    return this.afs
      .collection('Socios', (ref) => ref.where('idEmpresa', '==', idEmpresa))
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


  ActualizarSocioEstado(socios: any, Activo: boolean) {
    return this.afs
      .collection('Socios')
      .doc(socios.id)
      .ref.update({ Activo: Activo });
  }



  // !Registros
  crearRegistro(Registro: any): Promise<string> {

    return this.afs
      .collection('Registro')
      .doc(Registro.id)
      .ref.set({ ...Registro }) // Usa spread operator para añadir el id al objeto
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

  obtenerRegistros(idEmpresa: any): Observable<Registro[]> {
    return this.afs
      .collection('Registro', (ref) => ref.where('idEmpresa', '==', idEmpresa).orderBy('FechaRegistro', 'desc'))
      .valueChanges();
  }
  obtenerRegistrosbyCuenta(idElemento: any) {
    return this.afs
      .collection('Registro', (ref) => ref.where('Elemento.id', '==', idElemento))
      .valueChanges();
  }

  getElementsFromMultipleCollections(idElemento: any): Observable<any[]> {
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
  obtenerRegistrosByMatriz(idMatriz: any): Observable<Registro[]> {
    return this.afs
      .collection('Registro', (ref) => ref.where('idMatriz', '==', idMatriz).orderBy('FechaRegistro', 'desc'))
      .valueChanges();
  }
  obtenerRegistrosByProyecto(idProyecto: any): Observable<any[]> {
    return this.afs
      .collection('Registro', (ref) => ref.where('idProyecto', '==', idProyecto))
      .valueChanges();
  }
  obtenerRegistrosTipo(idEmpresa: any, Tipo: string): Observable<Registro[]> {
    return this.afs
      .collection('Registro', (ref) => ref.where('idEmpresa', '==', idEmpresa).where('TipoRegistro', '==', Tipo).orderBy('Orden', 'desc'))
      .valueChanges();
  }
  obtenerRegistrosFacturas(idEmpresa: any): Observable<any[]> {
    return this.afs
      .collection('RegistrosFacturas', (ref) => ref.where('idEmpresa', '==', idEmpresa).orderBy('Orden', 'desc'))
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
    return this.afs.collection('CuentasHijos').doc(id).delete();
  }
  borrarRegistroFactura(id: string) {
    return this.afs.collection('RegistrosFacturas').doc(id).delete();
  }
  DesactivarRegistro(IdRegistro: any) {
    return this.afs
      .collection('Registro')
      .doc(IdRegistro)
      .ref.update({ Activo: false });
  }




  identificarSemanas(semanas: any[]): any[] {
    const grupos: { [key: string]: any[] } = semanas.reduce((acc, semana) => {
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
          FechaActualizacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd')
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

  obtenerRegistrosStoreManagerRecapt(idEmpresa: any) {

    const StoreManagerRecapt$ = this.afs.collection('StoreManagerRecapt', (ref) => ref.where('idEmpresa', '==', idEmpresa)).valueChanges();
    const Registros$ = this.afs.collection('Registro', (ref) => ref.where('idEmpresa', '==', idEmpresa)).valueChanges();
    const SaldosIniciales$ = this.afs.collection('SaldosIniciales', (ref) => ref.where('idEmpresa', '==', idEmpresa)).valueChanges();

    return combineLatest([StoreManagerRecapt$, Registros$, SaldosIniciales$]).pipe(
      map(([RegistrosSMR, Registros, SaldosIniciales]) => {

        return [RegistrosSMR, Registros, SaldosIniciales];
      })
    );

  }





  obtenerValoresPlanes(idEmpresa: any): Observable<any[]> {
    return this.afs
      .collection('PlanificacionValores', (ref) => ref.where('idEmpresa', '==', idEmpresa))
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

  obtenerValoresPlanesItems(idEmpresa: any): Observable<any[]> {
    return this.afs
      .collection('PlanificacionValoresItems', (ref) => ref.where('idEmpresa', '==', idEmpresa))
      .valueChanges();
  }

  obtenerColecciones(idMatriz: any) {
    const Roles$ = this.afs.collection('Roles', (ref) => ref.where('idMatriz', '==', idMatriz)).valueChanges();
    const Usuarios$ = this.afs.collection('Usuarios', (ref) => ref.where('idMatriz', '==', idMatriz)).valueChanges();
    const SaldosIniciales$ = this.afs.collection('SaldosIniciales', (ref) => ref.where('idMatriz', '==', idMatriz)).valueChanges();
    const Sucursales$ = this.afs.collection('Sucursales', (ref) => ref.where('idMatriz', '==', idMatriz)).valueChanges();
    const Proyectos$ = this.afs.collection('Proyectos', (ref) => ref.where('idMatriz', '==', idMatriz)).valueChanges();

    return combineLatest([Roles$, Usuarios$, SaldosIniciales$, Sucursales$, Proyectos$]).pipe(

      map(([Roles, Usuarios, SaldosIniciales, Sucursales, Proyectos]) => {

        return [Roles, Usuarios, SaldosIniciales, Sucursales, Proyectos];
      })
    );

  }



}


