// angular import
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { TreeTableModule } from 'primeng/treetable';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import ConsolidadoMejoradoTrimesralComponent from './consolidado-mejorado-trimestral/consolidado-mejorado-trimestral';
import ConsolidadoSemestralComponent from './consolidado-mejorado-semestral/consolidado-mejorado-semestral.component';
@Component({
  selector: 'app-consolidado-mejorado',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule,TreeSelectModule,
    TreeTableModule,TableModule,ButtonModule,
    ConsolidadoMejoradoTrimesralComponent,ConsolidadoSemestralComponent],
  templateUrl: './consolidado-mejorado.component.html',
  styleUrls: ['./consolidado-mejorado.component.scss']
})
export default class ConsolidadoMejoradoComponent implements OnInit {
  @ViewChild('dt') table: Table; 
  constructor(
    private conS:ConfigurationService
  ) {}
  ExpandirCuentas:boolean=false
  Categorias:any=[]
  categoriasExpandidas: { [id: number]: boolean } = {};
  Items:any=[]
  ItemsBack:any=[]
  Registros:any=[]
  RegistrosBackUp:any=[]
  Semanas:any=[]
  SemanasSingle:any=[]
  SemanasSeleccionadas:any=[]
  CatalogoFechas:any=[]
  Trimestres:any=[]
  Meses:any=[]
  MesesBack:any=[]
  MesesSeleccionados:any=[]
  Anios:any=[]
  AniosSeleccionados:any=[]
  AniosBack:any=[]
  Cabecera:any=[]
  Semestres:any=[]
  CabeceraBack:any=[]
  usuario:any
  cargar:boolean=false
  MostrarTodasSemanas:boolean=false
  //Categorías
  DataCategorias:any=[]
  DataCategoriasMensual:any=[]
  DataCategoriasAnual:any=[]
  //FEO
  DataFEO:any=[]
  DataFEOMensual:any=[]
  DataFEOAnual:any=[]


  //Items
  DataItems:any=[]
  DataItemsMensual:any=[]
  DataItemsAnual:any=[]

  //SaldosIniciales
  SaldoInicial:any=[]
  SaldoInicialBack:any=[]
  DataSaldoInicial:any=[]
  DataSaldoInicialMensual:any=[]
  DataSaldoInicialAnual:any=[]
  DataSaldoFinal:any=[]
  DataSaldoFinalMensual:any=[]
  DataSaldoFinalAnual:any=[]

  Sucursales:any=[]
  SucursalSeleccionada:any=[]
  Proyectos:any=[]
  ProyectoSeleccionado:any=[]

  CuentasBancarias:any=[]
  CuentaBancariaSeleccionada:any=[]
  SemanasTodas:any=[]

  Expandir:boolean=false
  catalogoFechas: any[] = [];
  MaestroSemanasMesAnio:any=[]
  MaestroSeleccionado:any

  showSemanas:boolean=true

  DataTreeTable:any=[]
  RegistrosSaldosFinalesMensuales:any=[]

  verMensual:boolean=true
  verTrimestral:boolean=false
  verSemestral:boolean=false

  maxCategoryLength: number = 0;
  ngOnInit(): void {
    this.conS.usuario$.subscribe(usuario => {
      if (usuario) {
      this.usuario=usuario
      }
      else {
        this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }
      this.obtenerSaldoInicial()
      this.obtenerSucursales()
      this.obtenerProyectos()
      this.obtenerBancos()
      this.getCatalogoFechas()
   
    });

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
  

  cambiarPeriodo(periodo:any){
    if(periodo==1){
      this.verMensual=true
      this.verTrimestral=false
      this.verSemestral=false
    }
    else if(periodo==2){
      this.verMensual=false
      this.verTrimestral=true
      this.verSemestral=false
    }
    else {
      this.verMensual=false
      this.verTrimestral=false
      this.verSemestral=true
    }
  }
  
  toggleAllRows() {
    if (this.table) {
      // Si hay filas expandidas, contraerlas todas
      if (Object.keys(this.table.expandedRowKeys).length > 0) {
        this.ExpandirCuentas=false
        this.table.expandedRowKeys = {}; // Contraer todas las filas
      } else {
        // Expandir todas las filas
        const expandedKeys = {};
        this.table.value.forEach((row) => {
          expandedKeys[row.key] = true; // Marcar todas las filas como expandidas
        });
        this.table.expandedRowKeys = expandedKeys;
        this.ExpandirCuentas=true
      }
    }
  }

  ValoresByItem(dataArray: any[], categoriaId: string, valueKey: string): number {
    // Filtrar por id_categoria
    const filteredCategories = dataArray.filter(item => item.data.id_categoria === categoriaId);
  
    if (filteredCategories.length > 0) {
      // Buscar en los children si existen y tienen el id_item
      for (const category of filteredCategories) {
        if (category.data.children) {
          const filteredChildren = category.data.children.filter(child => child.data.id_item === categoriaId);
  
          if (filteredChildren.length > 0) {
            // Si el valor existe en values, devolverlo, si no, null
            return filteredChildren[0].data.values[valueKey] ?? null;
          }
        }
      }
    }
  
    return 0;
  } 


descargarExcel(){
  let _Cabecera:any=[]
 _Cabecera=this.Cabecera.filter((cab:any)=>cab.Mostrar==true)
  const headerRow: any[] = [];
  _Cabecera.forEach((element: any) => {
    headerRow.push(element.Nombre);
  });
  let Data: any[] = [];
  let Contador:number=1
  this.Categorias.forEach((categ: any) => {
    let fila: any[] = [`${Contador}- ${categ.Nombre}`];
    Contador+=1
    _Cabecera.filter((cab: any) => cab.Tipo != 1 && cab.Tipo != 2).forEach((cab: any) => {
      const index = `${cab.Anio}-${cab.NumMes}-${categ.id}-${cab.NumSemana}`;
      const indexMensual = `${cab.NumMes}-${cab.Anio}`;
      const indexAnual = `${cab.Anio}`;
      let valor = 0;
      const categoriaEncontrada = this.DataTreeTable.find((dataT: any) => dataT.data.id_categoria === categ.id);
      if (categoriaEncontrada) {
        if (cab.Tipo === 3) {
          valor = categoriaEncontrada.data.values?.[indexMensual] ?? 0;
        } else if (cab.Tipo === 4) {
          valor = categoriaEncontrada.data.values?.[indexAnual] ?? 0;
        }
      }
      else {
        valor=0
      }

  fila.push(valor);
    })
    Data.push(fila);
    this.getItems(categ.id).forEach((item: any) => {
  let filaItem: any[] = [item.Nombre];
  _Cabecera.filter((cab: any) => cab.Tipo != 1 && cab.Tipo != 2).forEach((cab: any) => {
    const indexItem = `${cab.Anio}-${cab.NumMes}-${item.id}-${cab.NumSemana}`;
    const indexItemMensual = `${cab.Mes}-${cab.Anio}`;
    const indexItemAnual = `${cab.Anio}`;
    let valorItem = 0;
 if (cab.Tipo == 3) {
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
      .find((child: any) => child.data.id_item == item.id)?.data.values[indexItemMensual] || 0;

  }
  else if (cab.Tipo == 4) {
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


  if(row[0].startsWith('1-') || row[0].startsWith('12-') 
  ){
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b4b4b4' },
      };
    });
  }
 else  if( 
     row[0].startsWith('3-') 
    || row[0].startsWith('4-')  
    || row[0].startsWith('6-') 
    || row[0].startsWith('7-')  
    || row[0].startsWith('9-')  
    || row[0].startsWith('10-')  
  ){
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' }, 
      };
    });
  }
else  if(row[0].startsWith('2-') 
    || row[0].startsWith('5-')
    || row[0].startsWith('8-') 
    || row[0].startsWith('10-')  
    || row[0].startsWith('11-')  
  )
  {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'afeffb' },
      };
    });
  }
