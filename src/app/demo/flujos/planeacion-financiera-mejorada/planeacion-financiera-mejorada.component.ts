// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SidebarModule } from 'primeng/sidebar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-planeacion-financiera-mejorada',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TableModule,
    InputGroupModule,
    InputGroupAddonModule,
    SidebarModule],
  templateUrl: './planeacion-financiera-mejorada.component.html',
  styleUrls: ['./planeacion-financiera-mejorada.component.scss']
})
export default class PlaneacionFinancieraMejoradaComponent implements OnInit,OnDestroy  {
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
DataCategoriasAnual:any=[]
DataItemsMensual:any=[]
DataItemsAnual:any=[]
DataItems:any=[]
RegistrosBackUp:any=[]
DataPlanesGeneral:any=[]
sidebarVisible2: boolean = false;
DataPlanesMensual:any=[]
DataPlanesAnual:any=[]
idTipoRegistro:any=0
cargando:boolean=true
DataItemsAnualPlanes:any=[]
Sucursales:any=[]
SucursalSeleccionada:any
Proyectos:any=[]
ProyectoSeleccionado:any

CuentasBancarias:any=[]
CuentaBancariaSeleccionada:any=[]
visible: boolean = false;
constructor(private conS:ConfigurationService,private toastr: ToastrService){

  this.debouncer.pipe(
    debounceTime(1000), // Espera 1 segundo después de que el usuario deja de escribir
    distinctUntilChanged() // Solo llama a la función si el valor ha cambiado
  ).subscribe((params:any) => {
    this.guardarValorPlan(
      params.Anio,
      params.MesRegistro,
      params.NumMes,
      params.idCategoria,
      params.idItem,
      params.Valor,
      params.TipoCategoria,
      params.Orden
    );
  });
}
inputValues: any = {}; 
private debouncer: Subject<any> = new Subject<any>();
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
ngOnDestroy() {
  // Desuscribir cuando el componente se destruye
  this.debouncer.unsubscribe();
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

  if(this.usuario.Rol=='Super Usuario'){
    this.conS.obtenerProyectosByMatriz(this.usuario.idMatriz).subscribe((resp: any)=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )

  })
    
}
else {
  this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe(resp=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )

  })

}  
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
          "Nombre": mes.Mes + " " + anio.Anio,
          "Mes":mes.Mes,
          "NumMes":mes.NumMes,
          "Anio":anio.Anio,
          "Tipo":2,
          "Mostrar":true,
          "MostrarBoton":true
        })
        this.Cabecera.push({
          "Nombre": mes.Mes + " " + anio.Anio,
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
      
              this.Cabecera.push({
                "Nombre":"Total" + anio.Anio,
                "Anio":anio.Anio,
                "Tipo":6,
                "Mostrar":true,
                "MostrarBoton":true
              })
        
})

