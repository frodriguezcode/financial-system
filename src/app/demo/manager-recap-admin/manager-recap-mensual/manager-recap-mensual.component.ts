// angular import
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-manager-recap-mensual',
  standalone: true,
  imports: [CommonModule, SharedModule,MultiSelectModule],
  templateUrl: './manager-recap-mensual.component.html',
  styleUrls: ['./manager-recap-mensual.component.scss']
})
export default class ManagerRecapMensualComponent implements OnInit {
  constructor(private conS:ConfigurationService,private datePipe: DatePipe,private toastr: ToastrService,){}
  DatosElementos:any=[]
  Cabecera:any=[]
  Fecha:any= new Date();
  Categorias:any=[]
  CatalogoElementos:any=[]
  Registros:any=[]
  Meses:any=[]
  MesesSeleccionados:any=[]
  Anios:any=[]
  AniosSeleccionados:any=[]
  cargando:boolean=true
  usuario:any
  ngOnInit(): void {

    this.conS.usuario$.subscribe(usuario => {
 
      this.cargando=true
      if (usuario) {
      this.usuario=usuario
      }
      else {
        this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }
      this.obtenerRegistrosStoreManagerRecapt()
    })  
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
      Trimestre:1,
      Mostrar: true
    },
    {
      Mes: 'Febrero',
      NumMes:2,
      Trimestre:1,
      Mostrar: true
    },
    {
      Mes: 'Marzo',
      NumMes:3,
      Trimestre:1,
      Mostrar: true
    },
    {
      Mes: 'Abril',
      NumMes:4,
      Trimestre:2,
      Mostrar: true
    },
    {
      Mes: 'Mayo',
      NumMes:5,
      Trimestre:2,
      Mostrar: true
    },
    {
      Mes: 'Junio',
      NumMes:6,
      Trimestre:2,
      Mostrar: true
    },
    {
      Mes: 'Julio',
      NumMes:7,
      Trimestre:3,
      Mostrar: true
    },
    {
      Mes: 'Agosto',
      NumMes:8,
      Trimestre:3,
      Mostrar: true
    },
    {
      Mes: 'Septiembre',
      NumMes:9,
      Trimestre:3,
      Mostrar: true
    },
    {
      Mes: 'Octubre',
      NumMes:10,
      Trimestre:4,
      Mostrar: true
    },
    {
      Mes: 'Noviembre',
      NumMes:11,
      Trimestre:4,
      Mostrar: true
    },
    {
      Mes: 'Diciembre',
      NumMes:12,
      Trimestre:4,
      Mostrar: true
    },
  
  ]
this.getCategorias()



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

  let Anios:any=this.AniosSeleccionados.length>0?this.AniosSeleccionados : this.Anios
  let Meses:any=this.MesesSeleccionados.length>0?this.MesesSeleccionados : this.Meses

  Anios.forEach((anio:any) => {
    Meses.forEach((mes:any) => {
    this.Cabecera.push({
      "Nombre": mes.Mes + " " + anio.Anio,
      "Mes":mes.Mes,
      "NumMes":mes.NumMes,
      "Trimestre":mes.Trimestre,
      "Anio":anio.Anio,
      "Tipo":2,
      "Mostrar":true,
      "MostrarBoton":true
    })

    })
    this.Cabecera.push({
      "Nombre": 'Acumulado',
      "Mes":0,
      "NumMes":'',
      "Anio":anio.Anio,
      "Tipo":3,
      "Mostrar":true,
      "MostrarBoton":true
    })
    this.Cabecera.push({
      "Nombre": 'Promedio',
      "Mes":0,
      "NumMes":'',
      "Anio":anio.Anio,
      "Tipo":4,
      "Mostrar":true,
      "MostrarBoton":true
    })

  })
  this.construirData()

  console.log('Cabecera',this.Cabecera)
}


@ViewChild('scrollTopSync') scrollTopSync!: ElementRef<HTMLDivElement>;
@ViewChild('scrollInner') scrollInner!: ElementRef<HTMLDivElement>;