else 
  {
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

worksheet.columns.forEach((column:any) => {
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

ocultarSemanas(){
  this.Semanas.forEach(semana => {
 
      semana.Mostrar = false;
    
  });
  this.Cabecera.forEach(cab => {

    if (cab.Tipo==2) {
      cab.Mostrar = false;
    
    }
    if (cab.Tipo==3) {
     
      cab.MostrarBotonSemanal = false;
    }
    
  });
  this.showSemanas=false
}
mostrarSemanas(){
  this.Semanas.forEach(semana => {
 
      semana.Mostrar = true;
    
  });
  this.Cabecera.forEach(cab => {

    if (cab.Tipo==2) {
      cab.Mostrar = true;
    
    }
    if (cab.Tipo==3) {
     
      cab.MostrarBotonSemanal = true;
    }
    
  });
  this.showSemanas=true
}

ocultarMostrar(NumMes:any,Anio:any){
  this.Semanas.forEach(semana => {
    if (semana.Mes == NumMes && semana.Anio == Anio) {
      semana.Mostrar = !semana.Mostrar;
    }
  });
  this.Cabecera.forEach(cab => {
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==2)) {
      cab.Mostrar = !cab.Mostrar;
    
    }
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==3)) {
     
      cab.MostrarBotonSemanal = !cab.MostrarBotonSemanal;
    }
  });

}
ocultarMostrarMeses(NumMes:any,Anio:any){
  this.Anios.forEach(anio => {

    this.Meses.forEach(mes => {
      if (mes.NumMes == NumMes && anio.Anio == Anio) {
        mes.Mostrar = !mes.Mostrar;
      }
    });
    
  });

  this.Cabecera.forEach(cab => {
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==3)) {
      cab.Mostrar = !cab.Mostrar;

      if(cab.MostrarBotonSemanal==true){

        cab.MostrarBotonSemanal = !cab.MostrarBotonSemanal;
      }
      cab.MostrarSemanas= !cab.MostrarSemanas;
    
    }
    if (cab.NumMes == NumMes && cab.Anio == Anio && (cab.Tipo==2)) {
      if(cab.Mostrar==true){

        cab.Mostrar = !cab.Mostrar;
        cab.MostrarBotonMensual = !cab.MostrarBotonMensual;
      }
    }
 
  });
 
}
  filtrarMeses(numMes:any){
    let _MesEncontrado:any=[]
    _MesEncontrado=this.MesesSeleccionados.filter((mes:any)=>mes.NumMes==numMes)
   
    if(_MesEncontrado.length>0){
      return true
    }
    else {
      return false
    }
  }

  obtenerProyectos(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
      _subscribe.unsubscribe()
      this.Proyectos=resp
      this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )

    })
  }
  getNameSucursal(idSucursal:any){
    if(idSucursal=='0'){
      return 'General'
    }
    else {
      let sucursal = this.Sucursales.filter((suc: any) => suc.id==idSucursal)
      if(sucursal.length){
        return sucursal[0].Sucursal
      }
      else{
        return 'General'
      }
    }
  }

  getCatalogoFechas(){
    const fechaInicio = '2023-01-01';
    const dias = 365; // Número de días a generar
    let _Semanas:any=[]
    this.catalogoFechas = this.conS.generarCatalogoFechas(fechaInicio);

    let SemanasAgrupadas:any=[]
    SemanasAgrupadas=this.conS.agruparPorAnoMesSemana(this.catalogoFechas);
   
    SemanasAgrupadas.forEach((fecha:any)=>{
      _Semanas.push(
        { 
        NumSemana: fecha.semana, 
        Semana: "Semana " + fecha.semana, 
        SemanaAnio: "Semana " + fecha.semana + ' ' + '(' + fecha.año + ')', 
        Mes:fecha.numeroMes,
        NumMes:fecha.numeroMes,
        MesNombre:fecha.mes,
        Fechas:fecha.fechas,
        Anio:fecha.año
      })
    })
   this.SemanasTodas= this.conS.posicionarSemanas(_Semanas);


   }
   filtrarBySemanas(){
    let SemanasRegistros:any=[]
    let MesesRegistros:any=[]
    let AniosRegistros:any=[]
    let CriteriosRegistros:any=[]
    let CriteriosSaldos:any=[]

    if(this.MaestroSeleccionado.length>0 ){
      let MaestroSelec=this.MaestroSeleccionado.filter(obj => !('expanded' in obj));
        MaestroSelec.forEach((maestro:any) => {
        AniosRegistros.push(maestro.Anio)
        MesesRegistros.push(maestro.parent.data)
        SemanasRegistros.push(maestro.NumSemana)
      
        
      });
    
    }


    CriteriosRegistros={
      NumSemana:SemanasRegistros,
      AnioRegistro:AniosRegistros,
      MesRegistro:MesesRegistros,

    }
    CriteriosSaldos={
      SemanaNum:SemanasRegistros,
      AnioRegistro:AniosRegistros,
      MesRegistro:MesesRegistros,

    }
    this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
    this.SaldoInicial= this.conS.filtradoDinamico(CriteriosSaldos,this.SaldoInicialBack)

   this.construirCabecera()

  }

  filtrarPorAnioMes(){
    this.Anios=this.AniosSeleccionados.length>0 ? this.AniosSeleccionados: this.AniosBack
    this.Meses=this.MesesSeleccionados.length>0 ? this.MesesSeleccionados: this.MesesBack
    this.construirCabecera()
  }

  filtrarData(){
    let SemanasRegistros:any=[]
    let Cuentas:any=[]
    let CriteriosRegistros:any=[]
    let CriteriosSaldos:any=[]
    let Sucursales:any=[]
    let Proyectos:any=[]

    // if(this.SemanasSeleccionadas.length>0){
    //   this.SemanasSeleccionadas.forEach((element:any) => {
    //     SemanasRegistros.push(element.NumSemana)
    //   });
    // }
    if(this.CuentaBancariaSeleccionada.length>0){
      this.CuentaBancariaSeleccionada.forEach((element:any) => {
        Cuentas.push(element.Cuenta)
      });
    }
    if(this.SucursalSeleccionada.length>0){
      this.SucursalSeleccionada.forEach((element:any) => {
        Sucursales.push(element.id)
      });
    }
    if(this.ProyectoSeleccionado.length>0){
      this.ProyectoSeleccionado.forEach((element:any) => {
        Proyectos.push(element.id)
      });
    }

    CriteriosRegistros={
      NumSemana:SemanasRegistros,
      NumCuenta:Cuentas,
      idProyecto:Proyectos,
      idSucursal:Sucursales

    }
    CriteriosSaldos={
      SemanaNum:SemanasRegistros,
      NumCuenta:Cuentas,
      idProyecto:Proyectos,
      idSucursal:Sucursales

    }
   
    this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
    this.SaldoInicial= this.conS.filtradoDinamico(CriteriosSaldos,this.SaldoInicialBack)

   this.construirCabecera()

  
  }

  obtenerSucursales(){
    let _subscribe:Subscription
   _subscribe= this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe((resp:any)=>{
    _subscribe.unsubscribe()
    this.Sucursales=resp.filter((suc:any)=>suc.Activo==true)
    })
  }
  obtenerBancos(){
    this.conS.obtenerBancos( this.usuario.idEmpresa).subscribe((resp:any)=>{
      this.CuentasBancarias=resp
      this.CuentasBancarias.map((c:any)=> c.CuentaNombre= c.Nombre + ' - ' + c.Cuenta)


    })
  }
  obtenerSaldoInicial(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerSaldoInicial( this.usuario.idEmpresa).subscribe((resp:any)=>{
      _subscribe.unsubscribe()
      this.SaldoInicial=resp
      this.SaldoInicial.map((saldo:any)=>{
        saldo.Trimestre=this.setTrim(saldo.MesRegistro), 
        saldo.Semestre=this.setSemestre(saldo.NumMes)
        
      })
      this.SaldoInicialBack=resp

      this.obtenerCategorias()
    })
  }

  obtenerCategorias(){
    let _subscribe:Subscription
    _subscribe= this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
      // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
      _subscribe.unsubscribe() 
      this.Categorias=[]
     this.Categorias.push(
      {
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Saldo Inicial en Bancos",
      "Orden":0,
      "Suma":false,
      "Tipo":0,
      "id":0,
    })
      data.forEach(categoria => {
        let _Categ={
          "Calculado":categoria.Calculado,
          "Mostrar":categoria.Mostrar,
          "Nombre":categoria.Nombre,
          "Orden":categoria.Orden,
          "Suma":categoria.Suma,
          "Tipo":categoria.Tipo,
          "id":categoria.id,
        }
        this.Categorias.push(_Categ)

        if(categoria.Orden==9){
          this.Categorias.push(
            {
            "Calculado":true,
            "Mostrar":true,
            "Nombre":"Saldo Final en Bancos",
            "Orden":11,
            "Suma":false,
            "Tipo":11,
            "id":11,
          })
        }
      })


   this.Categorias=this.Categorias.sort((a:any, b:any) => a.Orden - b.Orden)
    
      this.Categorias.forEach(element => {
        this.categoriasExpandidas[element.id]=true
        
      });
      this.obtenerItems()
    })
  }
  toggleCategoria(id: number) {

    this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
  }
  expandirTodo(){
    this.Expandir=!this.Expandir
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=false
      
    });
  }
  contraerTodo(){
    this.Expandir=!this.Expandir
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=true
      
    });
  }
  
