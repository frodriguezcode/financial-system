// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
@Component({
  selector: 'app-planeacion-financiera-mejorada',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule,DropdownModule,ButtonModule,InputTextModule,DialogModule],
  templateUrl: './planeacion-financiera-mejorada.component.html',
  styleUrls: ['./planeacion-financiera-mejorada.component.scss']
})
export default class PlaneacionFinancieraMejoradaComponent implements OnInit {
catalogoFechas:any=[]
SemanasTodas:any=[]
Meses: any = [];
MesesSeleccionados: any = [];
Anios: any = [];
AniosBack: any = [];
AniosSeleccionados: any = [];
AniosPlaneacion: any = [];
Cabecera: any = [];
CabeceraBack: any = [];
Categorias:any=[]
categoriasExpandidasHistory:any=[]
categoriasExpandidas: { [id: number]: boolean } = {};
Items:any=[]
ItemsBack:any=[]
usuario:any
Registros:any=[]
RegistrosValoresPlanesItems:any=[]
RegistrosValoresPlanesBackUp:any=[]
RegistrosValoresPlanes:any=[]
RegistrosValoresPlanesBackUpItems:any=[]
DataCategoriasMensual:any=[]
DataItemsMensual:any=[]
DataItems:any=[]
RegistrosBackUp:any=[]

DataPlanesMensual:any=[]
idTipoRegistro:any=0
cargando:boolean=true

Sucursales:any=[]
SucursalSeleccionada:any
Proyectos:any=[]
ProyectoSeleccionado:any

CuentasBancarias:any=[]
CuentaBancariaSeleccionada:any=[]
visible: boolean = false;
constructor(private conS:ConfigurationService,private toastr: ToastrService){}
ngOnInit(): void {
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    this.obtenerSucursales()
    this.obtenerProyectos()
    this.obtenerAniosPlaneacion()
  
 
  });

  this.Meses= [

    {
      Mes: 'Enero',
      NumMes:1,
      Mostrar: true
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      Mostrar: true
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      Mostrar: true
    },
    {
      Mes: 'Abril',
      NumMes:4,
      Mostrar: true
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      Mostrar: true
    },
    {
      Mes: 'Junio',
      NumMes:6,
      Mostrar: true
    },
    {
      Mes: 'Julio',
      NumMes:7,
      Mostrar: true
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      Mostrar: true
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      Mostrar: true
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      Mostrar: true
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      Mostrar: true
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      Mostrar: true
    },
  
  ]

}

showDialog() {
  this.visible = true;
}

guardarAnio(anio:any){
  let AnioEncontrado:any=[]
  AnioEncontrado=this.Anios.filter((a:any)=>a.Anio==Number(anio))
  if(AnioEncontrado.length>0){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: 'Ya existe este año',
      showConfirmButton: false,
      timer: 1500
    });
  }
  else if(anio<2015){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: 'Ingrese un año válido',
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
    this.AniosPlaneacion[0].Anios.push({Anio:Number(anio),
      Mostrar: true
    })
  this.conS.ActualizarAniosPlaneacion(this.AniosPlaneacion[0]).then(resp=>{
    this.construirCabecera()
    this.visible=false
  })

  }
  
}