@ViewChild('containerTable') containerTable!: ElementRef<HTMLDivElement>;

@ViewChild('dataTable') dataTable!: ElementRef<HTMLTableElement>;



contraer(){
  this.CatalogoElementos.map((cat:any)=>cat.Mostrar=false)
}
expandir(){
  this.CatalogoElementos.map((cat:any)=>cat.Mostrar=true)
}

getCategorias(){
  let Subscription:Subscription
  Subscription=this.conS.obtenerCategoriasFlujos().subscribe((data:any)=>{
    Subscription.unsubscribe()
    this.Categorias=data


    this.CatalogoElementos.push(
      // Mercadotecnia
      {          
      "Nombre":"Mercadotecnia",
      "id":'01',
      "Mostrar":true,
      "Orden":1,
      "Elementos":[
        {
        "Nombre":"Prospectos",
        "id":'01-01',
        "idPadre":'01',
        "Moneda":false,
        "Simbolo":1,
        "Orden":1,
        "OrdenData":1,
        "Editable":true,
        },
        {
        "Nombre":"(X) % de Conversión",
        "id":'01-02',
        "OrdenData":3,
        "idPadre":'01',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"(=) Clientes Nuevos",
        "id":'01-03',
        "OrdenData":2,
        "idPadre":'01',
        "Moneda":false,
        "Simbolo":1,
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(+) Clientes Existentes",
        "id":'01-04',
        "OrdenData":4,
        "Moneda":false,
        "idPadre":'01',
        "Simbolo":1,
        "Orden":4,
        "Editable":true,
        },
        {
        "Nombre":"(=) Clientes Totales",
        "id":'01-05',
        "idPadre":'01',
        "OrdenData":5,
        "Moneda":false,
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Transacciones Totales",
        "id":'01-06',
        "idPadre":'01',
        "OrdenData":6,
        "Simbolo":1,
        "Moneda":false,
        "Orden":6,
        "Editable":true,
        },
        {
        "Nombre":"(X) Transacciones Promedio",
        "id":'01-07',
        "idPadre":'01',
        "OrdenData":7,
        "Moneda":false,
        "Orden":7,
        "Editable":false,
        },
        {
        "Nombre":"(X) Monto Promedio de Venta",
        "id":'01-08',
        "idPadre":'01',
        "Moneda":true,
        "Orden":8,
        "OrdenData":9,
        "Editable":false,
        },
        {
        "Nombre":"(=) Ventas Netas",
        "id":'01-09',
        "OrdenData":8,
        "idPadre":'01',
        "Simbolo":1,
        "Orden":9,
        "Moneda":true,
        "Editable":true,
        },
  
  
      ],
      },
      // Estado de Resultados
      {          
      "Nombre":"Estado de Resultados",
      "id":'02',
      "Orden":2,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Ventas",
        "Moneda":true,
        "OrdenData":1,
        "id":'02-01',
        "idPadre":'02',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"(-) Costo de ventas",
        "id":'02-02',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "Orden":2,
        "OrdenData":2,
        "Editable":true,
        },
        {
        "Nombre":"(=) Utilidad Bruta",
        "id":'02-03',
        "Moneda":true,
        "OrdenData":3,
        "idPadre":'02',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Margen Bruto",
        "id":'02-04',
        "Moneda":false,
        "idPadre":'02',
        "Orden":4,
        "OrdenData":4,
        "Editable":false,
        },
        {
        "Nombre":"(-) Gastos de Ventas y Mkt",
        "id":'02-05',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "Orden":5,
        "OrdenData":5,
        "Editable":true,
        },
        {
        "Nombre":"(-) Gastos de Operación",
        "id":'02-06',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "Orden":6,
        "OrdenData":6,
        "Editable":true,
        },
        {
        "Nombre":"(-) Gastos de Administración",
        "id":'02-07',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "OrdenData":7,
        "Orden":7,
        "Editable":true,
        },
        {
        "Nombre":"Total gastos de operación",
        "id":'02-08',
        "Moneda":true,
        "idPadre":'02',
        "Orden":8,
        "OrdenData":8,
        "Editable":false,
        },
        {
        "Nombre":"(=) EBITDA",
        "id":'02-09',
        "Moneda":true,
        "idPadre":'02',
        "Orden":9,
        "OrdenData":9,
        "Editable":false,
        },
        {
        "Nombre":"Margen de Operación",
        "id":'02-10',
        "Moneda":false,
        "idPadre":'02',
        "Orden":10,
        "OrdenData":10,
        "Editable":false,
        },
        {
        "Nombre":"(-) Intereses",
        "id":'02-11',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "Orden":11,
        "OrdenData":11,
        "Editable":true,
        },
        {
        "Nombre":"(-) Impuestos",
        "id":'02-12',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "Orden":12,
        "OrdenData":12,
        "Editable":true,
        },
        {
        "Nombre":"(-) Depreciación",
        "id":'02-13',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "OrdenData":13,
        "Orden":13,
        "Editable":true,
        },
        {
        "Nombre":"(-) Amortización",
        "id":'02-14',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":2,
        "OrdenData":14,
        "Orden":14,
        "Editable":true,
        },
        {
        "Nombre":"(=) Utilidad Neta",
        "id":'02-15',
        "Moneda":true,
        "idPadre":'02',
        "Orden":15,
        "OrdenData":15,
        "Editable":false,
        },
        {
        "Nombre":"Margen Neto",
        "id":'02-16',
        "idPadre":'02',
        "Moneda":false,
        "Orden":16,
        "OrdenData":16,
        "Editable":false,
        },
        {
        "Nombre":"Gasto en Gente",
        "id":'02-17',
        "Moneda":true,
        "idPadre":'02',
        "Simbolo":1,
        "OrdenData":17,
        "Orden":17,
        "Editable":true,
        },
      ],
      },
      // Flujo de Efectivo
    )

    let CategoriasByFather: any[] = [];
    let CategoriasData: any[] = [];
    let idsAgregados: Set<string> = new Set();
    
    CategoriasData.push({
      "Nombre": 'Efectivo Inicial',
      "id": "03-01",
      "idPadre":'03',
      "Orden": CategoriasData.length + 1,
      "Editable": false,
    });
    idsAgregados.add("03-01");
    this.Categorias.forEach(categ => {
      if (!idsAgregados.has(categ.id)) {
        CategoriasData.push({
          "Nombre": categ.Nombre,
          "id": categ.id,
          "Moneda":true,
          "idPadre":'03',
          "Orden": CategoriasData.length + 1,
          "Editable": false,
        });
        idsAgregados.add(categ.id);
      }



        if (categ.Tipo == 3 && categ.Orden != 10) {
          const ids = categ.Categorias.map(c => c.idCategoria);
          CategoriasByFather = this.Categorias.filter(cat =>
            ids.includes(cat.id)
          );
  
      
          CategoriasByFather.forEach(element => {
            if (!idsAgregados.has(element.id)) {
  
              CategoriasData.push({
                "Nombre": element.Nombre,
                "id": element.id,
                "Moneda":true,
                "idPadre":'03',
                "idAbuelo": categ.id,
                "Orden": CategoriasData.length + 1,
                "Editable": false,
              });
              idsAgregados.add(element.id);
            }
          });
  
        }
        
      });
      CategoriasData.push({
        "Nombre": 'Efectivo Final',
        "id": `03-${CategoriasData.length + 1}`,
        "idPadre":'03',
        "Moneda":true,
        "Orden": CategoriasData.length + 1,
        "Editable": false,
      });
      idsAgregados.add(`03-${CategoriasData.length + 1}`);
    this.CatalogoElementos.push(
      // Flujo de Efectivo
      {          
      "Nombre":"Flujo de Efectivo",
      "id":'03',
      "Mostrar":true,
      "Orden":3,
      "Elementos":CategoriasData
      }
    )

    this.CatalogoElementos.push(
      // Cuentas por Cobrar
      {          
      "Nombre":"Cuentas por Cobrar",
      "id":'04',
      "Orden":4,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo Inicial",
        "id":'04-01',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'04',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(-) Cobros",
        "id":'04-02',
        "Moneda":true,
        "Simbolo":2,
        "idPadre":'04',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(+) Nuevas ventas a crédito",
        "id":'04-03',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'04',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Saldo Final",
        "id":'04-04',
        "Moneda":true,
        "idPadre":'04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Variación",
        "id":'04-05',
        "Moneda":true,
        "idPadre":'04',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Dias de cobro",
        "id":'04-06',
        "Moneda":false,
        "idPadre":'04',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Cash dejado sobre / levantado de la mesa",
        "id":'04-07',
        "Moneda":true,
        "idPadre":'04',
        "Orden":7,
        "Editable":false,
        }
  
  
      ],
      },
      // Inventarios
      {          
      "Nombre":"Inventarios",
      "id":'05',
      "Orden":5,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Inventario Inicial",
        "id":'05-01',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'05',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Compras",
        "id":'05-02',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'05',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(-) Costo de ventas",
        "id":'05-03',
        "Moneda":true,
        "idPadre":'05',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"(=) Inventario Final",
        "id":'05-04',
        "Moneda":true,
        "idPadre":'05',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Variación",
        "id":'05-05',
        "Moneda":true,
        "idPadre":'05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Dias de inventario",
        "id":'05-06',
        "Moneda":false,
        "idPadre":'05',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Cash dejado sobre / levantado de la mesa",
        "id":'05-07',
        "Moneda":true,
        "idPadre":'05',
        "Orden":7,
        "Editable":false,
        }
  
  
      ],
      },
      // Proveedores
      {          
      "Nombre":"Proveedores",
      "id":'06',
      "Orden":6,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo inicial",
        "id":'06-01',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'06',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Compras",
        "id":'06-02',
        "Moneda":true,
        "idPadre":'06',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"(=) Saldo final",
        "id":'06-03',
        "Moneda":true,
        "idPadre":'06',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Variación",
        "id":'06-04',
        "Moneda":true,
        "idPadre":'06',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Dias de pago",
        "id":'06-05',
        "Moneda":false,
        "idPadre":'06',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Cash dejado sobre / levantado de la mesa",
        "id":'06-06',
        "Moneda":true,
        "idPadre":'06',
        "Orden":6,
        "Editable":false,
        }
  
  
      ],
      },
      // Afectación al Flujo Operativo
      {          
      "Nombre":"Afectación al Flujo Operativo",
      "id":'07',
      "Orden":7,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Mensual",
        "id":'07-01',
        "Moneda":true,
        "idPadre":'07',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"What If",
        "id":'07-02',
        "Moneda":true,
        "idPadre":'07',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Real",
        "id":'07-03',
        "Moneda":true,
        "idPadre":'07',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (What If)",
        "id":'07-04',
        "Moneda":false,
        "idPadre":'07',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (Real)",
        "id":'07-05',
        "Moneda":false,
        "idPadre":'07',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Acumulado histórico",
        "id":'07-06',
        "Moneda":true,
        "idPadre":'07',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"What If",
        "id":'07-07',
        "Moneda":true,
        "idPadre":'07',
        "Orden":7,
        "Editable":false,
        },
        {
        "Nombre":"Real",
        "Moneda":true,
        "id":'07-08',
        "idPadre":'07',
        "Orden":8,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (What If)",
        "id":'07-09',
        "Moneda":false,
        "idPadre":'07',
        "Orden":9,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (Real)",
        "id":'07-10',
        "Moneda":false,
        "idPadre":'07',
        "Orden":10,
        "Editable":false,
        },
      ],
      },

      // Activo Fijo
      {          
      "Nombre":"Activo Fijo",
      "id":'08',
      "Orden":8,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo Inicial",
        "id":'08-01',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'08',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Compras",
        "id":'08-02',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'08',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(-) Ventas",
        "id":'08-03',
        "Moneda":true,
        "idPadre":'08',
        "Simbolo":2,
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Total - Activo fijo",
        "id":'08-04',
        "Moneda":true,
        "idPadre":'08',
        "Orden":4,
        "Editable":false,
        },
        
      ],
      },

      // Otros pasivos de Corto Plazo
      {          
      "Nombre":"Otros pasivos de Corto Plazo",
      "id":'09',
      "Orden":9,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo inicial",
        "id":'09-01',
        "Moneda":true,
        "idPadre":'09',
        "Simbolo":1,
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Nueva deuda",
        "id":'09-02',
        "Moneda":true,
        "Simbolo":1,
        "idPadre":'09',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"(-) Pagos",
        "id":'09-03',
        "Moneda":true,
        "Simbolo":2,
        "idPadre":'09',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Total - Otros pasivos de corto plazo",
        "id":'09-04',
        "Moneda":true,
        "idPadre":'09',
        "Orden":4,
        "Editable":false,
        },
      ],
      },

      // Pasivos de Largo Plazo
      {          
      "Nombre":"Pasivos de Largo Plazo",
      "id":'10',
      "Mostrar":true,
      "Orden":10,
      "Elementos":[
        {
        "Nombre":"Saldo inicial",
        "id":'10-01',
        "Moneda":true,
        "idPadre":'10',
        "Simbolo":1,
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Nueva deuda",
        "id":'10-02',
        "Moneda":true,
        "idPadre":'10',
        "Simbolo":1,
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(-) Pagos",
        "id":'10-03',
        "Moneda":true,
        "idPadre":'10',
        "Simbolo":2,
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Total - Pasivos de largo plazo",
        "id":'10-04',
        "Moneda":true,
        "idPadre":'10',
        "Orden":4,
        "Editable":false,
        },
      ],
      },

      // Comparativas
      {          
      "Nombre":"Comparativas",
      "id":'11',
      "Mostrar":true,
      "Orden":11,
      "Elementos":[
        {
        "Nombre":"Flujo Libre",
        "id":'11-01',
        "Moneda":true,
        "idPadre":'11',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Utilidad neta",
        "id":'11-02',
        "Moneda":true,
        "idPadre":'11',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Cuentas por cobrar",
        "id":'11-03',
        "Moneda":true,
        "idPadre":'11',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Inventarios",
        "id":'11-04',
        "Moneda":true,
        "idPadre":'11',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Variación en las Inversiones",
        "id":'11-05',
        "Moneda":true,
        "idPadre":'11',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Proveedores",
        "id":'11-06',
        "Moneda":true,
        "idPadre":'11',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Pasivos de Largo Plazo",
        "id":'11-07',
        "Moneda":true,
        "idPadre":'11',
        "Orden":7,
        "Editable":false,
        },
      ],
      },

      // Eficiencia y control
      {          
      "Nombre":"Eficiencia y control",
      "id":'12',
      "Mostrar":true,
      "Orden":12,
      "Elementos":[
        {
        "Nombre":"Costo de ventas ($)",
        "id":'12-01',
        "Moneda":true,
        "idPadre":'12',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Compras",
        "id":'12-02',
        "Moneda":true,
        "idPadre":'12',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Días de compra",
        "id":'12-03',
        "Moneda":false,
        "idPadre":'12',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Pago a proveedores",
        "id":'12-04',
        "Moneda":true,
        "idPadre":'12',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Costo de ventas (%)",
        "id":'12-05',
        "Moneda":false,
        "idPadre":'12',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"% de los ingresos para pagar a proveedores",
        "id":'12-06',
        "idPadre":'12',
        "Moneda":false,
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Gastos de operación totales ($)",
        "id":'12-07',
        "Moneda":true,
        "idPadre":'12',
        "Orden":7,
        "Editable":false,
        },
        {
        "Nombre":"Egresos de Operación ($)",
        "id":'12-08',
        "Moneda":true,
        "idPadre":'12',
        "Orden":8,
        "Editable":false,
        },
        {
        "Nombre":"Gastos de operación totales (%)",
        "id":'12-09',
        "Moneda":false,
        "idPadre":'12',
        "Orden":9,
        "Editable":false,
        },
        {
        "Nombre":"Egresos de Operación (%)",
        "id":'12-10',
        "idPadre":'12',
        "Orden":10,
        "Editable":false,
        },
        {
        "Nombre":"Margen Bruto",
        "id":'12-11',
        "idPadre":'12',
        "Orden":11,
        "Moneda":false,
        "Editable":false,
        },
        {
        "Nombre":"Margen de Operación",
        "id":'12-12',
        "idPadre":'12',
        "Orden":12,
        "Moneda":false,
        "Editable":false,
        },
        {
        "Nombre":"Margen Neto",
        "id":'12-13',
        "idPadre":'12',
        "Orden":13,
        "Moneda":false,
        "Editable":false,
        },
        {
        "Nombre":"Inversión en Gente",
        "id":'12-14',
        "idPadre":'12',
        "Orden":14,
        "Moneda":false,
        "Editable":false,
        },
        {
        "Nombre":"Inversión en Marketing",
        "id":'12-14',
        "idPadre":'12',
        "Orden":14,
        "Moneda":false,
        "Editable":false,
        },
        {
        "Nombre":"Punto de Equilibrio Mensual",
        "id":'12-15',
        "idPadre":'12',
        "Moneda":true,
        "Orden":15,
        "Editable":false,
        },
        {
        "Nombre":"Punto de Equilibrio Semanal",
        "id":'12-16',
        "idPadre":'12',
        "Orden":16,
        "Moneda":true,
        "Editable":false,
        },
      ],
      },

      // Actividad y gestión
      {          
      "Nombre":"Actividad y gestión",
      "id":'13',
      "Orden":13,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Días de Cobro",
        "id":'13-01',
        "idPadre":'13',
        "Moneda":false,
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Días de Inventario",
        "id":'13-02',
        "idPadre":'13',
        "Moneda":false,
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Días de Pago",
        "id":'13-03',
        "idPadre":'13',
        "Moneda":false,
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Días de recuperación del efectivo",
        "id":'13-04',
        "idPadre":'13',
        "Moneda":false,
        "Orden":4,
        "Editable":false,
        }
      ],
      },

      // Actividad y gestión
      {          
      "Nombre":"Retorno y rentabilidad",
      "id":'14',
      "Mostrar":true,
      "Orden":14,
      "Elementos":[
        {
        "Nombre":"ROI en gente",
        "id":'14-01',
        "Moneda":false,
        "idPadre":'14',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"ROI de Marketing",
        "id":'14-02',
        "Moneda":false,
        "idPadre":'14',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"ROI de activos operativos",
        "id":'14-03',
        "Moneda":false,
        "idPadre":'14',
        "Orden":3,
        "Editable":false,
        }
      ],
      },

      // Liquidez y solvencia
      {          
      "Nombre":"Liquidez y solvencia",
      "id":'15',
      "Mostrar":true,
      "Orden":15,
      "Elementos":[
        {
        "Nombre":"Dinero dejado sobre / levantado de la mesa",
        "id":'15-01',
        "idPadre":'15',
        "Moneda":true,
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Liquidez",
        "id":'15-02',
        "idPadre":'15',
        "Moneda":false,
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Valor del Capital de trabajo",
        "id":'15-03',
        "idPadre":'15',
        "Moneda":true,
        "Orden":3,
        "Editable":false,
        }
      ],
      },
    )

    this.construirCabecera()

    console.log('CatalogoElementos', this.CatalogoElementos)

    setTimeout(() => {
      const table = this.containerTable.nativeElement;
      const topScroll = this.scrollTopSync.nativeElement;
      const inner = this.scrollInner.nativeElement;
    
      // Actualiza el ancho de la barra superior
      // inner.style.width = table.scrollWidth + 'px';
      inner.style.width = this.dataTable.nativeElement.scrollWidth + 'px';
    
      let isSyncingTop = false;
      let isSyncingBottom = false;
    
      topScroll.addEventListener('scroll', () => {
        if (!isSyncingBottom) {
          isSyncingTop = true;
          table.scrollLeft = topScroll.scrollLeft;
        }
        isSyncingBottom = false;
      });
    
      table.addEventListener('scroll', () => {
        if (!isSyncingTop) {
          isSyncingBottom = true;
          topScroll.scrollLeft = table.scrollLeft;
        }
        isSyncingTop = false;
      });
    }, 300);
    
    


  })
}

