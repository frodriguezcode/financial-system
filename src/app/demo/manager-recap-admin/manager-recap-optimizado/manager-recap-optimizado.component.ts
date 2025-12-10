// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { AccordionModule } from 'primeng/accordion';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-manager-recap-optimizado',
  standalone: true,
  imports: [CommonModule, SharedModule, AgGridModule, AgGridAngular, AccordionModule],
  templateUrl: './manager-recap-optimizado.component.html',
  styleUrls: ['./manager-recap-optimizado.component.scss']
})
export default class ManagerRecaptOptimizadoComponent implements OnInit {
  constructor(private conS: ConfigurationService, private datePipe: DatePipe, private toastr: ToastrService,) { }
  usuario: any
  localeText: any;
  cargando: boolean = true
  CatalogoElementos: any = []
  RegistrosContable: any = []
  RegistrosManagerRecapt: any = []
  RegistrosManagerRecaptAcumulado: any = []
  RegistrosManagerRecaptPromedios: any = []
  RegistrosSaldosIniciales: any = []
  Categorias: any = []
  Cabecera: any = []
  Meses: any = []
  RowData: any = []
  MesesSeleccionados: any = []
  Anios: any = []
  AniosSeleccionados: any = []
  gridApi: any;
  gridColumnApi: any;
  gridOptions: any;
  ngOnInit(): void {
    this.localeText = {
      // Textos comunes
      page: 'Página',
      pagesize: 'Cantidad de registros',
      more: 'Más',
      to: 'a',
      of: 'de',
      next: 'Siguiente',
      last: 'Última',
      first: 'Primera',
      previous: 'Anterior',
      loadingOoo: 'Cargando...',

      // Filtros
      equals: 'Igual',
      AND: 'Y',
      OR: 'O',
      and: 'Y',
      or: 'O',
      notEqual: 'Distinto',
      lessThan: 'Menor que',
      greaterThan: 'Mayor que',
      lessThanOrEqual: 'Menor o igual que',
      greaterThanOrEqual: 'Mayor o igual que',
      inRange: 'En rango',
      contains: 'Contiene',
      notContains: 'No contiene',
      startsWith: 'Empieza con',
      endsWith: 'Termina con',
      before: 'Antes de',
      blank: 'En blanco',
      notBlank: 'No en blanco',
      after: 'Después de',
      noRowsToShow: 'No hay datos para mostrar, cree un registro nuevo',
      // Encabezados del menú de filtro
      filterOoo: 'Filtrar...',
      applyFilter: 'Aplicar',
      resetFilter: 'Quitar filtro',
      clearFilter: 'Limpiar',
      cancelFilter: 'Cancelar',

      // Columnas
      column: 'Columna',
      columns: 'Columnas',
      pinColumn: 'Fijar columna',
      valueColumns: 'Columnas de valores',
      pivotMode: 'Modo pivote',

      // Menú de columnas
      autosizeThiscolumn: 'Ajustar esta columna',
      autosizeAllColumns: 'Ajustar todas',
      groupBy: 'Agrupar por',
      ungroupBy: 'Desagrupar por'
    };
    this.conS.usuario$.subscribe(usuario => {
      this.cargando = true
      if (usuario) {
        this.usuario = usuario
      }
      else {
        this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }
      this.obtenerData()
    })

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.addEventListener('filterChanged', () => {
      this.gridApi.onFilterChanged();
    });
  }
   onCellValueChanged(event: any) {

   

    let DatosCabecera={
      "Anio":event.colDef.Anio,
      "NumMes":event.colDef.NumMes,
      "Mes":event.colDef.Mes,
      "Tipo":event.colDef.Tipo,
    }

    let DatosElemento=
    {
      "idElemento":event.data.idElemento,
      "Concepto":event.data.Concepto,
      "Valor": event.newValue.startsWith('$') ? event.newValue.substring(1) : event.newValue

    }

     console.log('DatosCabecera',DatosCabecera)
     console.log('DatosElemento',DatosElemento)

  }