const nuevosElementos = this.Cabecera.filter(itemA => 
  !this.CabeceraBack.some(itemB => itemB.Anio === itemA.Anio)
);
this.CabeceraBack.push(...nuevosElementos);
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


  this.getDataCategoriasMensualPlanes()
  this.getDataCategoriasMensual()
  this.getDataItemMensual()
  this.getDataItemsMensualPlanes()


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
      (this.MesesSeleccionados.some((mes: any) => mes.NumMes == cab.NumMes) &&
      this.Anios.some((anio: any) => anio.Anio == cab.Anio))
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
      this.Cabecera=this.CabeceraBack.filter((cab:any)=>
       
        this.Anios.some((anio: any) => anio.Anio == cab.Anio)
        || cab.Tipo==1
        )
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
        (this.MesesSeleccionados.some((mes: any) => mes.NumMes == cab.NumMes) &&
        this.Anios.some((anio: any) => anio.Anio == cab.Anio))
        || cab.Tipo==1
        )
  }
  else {
    this.Anios.map((mes:any)=>mes.Mostrar=true)
    this.Cabecera=this.CabeceraBack.filter((cab:any)=>
       
      this.Anios.some((anio: any) => anio.Anio == cab.Anio)
      || cab.Tipo==1
      )
  }


}
descargarExcel(){
 let _CabeceraPlan:any=[]
 let _CabeceraReal:any=[]

 //Data planeada
 _CabeceraPlan=this.Cabecera.filter((cab:any)=>cab.Mostrar==true && (cab.Tipo==2 || cab.Tipo==1  || cab.Tipo == 6))
  const headerRow: any[] = [];
  _CabeceraPlan.forEach((element: any) => {
    headerRow.push(element.Nombre);
  });
  let Data: any[] = [];
  let Contador:number=1
  this.Categorias.filter((categ:any)=>categ.Tipo!=20).forEach((categ: any) => {
    let fila: any[] = [`${Contador}- ${categ.Nombre}`];
    Contador+=1
    _CabeceraPlan.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {

        const index = `${cab.Anio}-${cab.NumMes}-${categ.id}`;
        const indexAnual = `${cab.Anio}-${categ.id}`;
        let valor = 0;
        if (cab.Tipo == 2) {
            valor = this.DataPlanesMensual[index]?.[0]?.Valor || 0;
        } else if (cab.Tipo == 3) {
            valor = this.DataCategoriasMensual[index]?.[0]?.Valor || 0;
        } else if (cab.Tipo == 4) {
            valor = this.DataPlanesMensual[index]?.[0]?.Diferencia || 0;
        } else if (cab.Tipo == 5) {
            valor = this.DataPlanesMensual[index]?.[0]?.Variacion || 0;
        }  
        else if (cab.Tipo == 6) {
            valor = this.DataPlanesAnual[indexAnual]?.[0]?.Valor || 0;
        }
        
        fila.push(valor);
    });
    Data.push(fila);
    this.getItems(categ.id).forEach((item: any) => {
        let filaItem: any[] = [item.Nombre];
        _CabeceraPlan.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {

            const indexItem = `${cab.Anio}-${cab.NumMes}-${item.id}`;
            const indexItemAnual = `${cab.Anio}-${item.id}`;
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
             else if (cab.Tipo == 6) {
                valorItem = this.DataItemsAnual[indexItemAnual]?.[0]?.Valor || 0;
            }
            filaItem.push(valorItem);
        });
        Data.push(filaItem);
    });


    
  });

  //Data real
  _CabeceraReal=this.Cabecera.filter((cab:any)=>cab.Mostrar==true && (cab.Tipo==3 || cab.Tipo==1 || cab.Tipo == 6))
  const headerRowReal: any[] = [];
  _CabeceraReal.forEach((element: any) => {
    headerRowReal.push(element.Nombre);
  });
  let DataReal: any[] = [];

  let ContadorReal:number=1
  this.Categorias.filter((categ:any)=>categ.Tipo!=21).forEach((categ: any) => {
    let fila: any[] = [`${ContadorReal}- ${categ.Nombre}`];
    Contador+=1
    _CabeceraReal.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {

        const index = `${cab.Anio}-${cab.NumMes}-${categ.id}`;
        const indexAnual = `${cab.Anio}-${categ.id}`;
        let valor = 0;
        if (cab.Tipo == 2) {
            valor = this.DataPlanesMensual[index]?.[0]?.Valor || 0;
        } else if (cab.Tipo == 3) {
            valor = this.DataCategoriasMensual[index]?.[0]?.Valor || 0;
        } else if (cab.Tipo == 4) {
            valor = this.DataPlanesMensual[index]?.[0]?.Diferencia || 0;
        } else if (cab.Tipo == 5) {
            valor = this.DataPlanesMensual[index]?.[0]?.Variacion || 0;
        }
        else if (cab.Tipo == 6) {
          valor = this.DataCategoriasAnual[indexAnual]?.[0]?.Valor || 0;
      }
        
        fila.push(valor);
    });

    DataReal.push(fila);

    this.getItems(categ.id).forEach((item: any) => {
        let filaItem: any[] = [item.Nombre];
        _CabeceraReal.filter((cab: any) => cab.Tipo != 1).forEach((cab: any) => {

            const indexItem = `${cab.Anio}-${cab.NumMes}-${item.id}`;
            const indexItemAnual = `${cab.Anio}-${item.id}`;
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
            else if (cab.Tipo == 6) {
              valorItem = this.DataItemsAnual[indexItemAnual]?.[0]?.Valor || 0;
          }
            filaItem.push(valorItem);
        });
        DataReal.push(filaItem);
    });


    
  });

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Data');

// 1. Añadir la tabla de DataPlan
worksheet.addRow([]); // Fila en blanco antes de DataPlan

const headerRowPlan = worksheet.addRow(headerRow); // Usar el headerRow de DataPlan

