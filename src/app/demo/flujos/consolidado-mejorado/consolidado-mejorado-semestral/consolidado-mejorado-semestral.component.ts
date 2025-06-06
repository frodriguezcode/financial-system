// angular import
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { TreeTableModule } from 'primeng/treetable';
@Component({
  selector: 'app-consolidado-mejorado-semestral',
  standalone: true,
  imports: [CommonModule, SharedModule, TableModule, ButtonModule,TreeTableModule],
  templateUrl: './consolidado-mejorado-semestral.component.html',
  styleUrls: ['./consolidado-mejorado-semestral.component.scss']
})
export default class ConsolidadoSemestralComponent implements OnInit {

  constructor(private conS: ConfigurationService) { }

  @ViewChild('dt') table: Table;

  Anios: any[] = [];
  AnioSeleccionados: any[] = [];
  Semestres: any[] = [];
  SemestresSeleccionados: any[] = [];
  Meses: any[] = [];
  RegistrosSaldosFinalesSemestrales: any[] = [];
  Cabecera: any[] = [];
  Registros: any[] = [];
  Items: any[] = [];
  SaldoInicial: any[] = [];
  Categorias: any[] = [];
  DataTreeTable = []
  usuario: any
  cargando: boolean = true
  RegistrosSaldosFinalesSemestres = []
  ExpandirCuentas: boolean = false
  Expandir: boolean = false

  maxCategoryLength: number = 0;


  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
 this.Semestres=[    
    {
      Semestre: 'Semestre 1',
      NumSemestre:1
    },
    {
      Semestre: 'Semestre 2',
      NumSemestre:2
    }
  
  ]
  this.Anios=[
    {Anio:2023,
    Mostrar: true
    },
    {Anio:2024,
    Mostrar: true

    },
    {Anio:2025,
    Mostrar: true

    },
  ]
  this.Meses= [
    {
      Mes: 'Enero',
      NumMes:1,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Abril',
      NumMes:4,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Junio',
      NumMes:6,
      Semestre:1,
      seleccionado: false
    },
    {
      Mes: 'Julio',
      NumMes:7,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      Semestre:2,
      seleccionado: false
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      Semestre:2,
      seleccionado: false
    },
  
  ]

 

    this.conS.RegistrosSemestrales$.subscribe((data: any) => {
      console.log('data', data)
    
      this.construirCabecera()

    })