obtenerItems(){
  let _subscribe:Subscription
  _subscribe=  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    _subscribe.unsubscribe()
    this.Items=[]
          this.Items=resp.filter((item:any)=>item.Activo==true);
          this.ItemsBack=resp.filter((item:any)=>item.Activo==true);;
      
         this.obtenerRegistros()
      })
}

filtrarCuentas(TipoRubro:any){
 if( this.ProyectoSeleccionado.length==0 && this.SucursalSeleccionada.length==0){

    this.Items=this.ItemsBack
  }
 else if(TipoRubro==1){

    if( this.SucursalSeleccionada.length==0){
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro)
    }

    else {
      const sucursalesID = this.SucursalSeleccionada.map(p => p.id);
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro
      &&

      item.Sucursales.some(sucursal => sucursalesID.includes(sucursal.id))
      )


    }
    
  }
  else {

    if( this.ProyectoSeleccionado.length==0){
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro)
    }

    else {
      const proyectosIds = this.ProyectoSeleccionado.map(p => p.id);
      this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==TipoRubro &&
      item.Proyectos.some(proyecto => proyectosIds.includes(proyecto.id))
      )
    }
    
  }
  this.getDataCategorias()
  this.getDataCategoriasMensual()
  this.getDataCategoriasAnual()

}
  
setTrim(MesRegistro:any){

if(MesRegistro=='Enero' || MesRegistro=='Febrero' || MesRegistro=='Marzo' ){
    return 1
}
else if(MesRegistro=='Abril' || MesRegistro=='Mayo' || MesRegistro=='Junio' ){
    return 2
}
else if(MesRegistro=='Julio' || MesRegistro=='Agosto' || MesRegistro=='Septiembre'){
    return 3
}
else if(MesRegistro=='Octubre' || MesRegistro=='Noviembre' || MesRegistro=='Diciembre'){
    return 4
}
else {
  return 0
}
  

}
setSemestre(NumMes:any){

if(NumMes>=6){
    return 2
}
else if(NumMes<6){
    return 1
}
else {
  return 0
}
  

}