obtenerAniosPlaneacion(){
  this.conS.obtenerAniosPlaneacion(this.usuario.idEmpresa).subscribe((resp:any)=>{

    if(resp.length>0){
      this.AniosPlaneacion=resp
      this.Anios=resp[0].Anios
      this.AniosBack=resp[0].Anios


    }
    else {
      let _AniosPlanes={
        idEmpresa:this.usuario.idEmpresa,
        Anios:[
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
      }
      this.conS.crearAniosPlaneacion(_AniosPlanes).then(resp=>{

 
      })
      this.AniosBack=[
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
    }
    this.obtenerCategorias()  
    this.obtenerRegistros()
    this.obtenerValoresPlanes()

  })
}
obtenerProyectos(){
  this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )

  })
}
obtenerSucursales(){
  this.conS.obtenerSucursales( this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Sucursales=resp.filter((suc:any)=>suc.Activo==true)
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

filtrarDataProyecto(){
  localStorage.setItem('ProyectoSelectBC', JSON.stringify(this.ProyectoSeleccionado));
  let CriteriosRegistros:any=[]
  this.SucursalSeleccionada={}
  
  if(this.ProyectoSeleccionado.MesesRango.length>0){
    let _AniosProyecto:any=[]
    let _MesesProyecto:any=[]

    this.ProyectoSeleccionado.MesesRango.forEach(element => {
      _AniosProyecto.push({
       "Anio": Number(element.year),
       "Mostrar": true,
      
      })
      element.meses.forEach(elementMes => {
        
        _MesesProyecto.push({
          "Mes":elementMes.nombre,
          "Mostrar":true,
          "NumMes":elementMes.numero,
          "Anio":elementMes.anio,
        })
      });
      
      
    });


    this.Cabecera=[]
    this.Cabecera.push({
      "Nombre":"Catálogo de Cuentas",
      "Mes":"",
      "NumMes":"",
      "Anio":"",
      "Tipo":1,
      "Mostrar":true,
      "MostrarBoton":true
    })

    _AniosProyecto.forEach((anio:any) => {
      _MesesProyecto.filter((m:any)=>m.Anio==anio.Anio).forEach((mes:any) => {
        this.Cabecera.push({
          "Nombre":"Plan " + mes.Mes + " " + anio.Anio,
          "Mes":mes.Mes,
          "NumMes":mes.NumMes,
          "Anio":anio.Anio,
          "Tipo":2,
          "Mostrar":true,
          "MostrarBoton":true
        })
        this.Cabecera.push({
          "Nombre":"Real "+ mes.Mes + " " + anio.Anio,
          "Mes":mes.Mes,
          "NumMes":mes.NumMes,
          "Anio":anio.Anio,
          "Tipo":3,
          "Mostrar":true,
          "MostrarBoton":true
        })
        this.Cabecera.push({
          "Nombre":"Diferencia",
          "Mes":mes.Mes,
          "NumMes":mes.NumMes,
          "Anio":anio.Anio,
          "Tipo":4,
          "Mostrar":true,
          "MostrarBoton":true
        })
  
        this.Cabecera.push({
          "Nombre":"% Variación",
          "Mes":mes.Mes,
          "NumMes":mes.NumMes,
          "Anio":anio.Anio,
          "Tipo":5,
          "Mostrar":true,
          "MostrarBoton":true
        })
  
  
  
      })
})

this.Anios=_AniosProyecto

  }

  else {
    this.Anios=this.AniosBack
    this.Cabecera=this.CabeceraBack
  }

  CriteriosRegistros={

    idProyecto:[this.ProyectoSeleccionado.id]

  } 


  this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
  this.RegistrosValoresPlanes= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosValoresPlanesBackUp)
  this.Items=this.ItemsBack.filter((item:any)=> item.TipoRubro==2 
  && item.Proyectos.some((proyecto: any) => proyecto.id === this.ProyectoSeleccionado.id))


  this.getDataCategoriasMensual()
  this.getDataItemMensual()
  this.getDataItemsMensualPlanes()
  this.getDataCategoriasMensualPlanes()


}

filtrarDataSucursal(){

  let CriteriosRegistros:any=[]
  this.ProyectoSeleccionado={}

  CriteriosRegistros={
    idSucursal:[this.SucursalSeleccionada.id]

  }

  this.Registros= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosBackUp)
  this.RegistrosValoresPlanes= this.conS.filtradoDinamico(CriteriosRegistros,this.RegistrosValoresPlanesBackUp)
  this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==1 
  && item.Sucursales.some((sucursal: any) => sucursal.id === this.SucursalSeleccionada.id))
  this.getDataCategoriasMensual()
  this.getDataItemMensual()
  this.getDataItemsMensualPlanes()
  this.getDataCategoriasMensualPlanes()


}
ocultarMes(anio:any,mes:any){
  this.Cabecera.forEach((cab:any) => {
    if(cab.NumMes==mes && cab.Anio==anio){
      cab.Mostrar=false
    }
  });
}
MostrarMes(anio:any,mes:any){
  this.Cabecera.forEach((cab:any) => {
    if(cab.NumMes==mes && cab.Anio==anio){
      cab.Mostrar=true
    }
  });
}
getMesesActivos(){
  if(this.MesesSeleccionados.length>0){
    this.Meses.forEach(mes => {
      mes.Mostrar = this.MesesSeleccionados.includes(mes);
    });
  
    if(this.AniosSeleccionados.length>0){

      this.Cabecera=this.CabeceraBack.filter((cab:any)=>
      this.MesesSeleccionados.some((mes: any) => mes.NumMes == cab.NumMes)
      && this.AniosSeleccionados.some((anio: any) => anio.Anio == cab.Anio)
      || cab.Tipo==1
      )
    }
    else {

      this.Cabecera=this.CabeceraBack.filter((cab:any)=>
      this.MesesSeleccionados.some((mes: any) => mes.NumMes == cab.NumMes)
      || cab.Tipo==1
      )
    }

  }
  else {
    if(this.AniosSeleccionados.length>0){
      this.Cabecera=this.CabeceraBack.filter((cab:any)=>this.AniosSeleccionados.some((anio: any) => anio.Anio == cab.Anio)
      || cab.Tipo==1
      )
    }
    else {
      this.Cabecera=this.CabeceraBack
    }
    this.Meses.map((mes:any)=>mes.Mostrar=true)
  
  }
}
getAniosActivos(){
  if(this.AniosSeleccionados.length>0 && this.MesesSeleccionados.length==0){
    this.Anios.forEach(anio => {
      anio.Mostrar = this.AniosSeleccionados.includes(anio);
    });
  
    
    this.Cabecera=this.CabeceraBack.filter((cab:any)=>this.AniosSeleccionados.some((anio: any) => anio.Anio == cab.Anio)
    || cab.Tipo==1
    )

  }

  else if(this.MesesSeleccionados.length>0 && this.AniosSeleccionados.length>0){
   
    this.Cabecera=this.CabeceraBack.filter((cab:any)=>
    this.MesesSeleccionados.some((mes: any) => mes.NumMes == cab.NumMes)
    && this.AniosSeleccionados.some((anio: any) => anio.Anio == cab.Anio)
    || cab.Tipo==1
    )
    this.Anios.forEach(anio => {
      anio.Mostrar = this.AniosSeleccionados.includes(anio);
    });
    this.Meses.forEach(mes => {
      mes.Mostrar = this.MesesSeleccionados.includes(mes);
    });

  }

  else if(this.MesesSeleccionados.length>0 && this.AniosSeleccionados.length==0) {
    this.Anios.map((mes:any)=>mes.Mostrar=true)
    this.Meses.forEach(mes => {
      mes.Mostrar = this.MesesSeleccionados.includes(mes);
    });
    this.Cabecera=this.CabeceraBack.filter((cab:any)=>
      this.MesesSeleccionados.some((mes: any) => mes.NumMes == cab.NumMes)
      || cab.Tipo==1
      )
  }
  else {
    this.Anios.map((mes:any)=>mes.Mostrar=true)
    this.Cabecera=this.CabeceraBack
  }


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
    _Cabecera.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {

        const index = `${cab.Anio}-${cab.NumMes}-${categ.id}`;
        let valor = 0;
        
        // Evaluamos según el tipo de cabecera
        if (cab.Tipo == 2) {
            valor = this.DataPlanesMensual[index]?.[0]?.Valor || 0;
        } else if (cab.Tipo == 3) {
            valor = this.DataCategoriasMensual[index]?.[0]?.Valor || 0;
        } else if (cab.Tipo == 4) {
            valor = this.DataPlanesMensual[index]?.[0]?.Diferencia || 0;
        } else if (cab.Tipo == 5) {
            valor = this.DataPlanesMensual[index]?.[0]?.Variacion || 0;
        }
        
        fila.push(valor);
    });

    // Añadimos la fila de la categoría al Data una vez
    Data.push(fila);

    // Ahora iteramos sobre los elementos de la categoría
    this.getItems(categ.id).forEach((item: any) => {
        let filaItem: any[] = [item.Nombre];
        _Cabecera.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {

            const indexItem = `${cab.Anio}-${cab.NumMes}-${item.id}`;
            let valorItem = 0;

            if (cab.Tipo == 2) {
                valorItem = this.DataItems[indexItem]?.[0]?.Valor || 0;
            } else if (cab.Tipo == 3) {
                valorItem = this.DataItemsMensual[indexItem]?.[0]?.Valor || 0;
            } else if (cab.Tipo == 4) {
                valorItem = this.DataItems[indexItem]?.[0]?.Diferencia || 0;
            } else if (cab.Tipo == 5) {
                valorItem = this.DataItems[indexItem]?.[0]?.Variacion || 0;
            }
            filaItem.push(valorItem);
        });
        Data.push(filaItem);
    });


    
  });
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

    // Aplicar estilo intercalado (gris suave en filas pares)

    if(row[0].startsWith('1-') 
      || row[0].startsWith('2-')
      || row[0].startsWith('4-') 
      || row[0].startsWith('5-')  
      || row[0].startsWith('7-') 
      || row[0].startsWith('8-')  
    ){
      dataRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2F2F2' }, // Gris suave
        };
      });
    }
  else  if(row[0].startsWith('3-') 
      || row[0].startsWith('6-')
      || row[0].startsWith('9-') 
      || row[0].startsWith('10-')  
    )
    {
      dataRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'afeffb' }, // Gris suave
        };
      });
    }
  else 
    {
      dataRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ffffff' }, // Gris suave
        };
      });
    }

    // if (index % 2 === 0) {
    //   dataRow.eachCell((cell, colNumber) => {
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: 'F2F2F2' }
    //     };
    //   });
    // }

  
    // Alinear las celdas, la primera a la izquierda y las demás centradas
    dataRow.eachCell((cell: any, colNumber: number) => {
      if (colNumber === 1) {
        // Si es la primera columna, alinear a la izquierda
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle'
        };
      } else {
        // Para las demás columnas, alinear al centro
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

    // 6. Guardar el archivo en formato Excel
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'datos.xlsx');
    });



}
switchTipoRegistro(idTipo){
  if(idTipo==0){
    this.idTipoRegistro=0
    this.Registros=this.RegistrosBackUp
    this.RegistrosValoresPlanes=this.RegistrosValoresPlanesBackUp
    this.Items=this.ItemsBack
    this.SucursalSeleccionada={}
    this.ProyectoSeleccionado={}
  }
  else {

    this.idTipoRegistro=idTipo
    this.Registros=this.RegistrosBackUp.filter((reg:any)=>reg.TipoRegistro==idTipo)
    this.RegistrosValoresPlanes=this.RegistrosValoresPlanesBackUp.filter((reg:any)=>reg.TipoRegistro==idTipo)
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.idTipoRegistro)
  }
  
  if(this.categoriasExpandidasHistory.length>0){
    console.log('categoriasExpandidasHistory',this.categoriasExpandidasHistory)
    this.categoriasExpandidas=this.categoriasExpandidasHistory
  }
  this.getDataCategoriasMensual()
  this.getDataItemMensual()
  this.getDataItemsMensualPlanes()
  this.getDataCategoriasMensualPlanes()

  //this.construirCabecera()
}
getTableClass() {
  return (this.AniosSeleccionados.length === 1 && this.MesesSeleccionados.length === 1) ? 'table table-100 table-reduced' : 'table table-100';
}
construirCabecera(){
  this.Cabecera=[]
  this.Cabecera.push({
    "Nombre":"Catálogo de Cuentas",
    "Mes":"",
    "NumMes":"",
    "Anio":"",
    "Tipo":1,
    "Mostrar":true,
    "MostrarBoton":true
  })
  this.Anios.forEach((anio:any) => {
    this.Meses.forEach((mes:any) => {
      this.Cabecera.push({
        "Nombre":"Plan " + mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":2,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre":"Real "+ mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":3,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre":"Diferencia",
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":4,
        "Mostrar":true,
        "MostrarBoton":true
      })

      this.Cabecera.push({
        "Nombre":"% Variación",
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":5,
        "Mostrar":true,
        "MostrarBoton":true
      })



    })

 this.CabeceraBack=this.Cabecera

this.getDataCategoriasMensual()
this.getDataItemMensual()
this.getDataItemsMensualPlanes()
this.getDataCategoriasMensualPlanes()
  })
//console.log('Cabecera',this.Cabecera)
}

