// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manager-recap-mensual',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './manager-recap-mensual.component.html',
  styleUrls: ['./manager-recap-mensual.component.scss']
})
export default class ManagerRecapMensualComponent implements OnInit {
  constructor(private conS:ConfigurationService){}
  Cabecera:any=[]
  Categorias:any=[]
  CatalogoElementos:any=[]
  Meses:any=[]
  Anios:any=[]
  cargando:boolean=true
  ngOnInit(): void {
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

  this.Anios.forEach((anio:any) => {
   this.Meses.forEach((mes:any) => {
    this.Cabecera.push({
      "Nombre": mes.Mes + " " + anio.Anio,
      "Mes":mes.Mes,
      "NumMes":mes.NumMes,
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
  this.cargando=false
  console.log('Cabecera',this.Cabecera)
}

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
    console.log('Categorias',this.Categorias)

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
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(X) % de Conversión",
        "id":'01-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"(=) Clientes Nuevos",
        "id":'01-03',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(+) Clientes Existentes",
        "id":'01-04',
        "Orden":4,
        "Editable":true,
        },
        {
        "Nombre":"(=) Clientes Totales",
        "id":'01-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Transacciones Totales",
        "id":'01-06',
        "Orden":6,
        "Editable":true,
        },
        {
        "Nombre":"(X) Transacciones Promedio",
        "id":'01-07',
        "Orden":7,
        "Editable":false,
        },
        {
        "Nombre":"(X) Monto Promedio de Venta",
        "id":'01-08',
        "Orden":8,
        "Editable":false,
        },
        {
        "Nombre":"(=) Ventas Netas",
        "id":'01-09',
        "Orden":9,
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
        "id":'02-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"(-) Costo de ventas",
        "id":'02-02',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(=) Utilidad Bruta",
        "id":'02-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Margen Bruto",
        "id":'02-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"(-) Gastos de Ventas y Mkt",
        "id":'02-05',
        "Orden":5,
        "Editable":true,
        },
        {
        "Nombre":"(-) Gastos de Operación",
        "id":'02-06',
        "Orden":6,
        "Editable":true,
        },
        {
        "Nombre":"(-) Gastos de Administración",
        "id":'02-07',
        "Orden":7,
        "Editable":true,
        },
        {
        "Nombre":"Total gastos de operación",
        "id":'02-08',
        "Orden":8,
        "Editable":false,
        },
        {
        "Nombre":"(=) EBITDA",
        "id":'02-09',
        "Orden":9,
        "Editable":false,
        },
        {
        "Nombre":"Margen de Operación",
        "id":'02-10',
        "Orden":10,
        "Editable":false,
        },
        {
        "Nombre":"Margen de Operación",
        "id":'02-11',
        "Orden":11,
        "Editable":false,
        },
        {
        "Nombre":"(-) Intereses",
        "id":'02-12',
        "Orden":12,
        "Editable":true,
        },
        {
        "Nombre":"(-) Impuestos",
        "id":'02-13',
        "Orden":13,
        "Editable":true,
        },
        {
        "Nombre":"(-) Depreciación",
        "id":'02-14',
        "Orden":14,
        "Editable":true,
        },
        {
        "Nombre":"(-) Amortización",
        "id":'02-15',
        "Orden":15,
        "Editable":true,
        },
        {
        "Nombre":"(=) Utilidad Neta",
        "id":'02-16',
        "Orden":16,
        "Editable":false,
        },
        {
        "Nombre":"Margen Neto",
        "id":'02-17',
        "Orden":17,
        "Editable":false,
        },
        {
        "Nombre":"Gasto en Gente",
        "id":'02-18',
        "Orden":18,
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
      "Orden": CategoriasData.length + 1,
      "Editable": false,
    });
    idsAgregados.add("03-01");
    this.Categorias.forEach(categ => {
      if (!idsAgregados.has(categ.id)) {
        CategoriasData.push({
          "Nombre": categ.Nombre,
          "id": categ.id,
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
                "idPadre": categ.id,
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
        "Orden": CategoriasData.length + 1,
        "Editable": false,
      });
      idsAgregados.add(`03-${CategoriasData.length + 1}`);
    this.CatalogoElementos.push(
      // Mercadotecnia
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
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(-) Cobros",
        "id":'04-02',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(+) Nuevas ventas a crédito",
        "id":'04-03',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Saldo Final",
        "id":'04-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Variación",
        "id":'04-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Dias de cobro",
        "id":'04-06',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Cash dejado sobre / levantado de la mesa",
        "id":'04-07',
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
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Compras",
        "id":'05-02',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(-) Costo de ventas",
        "id":'05-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"(=) Inventario Final",
        "id":'05-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Variación",
        "id":'05-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Dias de inventario",
        "id":'05-06',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Cash dejado sobre / levantado de la mesa",
        "id":'05-07',
        "Orden":7,
        "Editable":false,
        }
  
  
      ],
      },
      // Proveedores
      {          
      "Nombre":"Proveedores",
      "id":'07',
      "Orden":7,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo inicial",
        "id":'07-01',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Compras",
        "id":'07-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"(=) Saldo final",
        "id":'07-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Variación",
        "id":'07-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Dias de pago",
        "id":'07-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Cash dejado sobre / levantado de la mesa",
        "id":'07-06',
        "Orden":6,
        "Editable":false,
        }
  
  
      ],
      },
      // Afectación al Flujo Operativo
      {          
      "Nombre":"Afectación al Flujo Operativo",
      "id":'08',
      "Orden":8,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Mensual",
        "id":'08-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"What If",
        "id":'08-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Real",
        "id":'08-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (What If)",
        "id":'08-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (Real)",
        "id":'08-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Acumulado histórico",
        "id":'08-06',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"What If",
        "id":'08-07',
        "Orden":7,
        "Editable":false,
        },
        {
        "Nombre":"Real",
        "id":'08-08',
        "Orden":8,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (What If)",
        "id":'08-09',
        "Orden":9,
        "Editable":false,
        },
        {
        "Nombre":"Factor de conversión a efectivo (Real)",
        "id":'08-10',
        "Orden":10,
        "Editable":false,
        },
      ],
      },

      // Activo Fijo
      {          
      "Nombre":"Activo Fijo",
      "id":'09',
      "Orden":9,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo Inicial",
        "id":'09-01',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Compras",
        "id":'09-02',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(-) Ventas",
        "id":'09-03',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Total - Activo fijo",
        "id":'09-04',
        "Orden":4,
        "Editable":true,
        },
        
      ],
      },

      // Otros pasivos de Corto Plazo
      {          
      "Nombre":"Otros pasivos de Corto Plazo",
      "id":'10',
      "Orden":10,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Saldo inicial",
        "id":'10-01',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Nueva deuda",
        "id":'10-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"(-) Pagos",
        "id":'10-03',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Total - Otros pasivos de corto plazo",
        "id":'10-04',
        "Orden":4,
        "Editable":false,
        },
      ],
      },

      // Pasivos de Largo Plazo
      {          
      "Nombre":"Pasivos de Largo Plazo",
      "id":'11',
      "Mostrar":true,
      "Orden":11,
      "Elementos":[
        {
        "Nombre":"Saldo inicial",
        "id":'11-01',
        "Orden":1,
        "Editable":true,
        },
        {
        "Nombre":"(+) Nueva deuda",
        "id":'11-02',
        "Orden":2,
        "Editable":true,
        },
        {
        "Nombre":"(-) Pagos",
        "id":'11-03',
        "Orden":3,
        "Editable":true,
        },
        {
        "Nombre":"(=) Total - Pasivos de largo plazo",
        "id":'11-04',
        "Orden":4,
        "Editable":false,
        },
      ],
      },

      // Comparativas
      {          
      "Nombre":"Comparativas",
      "id":'12',
      "Mostrar":true,
      "Orden":12,
      "Elementos":[
        {
        "Nombre":"Flujo Libre",
        "id":'12-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Utilidad neta",
        "id":'12-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Cuentas por cobrar",
        "id":'12-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Inventarios",
        "id":'12-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Variación en las Inversiones",
        "id":'12-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Proveedores",
        "id":'12-06',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Variación en Pasivos de Largo Plazo",
        "id":'12-07',
        "Orden":7,
        "Editable":false,
        },
      ],
      },

      // Eficiencia y control
      {          
      "Nombre":"Eficiencia y control",
      "id":'13',
      "Mostrar":true,
      "Orden":13,
      "Elementos":[
        {
        "Nombre":"Costo de ventas ($)",
        "id":'13-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Compras",
        "id":'13-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Días de compra",
        "id":'13-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Pago a proveedores",
        "id":'13-04',
        "Orden":4,
        "Editable":false,
        },
        {
        "Nombre":"Costo de ventas (%)",
        "id":'13-05',
        "Orden":5,
        "Editable":false,
        },
        {
        "Nombre":"% de los ingresos para pagar a proveedores",
        "id":'13-06',
        "Orden":6,
        "Editable":false,
        },
        {
        "Nombre":"Gastos de operación totales ($)",
        "id":'13-07',
        "Orden":7,
        "Editable":false,
        },
        {
        "Nombre":"Egresos de Operación ($)",
        "id":'13-08',
        "Orden":8,
        "Editable":false,
        },
        {
        "Nombre":"Gastos de operación totales (%)",
        "id":'13-09',
        "Orden":9,
        "Editable":false,
        },
        {
        "Nombre":"Egresos de Operación (%)",
        "id":'13-10',
        "Orden":10,
        "Editable":false,
        },
        {
        "Nombre":"Margen Bruto",
        "id":'13-11',
        "Orden":11,
        "Editable":false,
        },
        {
        "Nombre":"Margen de Operación",
        "id":'13-12',
        "Orden":12,
        "Editable":false,
        },
        {
        "Nombre":"Margen Neto",
        "id":'13-13',
        "Orden":13,
        "Editable":false,
        },
        {
        "Nombre":"Inversión en Gente",
        "id":'13-14',
        "Orden":14,
        "Editable":false,
        },
        {
        "Nombre":"Inversión en Marketing",
        "id":'13-14',
        "Orden":14,
        "Editable":false,
        },
        {
        "Nombre":"Punto de Equilibrio Mensual",
        "id":'13-15',
        "Orden":15,
        "Editable":false,
        },
        {
        "Nombre":"Punto de Equilibrio Semanal",
        "id":'13-16',
        "Orden":16,
        "Editable":false,
        },
      ],
      },

      // Actividad y gestión
      {          
      "Nombre":"Actividad y gestión",
      "id":'14',
      "Orden":14,
      "Mostrar":true,
      "Elementos":[
        {
        "Nombre":"Días de Cobro",
        "id":'14-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Días de Inventario",
        "id":'14-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Días de Pago",
        "id":'14-03',
        "Orden":3,
        "Editable":false,
        },
        {
        "Nombre":"Días de recuperación del efectivo",
        "id":'14-04',
        "Orden":4,
        "Editable":false,
        }
      ],
      },

      // Actividad y gestión
      {          
      "Nombre":"Retorno y rentabilidad",
      "id":'15',
      "Mostrar":true,
      "Orden":15,
      "Elementos":[
        {
        "Nombre":"ROI en gente",
        "id":'15-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"ROI de Marketing",
        "id":'15-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"ROI de activos operativos",
        "id":'15-03',
        "Orden":3,
        "Editable":false,
        }
      ],
      },

      // Liquidez y solvencia
      {          
      "Nombre":"Liquidez y solvencia",
      "id":'16',
      "Mostrar":true,
      "Orden":16,
      "Elementos":[
        {
        "Nombre":"Dinero dejado sobre / levantado de la mesa",
        "id":'16-01',
        "Orden":1,
        "Editable":false,
        },
        {
        "Nombre":"Liquidez",
        "id":'16-02',
        "Orden":2,
        "Editable":false,
        },
        {
        "Nombre":"Valor del Capital de trabajo",
        "id":'16-03',
        "Orden":3,
        "Editable":false,
        }
      ],
      },
    )
    console.log('CatalogoElementos', this.CatalogoElementos);
    this.construirCabecera()


  })
}
  

}