obtenerRegistros(){
  let _subscribe:Subscription
  _subscribe=  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    _subscribe.unsubscribe()
    this.Registros=[]  

        resp.filter((data:any)=>data.Valor!=0).sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
          let _Registro={
            "Activo":element.Activo,
            "AnioRegistro":element.AnioRegistro,
            "Trimestre":this.setTrim(element.MesRegistro), 
            "Semestre":this.setSemestre(element.NumMes),
            "Cuenta":element.Cuenta,
            "Editando":element.Editando,
            "Elemento":element.Elemento,
            "FechaRegistro":element.FechaRegistro,
            "MesRegistro":element.MesRegistro,
            "Nuevo":element.Nuevo,
            "NumMes":element.NumMes,
            "NumSemana":element.NumSemana,
            "Orden":element.Orden,
            "Semana":element.Semana,
            "Valor":element.Valor,
            "id":element.id,
            "Tipo":element.Tipo || '',
            "idCategoria":element.idCategoria,
            "idEmpresa":element.idEmpresa,
            "idFlujo":element.idFlujo,
            "idUsuario":element.idUsuario,
            "idMatriz":element.idMatriz,
            "idSocioNegocio":element.idSocioNegocio,
            "idSucursal":element.idSucursal,
            "idProyecto":element.idProyecto,
            "NombreElemento":element.Elemento.label || '',
            "idElemento":element.Elemento.id || '',
            "NumCuenta":element.Cuenta.Cuenta || '',
            "CategoriaNombre":element.idCategoria.Nombre || '',
            "SocioNegocio":element.idSocioNegocio.Nombre || '',
    
          }
          this.Registros.push(_Registro)
          });


         
          this.RegistrosBackUp=this.Registros
   


          const obtenerAniosUnicos = (registros1: any[], registros2: any[]) => {
            const aniosUnicos = new Map();
          
            // Unir ambos arreglos y extraer los años únicos
            [...registros1, ...registros2].forEach((item) => {
              if (!aniosUnicos.has(item.AnioRegistro)) {
                aniosUnicos.set(item.AnioRegistro, {
                  Anio: item.AnioRegistro,
                  seleccionado: false,
                  label: item.AnioRegistro,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(aniosUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };

          const aniosActivos = obtenerAniosUnicos(this.Registros, this.SaldoInicial);

          const obtenerMesesUnicos = (registros1: any[], registros2: any[]) => {
            const mesesUnicos = new Map();
              [...registros1, ...registros2].forEach((item) => {
              const claveUnica = `${item.AnioRegistro}-${item.MesRegistro}`;
              if (!mesesUnicos.has(claveUnica)) {
                mesesUnicos.set(claveUnica, {
                  Anio: item.AnioRegistro,
                  Mes: item.MesRegistro,
                  NumMes: item.NumMes,
                  seleccionado: false,
                  label: item.MesRegistro,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(mesesUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };

          const obtenerTrimestresUnicos = (registros1: any[], registros2: any[]) => {
            const trimestresUnicos = new Map();
              [...registros1, ...registros2].forEach((item) => {
              const claveUnica = `${item.AnioRegistro}-${item.Trimestre}`;
              if (!trimestresUnicos.has(claveUnica)) {
                trimestresUnicos.set(claveUnica, {
                  Anio: item.AnioRegistro,
                  NumTrimestre: item.Trimestre,
                  Trimestre: `Trimestre ${item.Trimestre}`,
                  seleccionado: false,
                  label: item.Trimestre,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(trimestresUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };

          const obtenerSemestresUnicos = (registros1: any[], registros2: any[]) => {
            const semestresUnicos = new Map();
              [...registros1, ...registros2].forEach((item) => {
              const claveUnica = `${item.AnioRegistro}-${item.Semestre}`;
              if (!semestresUnicos.has(claveUnica)) {
                semestresUnicos.set(claveUnica, {
                  Anio: item.AnioRegistro,
                  NumSemestre: item.Semestre,
                  Semestre: `Semestre ${item.Semestre}`,
                  seleccionado: false,
                  label: item.Semestre,
                  icon: '',
                });
              }
            });
          
            // Convertir a array y agregar índices
            return Array.from(semestresUnicos.values()).map((item, index) => ({
              ...item,
              index: index + 1,
            }));
          };


          const mesesActivos = obtenerMesesUnicos(this.Registros, this.SaldoInicial);

          this.Meses=mesesActivos.sort((a:any, b:any) => a.NumMes- b.NumMes)
          this.MesesBack=mesesActivos.sort((a:any, b:any) => a.NumMes- b.NumMes)
          this.Anios=aniosActivos.sort((a:any, b:any) => a.Anio- b.Anio)
          this.AniosBack=aniosActivos.sort((a:any, b:any) => a.Anio- b.Anio)
          this.Trimestres=obtenerTrimestresUnicos(this.Registros, this.SaldoInicial)
          this.Semestres=obtenerSemestresUnicos(this.Registros, this.SaldoInicial)
          // this.Anios.map((anio:any)=>{anio.Mostrar=true,anio.MostrarBoton=true})
          // this.Meses.map((mes:any)=>{mes.Mostrar=true,mes.MostrarBoton=true})

          // this.MesesSeleccionados=this.Meses
    

     
          

          this.construirCabecera()
});
}

getSemanas(Anio:any,Mes:any){
  let semanas: any= [];
  this.Semanas.filter((sem:any)=>sem.Mes==Mes && sem.Anio==Anio).forEach((semana:any) => {
    semanas.push({ 
      key: '0-0-0'+semana.NumSemana, 
      label: semana.Semana, 
      Mes:semana.Mes,
      Anio:semana.Anio,
      posicion:semana.posicion,
      NumSemana:semana.NumSemana,
      icon: 'pi pi-calendar', 
      data: semana.Semana },)
  });

  return semanas.sort((a:any, b:any) => a.NumSemana - b.NumSemana)

}

VerTodasSemanas(){
  this.MostrarTodasSemanas=!this.MostrarTodasSemanas

  this.construirCabecera()
}
getSemanasByMesAnio(Anio:any,NumMes:any){

  return this.Semanas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)

   // return this.SemanasTodas.filter((sem:any)=>sem.Mes==NumMes && sem.Anio==Anio)
  



  
}

getValorSaldoInicial(NumSemana:any,Mes:any,Anio:any,Posicion:any){
if(Posicion==0 || Posicion==1){
  let _Data: any=[];
  _Data=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.SemanaNum==NumSemana
  && saldo.NumMes==Mes
  && saldo.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    let UltimaSemana:any=[]
    if(Mes==1){
      UltimaSemana= this.getSemanasByMesAnio(Anio-1,12).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

    }
    else{
      UltimaSemana= this.getSemanasByMesAnio(Anio,(Mes-1)).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

    }
  
    if(UltimaSemana.length>0){
      return this.getValorSaldoFinal(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes)
  
    }
    else {
      return 0
    }


   
  }

}
else if (Posicion == 2) {
  let DataSaldoFinal:any=[]
  let Valor:any
  DataSaldoFinal=this.DataSaldoFinal.filter((saldo:any)=>saldo.Mes==Mes && saldo.Anio==Anio && saldo.NumSemana==NumSemana - 1)
  if (DataSaldoFinal.length >= 1) {
   Valor=DataSaldoFinal[0].Valor
  } 
  
  else {
    Valor= 0; // Condición de terminación cuando NumSemana es menor o igual a 1
  }
  return Valor
} else {
  let DataSaldoFinal:any=[]
  let Valor:any
  DataSaldoFinal=this.DataSaldoFinal.filter((saldo:any)=>saldo.Mes==Mes && saldo.Anio==Anio && saldo.NumSemana==NumSemana - 1)
  if (DataSaldoFinal.length >= 1) {
   Valor=DataSaldoFinal[0].Valor
  } else {
    Valor= 0; // Condición de terminación cuando NumSemana es menor o igual a 1
  }
  return Valor
}


}

getValorSaldoFinal(Mes:any,Anio:any){

  return  this.getSaldoInicialMensual(Mes,Anio) + 
  this.getDataFlujoLibreMensual(Mes,Anio)

}
getSaldoInicialMensual(Mes:any,Anio:any){
  // let UltimaSemana:any=[]
  // UltimaSemana= this.getSemanasByMesAnio(Anio,Mes).filter((sem:any)=>(sem.posicion==0 || sem.posicion==1))

  // if(UltimaSemana.length>0){
  //   return this.getValorSaldoInicial(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes,UltimaSemana[0].Anio,UltimaSemana[0].posicion)

  // }
  // else {
  //   return 0
  // }

  let _Data: any=[];
  let _DataSaldoFinal: any=[];
  _Data=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.NumMes==Mes
  && saldo.AnioRegistro==Anio
  )

  _DataSaldoFinal=this.SaldoInicial.filter((saldo:any)=>saldo
  && saldo.NumMes==Mes-1
  && saldo.AnioRegistro==Anio
  )


  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }


  else {
    let key=`${Mes-1}-${Anio}`
    let ValorSaldo:number=0

    let RSFM=this.RegistrosSaldosFinalesMensuales.filter((reg:any)=>reg.key==key)
    let RSFM2=this.RegistrosSaldosFinalesMensuales.filter((reg:any)=>reg.Anio==Anio-1)

    if(RSFM.length>0){
      ValorSaldo=RSFM[0].Valor
    }
    else if(RSFM2.length>0) {
      ValorSaldo=RSFM2[RSFM2.length-1].Valor
    }
    else {
      ValorSaldo=0
    }



      return ValorSaldo


  }
}
getSaldoFinalMensual(Mes:any,Anio:any){
  let UltimaSemana:any=[]
  UltimaSemana= this.getSemanasByMesAnio(Anio,Mes).filter((sem:any)=>(sem.posicion==0 || sem.posicion==2))

  if(UltimaSemana.length>0){
    return this.getValorSaldoFinal(UltimaSemana[0].NumSemana,UltimaSemana[0].Mes)

  }
  else {
    return 0
  }
}

getValorCategoria(idCategoria:any,NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria.id==idCategoria
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Valor
  }
  else {
    return 0
  }


}

getValorCategoriaMensual(idCategoria:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria.id==idCategoria
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Valor
  }
  else {
    return 0
  }
}
getValorCategoriaAnual(idCategoria:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>registro
  .idCategoria.id==idCategoria
  && registro.AnioRegistro==Anio
  )
  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Valor
  }
  else {
    return 0
  }
}

getDataCategorias(){
this.DataCategorias=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
      this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${categ.id}-${sem.NumSemana}`;  //2023-2-kndkfdnfjk-7
        if (!this.DataCategorias[key]) {
          this.DataCategorias[key] =[];
        }
        if(categ.Orden==0) {
          
          this.DataCategorias[key].push({
            "Valor": this.obtenerValorSaldoInicial(sem.NumSemana,mes.NumMes,anio.Anio),
             "Tipo":this.obtenerValorSaldoInicial(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
     else if(categ.Orden==1) {
          
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoOperativo(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoOperativo(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }
      else if(categ.Orden==4) {   
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoInversion(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoInversion(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
      else if(categ.Orden==7) {         
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoFinanciero(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoFinanciero(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }
      else if(categ.Orden==10) {     
          this.DataCategorias[key].push({
            "Valor": this.getDataFlujoLibre(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoLibre(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
      else if(categ.Orden==11) {     
          this.DataCategorias[key].push({
            "Valor": this.obtenerValorSaldoFinal(sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.obtenerValorSaldoFinal(sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
        }
        else {
          this.DataCategorias[key].push({
            "Valor": this.getValorCategoria(categ.id,sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getValorCategoria(categ.id,sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
          
        }

        })
      })
    })
  
});

this.getDataItems()
this.getDataItemMensual()
this.getDataItemAnual()
}


getDataCategoriasMensual(){
  this.DataCategoriasMensual=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
    this.getMesesByAnio(anio.Anio).forEach((mes:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${categ.id}`;  
        if (!this.DataCategoriasMensual[key]) {
          this.DataCategoriasMensual[key] =[];
        }
        
        if(categ.Orden==0) {
          this.DataCategoriasMensual[key].push({
            "Valor": this.obtenerValorSaldoInicialMensual(mes.NumMes,anio.Anio),
            "Tipo":this.obtenerValorSaldoInicialMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }

      else if(categ.Orden==1) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==4) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==7) {
          
          this.DataCategoriasMensual[key].push({
            "Valor": this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio),
            "Tipo":this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
      }

      else if(categ.Orden==10) {     
        this.DataCategoriasMensual[key].push({
          "Valor": this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio),
          "Tipo":this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1

        });
      }

      else  if(categ.Orden==11) {
          this.DataCategoriasMensual[key].push({
            "Valor": this.obtenerValorSaldoFinalMensual(mes.NumMes,anio.Anio),
            "Tipo":this.obtenerValorSaldoFinalMensual(mes.NumMes,anio.Anio)<0 ? 2 : 1
          });
        }
        else {
          this.DataCategoriasMensual[key].push({
            "Valor": this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio),
            "Tipo":this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });

        }

       
      })
    })
  
});

}
getDataCategoriasAnual(){
  this.DataCategoriasAnual=[]
this.Categorias.forEach((categ:any) => {
  this.Anios.forEach((anio:any) => {
        const key = `${anio.Anio}-${categ.id}`;  
        if (!this.DataCategoriasAnual[key]) {
          this.DataCategoriasAnual[key] =[];
        }

        if(categ.Orden==0) {
          this.DataCategoriasAnual[key].push({
            "Valor": 0,
            "Tipo":1
          });
        }

      else if(categ.Orden==1) {
          
          this.DataCategoriasAnual[key].push({
            "Valor": this.getDataFlujoOperativoAnual(anio.Anio),
            "Tipo":this.getDataFlujoOperativoAnual(anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==4) {
          
          this.DataCategoriasAnual[key].push({
            "Valor": this.getDataFlujoInversionAnual(anio.Anio),
            "Tipo":this.getDataFlujoInversionAnual(anio.Anio)<0 ? 2 : 1
  
          });
      }
      else if(categ.Orden==7) {
          
          this.DataCategoriasAnual[key].push({
            "Valor": this.getDataFlujoFinancieroAnual(anio.Anio),
            "Tipo":this.getDataFlujoFinancieroAnual(anio.Anio)<0 ? 2 : 1
  
          });
      }

      else if(categ.Orden==10) {     
        this.DataCategoriasAnual[key].push({
          "Valor": this.getDataFlujoLibreAnual(anio.Anio),
          "Tipo":this.getDataFlujoLibreAnual(anio.Anio)<0 ? 2 : 1

        });
      }

      else  if(categ.Orden==11) {
          this.DataCategoriasAnual[key].push({
            "Valor": this.obtenerValorSaldoFinalAnual(anio.Anio),
            "Tipo":this.obtenerValorSaldoFinalAnual(anio.Anio)<0 ? 2 : 1
          });
        }
        else {
          this.DataCategoriasAnual[key].push({
            "Valor": this.getValorCategoriaAnual(categ.id,anio.Anio),
            "Tipo":this.getValorCategoriaAnual(categ.id,anio.Anio)<0 ? 2 : 1
  
          });

        }






       
    
    })
  
});

}

getValorItem(idElemento:any,NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
    && registro.NumSemana==NumSemana 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Number(Valor)
  }
  else {
    return 0
  }
}
getValorItemMensual(idElemento:any,Mes:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Number(Valor)
  }
  else {
    return 0
  }
}

getValorItemAnual(idElemento:any,Anio:any){
  let _Data: any=[];
  let Valor: number =0
  _Data=this.Registros.filter((registro:any)=>
    registro.idElemento==idElemento 
    && registro.AnioRegistro==Anio
    )
  
  if(_Data.length>0){
    _Data.forEach((element:any) => {
      Valor+=Number(element.Valor);
    });
    if(_Data[0].Tipo=='Egreso')
      {
        Valor=Valor*-1;
      }
    return Number(Valor)
  }
  else {
    return 0
  }
}
getDataItemMensual(){
this.DataItemsMensual=[]
this.Items.forEach((item:any) => {
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
        const key = `${anio.Anio}-${mes.NumMes}-${item.id}`;  
        if (!this.DataItemsMensual[key]) {
          this.DataItemsMensual[key] =[];
        }
        this.DataItemsMensual[key].push({
          "Valor": this.getValorItemMensual(item.id,mes.NumMes,anio.Anio),
          "Tipo": this.getValorItemMensual(item.id,mes.NumMes,anio.Anio)<0 ? 2 : 1

        });

       
      })
    })
  
});
}