obtenerCategorias(){
  this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
    // this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)
    this.Categorias=[]

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

    })
    this.Categorias.forEach(element => {
      this.categoriasExpandidas[element.id]=true
      
    });
    this.obtenerItems()

  })
}
toggleCategoria(id: number) {

  this.categoriasExpandidas[id] = !this.categoriasExpandidas[id];
  this.categoriasExpandidasHistory=this.categoriasExpandidas
}
getItems(idCategoria:any){
  let _Items:any=[]
 
  _Items = this.Items.filter((item: any) => 
    item.idCategoria == idCategoria && 
    (this.idTipoRegistro === 0 || item.TipoRubro == this.idTipoRegistro)
  );  return _Items
  }
obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
    this.Items=[]
      this.Items=resp.filter((item:any)=>item.Activo==true);;
      this.ItemsBack=resp.filter((item:any)=>item.Activo==true);
     this.obtenerRegistros()
  })
}

obtenerRegistros(){
  this.conS.obtenerRegistros(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Registros=[]  
    resp.sort((a:any, b:any) => b.Orden - a.Orden).forEach(element => {
      let _Registro={
        "Activo":element.Activo,
        "AnioRegistro":element.AnioRegistro,
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
        "TipoRegistro":element.TipoRegistro,
        "NombreElemento":element.Elemento.label || '',
        "idElemento":element.Elemento.id || '',
        "NumCuenta":element.Cuenta.Cuenta || '',
        "CategoriaNombre":element.idCategoria.Nombre || '',
        "SocioNegocio":element.idSocioNegocio.Nombre || '',

      }
      this.Registros.push(_Registro)

      });

      this.RegistrosBackUp=this.Registros
      this.construirCabecera()
    })
}