obtenerRegistrosStoreManagerRecapt(){
  this.conS.obtenerRegistrosStoreManagerRecapt(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Registros=resp
    console.log('Registros',this.Registros)
   
 
    
  })
}
getMonthName(Fecha: string) {
  return Number(Fecha.substring(5).substring(0, 2));
}

construirData(){
  this.DatosElementos=[]


  this.CatalogoElementos.forEach((catalogo:any) => {

    this.Cabecera.filter((cabecera:any)=>cabecera.Tipo!=1).forEach((cab:any) => {

      const copiaCatalogoElementos = [...catalogo.Elementos]
      .sort((a: any, b: any) => a.OrdenData - b.OrdenData);
      copiaCatalogoElementos.forEach((elemento:any) => {
        let RegistrosBySeccion:any=[]
        RegistrosBySeccion=this.Registros.filter((reg:any)=>reg.idCatalogo==elemento.idPadre)
        const key = `${cab.Anio}-${cab.NumMes}-${elemento.id}`; 
        if (!this.DatosElementos[key]) {
          this.DatosElementos[key] =[];
        }
        if(elemento.Editable==true){
          this.DatosElementos[`${key}`].push({ 
            "Valor":this.getValorElemento(elemento.id,cab.Anio,cab.NumMes,RegistrosBySeccion),
            "TipoNumero":this.getValorElemento(elemento.id,cab.Anio,cab.NumMes,RegistrosBySeccion)<0 ? 1 : 2
          })
        }
        else {
          //Mercadotecnia
        if(catalogo.id=='01'){ 
          if(elemento.id=='01-02'){
            let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-03`]?.[0]?.Valor
            let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-01`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 ? 0 :Valor1/Valor2,
              "TipoNumero":(Valor2 == 0 ? 0 :Valor1/Valor2)<0 ? 1 : 2
            })
          }
         else if(elemento.id=='01-05'){
            let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-03`]?.[0]?.Valor
            let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-04`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 ? 0 :Valor1/Valor2,
              "TipoNumero":(Valor2 == 0 ? 0 :Valor1/Valor2)<0 ? 1 : 2
            })
          }
         else if(elemento.id=='01-07'){
            let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-05`]?.[0]?.Valor
            let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-06`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 ? 0 :Valor1/Valor2,
              "TipoNumero":(Valor2 == 0 ? 0 :Valor1/Valor2)<0 ? 1 : 2
            })
          }
         else if(elemento.id=='01-08'){
            let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]?.Valor
            let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-07`]?.[0]?.Valor
            let Valor3= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-05`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 || Valor3 == 0  ? 0 :(Valor1/Valor2)/Valor3,
              "TipoNumero":(Valor2 == 0 || Valor3 == 0  ? 0 :(Valor1/Valor2)/Valor3)<0 ? 1 : 2
            })
          }

        }
        //Estado de Resultados
      if(catalogo.id=='02'){
          if(elemento.id=='02-01'){
            this.DatosElementos[`${key}`].push({              
              "Valor":this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]?.Valor,
              "TipoNumero":this.DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]?.Valor<1 ? 1 : 2
            })
        }
        else if(elemento.id=='02-03'){
            this.DatosElementos[`${key}`].push({              
              "Valor":
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]?.Valor,
              "TipoNumero":(
                this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor 
                +
                this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]?.Valor)<0 ? 1 : 2
            })
        }
        else if(elemento.id=='02-04'){
          let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]?.Valor
          let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 ? 0 :Valor1/Valor2,
              "TipoNumero":(Valor2 == 0 ? 0 :Valor1/Valor2)<0 ? 1 : 2
            })
        }

        else if(elemento.id=='02-08'){
          this.DatosElementos[`${key}`].push({              
            "Valor":
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]?.Valor,
            "TipoNumero":(
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]?.Valor)<0 ? 1 : 2
          })
        }

        else if(elemento.id=='02-09'){
          this.DatosElementos[`${key}`].push({              
            "Valor":
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]?.Valor,
            "TipoNumero":(
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]?.Valor)<0 ? 1 : 2
          })
        }

        else if(elemento.id=='02-10'){
          let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]?.Valor
          let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 ? 0 :Valor1/Valor2,
              "TipoNumero":(Valor2 == 0 ? 0 :Valor1/Valor2)<0 ? 1 : 2
            })
        }

        else if(elemento.id=='02-15'){
          this.DatosElementos[`${key}`].push({              
            "Valor":
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]?.Valor +
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]?.Valor + 
            this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]?.Valor,
            "TipoNumero":(
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]?.Valor +
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]?.Valor + 
              this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]?.Valor)<0 ? 1 : 2

          })
        }

        else if(elemento.id=='02-16'){
          let Valor1= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor
          let Valor2= this.DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor
            this.DatosElementos[`${key}`].push({              
              "Valor":Valor2 == 0 ? 0 :Valor1/Valor2,
              "TipoNumero":(Valor2 == 0 ? 0 :Valor1/Valor2)<0 ? 1 : 2
            })
        }


         }


        }




      })

    
    })
  
  })
  this.cargando=false
  console.log('DatosElementos',this.DatosElementos)
}