    this.maxCategoryLength = this.findLongestCategory();

  }



  findLongestCategory(): number {
    let maxLen = 0;
    // Recorre las filas principales
    for (const row of this.DataTreeTable) {
      const text = row.data.categoria || '';
      if (text.length > maxLen) {
        maxLen = text.length;
      }
      // Recorre los children
      if (row.data.children) {
        for (const child of row.data.children) {
          const childText = child.data.categoria || '';
          if (childText.length > maxLen) {
            maxLen = childText.length;
          }
        }
      }
    }
    return maxLen;
  }

  /**
   * Convierte la longitud de texto en px 
   * (aprox. 7px por carácter, puedes ajustar).
   */
  calcColumnWidthPx(): number {
    const factor = 7; // ~7px por carácter
    return this.maxCategoryLength * factor;
  }


  getSemestresByAnio(anio: any) {
    return this.Semestres.filter((sem: any) => sem.Anio == anio)
  }

  construirCabecera() {
    this.Cabecera = []
  let AniosCabecera=this.AnioSeleccionados.length>0 ? this.AnioSeleccionados:this.Anios
  let Semestres=this.SemestresSeleccionados.length>0 ? this.SemestresSeleccionados:this.Semestres
    this.Anios.forEach((anio: any) => {
      this.getSemestresByAnio(anio.Anio).forEach((sem: any) => {

        this.Cabecera.push({
          "Nombre": "Semestre " + sem.NumSemestre + ' - ' + anio.Anio,
          "Semestre": sem.NumSemestre,
          "NumSemestre": sem.NumSemestre,
          "Anio": anio.Anio,
          "Tipo": 2,
          "Mostrar": true,
          "MostrarBoton": true,
          "MostrarBotonSemanal": true,
          "MostrarBotonMensual": true,
          "MostrarSemanas": true,
        })

      });
      this.Cabecera.push({
        "Nombre": "Total " + anio.Anio,
        "Mes": "",
        "NumMes": "",
        "Anio": anio.Anio,
        "Tipo": 3,
        "Mostrar": true,
        "MostrarBoton": true
      })
    });
    console.log('Cabecera', this.Cabecera)
    this.construirData()
  }
  construirData() {

    let indexCategoria: number = 0
    let indexItem: number = 0
    this.DataTreeTable = []
    this.Categorias.forEach(categ => {
      indexCategoria += 1
      let newRow: any = {
        key: `${indexCategoria}`,
        data: {
          id_categoria: categ.id, // O el campo relevante de Categorias
          categoria: categ.Nombre, // O el campo relevante de Categorias
          values: {}, // Aquí guardaremos los valores por mes-año
          children: [],
          tipo: 0
        }
      }

      this.Anios.forEach((anio: any) => {
        this.getSemestresByAnio(anio.Anio).forEach((sem: any) => {
          let key = `${sem.NumSemestre}-${anio.Anio}`;
          newRow.data.tipo = categ.Tipo
          if (categ.Orden == 0) {
            this.RegistrosSaldosFinalesSemestrales.push({
              "key": key,
              "Anio": anio.Anio,
              "Valor": this.getValorSaldoFinalSemestral(sem.NumSemestre, anio.Anio) || 0
            })
            newRow.data.values[key] = this.getSaldoInicialSemestral(sem.NumSemestre, anio.Anio) || 0;


          }
          else if (categ.Orden == 1) {
            newRow.data.values[key] = this.getDataFlujoOperativoSemestral(sem.NumSemestre, anio.Anio) || 0;
          }
          else if (categ.Orden == 4) {
            newRow.data.values[key] = this.getDataFlujoInversionSemestral(sem.NumSemestre, anio.Anio) || 0;
          }

          else if (categ.Orden == 7) {
            newRow.data.values[key] = this.getDataFlujoFinancieroSemestral(sem.NumSemestre, anio.Anio) || 0;

          }

          else if (categ.Orden == 10) {
            newRow.data.values[key] = this.getDataFlujoLibreSemestral(sem.NumSemestre, anio.Anio) || 0;
          }

          else if (categ.Orden == 11) {
            newRow.data.values[key] = this.getValorSaldoFinalSemestral(sem.NumSemestre, anio.Anio) || 0;
          }

          else {
            newRow.data.values[key] = this.getValorCategoriaSemestral(categ.id, sem.NumSemestre, anio.Anio) || 0;
          }

        })

        let key = `${anio.Anio}`;

        if (categ.Orden == 0) {
          newRow.data.values[key] = this.obtenerValorSaldoInicialAnual(anio.Anio);


        }
        else if (categ.Orden == 1) {
          newRow.data.values[key] = this.getDataFlujoOperativoAnual(anio.Anio) || 0;


        }
        else if (categ.Orden == 4) {
          newRow.data.values[key] = this.getDataFlujoInversionAnual(anio.Anio) || 0;


        }
        else if (categ.Orden == 7) {
          newRow.data.values[key] = this.getDataFlujoFinancieroAnual(anio.Anio) || 0;

        }
        else if (categ.Orden == 10) {
          newRow.data.values[key] = this.getDataFlujoLibreAnual(anio.Anio) || 0;


        }
        else if (categ.Orden == 11) {
          newRow.data.values[key] = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0;


        }
        else {
          newRow.data.values[key] = this.getValorCategoriaAnual(categ.id, anio.Anio) || 0;
        }

      })

      this.getItems(categ.id).forEach(item => {
        let newItem: any = {
          key: `${indexCategoria}-${indexItem}`,
          data: {
            id_item: item.id, // Nombre del item
            categoria: item.Nombre, // Nombre del item
            values: {}
          }
        };
        this.Anios.forEach((anio: any) => {
          this.getSemestresByAnio(anio.Anio).forEach((sem: any) => {
            indexItem += 1
            let key = `${sem.NumSemestre}-${anio.Anio}`;

            newItem.data.values[key] = this.getValorItemSemestral(item.id, sem.NumSemestre, anio.Anio) || 0;



          })
          let keyAnio = `${anio.Anio}`;
          newItem.data.values[keyAnio] = this.getValorItemAnual(item.id, anio.Anio) || 0;
        })
        newRow.data.children.push(newItem);
      })

      this.DataTreeTable.push(newRow)
    })
    this.cargando = false
  }

  toggleAllRows() {
    if (this.table) {
      // Si hay filas expandidas, contraerlas todas
      if (Object.keys(this.table.expandedRowKeys).length > 0) {
        this.ExpandirCuentas = false
        this.table.expandedRowKeys = {}; // Contraer todas las filas
      } else {
        // Expandir todas las filas
        const expandedKeys = {};
        this.table.value.forEach((row) => {
          expandedKeys[row.key] = true; // Marcar todas las filas como expandidas
        });
        this.table.expandedRowKeys = expandedKeys;
        this.ExpandirCuentas = true
      }
    }
  }

  getItems(idCategoria: any) {
    let _Items: any = []

    _Items = this.Items.filter((item: any) => item.idCategoria == idCategoria
      && item.idUsuarios.some((user: any) => user == this.usuario.id)

    )
    return _Items
  }
  getValorItemSemestral(idElemento: any, Sem: any, Anio: any) {
    let _Data: any = [];
    let Valor: number = 0
    _Data = this.Registros.filter((registro: any) =>
      registro.idElemento == idElemento
      && registro.Semestre == Sem
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

  getValorItemAnual(idElemento: any, Anio: any) {
    let _Data: any = [];
    let Valor: number = 0
    _Data = this.Registros.filter((registro: any) =>
      registro.idElemento == idElemento
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

  getSaldoInicialSemestral(NumSemestre: any, Anio: any) {

    let _Data: any = [];
    let _DataSaldoFinal: any = [];
    _Data = this.SaldoInicial.filter((saldo: any) => saldo
      && saldo.Semestre == NumSemestre
      && saldo.AnioRegistro == Anio
    )

    _DataSaldoFinal = this.SaldoInicial.filter((saldo: any) => saldo
      && saldo.Semestre == NumSemestre - 1
      && saldo.AnioRegistro == Anio
    )


    if (_Data.length > 0) {
      let Valor: number = 0
      _Data.forEach((data: any) => {
        Valor += Number(data.Valor)
      });

      return Valor
    }


    else {
      let key = `${NumSemestre - 1}-${Anio}`
      let ValorSaldo: number = 0

      let RSFM = this.RegistrosSaldosFinalesSemestrales.filter((reg: any) => reg.key == key)
      let RSFM2 = this.RegistrosSaldosFinalesSemestrales.filter((reg: any) => reg.Anio == Anio - 1)

      if (RSFM.length > 0) {
        ValorSaldo = RSFM[0].Valor
      }
      else if (RSFM2.length > 0) {
        ValorSaldo = RSFM2[RSFM2.length - 1].Valor
      }
      else {
        ValorSaldo = 0
      }

      return ValorSaldo


    }
  }

  getValorSaldoFinalSemestral(NumSem: any, Anio: any) {
    return this.getSaldoInicialSemestral(NumSem, Anio) +
      this.getDataFlujoLibreSemestral(NumSem, Anio)
  }
  getDataFlujoOperativoSemestral(NumSem: any, Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) =>
      (registro.idCategoria.Orden == 2
        || registro.idCategoria.Orden == 3)
      && registro.Semestre == NumSem
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

  getDataFlujoInversionSemestral(NumSem: any, Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) =>
      (registro.idCategoria.Orden == 5
        || registro.idCategoria.Orden == 6)
      && registro.Semestre == NumSem
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

  getDataFlujoFinancieroSemestral(NumSem: any, Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) =>
      (registro.idCategoria.Orden == 9
        || registro.idCategoria.Orden == 8)
      && registro.Semestre == NumSem
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

  getDataFlujoLibreSemestral(NumSem: any, Anio: any) {
    return this.getDataFlujoOperativoSemestral(NumSem, Anio)
      + this.getDataFlujoInversionSemestral(NumSem, Anio)
      + this.getDataFlujoFinancieroSemestral(NumSem, Anio)
  }

  getValorCategoriaSemestral(idCategoria: any, Sem: any, Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) => registro
      .idCategoria.id == idCategoria
      && registro.Semestre == Sem
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

  obtenerValorSaldoInicialAnual(Anio: any) {
    let _ValorInicialSemestral: any = []
    let _ValorInicialesAnuales: any = []
    let _SaldosInicialesAnual: any = []
    _ValorInicialSemestral = this.SaldoInicial.filter((data: any) => data.Semestre == 1 && data.Anio == Anio)
    _ValorInicialesAnuales = this.SaldoInicial.filter((data: any) => data.Anio == Anio)
    _SaldosInicialesAnual = this.SaldoInicial.filter((data: any) => data.AnioRegistro == Anio)

    if (_ValorInicialSemestral.length > 0) {
      let Valor: number = 0
      _ValorInicialSemestral.forEach((data: any) => {
        Valor += data.Valor
      })
      return Valor
    }
    else if (_ValorInicialesAnuales.length > 0) {
      return _ValorInicialesAnuales[0].Valor
    }
    else if (_SaldosInicialesAnual.length > 0) {
      return _SaldosInicialesAnual[0].Valor
    }
    else {
      let ValorSaldo: number = 0
      let RSFM2 = this.RegistrosSaldosFinalesSemestrales.filter((reg: any) => reg.Anio == Anio - 1)
      if (RSFM2.length > 0) {
        ValorSaldo = RSFM2[RSFM2.length - 1].Valor
      }
      else {
        ValorSaldo = 0
      }

      return ValorSaldo
    }
  }

  getDataFlujoOperativoAnual(Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) =>
      (registro.idCategoria.Orden == 2
        || registro.idCategoria.Orden == 3)
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
  getDataFlujoInversionAnual(Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) =>
      (registro.idCategoria.Orden == 5
        || registro.idCategoria.Orden == 6)
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
  getDataFlujoFinancieroAnual(Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) =>
      (registro.idCategoria.Orden == 9
        || registro.idCategoria.Orden == 8)
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
  getDataFlujoLibreAnual(Anio: any) {
    return this.getDataFlujoOperativoAnual(Anio)
      + this.getDataFlujoInversionAnual(Anio)
      + this.getDataFlujoFinancieroAnual(Anio)
  }

  obtenerValorSaldoFinalAnual(Anio: any) {
    //   let _ValorFinalMensual:any=[]
    //   _ValorFinalMensual=this.DataSaldoFinalMensual.filter((data:any)=>data.Anio==Anio)
    //   if(_ValorFinalMensual.length>0){
    //     return _ValorFinalMensual[0].Valor
    //   }
    //   else {
    //     return 0
    //   }
    return this.obtenerValorSaldoInicialAnual(Anio) + this.getDataFlujoLibreAnual(Anio)
  }

  getValorCategoriaAnual(idCategoria: any, Anio: any) {
    let _Data: any = [];
    _Data = this.Registros.filter((registro: any) => registro
      .idCategoria.id == idCategoria
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

  descargarExcel() {
    let _Cabecera: any = []
    _Cabecera = this.Cabecera.filter((cab: any) => cab.Mostrar == true)
    const headerRow: any[] = [];
    _Cabecera.forEach((element: any) => {
      headerRow.push(element.Nombre);
    });
    let Data: any[] = [];
    let Contador: number = 1
    this.Categorias.forEach((categ: any) => {
      let fila: any[] = [`${Contador}- ${categ.Nombre}`];
      Contador += 1
      _Cabecera.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {
        const indexItemTrimesral = `${cab.NumSemestre}-${cab.Anio}`;
        const indexAnual = `${cab.Anio}`;
        let valor = 0;
        const categoriaEncontrada = this.DataTreeTable.find((dataT: any) => dataT.data.id_categoria === categ.id);
        if (categoriaEncontrada) {
          if (cab.Tipo === 2) {
            valor = categoriaEncontrada.data.values?.[indexItemTrimesral] ?? 0;
          } else if (cab.Tipo === 3) {
            valor = categoriaEncontrada.data.values?.[indexAnual] ?? 0;
          }
        }
        else {
          valor = 0
        }

        fila.push(valor);
      })
      Data.push(fila);
      this.getItems(categ.id).forEach((item: any) => {
        let filaItem: any[] = [item.Nombre];
        _Cabecera.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {
          const indexItemTrimesral = `${cab.NumSemestre}-${cab.Anio}`;
          const indexItemAnual = `${cab.Anio}`;
          let valorItem = 0;
          if (cab.Tipo == 2) {
            valorItem = this.DataTreeTable.filter((dataT: any) => dataT.data.id_categoria == categ.id).length === 0
              ? 0
              : this.DataTreeTable.filter(
                (dataT: any) =>
                  dataT.data.id_categoria == categ.id &&
                  dataT.data.children.some((child: any) => child.data.id_item == item.id)
              ).length === 0
                ? 0
                : this.DataTreeTable
                  .flatMap((dataT: any) => dataT.data.children) // Aplanar los children
                  .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemTrimesral] || 0;

          }
          else if (cab.Tipo == 3) {
            valorItem = this.DataTreeTable.filter((dataT: any) => dataT.data.id_categoria == categ.id).length === 0
              ? 0
              : this.DataTreeTable.filter(
                (dataT: any) =>
                  dataT.data.id_categoria == categ.id &&
                  dataT.data.children.some((child: any) => child.data.id_item == item.id)
              ).length === 0
                ? 0
                : this.DataTreeTable
                  .flatMap((dataT: any) => dataT.data.children) // Aplanar los children
                  .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemAnual] || 0;
          }
          filaItem.push(valorItem);

        })
        Data.push(filaItem);
      })

    })

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');
    const headerRowData = worksheet.addRow(headerRow);

    headerRowData.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '71bd9e' } // Fondo amarillo
      };
      cell.font = {
        bold: true,
        color: { argb: 'ffffff' } // Texto azul
      };
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle'
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    Data.forEach((row: any, index: any) => {
      const dataRow = worksheet.addRow(row);


      if (row[0].startsWith('1-') || row[0].startsWith('12-')
      ) {
        dataRow.eachCell((cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'b4b4b4' },
          };
        });
      }
      else if (
        row[0].startsWith('3-')
        || row[0].startsWith('4-')
        || row[0].startsWith('6-')
        || row[0].startsWith('7-')
        || row[0].startsWith('9-')
        || row[0].startsWith('10-')
      ) {
        dataRow.eachCell((cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' },
          };
        });
      }
      else if (row[0].startsWith('2-')
        || row[0].startsWith('5-')
        || row[0].startsWith('8-')
        || row[0].startsWith('10-')
        || row[0].startsWith('11-')
      ) {
        dataRow.eachCell((cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'afeffb' },
          };
        });
      }
      else {
        dataRow.eachCell((cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffffff' },
          };
        });
      }

      dataRow.eachCell((cell: any, colNumber: number) => {
        if (colNumber === 1) {
          cell.alignment = {
            horizontal: 'left',
            vertical: 'middle'
          };
        } else {
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
        }
      });
    });

    worksheet.columns.forEach((column: any) => {
      const maxLength = column.values.reduce((acc: number, curr: any) => {
        return curr && curr.toString().length > acc ? curr.toString().length : acc;
      }, 10);
      column.width = maxLength + 2; // Ajustar el ancho de la columna
    });
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'datos.xlsx');
    });

  }

}