obtenerValoresPlanes(){
  this.conS.obtenerValoresPlanes(this.usuario.idEmpresa).subscribe(resp=>{
    this.RegistrosValoresPlanes=resp
   this.RegistrosValoresPlanesBackUp=resp
  })
}


getDataItemsMensualPlanes(){
  this.DataItems=[]
  this.Items.forEach((item:any) => {
      this.Anios.forEach((anio:any) => {
        this.Meses.forEach((mes:any) => {
            const key = `${anio.Anio}-${mes.NumMes}-${item.id}`;  
            if (!this.DataItems[key]) {
              this.DataItems[key] =[];
            }
              this.DataItems[key].push({
                "Valor": item.Tipo==2 ? this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio)*-1  :this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio),
                "Diferencia":this.getValorItemMensual(item.id,mes.NumMes,anio.Anio)- this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio) ,
                "Variacion": this.calcularVariacion(this.getValorItemMensual(item.id,mes.NumMes,anio.Anio),this.getValorItemsMensualPlanes(item.id,mes.Mes,anio.Anio))
      
              });
    
            
    
  
          })
        })
      
    });
  

} 


getValorItemsMensualPlanes(idItem:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>registro
  .idItem==idItem
  && registro.MesRegistro==Mes
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

getDataCategoriasMensualPlanes(){
  this.DataPlanesMensual=[]
  this.Categorias.forEach((categ:any) => {
      this.Anios.forEach((anio:any) => {
        this.Meses.forEach((mes:any) => {
            const key = `${anio.Anio}-${mes.NumMes}-${categ.id}`;  
            if (!this.DataPlanesMensual[key]) {
              this.DataPlanesMensual[key] =[];
            }

           if(categ.Orden==1) {
              this.DataPlanesMensual[key].push({
                "Valor": this.getDataFlujoOperativoMensualPlanes(mes.Mes,anio.Anio),
                "Diferencia":this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio)- this.getDataFlujoOperativoMensualPlanes(mes.Mes,anio.Anio),
                "Variacion": this.calcularVariacion(this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio),this.getDataFlujoOperativoMensualPlanes(mes.Mes,anio.Anio))
              }); 
          }
          else if(categ.Orden==4) {

              this.DataPlanesMensual[key].push({
                "Valor": this.getDataFlujoInversionMensualPlanes(mes.Mes,anio.Anio),
                "Diferencia":this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio)- this.getDataFlujoInversionMensualPlanes(mes.Mes,anio.Anio),
                "Variacion": this.calcularVariacion(this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio),this.getDataFlujoInversionMensualPlanes(mes.Mes,anio.Anio))
              });    

          }
   
        else if(categ.Orden==7) {
              
          this.DataPlanesMensual[key].push({
            "Valor": this.getDataFlujoFinancieroMensualPlanes(mes.Mes,anio.Anio),
            "Diferencia":this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)- this.getDataFlujoFinancieroMensualPlanes(mes.Mes,anio.Anio),
            "Variacion": this.calcularVariacion(this.getDataFlujoFinancieroMensual(mes.Mes,anio.Anio),this.getDataFlujoFinancieroMensualPlanes(mes.Mes,anio.Anio))
          });   
        }
          else if(categ.Orden==10) { 
          
              this.DataPlanesMensual[key].push({
                "Valor": this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio),
                "Diferencia":this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)- this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio),
                "Variacion": this.calcularVariacion(this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio),this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio))
              });   
          }

            else {
              this.DataPlanesMensual[key].push({
                "Valor": this.getValorCategoriaMensualPlanes(categ.id,mes.Mes,anio.Anio),
                "Diferencia":this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)- this.getValorCategoriaMensualPlanes(categ.id,mes.Mes,anio.Anio) ,
                "Variacion": this.calcularVariacion(this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio),this.getValorCategoriaMensualPlanes(categ.id,mes.Mes,anio.Anio))
      
              });
    
            }
    
  
          })
        })
      
    });


    this.cargando=false  
} 
calcularVariacion(ValorA:any,ValorB:any){

  return ValorA==0 || ValorB==0 ? 0 :  (((ValorA / ValorB)-1))*100 
}
getDataFlujoFinancieroMensualPlanes(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==8
  || registro.Orden==9)
  && registro.MesRegistro==Mes
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

