
// Preguntar sobre Factor de conversión a efectivo (What If)
// Preguntar sobre Pagos en Proveedores
// Pago a proveedores / Eficiencia y control
// % de los ingresos para pagar a proveedores
// Egresos de Operación (%)

// Agregar (-) Pago a proveedores a Cuentas Padre
// % de los ingresos para operar
// % de los ingresos para pagar a proveedores


// Apuntes de 2025-04-21
// No crear mas cuentas bajo el padre Egresos de Operacion, solamente Pago a Proveedores y Costos de la Operación
// Pago a Proveedores tendrá los hijos fijos: Facturas vencidas en meses anteriores, facturas vencidas en el mes en curso y facturas con vencimiento en meses futuros
// Costos de la operación tendrá hijos dinámicos: Creados por el usuario.

// Modulo de Registro mostrar columna de nietos solamente si se elige el Padre Egresos de Operación

// Store Manager Recapt:
// Costos de la operación: Sumatoria de las cuentas bajo este padre
//% de los ingresos para operar : Division del cos
// Pago a proveedores: Sumatoria de las cuentas bajo este padre

// Todo será visible y calculado.
[
    {
        "Nombre": "Mercadotecnia",
        "id": "01",
        "Mostrar": true,
        "Orden": 1,
        "Elementos": [
            {
                "Nombre": "Prospectos",
                "id": "01-01",
                "idPadre": "01",
                "Moneda": false,
                "Simbolo": 1,
                "Orden": 1,
                "OrdenData": 1,
                "Editable": true
            },
            {
                "Nombre": "(X) % de Conversión",
                "id": "01-02",
                "OrdenData": 3,
                "idPadre": "01",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "(=) Clientes Nuevos",
                "id": "01-03",
                "OrdenData": 2,
                "idPadre": "01",
                "Moneda": false,
                "Simbolo": 1,
                "Orden": 3,
                "Editable": true
            },
            {
                "Nombre": "(+) Clientes Existentes",
                "id": "01-04",
                "OrdenData": 4,
                "Moneda": false,
                "idPadre": "01",
                "Simbolo": 1,
                "Orden": 4,
                "Editable": true
            },
            {
                "Nombre": "(=) Clientes Totales",
                "id": "01-05",
                "idPadre": "01",
                "OrdenData": 5,
                "Moneda": false,
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "Transacciones Totales",
                "id": "01-06",
                "idPadre": "01",
                "OrdenData": 6,
                "Simbolo": 1,
                "Moneda": false,
                "Orden": 6,
                "Editable": true
            },
            {
                "Nombre": "(X) Transacciones Promedio",
                "id": "01-07",
                "idPadre": "01",
                "OrdenData": 7,
                "Moneda": false,
                "Orden": 7,
                "Editable": false
            },
            {
                "Nombre": "(X) Monto Promedio de Venta",
                "id": "01-08",
                "idPadre": "01",
                "Moneda": true,
                "Orden": 8,
                "OrdenData": 9,
                "Editable": false
            },
            {
                "Nombre": "(=) Ventas Netas",
                "id": "01-09",
                "OrdenData": 8,
                "idPadre": "01",
                "Simbolo": 1,
                "Orden": 9,
                "Moneda": true,
                "Editable": true
            }
        ]
    },
    {
        "Nombre": "Estado de Resultados",
        "id": "02",
        "Orden": 2,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Ventas",
                "Moneda": true,
                "OrdenData": 1,
                "id": "02-01",
                "idPadre": "02",
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "(-) Costo de ventas",
                "id": "02-02",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "Orden": 2,
                "OrdenData": 2,
                "Editable": true
            },
            {
                "Nombre": "(=) Utilidad Bruta",
                "id": "02-03",
                "Moneda": true,
                "OrdenData": 3,
                "idPadre": "02",
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "Margen Bruto",
                "id": "02-04",
                "Moneda": false,
                "idPadre": "02",
                "Orden": 4,
                "OrdenData": 4,
                "Editable": false
            },
            {
                "Nombre": "(-) Gastos de Ventas y Mkt",
                "id": "02-05",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "Orden": 5,
                "OrdenData": 5,
                "Editable": true
            },
            {
                "Nombre": "(-) Gastos de Operación",
                "id": "02-06",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "Orden": 6,
                "OrdenData": 6,
                "Editable": true
            },
            {
                "Nombre": "(-) Gastos de Administración",
                "id": "02-07",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "OrdenData": 7,
                "Orden": 7,
                "Editable": true
            },
            {
                "Nombre": "Total gastos de operación",
                "id": "02-08",
                "Moneda": true,
                "idPadre": "02",
                "Orden": 8,
                "OrdenData": 8,
                "Editable": false
            },
            {
                "Nombre": "(=) EBITDA",
                "id": "02-09",
                "Moneda": true,
                "idPadre": "02",
                "Orden": 9,
                "OrdenData": 9,
                "Editable": false
            },
            {
                "Nombre": "Margen de Operación",
                "id": "02-10",
                "Moneda": false,
                "idPadre": "02",
                "Orden": 10,
                "OrdenData": 10,
                "Editable": false
            },
            {
                "Nombre": "(-) Intereses",
                "id": "02-11",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "Orden": 11,
                "OrdenData": 11,
                "Editable": true
            },
            {
                "Nombre": "(-) Impuestos",
                "id": "02-12",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "Orden": 12,
                "OrdenData": 12,
                "Editable": true
            },
            {
                "Nombre": "(-) Depreciación",
                "id": "02-13",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "OrdenData": 13,
                "Orden": 13,
                "Editable": true
            },
            {
                "Nombre": "(-) Amortización",
                "id": "02-14",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 2,
                "OrdenData": 14,
                "Orden": 14,
                "Editable": true
            },
            {
                "Nombre": "(=) Utilidad Neta",
                "id": "02-15",
                "Moneda": true,
                "idPadre": "02",
                "Orden": 15,
                "OrdenData": 15,
                "Editable": false
            },
            {
                "Nombre": "Margen Neto",
                "id": "02-16",
                "idPadre": "02",
                "Moneda": false,
                "Orden": 16,
                "OrdenData": 16,
                "Editable": false
            },
            {
                "Nombre": "Gasto en Gente",
                "id": "02-17",
                "Moneda": true,
                "idPadre": "02",
                "Simbolo": 1,
                "OrdenData": 17,
                "Orden": 17,
                "Editable": true
            }
        ]
    },
    {
        "Nombre": "Flujo de Efectivo",
        "id": "03",
        "Mostrar": true,
        "Orden": 3,
        "Elementos": [
            {
                "Nombre": "Efectivo Inicial",
                "id": "03-01",
                "idPadre": "03",
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "1. Flujo de efectivo Operativo",
                "id": "EESGPM4hWXvDlXSRnCwA",
                "Moneda": true,
                "Tipo": "Abuelo",
                "idPadre": "03",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "1.1 Ingresos de Operación",
                "id": "od11V2OHVgaLG1RiXMiz",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "EESGPM4hWXvDlXSRnCwA",
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "1.2 Egresos de Operación",
                "id": "KtA2Cxpd79TJrW9afqR9",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "EESGPM4hWXvDlXSRnCwA",
                "Orden": 4,
                "Editable": false
            },
            {
                "Nombre": "% de los ingresos para operar",
                "id": "03-5",
                "Moneda": false,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "EESGPM4hWXvDlXSRnCwA",
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "(-) Pago a proveedores",
                "id": "03-6",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "EESGPM4hWXvDlXSRnCwA",
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "% de los ingresos para pagar a proveedores",
                "id": "03-7",
                "Moneda": false,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "EESGPM4hWXvDlXSRnCwA",
                "Orden": 7,
                "Editable": false
            },
            {
                "Nombre": "Factor de conversión a efectivo operativo",
                "id": "03-8",
                "Moneda": false,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "EESGPM4hWXvDlXSRnCwA",
                "Orden": 8,
                "Editable": false
            },
            {
                "Nombre": "2. Flujo de efectivo de Inversión",
                "id": "GMzSuF04XQBsPmAkIB2C",
                "Moneda": true,
                "Tipo": "Abuelo",
                "idPadre": "03",
                "Orden": 9,
                "Editable": false
            },
            {
                "Nombre": "2.1 Ingresos de Inversión",
                "id": "JeFc3TNWBgrgubNPmDYU",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "GMzSuF04XQBsPmAkIB2C",
                "Orden": 10,
                "Editable": false
            },
            {
                "Nombre": "2.2 Egresos de Inversión",
                "id": "KNlKzH3EbD5QcXVAnbwe",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "GMzSuF04XQBsPmAkIB2C",
                "Orden": 11,
                "Editable": false
            },
            {
                "Nombre": "3. Flujo de efectivo Financiero",
                "id": "psmpY6iyDJNkW7AKFXgK",
                "Moneda": true,
                "Tipo": "Abuelo",
                "idPadre": "03",
                "Orden": 12,
                "Editable": false
            },
            {
                "Nombre": "3.1 Ingresos Financieros",
                "id": "jhtHzgzTXRPgCnWDqsUM",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "psmpY6iyDJNkW7AKFXgK",
                "Orden": 13,
                "Editable": false
            },
            {
                "Nombre": "3.2 Egresos Financieros",
                "id": "2sAJKELNPwwAuAbU6Vlw",
                "Moneda": true,
                "Tipo": "Padre",
                "idPadre": "03",
                "idAbuelo": "psmpY6iyDJNkW7AKFXgK",
                "Orden": 14,
                "Editable": false
            },
            {
                "Nombre": "Flujo de Efectivo Neto",
                "id": "VmmQpdpunMTqkoSjhzzj",
                "Moneda": true,
                "Tipo": "Abuelo",
                "idPadre": "03",
                "Orden": 15,
                "Editable": false
            },
            {
                "Nombre": "Efectivo Final",
                "id": "03-16",
                "idPadre": "03",
                "Moneda": true,
                "Orden": 16,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Cuentas por Cobrar",
        "id": "04",
        "Orden": 4,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Saldo Inicial",
                "id": "04-01",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "04",
                "Orden": 1,
                "Editable": true
            },
            {
                "Nombre": "(-) Cobros",
                "id": "04-02",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "04",
                "Orden": 2,
                "Editable": true
            },
            {
                "Nombre": "(+) Nuevas ventas a crédito",
                "id": "04-03",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "04",
                "Orden": 3,
                "Editable": true
            },
            {
                "Nombre": "(=) Saldo Final",
                "id": "04-04",
                "Moneda": true,
                "idPadre": "04",
                "Orden": 4,
                "Editable": false
            },
            {
                "Nombre": "Variación",
                "id": "04-05",
                "Moneda": true,
                "idPadre": "04",
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "Dias de cobro",
                "id": "04-06",
                "Moneda": false,
                "idPadre": "04",
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "Cash dejado sobre / levantado de la mesa",
                "id": "04-07",
                "Moneda": true,
                "idPadre": "04",
                "Orden": 7,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Inventarios",
        "id": "05",
        "Orden": 5,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Inventario Inicial",
                "id": "05-01",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "05",
                "Orden": 1,
                "Editable": true
            },
            {
                "Nombre": "(+) Compras",
                "id": "05-02",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "05",
                "Orden": 2,
                "Editable": true
            },
            {
                "Nombre": "(-) Costo de ventas",
                "id": "05-03",
                "Moneda": true,
                "idPadre": "05",
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "(=) Inventario Final",
                "id": "05-04",
                "Moneda": true,
                "idPadre": "05",
                "Orden": 4,
                "Editable": false
            },
            {
                "Nombre": "Variación",
                "id": "05-05",
                "Moneda": true,
                "idPadre": "05",
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "Dias de inventario",
                "id": "05-06",
                "Moneda": false,
                "idPadre": "05",
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "Cash dejado sobre / levantado de la mesa",
                "id": "05-07",
                "Moneda": true,
                "idPadre": "05",
                "Orden": 7,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Proveedores",
        "id": "06",
        "Orden": 6,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Saldo inicial",
                "id": "06-01",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "06",
                "Orden": 1,
                "Editable": true
            },
            {
                "Nombre": "(+) Compras",
                "id": "06-02",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "06",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "(-) Pagos",
                "id": "06-03",
                "Moneda": true,
                "idPadre": "06",
                "Simbolo": 2,
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "(=) Saldo final",
                "id": "06-04",
                "Moneda": true,
                "idPadre": "06",
                "Orden": 4,
                "Editable": false
            },
            {
                "Nombre": "Variación",
                "id": "06-05",
                "Moneda": true,
                "idPadre": "06",
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "Dias de pago",
                "id": "06-06",
                "Moneda": false,
                "idPadre": "06",
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "Cash dejado sobre / levantado de la mesa",
                "id": "06-07",
                "Moneda": true,
                "idPadre": "06",
                "Orden": 7,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Afectación al Flujo Operativo",
        "id": "07",
        "Orden": 7,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Mensual",
                "id": "07-01",
                "Moneda": true,
                "idPadre": "07",
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "What If",
                "id": "07-02",
                "Moneda": true,
                "idPadre": "07",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "Real",
                "id": "07-03",
                "Moneda": true,
                "idPadre": "07",
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "Factor de conversión a efectivo (What If)",
                "id": "07-04",
                "Moneda": false,
                "idPadre": "07",
                "Orden": 4,
                "Editable": false
            },
            {
                "Nombre": "Factor de conversión a efectivo (Real)",
                "id": "07-05",
                "Moneda": false,
                "idPadre": "07",
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "Acumulado histórico",
                "id": "07-06",
                "Moneda": true,
                "idPadre": "07",
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "What If",
                "id": "07-07",
                "Moneda": true,
                "idPadre": "07",
                "Orden": 7,
                "Editable": false
            },
            {
                "Nombre": "Real",
                "Moneda": true,
                "id": "07-08",
                "idPadre": "07",
                "Orden": 8,
                "Editable": false
            },
            {
                "Nombre": "Factor de conversión a efectivo (What If)",
                "id": "07-09",
                "Moneda": false,
                "idPadre": "07",
                "Orden": 9,
                "Editable": false
            },
            {
                "Nombre": "Factor de conversión a efectivo (Real)",
                "id": "07-10",
                "Moneda": false,
                "idPadre": "07",
                "Orden": 10,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Activo Fijo",
        "id": "08",
        "Orden": 8,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Saldo Inicial",
                "id": "08-01",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "08",
                "Orden": 1,
                "Editable": true
            },
            {
                "Nombre": "(+) Compras",
                "id": "08-02",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "08",
                "Orden": 2,
                "Editable": true
            },
            {
                "Nombre": "(-) Ventas",
                "id": "08-03",
                "Moneda": true,
                "idPadre": "08",
                "Simbolo": 2,
                "Orden": 3,
                "Editable": true
            },
            {
                "Nombre": "(=) Total - Activo fijo",
                "id": "08-04",
                "Moneda": true,
                "idPadre": "08",
                "Orden": 4,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Otros pasivos de Corto Plazo",
        "id": "09",
        "Orden": 9,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Saldo inicial",
                "id": "09-01",
                "Moneda": true,
                "idPadre": "09",
                "Simbolo": 1,
                "Orden": 1,
                "Editable": true
            },
            {
                "Nombre": "(+) Nueva deuda",
                "id": "09-02",
                "Moneda": true,
                "Simbolo": 1,
                "idPadre": "09",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "(-) Pagos",
                "id": "09-03",
                "Moneda": true,
                "Simbolo": 2,
                "idPadre": "09",
                "Orden": 3,
                "Editable": true
            },
            {
                "Nombre": "(=) Total - Otros pasivos de corto plazo",
                "id": "09-04",
                "Moneda": true,
                "idPadre": "09",
                "Orden": 4,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Pasivos de Largo Plazo",
        "id": "10",
        "Mostrar": true,
        "Orden": 10,
        "Elementos": [
            {
                "Nombre": "Saldo inicial",
                "id": "10-01",
                "Moneda": true,
                "idPadre": "10",
                "Simbolo": 1,
                "Orden": 1,
                "Editable": true
            },
            {
                "Nombre": "(+) Nueva deuda",
                "id": "10-02",
                "Moneda": true,
                "idPadre": "10",
                "Simbolo": 1,
                "Orden": 2,
                "Editable": true
            },
            {
                "Nombre": "(-) Pagos",
                "id": "10-03",
                "Moneda": true,
                "idPadre": "10",
                "Simbolo": 2,
                "Orden": 3,
                "Editable": true
            },
            {
                "Nombre": "(=) Total - Pasivos de largo plazo",
                "id": "10-04",
                "Moneda": true,
                "idPadre": "10",
                "Orden": 4,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Comparativas",
        "id": "11",
        "Mostrar": true,
        "Orden": 11,
        "Elementos": [
            {
                "Nombre": "Flujo Libre",
                "id": "11-01",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "Utilidad neta",
                "id": "11-02",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "Variación en Cuentas por cobrar",
                "id": "11-03",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "Variación en Inventarios",
                "id": "11-04",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 4,
                "Editable": false
            },
            {
                "Nombre": "Variación en las Inversiones",
                "id": "11-05",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 5,
                "Editable": false
            },
            {
                "Nombre": "Variación en Proveedores",
                "id": "11-06",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "Variación en Pasivos de Largo Plazo",
                "id": "11-07",
                "Moneda": true,
                "idPadre": "11",
                "Orden": 7,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Eficiencia y control",
        "id": "12",
        "Mostrar": true,
        "Orden": 12,
        "Elementos": [
            {
                "Nombre": "Costo de ventas ($)",
                "id": "12-01",
                "Moneda": true,
                "idPadre": "12",
                "Orden": 1,
                "OrdenData": 1,
                "Editable": false
            },
            {
                "Nombre": "Compras",
                "id": "12-02",
                "Moneda": true,
                "idPadre": "12",
                "Orden": 2,
                "OrdenData": 2,
                "Editable": false
            },
            {
                "Nombre": "Días de compra",
                "id": "12-03",
                "Moneda": false,
                "idPadre": "12",
                "Orden": 3,
                "OrdenData": 3,
                "Editable": false
            },
            {
                "Nombre": "Pago a proveedores",
                "id": "12-04",
                "Moneda": true,
                "idPadre": "12",
                "Orden": 4,
                "OrdenData": 4,
                "Editable": false
            },
            {
                "Nombre": "Costo de ventas (%)",
                "id": "12-05",
                "Moneda": false,
                "idPadre": "12",
                "Orden": 5,
                "OrdenData": 11,
                "Editable": false
            },
            {
                "Nombre": "% de los ingresos para pagar a proveedores",
                "id": "12-06",
                "idPadre": "12",
                "Moneda": false,
                "OrdenData": 6,
                "Orden": 6,
                "Editable": false
            },
            {
                "Nombre": "Gastos de operación totales ($)",
                "id": "12-07",
                "Moneda": true,
                "OrdenData": 7,
                "idPadre": "12",
                "Orden": 7,
                "Editable": false
            },
            {
                "Nombre": "Egresos de Operación ($)",
                "id": "12-08",
                "Moneda": true,
                "idPadre": "12",
                "Orden": 8,
                "OrdenData": 8,
                "Editable": false
            },
            {
                "Nombre": "Gastos de operación totales (%)",
                "id": "12-09",
                "Moneda": false,
                "idPadre": "12",
                "Orden": 9,
                "OrdenData": 9,
                "Editable": false
            },
            {
                "Nombre": "Egresos de Operación (%)",
                "id": "12-10",
                "idPadre": "12",
                "Orden": 10,
                "OrdenData": 10,
                "Editable": false
            },
            {
                "Nombre": "Margen Bruto",
                "id": "12-11",
                "idPadre": "12",
                "Orden": 11,
                "OrdenData": 5,
                "Moneda": false,
                "Editable": false
            },
            {
                "Nombre": "Margen de Operación",
                "id": "12-12",
                "idPadre": "12",
                "Orden": 12,
                "OrdenData": 12,
                "Moneda": false,
                "Editable": false
            },
            {
                "Nombre": "Margen Neto",
                "id": "12-13",
                "idPadre": "12",
                "Orden": 13,
                "OrdenData": 13,
                "Moneda": false,
                "Editable": false
            },
            {
                "Nombre": "Inversión en Gente",
                "id": "12-14",
                "idPadre": "12",
                "Orden": 14,
                "OrdenData": 14,
                "Moneda": false,
                "Editable": false
            },
            {
                "Nombre": "Inversión en Marketing",
                "id": "12-15",
                "idPadre": "12",
                "Orden": 15,
                "OrdenData": 15,
                "Moneda": false,
                "Editable": false
            },
            {
                "Nombre": "Punto de Equilibrio Mensual",
                "id": "12-16",
                "idPadre": "12",
                "Moneda": true,
                "Orden": 16,
                "OrdenData": 16,
                "Editable": false
            },
            {
                "Nombre": "Punto de Equilibrio Semanal",
                "id": "12-17",
                "idPadre": "12",
                "Orden": 17,
                "OrdenData": 17,
                "Moneda": true,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Actividad y gestión",
        "id": "13",
        "Orden": 13,
        "Mostrar": true,
        "Elementos": [
            {
                "Nombre": "Días de Cobro",
                "id": "13-01",
                "idPadre": "13",
                "Moneda": false,
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "Días de Inventario",
                "id": "13-02",
                "idPadre": "13",
                "Moneda": false,
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "Días de Pago",
                "id": "13-03",
                "idPadre": "13",
                "Moneda": false,
                "Orden": 3,
                "Editable": false
            },
            {
                "Nombre": "Días de recuperación del efectivo",
                "id": "13-04",
                "idPadre": "13",
                "Moneda": false,
                "Orden": 4,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Retorno y rentabilidad",
        "id": "14",
        "Mostrar": true,
        "Orden": 14,
        "Elementos": [
            {
                "Nombre": "ROI en gente",
                "id": "14-01",
                "Moneda": false,
                "idPadre": "14",
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "ROI de Marketing",
                "id": "14-02",
                "Moneda": false,
                "idPadre": "14",
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "ROI de activos operativos",
                "id": "14-03",
                "Moneda": false,
                "idPadre": "14",
                "Orden": 3,
                "Editable": false
            }
        ]
    },
    {
        "Nombre": "Liquidez y solvencia",
        "id": "15",
        "Mostrar": true,
        "Orden": 15,
        "Elementos": [
            {
                "Nombre": "Dinero dejado sobre / levantado de la mesa",
                "id": "15-01",
                "idPadre": "15",
                "Moneda": true,
                "Orden": 1,
                "Editable": false
            },
            {
                "Nombre": "Liquidez",
                "id": "15-02",
                "idPadre": "15",
                "Moneda": false,
                "Orden": 2,
                "Editable": false
            },
            {
                "Nombre": "Valor del Capital de trabajo",
                "id": "15-03",
                "idPadre": "15",
                "Moneda": true,
                "Orden": 3,
                "Editable": false
            }
        ]
    }
]