getDataItemAnual(){
  this.DataItemsAnual=[]
  this.Items.forEach((item:any) => {
    this.Anios.forEach((anio:any) => {
          const key = `${anio.Anio}-${item.id}`;  
          if (!this.DataItemsAnual[key]) {
            this.DataItemsAnual[key] =[];
          }
          this.DataItemsAnual[key].push({
            "Valor": this.getValorItemAnual(item.id,anio.Anio),
            "Tipo":this.getValorItemAnual(item.id,anio.Anio)<0 ? 2 : 1
          });
      }) 
  });

  let indexCategoria:number=0
  let indexItem:number=0
  this.DataTreeTable=[]
  this.Categorias.forEach(categ => {
    indexCategoria+=1
    let newRow: any = {
      key: `${indexCategoria}`,
      data: {
        id_categoria: categ.id, // O el campo relevante de Categorias
        categoria: categ.Nombre, // O el campo relevante de Categorias
        values: {}, // Aquí guardaremos los valores por mes-año
        children: [],
        tipo:0
      }
    };
    this.Anios.forEach((anio:any) => {
      this.getMesesByAnio(anio.Anio).forEach((mes:any) => {
        
                let key = `${mes.NumMes}-${anio.Anio}`;
                newRow.data.tipo=categ.Tipo
                if(categ.Orden==0) {
                  this.RegistrosSaldosFinalesMensuales.push({
                    "key":key,
                    "Anio":anio.Anio,
                    "Valor":this.getValorSaldoFinal(mes.NumMes,anio.Anio) || 0
                  })
                  newRow.data.values[key] = this.getSaldoInicialMensual(mes.NumMes,anio.Anio) || 0;
                 
        
                }
                else if(categ.Orden==1) {
                  newRow.data.values[key] = this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio) || 0;
                  
        
                }
                else if(categ.Orden==4) {
                  newRow.data.values[key] = this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio) || 0;
        
        
                }
                else if(categ.Orden==7) {
                  newRow.data.values[key] = this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio) || 0;
        
                }
                else if(categ.Orden==10) {
                  newRow.data.values[key] = this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio) || 0;
        
        
                }
                else if(categ.Orden==11) {
              
                  newRow.data.values[key] = this.getValorSaldoFinal(mes.NumMes,anio.Anio) || 0;
            
        
                }
                else {
                  newRow.data.values[key] = this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio) || 0;
                
        
                }

              })
        
                let key = `${anio.Anio}`;
                if(categ.Orden==0) {
                  newRow.data.values[key] = this.obtenerValorSaldoInicialAnual(anio.Anio);
                 
        
                }
                else if(categ.Orden==1) {
                  newRow.data.values[key] = this.getDataFlujoOperativoAnual(anio.Anio) || 0;
             
        
                }
                else if(categ.Orden==4) {
                  newRow.data.values[key] = this.getDataFlujoInversionAnual(anio.Anio) || 0;
        
        
                }
                else if(categ.Orden==7) {
                  newRow.data.values[key] = this.getDataFlujoFinancieroAnual(anio.Anio) || 0;
        
                }
                else if(categ.Orden==10) {
                  newRow.data.values[key] = this.getDataFlujoLibreAnual(anio.Anio) || 0;
        
        
                }
                else if(categ.Orden==11) {
                  newRow.data.values[key] = this.obtenerValorSaldoFinalAnual(anio.Anio) || 0;
            
        
                }
                else {
                  newRow.data.values[key] = this.getValorCategoriaAnual(categ.id,anio.Anio) || 0;
                
        
                }
              


      
    })

      


      // **AGREGAR ITEMS COMO HIJOS**
  this.getItems(categ.id).forEach(item => {

    let newItem: any = {
      key: `${indexCategoria}-${indexItem}`,
      data: {
        id_item: item.id, // Nombre del item
        categoria: item.Nombre, // Nombre del item
        values: {}
      }
    };
    this.Cabecera.filter((cab: any) => cab.Tipo != 1).forEach(cab => {
    indexItem+=1
      let key = `${cab.Mes}-${cab.Anio}`;

      if(cab.Tipo==3){
        newItem.data.values[key] = this.getValorItemMensual(item.id, cab.NumMes, cab.Anio) || 0;
      }
     else if(cab.Tipo==4){
      let keyAnio = `${cab.Anio}`;
        newItem.data.values[keyAnio] = this.getValorItemAnual(item.id,cab.Anio) || 0;
      }

    
    
    });

    newRow.data.children.push(newItem); // Agregar el item como hijo de la categoría
  });
    
  
  this.DataTreeTable.push(newRow)
});
  this.cargar=true
  }