getDataFlujoOperativoMensualPlanes(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==2
  || registro.Orden==3)
  && registro.MesRegistro==Mes
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

getDataFlujoInversionMensualPlanes(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==6
  || registro.Orden==5)
  && registro.MesRegistro==Mes
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

getDataFlujoLibreMensualPlanes(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensualPlanes(Mes,Anio) 
  + this.getDataFlujoInversionMensualPlanes(Mes,Anio)
  + this.getDataFlujoFinancieroMensualPlanes(Mes,Anio)
}


getValorCategoriaMensualPlanes(idCategoria:any,Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>registro
  .idCategoria==idCategoria
  && registro.MesRegistro==Mes
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

verifyValue(categoriaTipo:any,Monto:any){

  if(categoriaTipo==2 && Number(Monto)>0)
    {
      return [{Estado:false,Mensaje:'El valor debe ser negativo'}]  
    }
   else if (categoriaTipo==1 && Number(Monto)<0 ) 
    {
      return [{Estado:false,Mensaje:'El valor debe ser positivo'}]  
    }
    else {
      return [{Estado:true,Mensaje:'Excelente'}]  
    }

}

guardarValorPlan(Anio:any,MesRegistro:any,idCategoria:string,idItem:string,Valor:any,TipoCategoria:any,Orden:any){

  if(this.verifyValue(TipoCategoria,Number(Valor))[0].Estado==false){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: `${this.verifyValue(TipoCategoria,Number(Valor))[0].Mensaje}`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
  if(this.idTipoRegistro==2 && this.ProyectoSeleccionado==undefined){
    Swal.fire({
      position: "center",
      icon: "warning",
      title: `Debe elegir un proyecto`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  else {
    let _Valor:any={
      "AnioRegistro":Anio,
      "MesRegistro":MesRegistro,
      "Orden":Orden,
      "idCategoria":idCategoria,
      "idItem":idItem,
      "TipoCategoria":TipoCategoria,
      "TipoRegistro":this.idTipoRegistro,
      "Valor": Number(Valor.replace(',', '')),
      "idEmpresa":this.usuario.idEmpresa,
      "idSucursal":  ( this.SucursalSeleccionada==undefined  || Object.keys(this.SucursalSeleccionada).length === 0 )? '' : this.SucursalSeleccionada.id  ,
      "idProyecto":( this.ProyectoSeleccionado==undefined  || Object.keys(this.ProyectoSeleccionado).length === 0) ? '' : this.ProyectoSeleccionado.id
    }
   
    let _ValorPlanEncontrado:any=[]
    _ValorPlanEncontrado=this.RegistrosValoresPlanes.filter((data:any)=>
      data.idCategoria==idCategoria &&
      data.MesRegistro==MesRegistro &&
      data.AnioRegistro==Anio &&
      data.idItem==idItem &&
      data.idEmpresa==this.usuario.idEmpresa)
    if(_ValorPlanEncontrado.length>0){

      _ValorPlanEncontrado[0].Valor=Number(Valor.replace(',', ''))
      console.log('_ValorPlanEncontrado',_ValorPlanEncontrado[0])
    this.conS.ActualizarValorPlan(_ValorPlanEncontrado[0]).then(resp=>{
      this.toastr.success('Guardado', '¡Exito!');
      this.getDataItemsMensualPlanes()
      this.getDataCategoriasMensual()
      this.getDataCategoriasMensualPlanes()
    })
    }  
    
    else {
      this.conS.crearValorPlan(_Valor).then(resp=>{
        this.toastr.success('Guardado', '¡Exito!');
        this.getDataItemsMensualPlanes()
        this.getDataCategoriasMensual()
        this.getDataCategoriasMensualPlanes()
      })

}

console.log('ProyectoSeleccionado',this.ProyectoSeleccionado)

  }


  }
}



getDataCategoriasMensual(){
  this.DataCategoriasMensual=[]
  this.Categorias.forEach((categ:any) => {
      this.Anios.forEach((anio:any) => {
        this.Meses.forEach((mes:any) => {
            const key = `${anio.Anio}-${mes.NumMes}-${categ.id}`;  
            if (!this.DataCategoriasMensual[key]) {
              this.DataCategoriasMensual[key] =[];
            }

           if(categ.Orden==1) {
              
              this.DataCategoriasMensual[key].push({
                "Valor": this.getDataFlujoOperativoMensual(mes.NumMes,anio.Anio)
      
              });
          }
          else if(categ.Orden==4) {
              
              this.DataCategoriasMensual[key].push({
                "Valor": this.getDataFlujoInversionMensual(mes.NumMes,anio.Anio)
      
              });
          }
          else if(categ.Orden==7) {
              
              this.DataCategoriasMensual[key].push({
                "Valor": this.getDataFlujoFinancieroMensual(mes.NumMes,anio.Anio)
      
              });
          }
      
          else if(categ.Orden==10) {
              
              this.DataCategoriasMensual[key].push({
                "Valor": this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)
      
              });
          }

            else {
              this.DataCategoriasMensual[key].push({
                "Valor": this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)
      
              });
    
            }
    
           
          })
        })
      
    });
 this.getDataItemMensual()
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

getDataFlujoInversionMensual(Mes:any,Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==6
  || registro.idCategoria.Orden==5)
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
getDataFlujoLibreMensual(Mes:any,Anio:any){
  return this.getDataFlujoOperativoMensual(Mes,Anio) 
  + this.getDataFlujoInversionMensual(Mes,Anio)
  + this.getDataFlujoFinancieroMensual(Mes,Anio)
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
              "Valor": this.getValorItemMensual(item.id,mes.NumMes,anio.Anio)
    
            });
    
           
          })
        })
      
    });

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
}