// Aplicar estilos a la cabecera de DataPlan
headerRowPlan.eachCell((cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '71bd9e' }, // Fondo verde
  };
  cell.font = {
    bold: true,
    color: { argb: 'ffffff' }, // Texto blanco
  };
  cell.alignment = {
    horizontal: 'left',
    vertical: 'middle',
  };
  cell.border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
});

// Añadir las filas de DataPlan y aplicar estilos
Data.forEach((row: any, index: any) => {
  const dataRow = worksheet.addRow(row);

  // Condicional para aplicar diferentes colores de fondo
  if (row[0].startsWith('1-') || row[0].startsWith('2-') || row[0].startsWith('4-') || row[0].startsWith('5-') || row[0].startsWith('7-') || row[0].startsWith('8-')) {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' }, // Gris claro
      };
    });
  } else if (row[0].startsWith('3-') || row[0].startsWith('6-') || row[0].startsWith('9-') || row[0].startsWith('10-')) {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'afeffb' }, // Verde claro
      };
    });
  } else {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' }, // Blanco
      };
    });
  }

  // Alineación de las celdas
  dataRow.eachCell((cell: any, colNumber: number) => {
    if (colNumber === 1) {
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
      };
    } else {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    }
  });
});

// 2. Añadir la tabla de DataReal justo debajo de DataPlan
worksheet.addRow([]); // Fila en blanco antes de DataReal

const headerRowRealData = worksheet.addRow(headerRowReal); // Usar el headerRowReal de DataReal

// Aplicar estilos a la cabecera de DataReal
headerRowRealData.eachCell((cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '71bd9e' }, // Fondo verde
  };
  cell.font = {
    bold: true,
    color: { argb: 'ffffff' }, // Texto blanco
  };
  cell.alignment = {
    horizontal: 'left',
    vertical: 'middle',
  };
  cell.border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
});

// Añadir las filas de DataReal y aplicar estilos
DataReal.forEach((row: any, index: any) => {
  const dataRow = worksheet.addRow(row);

  // Condicional para aplicar diferentes colores de fondo
  if (row[0].startsWith('1-') || row[0].startsWith('2-') || row[0].startsWith('4-') || row[0].startsWith('5-') || row[0].startsWith('7-') || row[0].startsWith('8-')) {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' }, // Gris claro
      };
    });
  } else if (row[0].startsWith('3-') || row[0].startsWith('6-') || row[0].startsWith('9-') || row[0].startsWith('10-')) {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'afeffb' }, // Verde claro
      };
    });
  } else {
    dataRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' }, // Blanco
      };
    });
  }

  // Alineación de las celdas

  worksheet.getColumn(1).width = 30;  // Ajustar ancho de la columna 1 (por ejemplo 20 caracteres)
  // Ajustar ancho de la columna 1 (por ejemplo 20 caracteres)

  dataRow.eachCell((cell: any, colNumber: number) => {
    if (colNumber === 1) {
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
      };
    } else {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    }
  });
});

// Exportar el archivo Excel con ambas tablas en una hoja
workbook.xlsx.writeBuffer().then((buffer: any) => {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, `Planeacion Financiera ${this.usuario.Empresa}.xlsx`);
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

    this.categoriasExpandidas=this.categoriasExpandidasHistory
  }
  this.getDataCategoriasMensualPlanes()
  this.getDataCategoriasMensual()
  this.getDataItemMensual()
  this.getDataItemsMensualPlanes()

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
        "Nombre":mes.Mes + " " + anio.Anio,
        "Mes":mes.Mes,
        "NumMes":mes.NumMes,
        "Anio":anio.Anio,
        "Tipo":2,
        "Mostrar":true,
        "MostrarBoton":true
      })
      this.Cabecera.push({
        "Nombre": mes.Mes + " " + anio.Anio,
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

    this.Cabecera.push({
      "Nombre":"Total" + anio.Anio,
      "Anio":anio.Anio,
      "Tipo":6,
      "Mostrar":true,
      "MostrarBoton":true
    })

 this.CabeceraBack=this.Cabecera

 this.getDataCategoriasMensualPlanes()
this.getDataCategoriasMensual()
this.getDataItemMensual()
this.getDataItemsMensualPlanes()
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
    this.Categorias.push({
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Flujo de Efectivo Acumulado",
      "Orden":19,
      "Suma":true,
      "Tipo":19,
      "id":'Acumulado-0'
    })


    this.Categorias.push({
      "Calculado":true,
      "Mostrar":true,
      "Nombre":"Diferencia Teórico vs Real",
      "Orden":20,
      "Suma":true,
      "Tipo":20,
      "id":'Diferencia-0',
    })
    // this.Categorias.push({
    //   "Calculado":true,
    //   "Mostrar":true,
    //   "Nombre":"Diferencia Real vs Teórico",
    //   "Orden":21,
    //   "Suma":true,
    //   "Tipo":21,
    //   "id":'Diferencia-1',
    // })
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
  this.DataItemsAnualPlanes=[]
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
          
          const keyAnual = `${anio.Anio}-${item.id}`;  
          if (!this.DataItemsAnualPlanes[keyAnual]) {
            this.DataItemsAnualPlanes[keyAnual] =[];
          }

          this.DataItemsAnualPlanes[keyAnual].push({
            "Valor": this.getValorItemsAnualPlanes(item.id,anio.Anio)
  
          });
        })
      
    });
  this.initializeInputValues()

} 