getDataItems(){
  this.DataItems=[]
  this.Items.forEach((item:any) => {
    this.Anios.forEach((anio:any) => {
      this.Meses.forEach((mes:any) => {
        this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
          const key = `${anio.Anio}-${mes.NumMes}-${item.id}-${sem.NumSemana}`;  
          if (!this.DataItems[key]) {
            this.DataItems[key] =[];
          }
          this.DataItems[key].push({
            "Valor": this.getValorItem(item.id,sem.NumSemana,mes.NumMes,anio.Anio),
            "Tipo":this.getValorItem(item.id,sem.NumSemana,mes.NumMes,anio.Anio)<0 ? 2 : 1
  
          });
  
          })
        })
      })
    
  });

  }
  
getDataFlujoOperativo(NumSemana:any,Mes:any,Anio:any){
    let _Data: any=[];
    _Data=this.Registros.filter((registro:any)=>
    (registro.idCategoria.Orden==2
    || registro.idCategoria.Orden==3)
    && registro.NumSemana==NumSemana
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )
  
    if(_Data.length>0){
      let Valor:number=0
      _Data.forEach((data:any) => {
          Valor+=Number(data.Valor)
      });
  
      return Valor
    }
    else {
      return 0
    }
} 
getDataFlujoOperativoMensual(Mes:any,Anio:any){
    let _Data: any=[];
    _Data=this.Registros.filter((registro:any)=>
    (registro.idCategoria.Orden==2
    || registro.idCategoria.Orden==3)
    && registro.NumMes==Mes
    && registro.AnioRegistro==Anio
    )

    if(_Data.length>0){
      let Valor:number=0
      _Data.forEach((data:any) => {
          Valor+=Number(data.Valor)
      });

      return Valor
    }
    else {
      return 0
    }
} 

getDataFlujoOperativoAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==2
  || registro.idCategoria.Orden==3)
  && registro.AnioRegistro==Anio
  )


  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
} 
getDataFlujoInversion(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==5
  || registro.idCategoria.Orden==6)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoInversionMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==5
  || registro.idCategoria.Orden==6)
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoInversionAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==5
  || registro.idCategoria.Orden==6)
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoFinanciero(NumSemana:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==9
  || registro.idCategoria.Orden==8)
  && registro.NumSemana==NumSemana
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}
getDataFlujoFinancieroMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==9
  || registro.idCategoria.Orden==8)
  && registro.NumMes==Mes
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoFinancieroAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==9
  || registro.idCategoria.Orden==8)
  && registro.AnioRegistro==Anio
  )

  if(_Data.length>0){
    let Valor:number=0
    _Data.forEach((data:any) => {
        Valor+=Number(data.Valor)
    });

    return Valor
  }
  else {
    return 0
  }
}

getDataFlujoLibre(NumSemana:any,Mes:any,Anio:any){
return this.getDataFlujoOperativo(NumSemana,Mes,Anio) 
+ this.getDataFlujoInversion(NumSemana,Mes,Anio)
+ this.getDataFlujoFinanciero(NumSemana,Mes,Anio)
}
getDataFlujoLibreMensual(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensual(Mes,Anio) 
  + this.getDataFlujoInversionMensual(Mes,Anio)
  + this.getDataFlujoFinancieroMensual(Mes,Anio)
}
getDataFlujoLibreAnual(Anio:any){
  return this.getDataFlujoOperativoAnual(Anio) 
  + this.getDataFlujoInversionAnual(Anio)
  + this.getDataFlujoFinancieroAnual(Anio)
}