 onCellEditingStarted(event: any) {
  console.log('eventStarted')

  }
  obtenerData() {
    this.conS.obtenerDataManagerRecaptByEmpresa(this.usuario.idMatriz).subscribe((resp: any) => {
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
      this.Meses = [

        {
          Mes: 'Enero',
          NumMes: 1,
          Trimestre: 1,
          Mostrar: true
        },
        {
          Mes: 'Febrero',
          NumMes: 2,
          Trimestre: 1,
          Mostrar: true
        },
        {
          Mes: 'Marzo',
          NumMes: 3,
          Trimestre: 1,
          Mostrar: true
        },
        {
          Mes: 'Abril',
          NumMes: 4,
          Trimestre: 2,
          Mostrar: true
        },
        {
          Mes: 'Mayo',
          NumMes: 5,
          Trimestre: 2,
          Mostrar: true
        },
        {
          Mes: 'Junio',
          NumMes: 6,
          Trimestre: 2,
          Mostrar: true
        },
        {
          Mes: 'Julio',
          NumMes: 7,
          Trimestre: 3,
          Mostrar: true
        },
        {
          Mes: 'Agosto',
          NumMes: 8,
          Trimestre: 3,
          Mostrar: true
        },
        {
          Mes: 'Septiembre',
          NumMes: 9,
          Trimestre: 3,
          Mostrar: true
        },
        {
          Mes: 'Octubre',
          NumMes: 10,
          Trimestre: 4,
          Mostrar: true
        },
        {
          Mes: 'Noviembre',
          NumMes: 11,
          Trimestre: 4,
          Mostrar: true
        },
        {
          Mes: 'Diciembre',
          NumMes: 12,
          Trimestre: 4,
          Mostrar: true
        },

      ]
      let DataByEmpresa = resp.filter((data: any) => data.idEmpresa == this.usuario.idEmpresa)[0]
      console.log('DataByEmpresa',DataByEmpresa)
      this.RegistrosManagerRecapt = DataByEmpresa.RegistrosManagerRecapt
      this.RegistrosManagerRecaptAcumulado = DataByEmpresa.RegistrosManagerRecaptAcumulado
      this.RegistrosManagerRecaptPromedios = DataByEmpresa.RegistrosManagerRecaptPromedio
      this.RegistrosContable = DataByEmpresa.RegistrosContables
      this.Categorias = DataByEmpresa.Categorias
      this.CatalogoElementos = DataByEmpresa.CatalogoElementos
      this.RegistrosSaldosIniciales = DataByEmpresa.SaldosIniciales


      this.construirCabecera()
    })
  }



