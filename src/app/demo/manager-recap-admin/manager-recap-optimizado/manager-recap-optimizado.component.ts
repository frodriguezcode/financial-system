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
    this.actualizarData(DatosCabecera.Anio,DatosCabecera.NumMes,DatosCabecera.Mes,Number(DatosElemento.Valor),DatosElemento.idElemento)
   


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

    this.construirData()
  }


  getValoresManagerRecapValorNumero(key:any){

    return this.RegistrosManagerRecapt.find((data:any)=>data.key==key)==undefined ? 0 :this.RegistrosManagerRecapt.find((data:any)=>data.key==key).Valor

  }
  getValoresManagerRecap(key:any){

    return this.RegistrosManagerRecapt.find((data:any)=>data.key==key)==undefined ? 'No Encontrado' :this.RegistrosManagerRecapt.find((data:any)=>data.key==key).ValorMostrar

  }
  getValoresManagerRecapAnual(key:any){
    return this.RegistrosManagerRecaptAcumulado.find((data:any)=>data.key==key)==undefined ? 'No Encontrado' :this.RegistrosManagerRecaptAcumulado.find((data:any)=>data.key==key).ValorMostrar
  


  }

  obtenerSubArrayConElemento(RowData:any,idElemento: string) {
    const elemento = RowData.flat().find(item => item.idElemento === idElemento);
    return elemento || null;
  }


  actualizarValorSimple(idElemento: string, mesAnio: string, nuevoValor: any) {
const filaActual = this.RowData.flat().find(item => item.idElemento === idElemento);

if (filaActual) {

    // nueva referencia → AG Grid refresca
    const nuevaFila = { ...filaActual, [mesAnio]: nuevoValor };

    // Reemplaza la fila dentro de RowData
    this.RowData = this.RowData.map(grupo =>
        grupo.map(item =>
            item.idElemento === idElemento ? nuevaFila : item
        )
    );
}
}



  actualizarData(Anio:any,Mes:any,MesNombre:any,Valor:any,idElemento:any){
    let DatosElementos = [];
    let _RowData=[...this.RowData]
     const key = `${Anio}-${Mes}-${idElemento}`;
    const index = this.RegistrosManagerRecapt.findIndex((reg: any) => reg.key === key);
    if (index !== -1) {
      this.RegistrosManagerRecapt[index].Valor = Number(Valor)
    }
    else {
      this.RegistrosManagerRecapt.push(
      {
        key: `${key}`,
        Anio: Anio,
        Mes: Mes,
        "idCatalogo":'',
        idElemento: idElemento, 
        Valor: Number(Valor),     
        TipoNumero:Number(Valor)< 0
                  ? 1
                  : 2
        }
     )
    }
    this. CatalogoElementos.forEach((catalogo) => {
        const copiaCatalogoElementos = [...catalogo.Elementos].sort(
        (a, b) => a.OrdenData - b.OrdenData  );
      copiaCatalogoElementos.forEach((elemento) => {
      const key = `${Anio}-${Mes}-${elemento.id}`;
      const keyAnioMes = `${MesNombre} ${Anio}`;
      

      //Procesamiento de Datos
        if (!DatosElementos[key]) {
          DatosElementos[key] = [];
        }  
        if (elemento.editable == true) {
          if (elemento.id == "04-01") {
            if (Mes == 1) 
            {
              let Valor =
                DatosElementos[`${Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio - 1}-${12}-04-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)
            }
            else 
            {
               let Valor =
                DatosElementos[`${Anio}-${Mes-1}-04-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio}-${Mes-1}-04-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio}-${Mes-1}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)      
            }
        
          }
          else if (elemento.id == "05-01") {
            if (Mes == 1) 
            {
              let Valor =
                DatosElementos[`${Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio - 1}-${12}-05-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)     

            }
            else 
              {
               let Valor =
                DatosElementos[`${Anio}-${Mes-1}-05-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio}-${Mes-1}-05-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio}-${Mes-1}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
               this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)     
              }
        
          }   

          else if (elemento.id == "06-01") {
            if (Mes == 1) 
            {
              let Valor =
                DatosElementos[`${Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio - 1}-${12}-06-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)      
            }
            else 
              {
               let Valor =
                DatosElementos[`${Anio}-${Mes-1}-06-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio}-${Mes-1}-06-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio}-${Mes-1}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)     
              }
        
          } 
          else if (elemento.id == "08-01") {
            if (Mes == 1) 
            {
              let Valor =
                DatosElementos[`${Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio - 1}-${12}-08-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)      
            }
            else 
              {
               let Valor =
                DatosElementos[`${Anio}-${Mes-1}-08-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio}-${Mes-1}-08-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio}-${Mes-1}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)        
              }
        
          }   
          else if (elemento.id == "09-01") {
            if (Mes == 1) 
            {
              let Valor =
                DatosElementos[`${Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio - 1}-${12}-09-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
            this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)        
            }
            else 
              {
               let Valor =
                DatosElementos[`${Anio}-${Mes-1}-09-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio}-${Mes-1}-09-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio}-${Mes-1}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)      
              }
        
          }     
          else if (elemento.id == "10-01") {
            if (Mes == 1) 
            {
              let Valor =
                DatosElementos[`${Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio - 1}-${12}-10-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
            this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)        
            }
            else 
              {
               let Valor =
                DatosElementos[`${Anio}-${Mes-1}-10-04`]?.[0]?.Valor ==
                undefined
                  ? this.getValoresManagerRecapValorNumero(key)
                  : DatosElementos[`${Anio}-${Mes-1}-10-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: DatosElementos[`${Anio}-${Mes-1}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true});
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)      
              }
        
          }     
          else if (
            elemento.id == "01-01" ||
            elemento.id == "01-03" ||
            elemento.id == "01-04" ||
            elemento.id == "01-06") {  
              let Valor =this.getValoresManagerRecapValorNumero(key)
        
              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:Valor,
                Lectura: Valor==
                  0
                    ? false
                    : true});
            this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)        

          }                         
          

        }
        
        else {
          //Mercadotecnia
          if (catalogo.id == "01") {
            if (elemento.id == "01-02") {
              let Valor1 =DatosElementos[`${Anio}-${Mes}-01-03`]?.[0]?.Valor || 0;
              let Valor2 =DatosElementos[`${Anio}-${Mes}-01-01`]?.[0]?.Valor || 0;
              let Valor =Valor2 == 0 ? 0 : Valor1 / Valor2

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:((Valor*100).toFixed(0)) + "%",
                Lectura: Valor==0
                    ? false
                    : true});
    
            this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)               
            }
            else if (elemento.id == "01-05") {
              let Valor1 =DatosElementos[`${Anio}-${Mes}-01-03`]?.[0]?.Valor || 0;
              let Valor2 =DatosElementos[`${Anio}-${Mes}-01-04`]?.[0]?.Valor || 0;
              let Valor =Valor1 + Valor2

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:Valor,
                Lectura: Valor==0
                    ? false
                    : true});
    
            this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0) 
            }  
            else if (elemento.id == "01-07") {
              let Valor1 =DatosElementos[`${Anio}-${Mes}-01-05`]?.[0]?.Valor || 0;
              let Valor2 =DatosElementos[`${Anio}-${Mes}-01-06`]?.[0]?.Valor || 0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:Valor,
                Lectura: Valor==0
                    ? false
                    : true});
    
            this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0) 
            }   
            else if (elemento.id == "01-08") {
              let Valor1 =
                DatosElementos[`${Anio}-${Mes}-01-09`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${Anio}-${Mes}-01-07`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${Anio}-${Mes}-01-05`]?.[0]?.Valor ||
                0;
              let Valor =
                Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: Valor < 0
                    ? false
                    : true
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0) 
            }  
              
          }
          //Estado de Resultados
          if (catalogo.id == "02") {
            if (elemento.id == "02-01") {
              let Valor =
                DatosElementos[`${Anio}-${Mes}-01-09`]?.[0]?.Valor || 0

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: Valor < 0
                    ? false
                    : true
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             

            }
            else if (elemento.id == "02-03") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-02`]?.[0]?.Valor || 0
              let Valor = Valor1+Valor2

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: Valor < 0
                    ? false
                    : true
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             

            }
      
            else if (elemento.id == "02-04") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-03`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 0
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:(Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                ValorMostrar:(Valor * 100).toFixed(0) + "%",
                Lectura: true
                   
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)
            }  
            else if (elemento.id == "02-08") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-05`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-06`]?.[0]?.Valor || 0
              let Valor3 = DatosElementos[`${Anio}-${Mes}-02-07`]?.[0]?.Valor || 0
              let Valor = Valor1+Valor2+Valor3

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:true
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
            }     
            else if (elemento.id == "02-09") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-03`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-08`]?.[0]?.Valor || 0
              let Valor = Valor1+Valor2

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:true
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
            } 
            else if (elemento.id == "02-10") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-09`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 0
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:(Valor * 100).toFixed(0) + "%",
                Lectura: true
                   
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)
            }   
            else if (elemento.id == "02-15") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-09`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-10`]?.[0]?.Valor || 0
              let Valor3 = DatosElementos[`${Anio}-${Mes}-02-11`]?.[0]?.Valor || 0
              let Valor4 = DatosElementos[`${Anio}-${Mes}-02-12`]?.[0]?.Valor || 0
              let Valor5 = DatosElementos[`${Anio}-${Mes}-02-13`]?.[0]?.Valor || 0
              let Valor6 = DatosElementos[`${Anio}-${Mes}-02-14`]?.[0]?.Valor || 0
              let Valor = Valor1+Valor2+Valor3+Valor4+Valor5+Valor6

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                  : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:true
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
            } 
            else if (elemento.id == "02-16") {
              let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 0
              let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 0
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;

              DatosElementos[`${key}`].push({
                Valor:Valor,
                TipoNumero:Valor < 0 ? 1 : 2,
                ValorMostrar:(Valor * 100).toFixed(0) + "%",
                Lectura: true
                   
                });
              this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)
            }                                                                
          }

          
 

        }

      })
    }) 
  }

  construirData() {
    let _DataRow: any = []
    this.CatalogoElementos.forEach(catalogo => {
      let _DataRowByElemento: any = []
   

      catalogo.Elementos.forEach((element: any) => {
        let fila: any = {
          Concepto: element.Nombre,
          editable: element.editable,
          idElemento:element.id,
          idCatalogo:catalogo.id
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