buidDataPlanesGeneral(){

}


initializeInputValues() {
  // Asume que DataItems tiene los datos correctos para inicializar
  for (let key in this.DataItems) {
    const dataItem = this.DataItems[key];
    if (dataItem && dataItem.length > 0) {
      // Usa el formato clave que estás utilizando para ngModel
      this.inputValues[key] = (dataItem[0].Valor).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    }
  }

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

getValorItemsAnualPlanes(idItem:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>registro
  .idItem==idItem
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

getNombreMes(NumMes:any){
let MesEncontrado:any=[]
MesEncontrado=this.Meses.filter((m:any)=>m.NumMes==NumMes)
if(MesEncontrado.length>0){
  return MesEncontrado[0].Mes
}
}

getDataCategoriasMensualPlanes(){
  this.DataPlanesMensual=[]
  this.DataPlanesAnual=[]
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
          else if(categ.Orden==19) { 

            if(mes.NumMes==1){
                   let ValorAcumulado:number=0
                   ValorAcumulado=this.DataPlanesMensual[`${anio.Anio-1}-${12}-${categ.id}`] ==undefined ? 0
                   : this.DataPlanesMensual[`${anio.Anio-1}-${12}-${categ.id}`]?.[0]?.Valor 
                  this.DataPlanesMensual[key].push({
                    "Valor": this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio) + ValorAcumulado ,
                  });   

            }

           
            else {
              let ValorAcumulado:number=0
              ValorAcumulado=this.DataPlanesMensual[`${anio.Anio}-${mes.NumMes-1}-${categ.id}`] ==undefined ? 0
              : this.DataPlanesMensual[`${anio.Anio}-${mes.NumMes-1}-${categ.id}`]?.[0]?.Valor 

                  this.DataPlanesMensual[key].push({
                    "Valor": this.getDataFlujoLibreMensualPlanes(mes.Mes,anio.Anio)+ValorAcumulado,
                  });   

            }
          }

          else if(categ.Orden==21) {
            
            this.DataPlanesMensual[key].push({
              "Valor":
             
              ( this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)-
              this.DataPlanesMensual[anio.Anio +
                '-' + mes.NumMes + '-' + 'VmmQpdpunMTqkoSjhzzj']?.[0]?.Valor)
    
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



          const keyAnual = `${anio.Anio}-${categ.id}`;  

          if (!this.DataPlanesAnual[keyAnual]) {
            this.DataPlanesAnual[keyAnual] =[];
          }

          if(categ.Orden==1) {
            this.DataPlanesAnual[keyAnual].push({
              "Valor": this.getDataFlujoOperativoAnualPlanes(anio.Anio),
            }); 
        }

        else if(categ.Orden==4) {
          this.DataPlanesAnual[keyAnual].push({
            "Valor": this.getDataFlujoInversionAnualPlanes(anio.Anio),

          });    
      }

      else if(categ.Orden==7) {            
        this.DataPlanesAnual[keyAnual].push({
          "Valor": this.getDataFlujoFinancieroAnualPlanes(anio.Anio)
        });   
      }

      else if(categ.Orden==10) { 
          
        this.DataPlanesAnual[keyAnual].push({
          "Valor": this.getDataFlujoLibreAnualPlanes(anio.Anio)
        });   
    }

    else if(categ.Orden==19) { 
      let ValorAcumulado:number=0
      this.Meses.forEach(mes => {
        ValorAcumulado+=this.DataPlanesMensual[`${anio.Anio}-${mes.NumMes}-${categ.id}`] ==undefined ? 0
        : this.DataPlanesMensual[`${anio.Anio}-${mes.NumMes}-${categ.id}`]?.[0]?.Valor 
        
      });
        this.DataPlanesAnual[keyAnual].push({
              "Valor": ValorAcumulado
        });   

      
    }



    else if(categ.Orden==21) {
      let ValorAcumulado:number= this.getValorCategoriaAnual('VmmQpdpunMTqkoSjhzzj',anio.Anio) +
      this.DataPlanesAnual[anio.Anio + '-' + 'VmmQpdpunMTqkoSjhzzj']?.[0]?.Valor
      this.DataPlanesAnual[keyAnual].push({
        "Valor":
        ValorAcumulado
      });

  }

    else {
      this.DataPlanesAnual[keyAnual].push({
        "Valor": this.getValorCategoriaAnualPlanes(categ.id,anio.Anio),


      });

    }




  
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

getDataFlujoFinancieroAnualPlanes(Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==8
  || registro.Orden==9)
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

getDataFlujoInversionAnualPlanes(Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==6
  || registro.Orden==5)
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


getDataFlujoLibreAnualPlanes(Anio:any){
  return this.getDataFlujoOperativoAnualPlanes(Anio) 
  + this.getDataFlujoInversionAnualPlanes(Anio)
  + this.getDataFlujoFinancieroAnualPlanes(Anio)
}



getDataFlujoOperativoAnualPlanes(Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>
  (registro.Orden==2
  || registro.Orden==3)
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

getValorCategoriaAnualPlanes(idCategoria:any,Anio:any){
  let _Data: any=[];
  _Data=this.RegistrosValoresPlanes.filter((registro:any)=>registro
  .idCategoria==idCategoria
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

onInputChange(Anio: any, MesRegistro: any,NumMes:any, idCategoria: any, idItem: any, Valor: any, TipoCategoria: any, Orden: any) {
  // Emitir los valores al debouncer

  this.debouncer.next({ Anio, MesRegistro,NumMes, idCategoria, idItem, Valor, TipoCategoria, Orden });
}

guardarValorPlan(Anio:any,MesRegistro:any,NumMes:any,idCategoria:any,idItem:any,Valor:any,TipoCategoria:any,Orden:any){

  let ValorPlan:any=this.inputValues[Anio+'-'+ NumMes +'-'+idItem]

  if (ValorPlan === ""){
    Swal.fire({
      position: "center",
      icon: "error",
      title: "El valor no debe estar en blanco",
      showConfirmButton: false,
      timer: 1500
    });
  }
  else  if (isNaN(Number(ValorPlan.replace(/[$,\s]/g, ''))))  {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "El valor debe ser numérico",
      showConfirmButton: false,
      timer: 1500
    });
  }

  if(this.verifyValue(TipoCategoria,Number(Valor.replace(/[$,\s]/g, '')))[0].Estado==false){
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
      "Valor": Number(ValorPlan.replace(/[$,\s]/g, '')),
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

      _ValorPlanEncontrado[0].Valor= Number(ValorPlan.replace(/[$,\s]/g, ''))
  
    this.conS.ActualizarValorPlan(_ValorPlanEncontrado[0]).then(resp=>{
      this.toastr.success('Guardado', '¡Exito!');
      this.getDataItemsMensualPlanes()
      this.getDataCategoriasMensualPlanes()
      this.getDataCategoriasMensual()
      this.initializeInputValues()
    })
    }  
    
    else {
      this.conS.crearValorPlan(_Valor).then(resp=>{
        this.toastr.success('Guardado', '¡Exito!');
        this.getDataItemsMensualPlanes()
        this.getDataCategoriasMensualPlanes()
        this.getDataCategoriasMensual()
        this.initializeInputValues()
      })

}



  }


  }
}



getDataCategoriasMensual(){
  this.DataCategoriasMensual=[]
  this.DataCategoriasAnual=[]
  let idCategoria:string=''
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

          else if(categ.Orden==19) { 
            if(mes.NumMes==1){
                   let ValorAcumulado:number=0
                   ValorAcumulado=this.DataCategoriasMensual[`${anio.Anio-1}-${12}-${categ.id}`] ==undefined ? 0
                   : this.DataCategoriasMensual[`${anio.Anio-1}-${12}-${categ.id}`]?.[0]?.Valor 
               
                  this.DataCategoriasMensual[key].push({
                    "Valor": this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio) + ValorAcumulado ,
                  });   

            }
            else {
             
              let ValorAcumulado:number=0
              ValorAcumulado=this.DataCategoriasMensual[`${anio.Anio}-${mes.NumMes-1}-${categ.id}`] ==undefined ? 0
              : this.DataCategoriasMensual[`${anio.Anio}-${mes.NumMes-1}-${categ.id}`]?.[0]?.Valor 

                  this.DataCategoriasMensual[key].push({
                    "Valor": this.getDataFlujoLibreMensual(mes.NumMes,anio.Anio)+ValorAcumulado,
                  });   
          
            }
          }
          else if(categ.Orden==20) {
              
              this.DataCategoriasMensual[key].push({
                "Valor":
                this.DataPlanesMensual[anio.Anio +
                  '-' + mes.NumMes + '-' + 'VmmQpdpunMTqkoSjhzzj']?.[0]?.Valor -
                this.DataCategoriasMensual[anio.Anio +
                  '-' + mes.NumMes + '-' + 'VmmQpdpunMTqkoSjhzzj']?.[0]?.Valor
      
              });
          }

            else {
              this.DataCategoriasMensual[key].push({
                "Valor": this.getValorCategoriaMensual(categ.id,mes.NumMes,anio.Anio)
      
              });
    
            }
    
           
          })

          const keyAnual = `${anio.Anio}-${categ.id}`;  
          if (!this.DataCategoriasAnual[keyAnual]) {
            this.DataCategoriasAnual[keyAnual] =[];
          }
          if(categ.Orden==1) {
              
            this.DataCategoriasAnual[keyAnual].push({
              "Valor": this.getDataFlujoOperativoAnual(anio.Anio)
            });
          }
          else if(categ.Orden==4) {
              
            this.DataCategoriasAnual[keyAnual].push({
              "Valor": this.getDataFlujoInversionAnual(anio.Anio)
    
            });
        }

        else if(categ.Orden==7) {
              
          this.DataCategoriasAnual[keyAnual].push({
            "Valor": this.getDataFlujoFinancieroAnual(anio.Anio)
  
          });
      }

      else if(categ.Orden==10) {
              
        this.DataCategoriasAnual[keyAnual].push({
          "Valor": this.getDataFlujoLibreAnual(anio.Anio)

        });
    }
    
    else if(categ.Orden==19) { 
      let ValorAcumulado:number=0
      this.Meses.forEach(mes => {
        ValorAcumulado+=this.DataCategoriasMensual[`${anio.Anio}-${mes.NumMes}-${categ.id}`] ==undefined ? 0
        : this.DataCategoriasMensual[`${anio.Anio}-${mes.NumMes}-${categ.id}`]?.[0]?.Valor 
        
      });
        this.DataCategoriasAnual[keyAnual].push({
              "Valor": ValorAcumulado
        });   

      
    }

    else if(categ.Orden==20) {
      let ValorAcumulado:number=  this.DataPlanesAnual[anio.Anio + '-' + 'VmmQpdpunMTqkoSjhzzj']?.[0]?.Valor +
      this.DataCategoriasAnual[anio.Anio + '-' + 'VmmQpdpunMTqkoSjhzzj']?.[0]?.Valor
      this.DataCategoriasAnual[keyAnual].push({
        "Valor":
        ValorAcumulado
      });

  }

  else {
    this.DataCategoriasAnual[keyAnual].push({
      "Valor": this.getValorCategoriaAnual(categ.id,anio.Anio)
    });

  }


  
          


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
getDataFlujoInversionAnual(Anio:any){
  let _Data: any=[];
  _Data=this.Registros.filter((registro:any)=>
  (registro.idCategoria.Orden==6
  || registro.idCategoria.Orden==5)
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

getDataFlujoLibreAnual(Anio:any){

  return this.getDataFlujoOperativoAnual(Anio) 
  + this.getDataFlujoInversionAnual(Anio)
  + this.getDataFlujoFinancieroAnual(Anio)
}
getDataItemMensual(){
this.DataItemsMensual=[]
this.DataItemsAnual=[]
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

          const keyAnual = `${anio.Anio}-${item.id}`;  
          if (!this.DataItemsAnual[keyAnual]) {
            this.DataItemsAnual[keyAnual] =[];
          }

          this.DataItemsAnual[keyAnual].push({
            "Valor": this.getValorItemAnual(item.id,anio.Anio)
  
          });
  


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
}