  construirCabecera() {
    console.log('CatalogoElementos', this.CatalogoElementos)
    let AniosCabecera = this.construirTiempos().AniosSeleccionados;
    let MesesCabecera = this.construirTiempos().MesesSeleccionados;
    this.Cabecera = [];
    this.Cabecera.push({
      field: 'Concepto',
      headerName: 'Concepto',
      idCampania: '',
      Mes: '',
      Mostrar: true,
      sort:false,
      width: 200,
      pinned: 'left',
      Orden: this.Cabecera.length + 1,
      NumMes: '',
      NumTrimestre: '',
      Anio: '',
      Tipo: 1
    });
    AniosCabecera.forEach((anio: any) => {
      MesesCabecera.forEach((mes: any) => {
        this.Cabecera.push({
          Nombre: mes.Mes + ' ' + anio.Anio,
          field: mes.Mes + ' ' + anio.Anio,
          headerName: mes.Mes + ' ' + anio.Anio,
          Mes: mes.Mes,
          Mostrar: true,
          editable: (params: any) => params.data.editable === true,
          cellStyle: (params: any) => {
            if (params.data?.editable === false) {
              return {
                backgroundColor: '#f2f2f2',  // gris suave
                color: '#000'                // texto más tenue
              };
            } else {
              return {
                backgroundColor: '#ffffff',  // blanco
                color: '#000'
              };
            }
          },
          
          width: 200,
          Orden: this.Cabecera.length + 1,
          NumMes: mes.NumMes,
          filter:false,
          sort:false,
          NumTrimestre: mes.Trimestre,
          Anio: anio.Anio,
          Tipo: 2
        });
      })
      this.Cabecera.push({
        Nombre: 'Acumulado ' + anio.Anio,
        field: 'Acumulado ' + anio.Anio,
        headerName: 'Acumulado ' + anio.Anio,
        Mostrar: true,
        filter:false,
  valueGetter: params => {
    const v = params.data['Acumulado ' + anio.Anio];
    return v !== undefined && v !== null ? String(v) : '';
  },
        sort:false,
        width: 200,
        Orden: this.Cabecera.length + 1,
        Anio: anio.Anio,
        Tipo: 3
      });
      this.Cabecera.push({
        Nombre: 'Promedio ' + anio.Anio,
        field: 'Promedio ' + anio.Anio,
        headerName: 'Promedio ' + anio.Anio,
        Mostrar: true,
        filter:false,
        sort:false,        
        width: 200,
        Orden: this.Cabecera.length + 1,
        Anio: anio.Anio,
        Tipo: 4
      });
    })

    console.log('Cabecera', this.Cabecera)
    this.construirData()
  }


  getValoresManagerRecap(key:any){

    return this.RegistrosManagerRecapt.find((data:any)=>data.key==key)==undefined ? 'No Encontrado' :this.RegistrosManagerRecapt.find((data:any)=>data.key==key).ValorMostrar

  }
  getValoresManagerRecapAnual(key:any){
    return this.RegistrosManagerRecaptAcumulado.find((data:any)=>data.key==key)==undefined ? 'No Encontrado' :this.RegistrosManagerRecaptAcumulado.find((data:any)=>data.key==key).ValorMostrar
  


  }

  construirData() {
    let _DataRow: any = []
    this.CatalogoElementos.forEach(catalogo => {
      let _DataRowByElemento: any = []
   

      catalogo.Elementos.forEach((element: any) => {
        let fila: any = {
          Concepto: element.Nombre,
          editable: element.editable,
          idElemento:element.id
        };
        this.Cabecera
          .filter((cabecera: any) => cabecera.Tipo != 1)
          .sort((a: any, b: any) => a.Orden - b.Orden).forEach((cab: any) => {
            
            if(cab.Tipo==2){
              const key = `${cab.Anio}-${cab.NumMes}-${element.id}`;
              fila[cab.Nombre] = this.getValoresManagerRecap(key)

            }

            else if(cab.Tipo==3) {
              const keyAnual = `${cab.Anio}-${element.id}`;
              if(cab.Anio==2023 && element.id=='01-08'){
                console.log('Valor',this.getValoresManagerRecapAnual(keyAnual))
              }
              fila[cab.Nombre] = this.getValoresManagerRecapAnual(keyAnual)
            }


          })
        _DataRowByElemento.push(fila);
      });

      _DataRow.push(_DataRowByElemento)
    });
    this.RowData = _DataRow
    this.cargando = false
    console.log('_DataRow', _DataRow)
  }

  construirTiempos() {
    // Anios
    let AniosSeleccionados =
      this.AniosSeleccionados.length > 0 ? this.AniosSeleccionados : this.Anios.filter((anio: any) => anio.Anio != 'Todos');
    //Meses
    let MesesSeleccionados = this.MesesSeleccionados.length > 0 ? this.MesesSeleccionados : this.Meses.filter((mes: any) => mes.id != 0);

    return {
      AniosSeleccionados: AniosSeleccionados,
      MesesSeleccionados: MesesSeleccionados
    };
  }



}