getMesesByAnio(anio:any){
  return this.Meses.filter((mes:any)=>mes.Anio==anio)
}
construirCabecera(){

    this.Cabecera=[]
    // this.Cabecera.push({
    //   "Nombre":"Concepto",
    //   "Mes":"",
    //   "NumMes":"",
    //   "Anio":"",
    //   "Tipo":1,
    //   "Mostrar":true,
    //   "MostrarBoton":true
    // })
    this.Anios.forEach((anio:any) => {
      this.getMesesByAnio(anio.Anio).forEach((mes:any) => {
        // this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
        //   this.Cabecera.push({
        //     "Nombre":sem.Semana + ' '+ mes.Mes + ' ' + anio.Anio,
        //     "Mes":mes.Mes,
        //     "NumMes":mes.NumMes,
        //     "Anio":anio.Anio,
        //     "Tipo":2,
        //     "NumSemana":sem.NumSemana,
        //     "Mostrar":true,
        //     "MostrarBoton":true
            
          
        //   })
          
        // });
       // if(this.getSemanasByMesAnio(anio.Anio,mes.NumMes).length>0){
          this.Cabecera.push({
            "Nombre":"Total "+ mes.Mes + ' ' + anio.Anio,
            "Mes":mes.Mes,
            "NumMes":mes.NumMes,
            "Anio":anio.Anio,
            "Tipo":3,
            "Mostrar":true,
            "MostrarBoton":true,
            "MostrarBotonSemanal":true,
            "MostrarBotonMensual":true,
            "MostrarSemanas":true,
          })

      //  }
      });
      this.Cabecera.push({
        "Nombre":"Total " + anio.Anio,
        "Mes":"",
        "NumMes":"",
        "Anio":anio.Anio,
        "Tipo":4,
        "Mostrar":true,
        "MostrarBoton":true
      })
    });


    this.CabeceraBack=this.Cabecera

 
    // this.DataSaldoInicial=[]
    // this.DataSaldoFinal=[]
    // this.DataSaldoInicialMensual=[]
    // this.DataSaldoFinalMensual=[]
    // this.Anios.forEach((anio:any) => {
    //   this.getMesesByAnio(anio.Anio).forEach((mes:any) => {
    //     this.getSemanasByMesAnio(anio.Anio,mes.NumMes).forEach((sem:any) => {
    //       let _SemanaDataInicial:any=[]
    //       _SemanaDataInicial=this.DataSaldoInicial.filter((data:any)=>data.NumSemana==sem.NumSemana && data.Anio==anio.Anio && data.Mes==sem.Mes)
    //       if(_SemanaDataInicial.length==0){
    //         this.DataSaldoInicial.push({
    //           "NumSemana":sem.NumSemana,
    //           "Mes":sem.Mes,
    //           "Anio":sem.Anio,
    //           "Valor":this.getValorSaldoInicial(sem.NumSemana,sem.Mes,anio.Anio,sem.posicion)
  
    //         })

    //       }
    //       let _SemanaDataFinal:any=[]
    //       _SemanaDataFinal=this.DataSaldoFinal.filter((data:any)=>data.NumSemana==sem.NumSemana && data.Anio==anio.Anio && data.Mes==sem.Mes)
    //       if(_SemanaDataFinal.length==0){
    //         this.DataSaldoFinal.push({
    //           "NumSemana":sem.NumSemana,
    //           "Mes":sem.Mes,
    //           "Anio":sem.Anio,
    //           "Valor":this.getValorSaldoFinal(sem.NumSemana,sem.Mes)
  
    //         })

    //       }
    //     })  
    //     //DataMensual
    //     let _MesDataInicial:any=[]
    //     _MesDataInicial=this.DataSaldoInicialMensual.filter((data:any)=>data.Anio==anio.Anio && data.Mes==mes.NumMes)
    //     if(_MesDataInicial.length==0){
    //       this.DataSaldoInicialMensual.push({
    //         "Mes":mes.NumMes,
    //         "Anio":anio.Anio,
    //         "Valor":this.getSaldoInicialMensual(mes.NumMes,anio.Anio)

    //       })

    //     }    
    //     let _MesDataFinal:any=[]
    //     _MesDataFinal=this.DataSaldoFinalMensual.filter((data:any)=>data.Anio==anio.Anio && data.Mes==mes.NumMes)
    //     if(_MesDataFinal.length==0){
    //       this.DataSaldoFinalMensual.push({
    //         "Mes":mes.NumMes,
    //         "Anio":anio.Anio,
    //         "Valor":this.getSaldoFinalMensual(mes.NumMes,anio.Anio)

    //       })

    //     }    


    //   })      
    // })      
    this.getDataCategorias()
    this.getDataCategoriasMensual()
    this.getDataCategoriasAnual()


    let DataTrimestral={
      'Registros':this.Registros,
      'Anios':this.Anios,
      'Cabecera':this.Cabecera,
      'Categorias':this.Categorias,
      'Items':this.Items,
      'Trimestres':this.Trimestres,
      'SaldoInicial':this.SaldoInicial

    }
    this.conS.enviarRegistrosTrimestrales(DataTrimestral)
    let DataSemestral={
      'Registros':this.Registros,
      'Anios':this.Anios,
      'Cabecera':this.Cabecera,
      'Categorias':this.Categorias,
      'Items':this.Items,
      'Semestres':this.Semestres,
      'SaldoInicial':this.SaldoInicial
      
    }
    this.conS.enviarRegistrosSemestrales(DataSemestral)

   }
   getItems(idCategoria:any){
    let _Items:any=[]

    _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria
    && item.idUsuarios.some((user:any) => user == this.usuario.id)

     )
    return _Items
    }

obtenerValorSaldoInicial(NumSemana:any,Mes:any,Anio:any){
let _ValorInicial:any=[]
_ValorInicial=this.DataSaldoInicial.filter((data:any)=>data.NumSemana==NumSemana && data.Mes==Mes && data.Anio==Anio)
if(_ValorInicial.length>0){
  return _ValorInicial[0].Valor
}
else {
  return 0
}
}
obtenerValorSaldoFinal(NumSemana:any,Mes:any,Anio:any){
let _ValorFinal:any=[]
_ValorFinal=this.DataSaldoFinal.filter((data:any)=>data.NumSemana==NumSemana && data.Mes==Mes && data.Anio==Anio)
if(_ValorFinal.length>0){
  return _ValorFinal[0].Valor
}
else {
  return 0
}
}

obtenerValorSaldoInicialMensual(Mes:any,Anio:any){
  let _ValorInicialMensual:any=[]
  _ValorInicialMensual=this.DataSaldoInicialMensual.filter((data:any)=>data.Mes==Mes && data.Anio==Anio)



  if(_ValorInicialMensual.length>0){
      if(_ValorInicialMensual[0].Valor>0){
        return _ValorInicialMensual[0].Valor
      }
      else {
        return 0
      }
  }

  else {



    return 0 
  }
}
obtenerValorSaldoInicialAnual(Anio:any){
  let _ValorInicialMensual:any=[]
  let _ValorInicialesAnuales:any=[]
  let _SaldosInicialesAnual:any=[]
  _ValorInicialMensual=this.DataSaldoInicialMensual.filter((data:any)=>data.Mes==1 && data.Anio==Anio)
  _ValorInicialesAnuales=this.DataSaldoInicialMensual.filter((data:any)=>data.Anio==Anio)
  _SaldosInicialesAnual=this.SaldoInicial.filter((data:any)=>data.AnioRegistro==Anio)

  if(_ValorInicialMensual.length>0){
    return _ValorInicialMensual[0].Valor
  }
 else if(_ValorInicialesAnuales.length>0){
    return _ValorInicialesAnuales[0].Valor
  }
 else if(_SaldosInicialesAnual.length>0){
    return _SaldosInicialesAnual[0].Valor
  }
  else {
    let ValorSaldo:number=0
    let RSFM2=this.RegistrosSaldosFinalesMensuales.filter((reg:any)=>reg.Anio==Anio-1)
    if(RSFM2.length>0) {
      ValorSaldo=RSFM2[RSFM2.length-1].Valor
    }
    else {
      ValorSaldo=0
    }

    return ValorSaldo
  }
}
obtenerValorSaldoFinalMensual(Mes:any,Anio:any){
  let _ValorFinalMensual:any=[]
  _ValorFinalMensual=this.DataSaldoFinalMensual.filter((data:any)=>data.Mes==Mes && data.Anio==Anio)
  if(_ValorFinalMensual.length>0){
    return _ValorFinalMensual[0].Valor
  }
  else {
    return 0
  }
}
obtenerValorSaldoFinalAnual(Anio:any){
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



}