getValorElemento(idElemento:string,Anio:any,NumMes:any,Registros:any){

  let RegistroEncontrado:any=[]
  RegistroEncontrado=Registros.filter((meta:any)=>
  meta.AnioRegistro==Anio && 
  meta.NumMesRegistro==NumMes && 
  meta.idElemento==idElemento)
  if(RegistroEncontrado.length>0){
    return RegistroEncontrado[0].Valor
  }
  else {
    return 0
  }

}


  
guardarRegistro(elemento:any,Valor:any,Cab:any){
  let Fecha:any
  Fecha=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
  let ValorRegisro:any=0
  if(elemento.Simbolo==2)
    {
    ValorRegisro=Number(Valor.replace(/[\s$,\-]/g, ''))*-1

  }
  else {
    ValorRegisro=Number(Valor.replace(/[\s$,\-]/g, ''))
  }

  if (isNaN(ValorRegisro)) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "El valor debe ser numérico",
      showConfirmButton: false,
      timer: 1500
});
  }

  else {
    let Registro = 
    {
      "FechaRegistro":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
      "MesRegistro":Cab.Mes,
      "NumMesRegistro":Cab.NumMes,
      "Trimestre":Cab.Trimestre,
      "idEmpresa":this.usuario.idEmpresa,
      "FechaActualizacion":"",
      "AnioRegistro": Cab.Anio,    
      "idElemento": elemento.id,    
      "Valor": ValorRegisro,    
      "idCatalogo": elemento.idPadre   
    }
    console.log('elemento',elemento)
    console.log('Registro',Registro)

    this.conS.guardarOModificarRegistro(Registro).then(resp=>{
      this.toastr.success('Guardado', '¡Exito!');
    })

  }




}

}
