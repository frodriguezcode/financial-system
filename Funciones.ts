    // formato: 1- Moneda, 2- Porcentaje, 3- Normal
    // tipo_numero: 1- Positivo, 2- Negativo, 3- Dinamico
                formato:elemento.formato,
                tipo_numero:elemento.tipo_numero,

              let Valor = getValorElemento(
              elemento.id,
              cab.Anio,
              cab.NumMes,
              RegistrosBySeccion
              );

            if (elemento.editable == true) 
            {
              let Valor = getValorElemento(
              elemento.id,
              cab.Anio,
              cab.NumMes,
              RegistrosBySeccion
              );  

              if(elemento.id=='01-04' && cab.NumMes!=1){
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes-1}-01-05`]?.[0]?.Valor || 0;
              DatosElementos[`${key}`].push({
                Valor: Valor,
                ValorMostrar: Valor,
                TipoNumero: Valor,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                formato:elemento.formato,
                tipo_numero:elemento.tipo_numero,                
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor,
                ValorMostrar: Valor,
                TipoNumero: (Valor) < 0 ? 1 : 2,
                Lectura: true,
              }); 
              }
              else if(elemento.id=='01-04' && cab.NumMes==1){
               let Valor = getValorElemento(
                elemento.id,
                cab.Anio,
                cab.NumMes,
                RegistrosBySeccion
               );
               DatosElementos[`${key}`].push({
                Valor: getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ),
              TipoNumero:
                getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ) < 0
                  ? 1
                  : 2,
              ValorMostrar: Number(Valor.toFixed(0)).toLocaleString("en-US"),
              Lectura: false,
               });
               RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                formato:elemento.formato,
                tipo_numero:elemento.tipo_numero,                
                idElemento: elemento.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ),
                TipoNumero:
                  getValorElemento(
                    elemento.id,
                    cab.Anio,
                    cab.NumMes,
                    RegistrosBySeccion
                  ) < 0
                    ? 1
                    : 2,
                ValorMostrar: Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
              });

          
              }              
              else if (elemento.formato == 1)
              {

                DatosElementos[`${key}`].push({
                Valor: Valor,
                TipoNumero: 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "-$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
                });

                RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                formato:elemento.formato,
                tipo_numero:elemento.tipo_numero,                
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor,
                TipoNumero: 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
                });                 
              }
              else if (elemento.formato == 3)
              {


                DatosElementos[`${key}`].push({
                Valor: Valor,
                TipoNumero: 1,
                ValorMostrar: Valor ,
                Lectura: false,
                });

                RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                formato:elemento.formato,
                tipo_numero:elemento.tipo_numero,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor,
                TipoNumero: 1,
                ValorMostrar:Valor, 
                Lectura: false,
                });                 
              }                 

            }


function construirDataManagerRecapt(CatalogoElementos, registros, Cabecera) {
  let DatosElementos = [];
  let DatosElementosPromedios = [];
  let DatosElementosAcumulados = [];
  let RegistrosManagerRecaptAcumulados = [];
  let RegistrosManagerRecaptPromedios = [];
  RegistrosSaldosFinalesMensuales = [];
  let RegistrosManagerRecapt = [];
  CatalogoElementos.forEach((catalogo) => {
    Cabecera.filter((cabecera) => cabecera.Tipo != 1).forEach((cab) => {
      const copiaCatalogoElementos = [...catalogo.Elementos].sort(
        (a, b) => a.OrdenData - b.OrdenData
      );
      copiaCatalogoElementos.forEach((elemento) => {
        let RegistrosBySeccion = [];
        RegistrosBySeccion =
          registros == undefined
            ? []
            : registros.filter((reg) => reg.idCatalogo == elemento.idPadre);
        const key = `${cab.Anio}-${cab.NumMes}-${elemento.id}`;
        const keyAnual = `${cab.Anio}-${elemento.id}`;
        // Mensual
        if(cab.Tipo == 2){
          if (!DatosElementos[key]) {
            DatosElementos[key] = [];
          }
          if (elemento.editable == true) {
          
          if (elemento.id == "04-01") {
            if (cab.NumMes == 1) {
              let Valor =
                DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });

              RegistrosManagerRecapt.push({
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Anio: cab.Anio,
                Mes: cab.NumMes,
                "idCatalogo":catalogo.id,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-04-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
            }  
            else {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                  ?.Valor == undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                      ?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });

              RegistrosManagerRecapt.push({
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                "idCatalogo":catalogo.id,
                Anio: cab.Anio,
                Mes: cab.NumMes,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-04-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
            }
          } 
          else if (elemento.id == "05-01") {
            if (cab.NumMes == 1) {
              let Valor =
                DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                idElemento: elemento.id,
                "idCatalogo":catalogo.id,
                Anio: cab.Anio,
                Mes: cab.NumMes,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-05-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
            } else {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                  ?.Valor == undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                      ?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar: Valor < 0 ? "-$ " + Valor * -1 : "$ " + Valor,
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                Anio: cab.Anio,
                Mes: cab.NumMes,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar: Valor < 0 ? "-$ " + Valor * -1 : "$ " + Valor,
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-05-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
            }
          } 
          else if (elemento.id == "06-01") {
            if (cab.NumMes == 1) {
              let Valor =
                DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Anio: cab.Anio,
                Mes: cab.NumMes,
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-06-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
            } 
            else {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                  ?.Valor == undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                      ?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Anio: cab.Anio,
                Mes: cab.NumMes,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-06-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
            }
          } 
          else if (elemento.id == "08-01") {
            if (cab.NumMes == 1) {
              let Valor =
                DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });

              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-08-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
            } 
            else {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                  ?.Valor == undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                      ?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-08-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
            }
          } 
          else if (elemento.id == "09-01") {
            if (cab.NumMes == 1) {
              let Valor =
                DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                idElemento: elemento.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-09-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
            } 
            else {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                  ?.Valor == undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                      ?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                idElemento: elemento.id,
                key: `${key}`,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-09-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
            }
          } 
          else if (elemento.id == "10-01") {
            if (cab.NumMes == 1) {
              let Valor =
                DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                idElemento: elemento.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor:
                  DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio - 1}-${12}-10-04`]?.[0]?.Valor ==
                  undefined
                    ? false
                    : true,
              });
            } 
            else {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                  ?.Valor == undefined
                  ? getValorElemento(
                      elemento.id,
                      cab.Anio,
                      cab.NumMes,
                      RegistrosBySeccion
                    )
                  : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                      ?.Valor;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                idElemento: "10-01",
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                        ?.Valor,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                    ?.Valor == undefined
                    ? getValorElemento(
                        elemento.id,
                        cab.Anio,
                        cab.NumMes,
                        RegistrosBySeccion
                      )
                    : DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                        ?.Valor) < 0
                    ? 1
                    : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura:
                  DatosElementos[`${cab.Anio}-${cab.NumMes - 1}-10-04`]?.[0]
                    ?.Valor == undefined
                    ? false
                    : true,
              });
            }
          } 

          else if(elemento.id=='01-04' && cab.NumMes!=1){
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes-1}-01-05`]?.[0]?.Valor || 0;
              DatosElementos[`${key}`].push({
                Valor: Valor,
                ValorMostrar: Valor,
                TipoNumero: Valor,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor,
                ValorMostrar: Valor,
                TipoNumero: (Valor) < 0 ? 1 : 2,
                Lectura: true,
              }); 


          }
          else if(elemento.id=='01-04' && cab.NumMes==1){
            let Valor = getValorElemento(
              elemento.id,
              cab.Anio,
              cab.NumMes,
              RegistrosBySeccion
            );
            DatosElementos[`${key}`].push({
              Valor: getValorElemento(
                elemento.id,
                cab.Anio,
                cab.NumMes,
                RegistrosBySeccion
              ),
              TipoNumero:
                getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ) < 0
                  ? 1
                  : 2,
              ValorMostrar: Number(Valor.toFixed(0)).toLocaleString("en-US"),
              Lectura: false,
            });
            RegistrosManagerRecapt.push({
              "idCatalogo":catalogo.id,
              idElemento: elemento.id,
              key: `${key}`,
              keyAnual: `${keyAnual}`,
              Valor: getValorElemento(
                elemento.id,
                cab.Anio,
                cab.NumMes,
                RegistrosBySeccion
              ),
              TipoNumero:
                getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ) < 0
                  ? 1
                  : 2,
              ValorMostrar: Number(Valor.toFixed(0)).toLocaleString("en-US"),
              Lectura: false,
            });

          
          }
          else if (
            elemento.id == "01-01" ||
            elemento.id == "01-03" ||
            elemento.id == "01-06"
          ) 
          {
            let Valor = getValorElemento(
              elemento.id,
              cab.Anio,
              cab.NumMes,
              RegistrosBySeccion
            );
            DatosElementos[`${key}`].push({
              Valor: getValorElemento(
                elemento.id,
                cab.Anio,
                cab.NumMes,
                RegistrosBySeccion
              ),
              TipoNumero:
                getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ) < 0
                  ? 1
                  : 2,
              ValorMostrar: Number(Valor.toFixed(0)).toLocaleString("en-US"),
              Lectura: false,
            });
            RegistrosManagerRecapt.push({
              "idCatalogo":catalogo.id,
              idElemento: elemento.id,
              key: `${key}`,
              keyAnual: `${keyAnual}`,
              Valor: getValorElemento(
                elemento.id,
                cab.Anio,
                cab.NumMes,
                RegistrosBySeccion
              ),
              TipoNumero:
                getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                ) < 0
                  ? 1
                  : 2,
              ValorMostrar: Number(Valor.toFixed(0)).toLocaleString("en-US"),
              Lectura: false,
            });
          } 
          else {
            let Valor = 0;
            if (elemento.id == "04-02") {
              Valor = Math.abs(
                getValorElemento(
                  elemento.id,
                  cab.Anio,
                  cab.NumMes,
                  RegistrosBySeccion
                )
              );
              DatosElementos[`${key}`].push({
                Valor: Valor,
                TipoNumero: 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "-$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
              });

              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor,
                TipoNumero: 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "-$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
              });
            } 
            else {
              Valor = getValorElemento(
                elemento.id,
                cab.Anio,
                cab.NumMes,
                RegistrosBySeccion
              );
              DatosElementos[`${key}`].push({
                Valor: Valor,
                TipoNumero: Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                Valor: Valor,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                TipoNumero: Valor < 0 ? 1 : 2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                Lectura: false,
              });
            }
          }
          // Final Editables
          } 
          else {
          //Mercadotecnia
          if (catalogo.id == "01") {
            if (elemento.id == "01-02") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-03`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-01`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                ValorMostrar:
                  Valor2 == 0
                    ? 0 + "%"
                    : ((Valor1 / Valor2) * 100).toFixed(0) + "%",
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                ValorMostrar:
                  Valor2 == 0
                    ? 0 + "%"
                    : ((Valor1 / Valor2) * 100).toFixed(0) + "%",
                Lectura: true,
              });
            }      
            else if (elemento.id == "01-05") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-03`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-04`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 + Valor2,
                ValorMostrar: Valor2 == 0 ? 0 : Valor1 + Valor2,
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 + Valor2,
                ValorMostrar: Valor2 == 0 ? 0 : Valor1 + Valor2,
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "01-07") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-05`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-06`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: Valor2 == 0 ? 0 : Valor1 / Valor2,
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: Valor2 == 0 ? 0 : Valor1 / Valor2,
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "01-08") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-07`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-05`]?.[0]?.Valor ||
                0;
              let Valor =
                Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3;
              DatosElementos[`${key}`].push({
                Valor:
                  Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3) <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3) <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }
          //Estado de Resultados
          if (catalogo.id == "02") {
            if (elemento.id == "02-01") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]
                    ?.Valor < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-01-09`]?.[0]
                    ?.Valor < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-03") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-04") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-08") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-06`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-07`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-09") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-10") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-15") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-10`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-11`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-12`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-13`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-02-14`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "02-16") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }
          //Flujo de Efectivo
          if (catalogo.id == "03") {
            if (elemento.id == "03-01") {
              let keySaldosFinales = `${cab.NumMes}-${(cab.NumMes, cab.Anio)}`;
              let Valor = getSaldoInicialMensual(cab.NumMes, cab.Anio);
              DatosElementos[`${key}`].push({
                Valor: getSaldoInicialMensual(cab.NumMes, cab.Anio),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  getSaldoInicialMensual(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: getSaldoInicialMensual(cab.NumMes, cab.Anio),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  getSaldoInicialMensual(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                Lectura: true,
              });

              RegistrosSaldosFinalesMensuales.push({
                key: keySaldosFinales,
                Anio: cab.Anio,
                Valor: getValorSaldoFinal(cab.NumMes, cab.Anio) || 0,
              });
            } 
            else if (elemento.id == "03-16") {
              let Valor = getValorSaldoFinal(cab.NumMes, cab.Anio);
              DatosElementos[`${key}`].push({
                Valor: getValorSaldoFinal(cab.NumMes, cab.Anio),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  getValorSaldoFinal(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: getValorSaldoFinal(cab.NumMes, cab.Anio),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  getValorSaldoFinal(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "03-17") {
              let Valor1 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                ]?.[0]?.Valor || 0;
              let Valor2 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-VmmQpdpunMTqkoSjhzzj`
                ]?.[0]?.Valor || 0;
              DatosElementos[`${key}`].push({
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar:
                  Valor1 == 0
                    ? 0 + "%"
                    : ((Valor2 / Valor1) * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar:
                  Valor1 == 0
                    ? 0 + "%"
                    : ((Valor2 / Valor1) * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor1 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
            }
            //Abuelos
            else if (elemento.Tipo == "Abuelo") {
              if (elemento.id == "EESGPM4hWXvDlXSRnCwA") {
                let Valor = getDataFlujoOperativoMensual(cab.NumMes, cab.Anio);
                DatosElementos[`${key}`].push({
                  Valor: getDataFlujoOperativoMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoOperativoMensual(cab.NumMes, cab.Anio) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  idElemento: elemento.id,
                  Valor: getDataFlujoOperativoMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoOperativoMensual(cab.NumMes, cab.Anio) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
              } 
              else if (elemento.id == "GMzSuF04XQBsPmAkIB2C") {
                let Valor = getDataFlujoOperativoMensual(cab.NumMes, cab.Anio);
                DatosElementos[`${key}`].push({
                  Valor: getDataFlujoInversionMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoInversionMensual(cab.NumMes, cab.Anio) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  idElemento: elemento.id,
                  Valor: getDataFlujoInversionMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoInversionMensual(cab.NumMes, cab.Anio) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
              } 
              else if (elemento.id == "psmpY6iyDJNkW7AKFXgK") {
                let Valor = getDataFlujoInversionMensual(cab.NumMes, cab.Anio);
                DatosElementos[`${key}`].push({
                  Valor: getDataFlujoInversionMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoInversionMensual(cab.NumMes, cab.Anio) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,  
                  idElemento: elemento.id,
                  Valor: getDataFlujoInversionMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoInversionMensual(cab.NumMes, cab.Anio) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
              } 
              else if (elemento.id == "VmmQpdpunMTqkoSjhzzj") {
                let Valor = getDataFlujoLibreMensual(cab.NumMes, cab.Anio);
                DatosElementos[`${key}`].push({
                  Valor: getDataFlujoLibreMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoLibreMensual(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  idElemento: elemento.id,
                  Valor: getDataFlujoLibreMensual(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getDataFlujoLibreMensual(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                  Lectura: true,
                });
              }
            }
            //Padres
            else if (elemento.Tipo == "Padre") {
              if (elemento.id == "03-5") {
                let Valor =
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                  ]?.[0]?.Valor || 0) == 0
                    ? 0
                    : ((DatosElementos[
                        `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                      ]?.[0]?.Valor || 0) /
                        (DatosElementos[
                          `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                        ]?.[0]?.Valor || 0)) *
                      100;

                DatosElementos[`${key}`].push({
                  Valor:
                    (DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[
                          `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                        ]?.[0]?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100,
                  ValorMostrar: Valor.toFixed(0) + "%",
                  TipoNumero:
                    ((DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[
                          `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                        ]?.[0]?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  idElemento: elemento.id,
                  Valor:
                    (DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[
                          `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                        ]?.[0]?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100,
                  ValorMostrar: Valor.toFixed(0) + "%",
                  TipoNumero:
                    ((DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[
                          `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                        ]?.[0]?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
              } 
              else if (elemento.id == "03-6") {
                let Valor = getValorPagoProveedores(cab.NumMes, cab.Anio);
                DatosElementos[`${key}`].push({
                  Valor: getValorPagoProveedores(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getValorPagoProveedores(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  idElemento: elemento.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  Valor: getValorPagoProveedores(cab.NumMes, cab.Anio),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getValorPagoProveedores(cab.NumMes, cab.Anio) < 0 ? 1 : 2,
                  Lectura: true,
                });
              }

              if (elemento.id == "03-7") {
                let Valor =
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                  ]?.[0]?.Valor || 0) == 0
                    ? 0
                    : ((DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                        ?.Valor || 0) /
                        (DatosElementos[
                          `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                        ]?.[0]?.Valor || 0)) *
                      100;

                DatosElementos[`${key}`].push({
                  Valor:
                    (DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                          ?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100,
                  ValorMostrar: Valor.toFixed(0) + "%",
                  TipoNumero:
                    ((DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                          ?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  idElemento: elemento.id,
                  Valor:
                    (DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                          ?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100,
                  ValorMostrar: Valor.toFixed(0) + "%",
                  TipoNumero:
                    ((DatosElementos[
                      `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                    ]?.[0]?.Valor || 0) == 0
                      ? 0
                      : ((DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                          ?.Valor || 0) /
                          (DatosElementos[
                            `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                          ]?.[0]?.Valor || 0)) *
                        100) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
              } 
              else {
                let Valor = getValorCategoriaMensual(
                  elemento.id,
                  cab.NumMes,
                  cab.Anio
                );
                DatosElementos[`${key}`].push({
                  Valor: getValorCategoriaMensual(
                    elemento.id,
                    cab.NumMes,
                    cab.Anio
                  ),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getValorCategoriaMensual(
                      elemento.id,
                      cab.NumMes,
                      cab.Anio
                    ) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
                RegistrosManagerRecapt.push({
                  "idCatalogo":catalogo.id,
                  key: `${key}`,
                  keyAnual: `${keyAnual}`,
                  idElemento: elemento.id,
                  Valor: getValorCategoriaMensual(
                    elemento.id,
                    cab.NumMes,
                    cab.Anio
                  ),
                  ValorMostrar:
                    Valor < 0
                      ? "-$ " +
                        Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                      : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                  TipoNumero:
                    getValorCategoriaMensual(
                      elemento.id,
                      cab.NumMes,
                      cab.Anio
                    ) < 0
                      ? 1
                      : 2,
                  Lectura: true,
                });
              }
            }
          }

          //Cuentas por cobrar
          if (catalogo.id == "04") {
            if (elemento.id == "04-04") {
              let Valor =
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                  ?.Valor || 0) +
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]
                  ?.Valor || 0) +
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-03`]?.[0]
                  ?.Valor || 0);
              DatosElementos[`${key}`].push({
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                    ?.Valor || 0) +
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]
                    ?.Valor || 0) +
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-03`]?.[0]
                    ?.Valor || 0),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                    ?.Valor || 0) +
                    (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]
                      ?.Valor || 0) +
                    (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-03`]?.[0]
                      ?.Valor || 0) <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                    ?.Valor || 0) +
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]
                    ?.Valor || 0) +
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-03`]?.[0]
                    ?.Valor || 0),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                    ?.Valor || 0) +
                    (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]
                      ?.Valor || 0) +
                    (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-03`]?.[0]
                      ?.Valor || 0) <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "04-05") {
              let Valor =
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]
                  ?.Valor || 0) -
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                  ?.Valor || 0);
              DatosElementos[`${key}`].push({
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]
                    ?.Valor || 0) -
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                    ?.Valor || 0),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]
                    ?.Valor || 0) -
                    (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                      ?.Valor || 0) <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]
                    ?.Valor || 0) -
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                    ?.Valor || 0),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]
                    ?.Valor || 0) -
                    (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]
                      ?.Valor || 0) <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "04-06") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 / 30 == 0 ? 0 : Valor1 / (Valor2 / 30),
                ValorMostrar:
                  Valor2 / 30 == 0 ? 0 : (Valor1 / (Valor2 / 30)).toFixed(0),
                TipoNumero:
                  Valor2 / 30 == 0 ? 0 : Valor1 / (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 / 30 == 0 ? 0 : Valor1 / (Valor2 / 30),
                ValorMostrar:
                  Valor2 / 30 == 0 ? 0 : (Valor1 / (Valor2 / 30)).toFixed(0),
                TipoNumero:
                  Valor2 / 30 == 0 ? 0 : Valor1 / (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "04-07") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-02`]?.[0]?.Valor ||
                0;
              let Valor = (30 - Valor1) * (Valor2 / 30);
              DatosElementos[`${key}`].push({
                Valor: (30 - Valor1) * (Valor2 / 30),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (30 - Valor1) * (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: (30 - Valor1) * (Valor2 / 30),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (30 - Valor1) * (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }
          // Inventarios
          if (catalogo.id == "05") {
            if (elemento.id == "05-03") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
              });
            } 
            else if (elemento.id == "05-04") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "05-05") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]?.Valor ||
                0 -
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                    ?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]
                    ?.Valor ||
                    0 -
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]
                    ?.Valor ||
                    0 -
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "05-06") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                ValorMostrar:
                  Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                TipoNumero:
                  (Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                ValorMostrar:
                  Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                TipoNumero:
                  (Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "05-07") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-03`]?.[0]?.Valor ||
                0;
              let Valor = (Valor1 - 15) * (Valor2 / 30);
              DatosElementos[`${key}`].push({
                Valor: (Valor1 - 15) * (Valor2 / 30),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 - 15) * (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: (Valor1 - 15) * (Valor2 / 30),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 - 15) * (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }
          // Proveedores
          if (catalogo.id == "06") {
            if (elemento.id == "06-02") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "06-03") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "06-04") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]
                    ?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "06-05") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]?.Valor ||
                0 -
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                    ?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]
                    ?.Valor ||
                    0 -
                      (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                        ?.Valor || 0)) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]
                    ?.Valor ||
                    0 -
                      (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-01`]?.[0]
                        ?.Valor || 0)) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "06-06") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                ValorMostrar:
                  Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                TipoNumero:
                  (Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                ValorMostrar:
                  Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30,
                TipoNumero:
                  (Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "06-07") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-03`]?.[0]?.Valor ||
                0;
              let Valor = (Valor1 - 30) * (Valor2 / 30);
              DatosElementos[`${key}`].push({
                Valor: (Valor1 - 30) * (Valor2 / 30),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 - 30) * (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: (Valor1 - 30) * (Valor2 / 30),
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 - 30) * (Valor2 / 30) < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }

          // Afectación al flujo de efectivo
          if (catalogo.id == "07") {
            if (elemento.id == "07-01") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-05`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-05`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-05`]?.[0]?.Valor ||
                0;
              let Valor = (Valor1 + Valor2) * -1 + Valor3;
              DatosElementos[`${key}`].push({
                Valor: (Valor1 + Valor2) * -1 + Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 + Valor2) * -1 + Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: (Valor1 + Valor2) * -1 + Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 + Valor2) * -1 + Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-02" || elemento.id == "07-08") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-07-01`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                ]?.[0]?.Valor || 0;
              let Valor = Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-03") {
              let Valor =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                ]?.[0]?.Valor || 0;
                
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                  ]?.[0]?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                  ]?.[0]?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor:
                  DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                  ]?.[0]?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                  ]?.[0]?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-04") {
              let Valor1 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                ]?.[0]?.Valor || 0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-07-02`]?.[0]?.Valor ||
                0;
              let Valor = Valor1 == 0 ? 0 : Valor2 / Valor1;
              DatosElementos[`${key}`].push({
                Valor: Valor,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-05") {
              let Valor1 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                ]?.[0]?.Valor || 0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-07-03`]?.[0]?.Valor ||
                0;
              let Valor = Valor1 == 0 ? 0 : Valor2 / Valor1;
              DatosElementos[`${key}`].push({
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-06") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-07`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-07`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-07`]?.[0]?.Valor ||
                0;
              let Valor = Valor1 + Valor2 + Valor3;
              DatosElementos[`${key}`].push({
                Valor: Valor1 + Valor2 + Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 + Valor2 + Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor1 + Valor2 + Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 + Valor2 + Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-07") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-07-06`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                ]?.[0]?.Valor || 0;
              let Valor = Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-09") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-07-07`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-EESGPM4hWXvDlXSRnCwA`
                ]?.[0]?.Valor || 0;
              let Valor = Valor1 == 0 ? 0 : Valor2 / Valor1;
              DatosElementos[`${key}`].push({
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "07-10") {
              let Valor1 =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-od11V2OHVgaLG1RiXMiz`
                ]?.[0]?.Valor || 0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-07-08`]?.[0]?.Valor ||
                0;
              let Valor = Valor1 == 0 ? 0 : Valor2 / Valor1;
              DatosElementos[`${key}`].push({
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                Valor: Valor1 == 0 ? 0 : Valor2 / Valor1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }
          // Activo Fijo
          if (catalogo.id == "08") {
            if (elemento.id == "08-04") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-03`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-08-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-08-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-08-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-08-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }
          // Otros pasivos de Corto Plazo
          if (catalogo.id == "09") {
            if (elemento.id == "09-02") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-08-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "09-04") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-09-01`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-09-02`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-09-03`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-09-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-09-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-09-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-09-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-09-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-09-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-09-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-09-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-09-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-09-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-09-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-09-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }

          // Pasivos de Largo Plazo
          if (catalogo.id == "10") {
            if (elemento.id == "10-04") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-02`]?.[0]
                    ?.Valor ||
                0 +
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-03`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-10-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-10-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-10-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-10-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                    ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-10-02`]?.[0]
                      ?.Valor ||
                  0 +
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-10-03`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                    ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-10-02`]?.[0]
                        ?.Valor ||
                    0 +
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-10-03`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }
          // Comparativas
          if (catalogo.id == "11") {
            if (elemento.id == "11-01") {
              let Valor =
                DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-VmmQpdpunMTqkoSjhzzj`
                ]?.[0]?.Valor || 0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-VmmQpdpunMTqkoSjhzzj`
                  ]?.[0]?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-VmmQpdpunMTqkoSjhzzj`
                  ]?.[0]?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-VmmQpdpunMTqkoSjhzzj`
                  ]?.[0]?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-VmmQpdpunMTqkoSjhzzj`
                  ]?.[0]?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "11-02") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "11-03") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-05`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-04-05`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-05`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-04-05`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-05`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "11-04") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-05`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-05`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-05`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-05`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-05`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "11-05") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-08-04`]?.[0]?.Valor ||
                0 -
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-08-04`]?.[0]
                    ?.Valor ||
                    0 -
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-08-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-08-04`]?.[0]
                    ?.Valor ||
                    0 -
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-08-01`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "11-06") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-05`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-05`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-05`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-05`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-05`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "11-07") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-10-04`]?.[0]?.Valor ||
                0 -
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                    ?.Valor ||
                0;

              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-10-04`]?.[0]
                    ?.Valor ||
                    0 -
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,             
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-10-04`]?.[0]
                    ?.Valor ||
                  0 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                      ?.Valor ||
                  0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-10-04`]?.[0]
                    ?.Valor ||
                    0 -
                      DatosElementos[`${cab.Anio}-${cab.NumMes}-10-01`]?.[0]
                        ?.Valor ||
                    0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }
          // Eficiencia y control
          if (catalogo.id == "12") {
            if (elemento.id == "12-01") {
              let Valor =
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                  ?.Valor || 0) * -1;
              DatosElementos[`${key}`].push({
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0) *
                    -1 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-02`]?.[0]
                    ?.Valor || 0) *
                    -1 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-02") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                keyAnual: `${keyAnual}`,
                key: `${key}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-02`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-03") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-12-01`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-12-02`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor1 / 30 == 0 ? 0 : Valor2 / (Valor1 / 30),
                ValorMostrar:
                  Valor1 / 30 == 0 ? 0 : (Valor2 / (Valor1 / 30)).toFixed(0),
                TipoNumero:
                  (Valor1 / 30 == 0 ? 0 : Valor2 / (Valor1 / 30)) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor1 / 30 == 0 ? 0 : Valor2 / (Valor1 / 30),
                ValorMostrar:
                  Valor1 / 30 == 0 ? 0 : (Valor2 / (Valor1 / 30)).toFixed(0),
                TipoNumero:
                  (Valor1 / 30 == 0 ? 0 : Valor2 / (Valor1 / 30)) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-04") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-03-6`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor1 * -1,
                ValorMostrar:
                  Valor1 * -1 < 0
                    ? "-$ " +
                      Number((Valor1 * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " +
                      Number((Valor1 * -1).toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 * -1 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor1 * -1,
                ValorMostrar:
                  Valor1 * -1 < 0
                    ? "-$ " +
                      Number((Valor1 * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " +
                      Number((Valor1 * -1).toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 * -1 < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-05") {
              let Valor =
                1 -
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-12-11`]?.[0]
                    ?.Valor || 0;
              DatosElementos[`${key}`].push({
                Valor:
                  1 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-12-11`]?.[0]
                      ?.Valor || 0,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (1 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-12-11`]?.[0]
                      ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  1 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-12-11`]?.[0]
                      ?.Valor || 0,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (1 -
                    DatosElementos[`${cab.Anio}-${cab.NumMes}-12-11`]?.[0]
                      ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-06") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-03-7`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-03-7`]?.[0]
                    ?.Valor || 0,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-03-7`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-03-7`]?.[0]
                    ?.Valor || 0,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-03-7`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-07") {
              let Valor =
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                  ?.Valor || 0) * -1;
              DatosElementos[`${key}`].push({
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                    ?.Valor || 0) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                    ?.Valor || 0) *
                    -1 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                    ?.Valor || 0) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]
                    ?.Valor || 0) *
                    -1 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-08") {
              let Valor =
                (DatosElementos[
                  `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                ]?.[0]?.Valor || 0) * -1;
              DatosElementos[`${key}`].push({
                Valor:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                  ]?.[0]?.Valor || 0) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                  ]?.[0]?.Valor || 0) *
                    -1 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                  ]?.[0]?.Valor || 0) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[
                    `${cab.Anio}-${cab.NumMes}-KtA2Cxpd79TJrW9afqR9`
                  ]?.[0]?.Valor || 0) *
                    -1 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-09") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1) < 0 ? 1 : 2,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1) < 0 ? 1 : 2,
              });
            } 
            else if (elemento.id == "12-10") {
              let Valor =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-03-5`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-03-5`]?.[0]
                    ?.Valor || 0,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-03-5`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-03-5`]?.[0]
                    ?.Valor || 0,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-03-5`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-11") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-03`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-12") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-09`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-13") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-14") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-17`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero: (Valor2 == 0 ? 0 : Valor1 / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-15") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-01`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : (Valor1 * -1) / Valor2;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : (Valor1 * -1) / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (Valor2 == 0 ? 0 : (Valor1 * -1) / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : (Valor1 * -1) / Valor2,
                ValorMostrar: (Valor * 100).toFixed(0) + "%",
                TipoNumero:
                  (Valor2 == 0 ? 0 : (Valor1 * -1) / Valor2) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-16") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-08`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-12-11`]?.[0]?.Valor ||
                0;
              let Valor = Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 / Valor2) * -1 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: (Valor1 / Valor2) * -1 < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "12-17") {
              let Valor =
                (DatosElementos[`${cab.Anio}-${cab.NumMes}-12-16`]?.[0]
                  ?.Valor || 0) * 4.33;
              DatosElementos[`${key}`].push({
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-12-16`]?.[0]
                    ?.Valor || 0) * 4.33,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-12-16`]?.[0]
                    ?.Valor || 0) *
                    4.33 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-12-16`]?.[0]
                    ?.Valor || 0) * 4.33,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-12-16`]?.[0]
                    ?.Valor || 0) *
                    4.33 <
                  0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }
          // Actividad y gestión
          if (catalogo.id == "13") {
            if (elemento.id == "13-01") {
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]
                    ?.Valor || 0,
                ValorMostrar: (
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]
                    ?.Valor || 0
                ).toFixed(0),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]
                    ?.Valor || 0,
                ValorMostrar: (
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]
                    ?.Valor || 0
                ).toFixed(0),
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-04-06`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "13-02") {
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]
                    ?.Valor || 0,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]
                    ?.Valor || 0,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-05-06`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
            else if (elemento.id == "13-03") {
              DatosElementos[`${key}`].push({
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]
                    ?.Valor || 0,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]
                    ?.Valor || 0,
                ValorMostrar:
                  DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]
                    ?.Valor || 0,
                TipoNumero:
                  (DatosElementos[`${cab.Anio}-${cab.NumMes}-06-06`]?.[0]
                    ?.Valor || 0) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "13-04") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-13-01`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-13-02`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-13-03`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor1 + Valor2 - Valor3,
                ValorMostrar: (Valor1 + Valor2 - Valor3).toFixed(0),
                TipoNumero: Valor1 + Valor2 - Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor1 + Valor2 - Valor3,
                ValorMostrar: (Valor1 + Valor2 - Valor3).toFixed(0),
                TipoNumero: Valor1 + Valor2 - Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }

          // Retorno y rentabilidad
          if (catalogo.id == "14") {
            if (elemento.id == "14-01") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-17`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: Valor2 == 0 ? 0 : (Valor1 / Valor2).toFixed(0),
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 == 0 ? 0 : Valor1 / Valor2,
                ValorMostrar: Valor2 == 0 ? 0 : (Valor1 / Valor2).toFixed(0),
                TipoNumero: (Valor1 == 0 ? 0 : Valor2 / Valor1) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "14-02") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-05`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 * -1 == 0 ? 0 : Valor1 / (Valor2 * -1),
                ValorMostrar:
                  Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)).toFixed(0),
                TipoNumero:
                  (Valor2 * -1 == 0 ? 0 : Valor1 / (Valor2 * -1)) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 * -1 == 0 ? 0 : Valor1 / (Valor2 * -1),
                ValorMostrar:
                  Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)).toFixed(0),
                TipoNumero:
                  (Valor2 * -1 == 0 ? 0 : Valor1 / (Valor2 * -1)) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "14-03") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-02-15`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-01`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-01`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor2 + Valor3 == 0 ? 0 : Valor1 / (Valor2 + Valor3),
                ValorMostrar:
                  Valor2 + Valor3 == 0
                    ? 0
                    : (Valor1 / (Valor2 + Valor3)).toFixed(0),
                TipoNumero:
                  (Valor2 + Valor3 == 0 ? 0 : Valor1 / (Valor2 + Valor3)) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor2 + Valor3 == 0 ? 0 : Valor1 / (Valor2 + Valor3),
                ValorMostrar:
                  Valor2 + Valor3 == 0
                    ? 0
                    : (Valor1 / (Valor2 + Valor3)).toFixed(0),
                TipoNumero:
                  (Valor2 + Valor3 == 0 ? 0 : Valor1 / (Valor2 + Valor3)) < 0
                    ? 1
                    : 2,
                Lectura: true,
              });
            }
          }
          // Liquidez y solvencia
          if (catalogo.id == "15") {
            if (elemento.id == "15-01") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-07`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-07`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-07`]?.[0]?.Valor ||
                0;
              let Valor = Valor1 + Valor2 + Valor3;
              DatosElementos[`${key}`].push({
                Valor: Valor1 + Valor2 + Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 + Valor2 + Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor1 + Valor2 + Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 + Valor2 + Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "15-02") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]?.Valor ||
                0;
              DatosElementos[`${key}`].push({
                Valor: Valor3 == 0 ? 0 : (Valor1 + Valor2) / Valor3,
                ValorMostrar:
                  Valor3 == 0 ? 0 : ((Valor1 + Valor2) / Valor3).toFixed(0),
                TipoNumero:
                  (Valor3 == 0 ? 0 : (Valor1 + Valor2) / Valor3) < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor3 == 0 ? 0 : (Valor1 + Valor2) / Valor3,
                ValorMostrar:
                  Valor3 == 0 ? 0 : ((Valor1 + Valor2) / Valor3).toFixed(0),
                TipoNumero:
                  (Valor3 == 0 ? 0 : (Valor1 + Valor2) / Valor3) < 0 ? 1 : 2,
                Lectura: true,
              });
            } 
            else if (elemento.id == "15-03") {
              let Valor1 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-04-04`]?.[0]?.Valor ||
                0;
              let Valor2 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-05-04`]?.[0]?.Valor ||
                0;
              let Valor3 =
                DatosElementos[`${cab.Anio}-${cab.NumMes}-06-04`]?.[0]?.Valor ||
                0;
              let Valor = Valor1 + Valor2 - Valor3;
              DatosElementos[`${key}`].push({
                Valor: Valor1 + Valor2 - Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 + Valor2 - Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
              RegistrosManagerRecapt.push({
                "idCatalogo":catalogo.id,
                key: `${key}`,
                keyAnual: `${keyAnual}`,
                idElemento: elemento.id,
                Valor: Valor1 + Valor2 - Valor3,
                ValorMostrar:
                  Valor < 0
                    ? "-$ " +
                      Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                    : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                TipoNumero: Valor1 + Valor2 - Valor3 < 0 ? 1 : 2,
                Lectura: true,
              });
            }
          }
          } 
        }  
        // Acumulado y Promedio
        else {
        

        if (!DatosElementosAcumulados[keyAnual]) {
          DatosElementosAcumulados[keyAnual] = [];
        }
        if (!DatosElementosPromedios[keyAnual]) {
          DatosElementosPromedios[keyAnual] = [];
        }          
        if (catalogo.id == "01") {
          if ( elemento.id == "01-09") {
            let ValorElemento = 0;
            Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
              const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
              const item = RegistrosManagerRecapt.find(x => x.key === key);
              ValorElemento+=item==undefined?0:item.Valor 
            });
            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })             
            RegistrosManagerRecaptAcumulados.push({ 
            "Valor":ValorElemento,
            "key": `${keyAnual}`,
            "idElemento":elemento.id,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })
              //Promedio
              let ValorPromedio=
              ValorElemento/12
              DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio.toLocaleString('en-US')
              }) 
              RegistrosManagerRecaptPromedios.push({  
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })                         

  
          }
          else if(elemento.id=="01-08"){
            let Valor1 =
                DatosElementosAcumulados[`${cab.Anio}-01-05`]?.[0]?.Valor || 0;
            let Valor2 =
                DatosElementosAcumulados[`${cab.Anio}-01-07`]?.[0]?.Valor || 0;
            let Valor3 =
                DatosElementosAcumulados[`${cab.Anio}-01-09`]?.[0]?.Valor || 0; 
                 
            let ValorElemento=Valor2 == 0 || Valor1 == 0 ? 0 : Valor3 / Valor2 / Valor1;              
            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })             
            RegistrosManagerRecaptAcumulados.push({ 
            "Valor":ValorElemento,
            "key": `${keyAnual}`,
            "idElemento":elemento.id,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
            
              let Valor1Promedio =
                DatosElementosAcumulados[`${cab.Anio}-01-05`]?.[0]?.Valor || 0;
              let Valor2Promedio =
                DatosElementosAcumulados[`${cab.Anio}-01-07`]?.[0]?.Valor || 0;
              let Valor3Promedio =
                DatosElementosAcumulados[`${cab.Anio}-01-09`]?.[0]?.Valor || 0;

              let ValorPromedio =
                Valor2Promedio == 0 || Valor1Promedio == 0 ? 0 : Valor3Promedio / Valor2Promedio / Valor1Promedio;
              DatosElementosPromedios[`${keyAnual}`].push({
                Valor: Valor3 / Valor2 / Valor1,
                TipoNumero: ValorPromedio < 0 ? 1 : 2,
                ValorMostrar:
                  ValorPromedio < 0
                    ? "-$ " +
                      Number((ValorPromedio * -1).toFixed(0)).toLocaleString(
                        "en-US"
                      )
                    : "$ " +
                      Number(ValorPromedio.toFixed(0)).toLocaleString("en-US"),
              });
              RegistrosManagerRecaptPromedios.push({
                Valor: ValorPromedio,
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idElemento":elemento.id,
                "idCatalogo":catalogo.id,
                "Lectura":true,
                TipoNumero: ValorPromedio < 0 ? 1 : 2,
                ValorMostrar:
                ValorPromedio < 0
                    ? "-$ " +
                      Number((ValorPromedio * -1).toFixed(0)).toLocaleString(
                        "en-US"
                      )
                    : "$ " +
                      Number(ValorPromedio.toFixed(0)).toLocaleString("en-US"),
              });            
          }

          else if(elemento.id=='01-02'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-01-01`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-01-03`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor1==0 ? 0 : Valor2/Valor1 ,
              "TipoNumero":(Valor1==0 ? 0 : Valor2/Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : Valor2/Valor1)*100).toFixed(0) +'%'
              }) 

              RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,
              "Valor":Valor1==0 ? 0 : Valor2/Valor1 ,
              "TipoNumero":(Valor1==0 ? 0 : Valor2/Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : Valor2/Valor1)*100).toFixed(0) +'%'
              }) 

              let ValorElementos=[]
              Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
              const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
              const item = DatosElementos.find(x => x.key === key);
                ValorElementos.push(item==undefined?0:item.Valor )
                })
                const suma = ValorElementos.reduce((acc, val) => acc + val, 0);
                const promedio = suma / ValorElementos.length;
                // Promedio
                DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":promedio,
                "TipoNumero":promedio<0 ? 1 : 2,
                "ValorMostrar": (promedio*100).toFixed(0)+'%'
                }) 

                RegistrosManagerRecaptPromedios.push({ 
                  "key": `${keyAnual}`,
                  "Anio":cab.Anio,
                  "idCatalogo":catalogo.id,
                  "idElemento":elemento.id,
                  "Lectura":true,                
                  "idElemento":elemento.id,
                  "Valor":promedio,
                  "TipoNumero":promedio<0 ? 1 : 2,
                  "ValorMostrar": (promedio*100).toFixed(0)+'%'
                }) 
          }
          else if(elemento.id=='01-05'){
            const item = RegistrosManagerRecapt.find(x => x.key === `${cab.Anio}-12-01-05`);  
            let Valor= item==undefined?0:item.Valor 
              DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor ,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor).toFixed(0)
              }) 

              RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,
              "Valor":Valor ,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor).toFixed(0)
              }) 

      
                const promedio = Valor / 12;
                // Promedio
                DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":promedio,
                "TipoNumero":promedio<0 ? 1 : 2,
                "ValorMostrar": (promedio).toFixed(0)
                }) 

                RegistrosManagerRecaptPromedios.push({ 
                  "key": `${keyAnual}`,
                  "Anio":cab.Anio,
                  "idCatalogo":catalogo.id,
                  "idElemento":elemento.id,
                  "Lectura":true,                
                  "idElemento":elemento.id,
                  "Valor":promedio,
                  "TipoNumero":promedio<0 ? 1 : 2,
                  "ValorMostrar": (promedio).toFixed(0)
                }) 
          }  
          else if(elemento.id=='01-07'){

            let Valor1=(DatosElementosAcumulados[`${cab.Anio}-01-06`]?.[0]?.Valor || 0)  
            let Valor2=(DatosElementosAcumulados[`${cab.Anio}-01-05`]?.[0]?.Valor || 0) 
            let Valor=Valor2==0?0 :  Valor1/Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor.toFixed(0)
            })
            DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":(Valor),
                  "TipoNumero":(Valor)<0 ? 1 : 2,
                  "ValorMostrar": (Valor).toFixed(0)
            })
            RegistrosManagerRecaptAcumulados.push({
	            "key": `${keyAnual}`,
              "idCatalogo":catalogo.id,
              "Lectura":true,   
              "Anio":cab.Anio,
              "idElemento":elemento.id,           
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor).toFixed(1)
            })
            RegistrosManagerRecaptPromedios.push({  
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": (Valor).toFixed(1)
            })             
            
          } 
          else if(elemento.id=='01-06' || elemento.id=='01-04' || elemento.id=='01-03' || elemento.id=='01-01'){
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
          const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
          const item = RegistrosManagerRecapt.find(x => x.key === key);
          ValorElemento+=item==undefined?0:item.Valor
          })
            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento
            })
            RegistrosManagerRecaptAcumulados.push({
	            "key": `${keyAnual}`,
              "idCatalogo":catalogo.id,
              "Lectura":true,   
              "Anio":cab.Anio,
              "idElemento":elemento.id,           
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento
            })

            //Promedio
            let ValorPromedio=
            (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio.toFixed(2).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({  
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio.toFixed(2)
            }) 
          }                  

          else {
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
          const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
          const item = RegistrosManagerRecapt.find(x => x.key === key);
          ValorElemento+=item==undefined?0:item.Valor
          })
            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({
	            "key": `${keyAnual}`,
              "idCatalogo":catalogo.id,
              "Lectura":true,   
              "Anio":cab.Anio,
              "idElemento":elemento.id,           
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })

            //Promedio
            let ValorPromedio=
            (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio.toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({  
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
          }          
        }

        else if(catalogo.id=='02'){
        if(elemento.id=='02-01' || 
           elemento.id=='02-02' || 
           elemento.id=='02-05' ||
           elemento.id=='02-06' ||
           elemento.id=='02-07' ||
           elemento.id=='02-11' ||
           elemento.id=='02-12' || 
           elemento.id=='02-13' || 
           elemento.id=='02-14' || 
           elemento.id=='02-17' 
           )
           
          {
            let ValorElemento=0
            Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
            })

            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({ 
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,              
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            })
            let ValorPromedio=ValorElemento/12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })
            RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "Lectura":true,
	              "idElemento":elemento.id,              
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })
          }
          else if(elemento.id=='02-03')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0
            let Valor=Valor1+Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            let ValorPromedio=Valor/12           

            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
          }
          else if(elemento.id=='02-04')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-03`]?.[0]?.Valor || 0
            let Valor=Valor2==0? 0: Valor2/Valor1
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-03`]?.[0]?.Valor || 0
            let ValorPromedio=Valor2Promedio==0? 0: Valor2Promedio/Valor1Promedio        
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0) + '%'
            })            
          }
          else if(elemento.id=='02-08')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-05`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-06`]?.[0]?.Valor || 0
            let Valor3= DatosElementosAcumulados[`${cab.Anio}-02-07`]?.[0]?.Valor || 0
            let Valor=Valor1+Valor2+Valor3
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })

            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-05`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-06`]?.[0]?.Valor || 0
            let Valor3Promedio= DatosElementosPromedios[`${cab.Anio}-02-07`]?.[0]?.Valor || 0
            let ValorPromedio=Valor1Promedio+Valor2Promedio+Valor3Promedio        

            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
          }  
          else if(elemento.id=='02-09')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-03`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-08`]?.[0]?.Valor || 0
            let Valor=Valor1+Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })

            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-03`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-08`]?.[0]?.Valor || 0
            let ValorPromedio=Valor1Promedio+Valor2Promedio        

            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
          }
          else if(elemento.id=='02-10')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-09`]?.[0]?.Valor || 0
            let Valor=Valor2==0? 0: Valor2/Valor1
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-09`]?.[0]?.Valor || 0
            let ValorPromedio=Valor2Promedio==0? 0: Valor2Promedio/Valor1Promedio        
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0) + '%'
            })            
          }
          else if(elemento.id=='02-15')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-09`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-11`]?.[0]?.Valor || 0
            let Valor3= DatosElementosAcumulados[`${cab.Anio}-02-12`]?.[0]?.Valor || 0
            let Valor=Valor1+Valor2+Valor3
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })

            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-09`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-11`]?.[0]?.Valor || 0
            let Valor3Promedio= DatosElementosPromedios[`${cab.Anio}-02-12`]?.[0]?.Valor || 0
            let ValorPromedio=Valor1Promedio+Valor2Promedio+Valor3Promedio        

            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
          }
          else if(elemento.id=='02-16')
          {
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0
            let Valor=Valor2==0? 0: Valor2/Valor1
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-15`]?.[0]?.Valor || 0
            let ValorPromedio=Valor2Promedio==0? 0: Valor2Promedio/Valor1Promedio        
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0) + '%'
            })            
          }                    
          
        }

        else if(catalogo.id=='03'){
          if(elemento.id=='03-01'){
            let Valor= DatosElementos[`${cab.Anio}-1-03-01`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
              })          
              RegistrosManagerRecaptAcumulados.push({ 
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
              })
              
                //Promedio
                let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-03-01`]?.[0]?.Valor || 0
                DatosElementosPromedios[`${keyAnual}`].push({                  
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                  '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                })                 
                RegistrosManagerRecaptPromedios.push({
                  "key": `${keyAnual}`,
                  "Anio":cab.Anio,
                  "idCatalogo":catalogo.id,
                  "Lectura":true,
	                "idElemento":elemento.id,                  
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                  '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                })                 
          }

          else if(elemento.id=='03-16'){
            let Valor=DatosElementos[`${cab.Anio}-12-03-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })  
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })  

            //Promedio
            let ValorPromedio= DatosElementosAcumulados[`${cab.Anio}-03-16`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })

          }

          else if(elemento.id=='03-17'){
          let Valor1= DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0
          let Valor2= DatosElementosAcumulados[`${cab.Anio}-VmmQpdpunMTqkoSjhzzj`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor2==0? 0: Valor2/Valor1,
            "ValorMostrar":Valor2==0? 0+ '%': ((Valor2/Valor1)*100).toFixed(0) + '%',
            "TipoNumero":
            (
            Valor1==0? 0: Valor2/Valor1
            )<0 ? 1 : 2
            })            
            RegistrosManagerRecaptAcumulados.push({  
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                          
              "Valor":Valor2==0? 0: Valor2/Valor1,
              "ValorMostrar":Valor2==0? 0+ '%': ((Valor2/Valor1)*100).toFixed(0) + '%',
              "TipoNumero":
              (
              Valor1==0? 0: Valor2/Valor1
              )<0 ? 1 : 2
            })  

          //Promedio
            let Valor1Prom= ( DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let Valor2Prom= ( DatosElementosPromedios[`${cab.Anio}-VmmQpdpunMTqkoSjhzzj`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
             DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
             })            
             RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
             })            
          }

          else if(
            elemento.id=='EESGPM4hWXvDlXSRnCwA' || 
            elemento.id=='od11V2OHVgaLG1RiXMiz' || 
            elemento.id=='KtA2Cxpd79TJrW9afqR9' || 
            elemento.id=='GMzSuF04XQBsPmAkIB2C' || 
            elemento.id=='JeFc3TNWBgrgubNPmDYU' || 
            elemento.id=='KNlKzH3EbD5QcXVAnbwe' || 
            elemento.id=='psmpY6iyDJNkW7AKFXgK' || 
            elemento.id=='jhtHzgzTXRPgCnWDqsUM' || 
            elemento.id=='2sAJKELNPwwAuAbU6Vlw' || 
            elemento.id=='VmmQpdpunMTqkoSjhzzj' ||  
            elemento.id=='03-6'    
          ){ 
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,            
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })
          //Promedios
            if(
            elemento.id=='od11V2OHVgaLG1RiXMiz' || 
            elemento.id=='KtA2Cxpd79TJrW9afqR9' || 
            elemento.id=='JeFc3TNWBgrgubNPmDYU' || 
            elemento.id=='KNlKzH3EbD5QcXVAnbwe' || 
            elemento.id=='jhtHzgzTXRPgCnWDqsUM' || 
            elemento.id=='2sAJKELNPwwAuAbU6Vlw' || 
            elemento.id=='VmmQpdpunMTqkoSjhzzj' ||  
            elemento.id=='03-6'    
            ){
              let ValorPromedio=
              (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
              DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "Lectura":true,
	              "idElemento":elemento.id,                 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })

            }
            else if(elemento.id=='EESGPM4hWXvDlXSRnCwA')
          {
            let Valor1= Number((DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0).toFixed(0) || 0) 
            let Valor2= Number((DatosElementosPromedios[`${cab.Anio}-KtA2Cxpd79TJrW9afqR9`]?.[0]?.Valor || 0).toFixed(0) || 0) 
            let Valor3= Number((DatosElementosPromedios[`${cab.Anio}-03-6`]?.[0]?.Valor || 0).toFixed(0) || 0) 
            let ValorPromedio=
            Valor1+Valor2+Valor3     
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

            }  
          
            else if(elemento.id=='GMzSuF04XQBsPmAkIB2C')
          {
            let Valor1= (DatosElementosPromedios[`${cab.Anio}-JeFc3TNWBgrgubNPmDYU`]?.[0]?.Valor || 0) 
            let Valor2= (DatosElementosPromedios[`${cab.Anio}-KNlKzH3EbD5QcXVAnbwe`]?.[0]?.Valor || 0) 
            let ValorPromedio=
            Valor1+Valor2
           
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })    
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })    
            }
          
            else if(elemento.id=='psmpY6iyDJNkW7AKFXgK')
          {
            let Valor1= (DatosElementosPromedios[`${cab.Anio}-jhtHzgzTXRPgCnWDqsUM`]?.[0]?.Valor || 0) 
            let Valor2= (DatosElementosPromedios[`${cab.Anio}-2sAJKELNPwwAuAbU6Vlw`]?.[0]?.Valor || 0) 
            let ValorPromedio=
            Valor1+Valor2
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            
            
            }          
          
          
           }
           
           if(elemento.id=='03-5'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-KtA2Cxpd79TJrW9afqR9`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor1==0 ? 0 : (Valor2/Valor1)*-1 ,
              "TipoNumero":(Valor1==0 ? 0 : (Valor2/Valor1)*-1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : (Valor2/Valor1)*-1)*100).toFixed(0) +'%'
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor1==0 ? 0 : (Valor2/Valor1)*-1 ,
              "TipoNumero":(Valor1==0 ? 0 : (Valor2/Valor1)*-1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : (Valor2/Valor1)*-1)*100).toFixed(0) +'%'
            })
          //Promedio
            let Valor1Prom= (DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let Valor2Prom= (DatosElementosPromedios[`${cab.Anio}-KtA2Cxpd79TJrW9afqR9`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })            
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })            
           }

           if(elemento.id=='03-7'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-03-6`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor1==0 ? 0 : (Valor2/Valor1)*-1 ,
              "TipoNumero":(Valor1==0 ? 0 : (Valor2/Valor1)*-1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : (Valor2/Valor1)*-1)*100).toFixed(0) +'%'
            })  
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor1==0 ? 0 : (Valor2/Valor1)*-1 ,
              "TipoNumero":(Valor1==0 ? 0 : (Valor2/Valor1)*-1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : (Valor2/Valor1)*-1)*100).toFixed(0) +'%'
            }) 
          //Promedio
            let Valor1Prom= (DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let Valor2Prom= (DatosElementosPromedios[`${cab.Anio}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })              
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })              
           }

           if(elemento.id=='03-8'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor1==0 ? 0 : (Valor2/Valor1)*-1 ,
              "TipoNumero":(Valor1==0 ? 0 : (Valor2/Valor1)*-1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : (Valor2/Valor1)*-1)*100).toFixed(0) +'%'
            })  
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,
              "Valor":Valor1==0 ? 0 : (Valor2/Valor1)*-1 ,
              "TipoNumero":(Valor1==0 ? 0 : (Valor2/Valor1)*-1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1==0 ? 0 : (Valor2/Valor1)*-1)*100).toFixed(0) +'%'
            })  
          //Promedio
            let Valor1Prom= (DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let Valor2Prom= (DatosElementosPromedios[`${cab.Anio}-03-6`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })             
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })             

           }

        }

        else if(catalogo.id=='04'){
          if(elemento.id=='04-01'){
            let Valor=DatosElementos[`${cab.Anio}-1-04-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 

            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-04-01`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
          }

          else if(
          elemento.id=='04-02' || 
          elemento.id=='04-03'){
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
          const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
          const item = RegistrosManagerRecapt.find(x => x.key === key);
          ValorElemento+=item==undefined?0:item.Valor 
          })
          
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,            
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })
          //Promedio
            let ValorPromedio=
            (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })           
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })           
          }

          else if(elemento.id=='04-04'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-04-01`]?.[0]?.Valor || 0
            let Valor2= Math.abs(DatosElementosAcumulados[`${cab.Anio}-04-02`]?.[0]?.Valor)  || 0
            let Valor3=DatosElementosAcumulados[`${cab.Anio}-04-03`]?.[0]?.Valor || 0

            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":(Valor3-Valor2)+Valor1,
              "TipoNumero":((Valor3-Valor2)+Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor3-Valor2)+Valor1)<0 ? ('-$ ' + (Number((((Valor3-Valor2)+Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((((Valor3-Valor2)+Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":(Valor3-Valor2)+Valor1,
              "TipoNumero":((Valor3-Valor2)+Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor3-Valor2)+Valor1)<0 ? ('-$ ' + (Number((((Valor3-Valor2)+Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((((Valor3-Valor2)+Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

          }
          else if(elemento.id=='04-05'){
          let Valor1=DatosElementosAcumulados[`${cab.Anio}-04-01`]?.[0]?.Valor || 0
          let Valor2=DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor2-Valor1,
              "TipoNumero":(Valor2-Valor1)<0 ? 1 : 2,
              "ValorMostrar": (Valor2-Valor1)<0 ? ('-$ ' + (Number(((Valor2-Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor2-Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor2-Valor1,
              "TipoNumero":(Valor2-Valor1)<0 ? 1 : 2,
              "ValorMostrar": (Valor2-Valor1)<0 ? ('-$ ' + (Number(((Valor2-Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor2-Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let Valor1Prom=DatosElementosPromedios[`${cab.Anio}-04-01`]?.[0]?.Valor || 0
            let Valor2Prom=DatosElementosPromedios[`${cab.Anio}-04-04`]?.[0]?.Valor || 0

            let ValorPromedio=Valor2Prom-Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
          } 
          else if(elemento.id=='04-06'){
          let Valor2=DatosElementosAcumulados[`${cab.Anio}-04-02`]?.[0]?.Valor || 0
          let Valor3=DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor": (Valor2/30)==0 ? 0 :  Valor3/Number((Valor2/30).toFixed(2)),
              "TipoNumero":( (Valor2/30)==0? 0 :  Valor3/ Number((Valor2/30).toFixed(2)))<0 ? 1 : 2,
              "ValorMostrar": ( (Valor2/30)==0 ? 0 :  Valor3/Number((Valor2/30).toFixed(2))).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor": (Valor2/30)==0 ? 0 :  Valor3/Number((Valor2/30).toFixed(2)),
              "TipoNumero":( (Valor2/30)==0? 0 :  Valor3/ Number((Valor2/30).toFixed(2)))<0 ? 1 : 2,
              "ValorMostrar": ( (Valor2/30)==0 ? 0 :  Valor3/Number((Valor2/30).toFixed(2))).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }) 

            //Promedio
            let Valor1Prom=Number(DatosElementosPromedios[`${cab.Anio}-04-01`]?.[0]?.Valor.toFixed(0)) || 0
            let Valor2Prom=Number(DatosElementosPromedios[`${cab.Anio}-04-02`]?.[0]?.Valor.toFixed(0)) || 0

            let ValorPromedio=Valor1Prom==0 || Valor2Prom ==0 ?0 : 30/(Valor2Prom/Valor1Prom)
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

          }
          
          else if(elemento.id=='04-07'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-04-02`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-04-06`]?.[0]?.Valor || 0
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":(30-Valor2 ) * (Valor1 / 360),
            "TipoNumero":(30-Valor2 ) * (Valor1 / 360)<0 ? 1 : 2,
            "ValorMostrar": (30-Valor2 ) * (Valor1 / 360)<0 ? ('-$ ' + (Number(((30-Valor2 ) * (Valor1 / 360) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((30-Valor2 ) * (Valor1 / 360)).toFixed(0))).toLocaleString('en-US')          
          }) 
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":(30-Valor2 ) * (Valor1 / 360),
            "TipoNumero":(30-Valor2 ) * (Valor1 / 360)<0 ? 1 : 2,
            "ValorMostrar": (30-Valor2 ) * (Valor1 / 360)<0 ? ('-$ ' + (Number(((30-Valor2 ) * (Valor1 / 360) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((30-Valor2 ) * (Valor1 / 360)).toFixed(0))).toLocaleString('en-US')          
          }) 
          //Promedio
          let Valor1Prom=Number(DatosElementosPromedios[`${cab.Anio}-04-02`]?.[0]?.Valor.toFixed(0)) || 0
          let Valor2Prom=Number(DatosElementosPromedios[`${cab.Anio}-04-06`]?.[0]?.Valor.toFixed(0)) || 0

          let ValorPromedio=(30-Valor2Prom ) * (Valor1Prom / 30)
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 
           RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 
          } 
             
        }

        else if(catalogo.id=='05'){
          if(elemento.id=='05-01'){
            let Valor=DatosElementos[`${cab.Anio}-1-05-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-05-01`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
          }

          else if(
          elemento.id=='05-02' || 
          elemento.id=='05-03'){ 
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
            let ValorPromedio=
            (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })   
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })   

          }

          else if(elemento.id=='05-04'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-05-01`]?.[0]?.Valor || 0
            let Valor2= Math.abs(DatosElementosAcumulados[`${cab.Anio}-05-02`]?.[0]?.Valor)  || 0
            let Valor3=DatosElementosAcumulados[`${cab.Anio}-05-03`]?.[0]?.Valor || 0

            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":(Valor3+Valor2)+Valor1,
              "TipoNumero":((Valor3+Valor2)+Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor3+Valor2)+Valor1)<0 ? ('-$ ' + (Number((((Valor3+Valor2)+Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((((Valor3+Valor2)+Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":(Valor3+Valor2)+Valor1,
              "TipoNumero":((Valor3+Valor2)+Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor3+Valor2)+Valor1)<0 ? ('-$ ' + (Number((((Valor3+Valor2)+Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((((Valor3+Valor2)+Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })   
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })   
          } 

          else if(elemento.id=='05-05'){
          let Valor1=DatosElementosAcumulados[`${cab.Anio}-05-01`]?.[0]?.Valor || 0
          let Valor2=DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor2-Valor1,
              "TipoNumero":(Valor2-Valor1)<0 ? 1 : 2,
              "ValorMostrar": (Valor2-Valor1)<0 ? ('-$ ' + (Number(((Valor2-Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor2-Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor2-Valor1,
              "TipoNumero":(Valor2-Valor1)<0 ? 1 : 2,
              "ValorMostrar": (Valor2-Valor1)<0 ? ('-$ ' + (Number(((Valor2-Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor2-Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let Valor1Prom=DatosElementosPromedios[`${cab.Anio}-05-01`]?.[0]?.Valor || 0
            let Valor2Prom=DatosElementosPromedios[`${cab.Anio}-05-04`]?.[0]?.Valor || 0

            let ValorPromedio=Valor2Prom-Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             


          }
          
          else if(elemento.id=='05-06'){
          let Valor2=Math.abs(DatosElementosAcumulados[`${cab.Anio}-05-03`]?.[0]?.Valor) || 0
          let Valor3=DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360),
              "TipoNumero":( Valor2==0 ? 0 :  Number((Valor3/Valor2)*360))<0 ? 1 : 2,
              "ValorMostrar": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360),
              "TipoNumero":( Valor2==0 ? 0 :  Number((Valor3/Valor2)*360))<0 ? 1 : 2,
              "ValorMostrar": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }) 
          //Promedio
          let Valor1Prom=Number(DatosElementosPromedios[`${cab.Anio}-05-03`]?.[0]?.Valor.toFixed(0)) || 0
          let Valor2Prom=Number(DatosElementosPromedios[`${cab.Anio}-05-04`]?.[0]?.Valor.toFixed(0)) || 0

          let ValorPromedio=Valor1Prom==0?0 :(Valor2Prom/(Valor1Prom*-1))*30
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 

          }

          else if(elemento.id=='05-07'){
          let Valor1=Number(DatosElementosAcumulados[`${cab.Anio}-05-03`]?.[0]?.Valor.toFixed(0)) || 0
          let Valor2=Number(DatosElementosAcumulados[`${cab.Anio}-05-06`]?.[0]?.Valor.toFixed(0)) || 0
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":(Valor2-15) * (Valor1 / 360),
            "TipoNumero":((Valor2-15) * (Valor1 / 360))<0 ? 1 : 2,
            "ValorMostrar":((Valor2-15) * (Valor1 / 360))<0 ? ('-$ ' + (Number(((Valor2-15) * (Valor1 / 360) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor2-15) * (Valor1 / 360))).toLocaleString('en-US')          
          }) 
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":(Valor2-15) * (Valor1 / 360),
            "TipoNumero":((Valor2-15) * (Valor1 / 360))<0 ? 1 : 2,
            "ValorMostrar":((Valor2-15) * (Valor1 / 360))<0 ? ('-$ ' + (Number(((Valor2-15) * (Valor1 / 360) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor2-15) * (Valor1 / 360))).toLocaleString('en-US')          
          }) 
          //Promedio
          let Valor1Prom=Number(DatosElementosPromedios[`${cab.Anio}-05-03`]?.[0]?.Valor.toFixed(0)) || 0
          let Valor2Prom=Number(DatosElementosPromedios[`${cab.Anio}-05-06`]?.[0]?.Valor.toFixed(0)) || 0

          let ValorPromedio=(Valor2Prom-15 ) * (Valor1Prom/30)
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

          }                   
        }
        else if(catalogo.id=='06'){
          if(elemento.id=='06-01'){
            let Valor=DatosElementos[`${cab.Anio}-1-06-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
          let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-06-01`]?.[0]?.Valor || 0
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })

          }

          else if(
          elemento.id=='06-02' || 
          elemento.id=='06-03'){ 
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = DatosElementos.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })

          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })           
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })
          
          //Promedio
          let ValorPromedio=
          (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })          
          RegistrosManagerRecaptPromedios.push({ 
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,            
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })          

          }

          else if(elemento.id=='06-04'){
          let Valor1=DatosElementosAcumulados[`${cab.Anio}-06-01`]?.[0]?.Valor || 0
          let Valor2= Math.abs(DatosElementosAcumulados[`${cab.Anio}-06-02`]?.[0]?.Valor)  || 0
          let Valor3=DatosElementosAcumulados[`${cab.Anio}-06-03`]?.[0]?.Valor || 0

            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":(Valor3+Valor2)+Valor1,
              "TipoNumero":((Valor3+Valor2)+Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor3+Valor2)+Valor1)<0 ? ('-$ ' + (Number((((Valor3+Valor2)+Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((((Valor3+Valor2)+Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":(Valor3+Valor2)+Valor1,
              "TipoNumero":((Valor3+Valor2)+Valor1)<0 ? 1 : 2,
              "ValorMostrar": ((Valor3+Valor2)+Valor1)<0 ? ('-$ ' + (Number((((Valor3+Valor2)+Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((((Valor3+Valor2)+Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
          let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })             
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })             
          }  
          
          else if(elemento.id=='06-05'){
          let Valor1=DatosElementosAcumulados[`${cab.Anio}-06-01`]?.[0]?.Valor || 0
          let Valor2=DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor2-Valor1,
              "TipoNumero":(Valor2-Valor1)<0 ? 1 : 2,
              "ValorMostrar": (Valor2-Valor1)<0 ? ('-$ ' + (Number(((Valor2-Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor2-Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
            DatosElementosAcumulados[`${keyAnual}`].push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor2-Valor1,
              "TipoNumero":(Valor2-Valor1)<0 ? 1 : 2,
              "ValorMostrar": (Valor2-Valor1)<0 ? ('-$ ' + (Number(((Valor2-Valor1) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor2-Valor1)).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
          let Valor1Prom=DatosElementosPromedios[`${cab.Anio}-06-01`]?.[0]?.Valor || 0
          let Valor2Prom=DatosElementosPromedios[`${cab.Anio}-06-04`]?.[0]?.Valor || 0

          let ValorPromedio=Valor2Prom-Valor1Prom
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })  
          RegistrosManagerRecaptPromedios.push({ 
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,            
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })  

          } 
          
          else if(elemento.id=='06-06'){
          let Valor2=Math.abs(DatosElementosAcumulados[`${cab.Anio}-06-03`]?.[0]?.Valor) || 0
          let Valor3=DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360),
              "TipoNumero":( Valor2==0 ? 0 :  Number((Valor3/Valor2)*360))<0 ? 1 : 2,
              "ValorMostrar": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360),
              "TipoNumero":( Valor2==0 ? 0 :  Number((Valor3/Valor2)*360))<0 ? 1 : 2,
              "ValorMostrar": Valor2==0 ? 0 :  Number((Valor3/Valor2)*360).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }) 
          //Promedio
          let Valor1Prom=Number((DatosElementosPromedios[`${cab.Anio}-06-03`]?.[0]?.Valor || 0).toFixed(0)) || 0
          let Valor2Prom=Number((DatosElementosPromedios[`${cab.Anio}-06-04`]?.[0]?.Valor || 0).toFixed(0)) || 0

          let ValorPromedio=(Valor1Prom*-1)==0?0:Valor2Prom/(Valor1Prom*-1)*30
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          }) 
          }

          else if(elemento.id=='06-07'){
          let Valor1=DatosElementosAcumulados[`${cab.Anio}-06-02`]?.[0]?.Valor || 0
          let Valor2=Number((DatosElementosAcumulados[`${cab.Anio}-06-06`]?.[0]?.Valor || 0).toFixed(0)) || 0
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":(Valor2-30) * (Valor1 / 360),
            "TipoNumero":((Valor2-30) * (Valor1 / 360))<0 ? 1 : 2,
            "ValorMostrar":((Valor2-30) * (Valor1 / 360))<0 ? ('-$ ' + (Number(((Valor2-30) * (Valor1 / 360) * -1).toFixed(0))).toLocaleString('en-US')) :
             '$ ' + (Number((Valor2-30) * (Valor1 / 360))).toLocaleString('en-US')     
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":(Valor2-30) * (Valor1 / 360),
            "TipoNumero":((Valor2-30) * (Valor1 / 360))<0 ? 1 : 2,
            "ValorMostrar":((Valor2-30) * (Valor1 / 360))<0 ? ('-$ ' + (Number(((Valor2-30) * (Valor1 / 360) * -1).toFixed(0))).toLocaleString('en-US')) :
             '$ ' + (Number((Valor2-30) * (Valor1 / 360))).toLocaleString('en-US')     
          })
          //Promedio
          let Valor1Prom=Number((DatosElementosPromedios[`${cab.Anio}-06-02`]?.[0]?.Valor || 0).toFixed(0)) || 0
          let Valor2Prom=Number((DatosElementosPromedios[`${cab.Anio}-06-06`]?.[0]?.Valor || 0).toFixed(0)) || 0

          let ValorPromedio=(Valor2Prom-30) * (Valor1Prom / 360)
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })            

          }   
          

        }

        else if(catalogo.id=='07'){
          if(elemento.id=='07-01'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-04-05`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-05-05`]?.[0]?.Valor || 0
            let Valor3= DatosElementosAcumulados[`${cab.Anio}-06-05`]?.[0]?.Valor || 0
             DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":((Valor1+Valor2)*-1)+Valor3,
              "TipoNumero":(((Valor1+Valor2)*-1)+Valor3)<0 ? 1 : 2,
              "ValorMostrar": (((Valor1+Valor2)*-1)+Valor3)<0 ? 
              ('-$ ' + (Number(((((Valor1+Valor2)*-1)+Valor3) * -1).toFixed(0))).toLocaleString('en-US')) :
              '$ ' + (Number(((((Valor1+Valor2)*-1)+Valor3)).toFixed(0))).toLocaleString('en-US')
              })  
             RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":((Valor1+Valor2)*-1)+Valor3,
                "TipoNumero":(((Valor1+Valor2)*-1)+Valor3)<0 ? 1 : 2,
                "ValorMostrar": (((Valor1+Valor2)*-1)+Valor3)<0 ? 
                ('-$ ' + (Number(((((Valor1+Valor2)*-1)+Valor3) * -1).toFixed(0))).toLocaleString('en-US')) :
                '$ ' + (Number(((((Valor1+Valor2)*-1)+Valor3)).toFixed(0))).toLocaleString('en-US')
              })
            //Promedio
              let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-07-01`]?.[0]?.Valor || 0 /12
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                  '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                })              
                RegistrosManagerRecaptPromedios.push({ 
                  "key": `${keyAnual}`,
                  "Anio":cab.Anio,
                  "idCatalogo":catalogo.id,
                  "Lectura":true,
                  "idElemento":elemento.id,                
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                  '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                })              
          }
          else if(elemento.id=='07-02'){
          let Valor1= DatosElementosAcumulados[`${cab.Anio}-07-01`]?.[0]?.Valor || 0
          let Valor2= DatosElementosAcumulados[`${cab.Anio}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 0

          let Valor=Valor1<0?(Valor2+(Valor1*-1)):Valor1
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2,
            "ValorMostrar": (Valor)<0 ? 
            ('-$ ' + (Number(((Valor) * -1).toFixed(0))).toLocaleString('en-US')) :
            '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2,
            "ValorMostrar": (Valor)<0 ? 
            ('-$ ' + (Number(((Valor) * -1).toFixed(0))).toLocaleString('en-US')) :
            '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          //Promedio
          let ValorPromedio= DatosElementosAcumulados[`${cab.Anio}-07-02`]?.[0]?.Valor || 0 /12
           DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })
           RegistrosManagerRecaptPromedios.push({ 
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,            
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })

          }

          else if(
          elemento.id=='07-03' || 
          elemento.id=='07-08'){
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          }) 
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,            
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
          })
           //Promedio
          let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0 /12
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })          
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "Lectura":true,
	          "idElemento":elemento.id,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })          
          
          




          }

          else if(elemento.id=='07-04'){
           let Valor1=DatosElementosAcumulados[`${cab.Anio}-07-02`]?.[0]?.Valor || 0
           let Valor2=DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0

           let Valor=Valor2==0?0:Valor1/Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
          //Promedio
          let Valor1Prom= (DatosElementosPromedios[`${cab.Anio}-07-02`]?.[0]?.Valor || 0) 
          let Valor2Prom= (DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
          let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })            
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })            
          }

          else if(elemento.id=='07-05'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-07-03`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0

            let Valor=Valor2==0?0:Valor1/Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
          //Promedio
            let Valor1Prom= (DatosElementosPromedios[`${cab.Anio}-07-03`]?.[0]?.Valor || 0) 
            let Valor2Prom= (DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })             
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
            })             
          }

          else if(elemento.id=='07-06'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-04-07`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-05-07`]?.[0]?.Valor || 0
            let Valor3= DatosElementosAcumulados[`${cab.Anio}-06-05`]?.[0]?.Valor || 0
          
             DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":(Valor1+Valor2+Valor3),
              "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
              ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
              '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
             })  
             RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":(Valor1+Valor2+Valor3),
              "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
              "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
              ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
              '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
             })  

          //Promedio
            let ValorPromedio= DatosElementosAcumulados[`${cab.Anio}-07-06`]?.[0]?.Valor || 0 /12
             DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
             RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })

          }

          else if(elemento.id=='07-07'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-07-06`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 0

            let Valor=Valor1<0?(Valor2+(Valor1*-1)):Valor1
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor)<0 ? 
              ('-$ ' + (Number(((Valor) * -1).toFixed(0))).toLocaleString('en-US')) :
              '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor)<0 ? 
              ('-$ ' + (Number(((Valor) * -1).toFixed(0))).toLocaleString('en-US')) :
              '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            })
          //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-07-07`]?.[0]?.Valor /12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

          }          
          else if(elemento.id=='07-09'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-07-07`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0

            let Valor=Valor2==0?0:Valor1/Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            //Promedio
            let Valor1Prom= ( DatosElementosPromedios[`${cab.Anio}-07-07`]?.[0]?.Valor || 0) 
            let Valor2Prom= ( DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
              })  
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "Lectura":true,
	              "idElemento":elemento.id,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
              })  
          }
          else if(elemento.id=='07-10'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-07-08`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0

            let Valor=Valor2==0?0:Valor1/Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2,
              "ValorMostrar": (Valor*100).toFixed(0) + '%'
            })
          //Promedio
            let Valor1Prom= (DatosElementosPromedios[`${cab.Anio}-07-08`]?.[0]?.Valor || 0) 
            let Valor2Prom= (DatosElementosPromedios[`${cab.Anio}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0) 
            let ValorPromedio=Valor1Prom==0 ? 0 : Valor2Prom/Valor1Prom
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
              })  
              RegistrosManagerRecaptPromedios.push({ 
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
              })  


          }


        }
        else if(catalogo.id=='08'){
          if(elemento.id=='08-01'){
            let Valor= DatosElementos[`${cab.Anio}-1-08-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let ValorPromedio= DatosElementosAcumulados[`${cab.Anio}-08-01`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

            
          }
          
          else if(
          elemento.id=='08-02' || 
          elemento.id=='08-03'){
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 

            let ValorPromedio=
            (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })

          } 
          
          if(elemento.id=='08-04'){
             let Valor1=DatosElementosAcumulados[`${cab.Anio}-08-01`]?.[0]?.Valor || 0
             let Valor2=DatosElementosAcumulados[`${cab.Anio}-08-02`]?.[0]?.Valor || 0
             let Valor3=DatosElementosAcumulados[`${cab.Anio}-08-03`]?.[0]?.Valor || 0
             
             DatosElementosAcumulados[`${keyAnual}`].push({ 
               "Valor":(Valor1+Valor2+Valor3),
               "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
               "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
               ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
               '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
             })
             RegistrosManagerRecaptAcumulados.push({
               "key": `${keyAnual}`,
               "Anio":cab.Anio,
               "idCatalogo":catalogo.id,
               "idElemento":elemento.id,
               "Lectura":true,               
               "Valor":(Valor1+Valor2+Valor3),
               "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
               "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
               ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
               '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
             })
             
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-08-04`]?.[0]?.Valor || 0
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })              
              RegistrosManagerRecaptPromedios.push({ 
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })              
          }  
          
        }

        else if(catalogo.id=='09'){
          if(elemento.id=='09-01'){
            let Valor=DatosElementos[`${cab.Anio}-1-09-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-09-01`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             

          }

          else if(
          elemento.id=='09-02' || 
          elemento.id=='09-03'){
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })
            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":ValorElemento,
            "TipoNumero":ValorElemento<0 ? 1 : 2,
            "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 

            let ValorPromedio=
            (DatosElementosAcumulados[`${cab.Anio}-${elemento.id}`]?.[0]?.Valor || 0)/12
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })
          } 
          
          else if(elemento.id=='09-04'){
             let Valor1= DatosElementosAcumulados[`${cab.Anio}-09-01`]?.[0]?.Valor || 0
             let Valor2= DatosElementosAcumulados[`${cab.Anio}-09-02`]?.[0]?.Valor || 0
             let Valor3= DatosElementosAcumulados[`${cab.Anio}-09-03`]?.[0]?.Valor || 0
             
              DatosElementosAcumulados[`${keyAnual}`].push({ 
               "Valor":(Valor1+Valor2+Valor3),
               "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
               "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
               ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
               '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
              }) 
              RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                 
               "Valor":(Valor1+Valor2+Valor3),
               "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
               "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
               ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
               '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
              }) 

            //Promedio
            let ValorPromedio= DatosElementosAcumulados[`${cab.Anio}-09-04`]?.[0]?.Valor || 0
             DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })              
             RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
             })              
          }          

        }

        else if(catalogo.id=='10'){
          if(elemento.id=='10-01'){
            let Valor=DatosElementos[`${cab.Anio}-1-10-01`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-10-01`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })             

          }
          else if(
          elemento.id=='10-02' || 
          elemento.id=='10-03'){
          let ValorElemento=0
          Meses.sort((a, b) => a.NumMes - b.NumMes).forEach((mes) => {
            const key = `${cab.Anio}-${mes.NumMes}-${elemento.id}`;
            const item = RegistrosManagerRecapt.find(x => x.key === key);
            ValorElemento+=item==undefined?0:item.Valor 
          })
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
            }) 
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-08-01`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "Lectura":true,
	            "idElemento":elemento.id,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

          }  
          if(elemento.id=='10-04'){
             let Valor1=DatosElementosAcumulados[`${cab.Anio}-10-01`]?.[0]?.Valor || 0
             let Valor2=DatosElementosAcumulados[`${cab.Anio}-10-02`]?.[0]?.Valor || 0
             let Valor3=DatosElementosAcumulados[`${cab.Anio}-10-03`]?.[0]?.Valor || 0
             
             DatosElementosAcumulados[`${keyAnual}`].push({ 
               "Valor":(Valor1+Valor2+Valor3),
               "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
               "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
               ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
               '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
             }) 
             RegistrosManagerRecaptAcumulados.push({ 
               "key": `${keyAnual}`,
               "Anio":cab.Anio,
               "idCatalogo":catalogo.id,
               "idElemento":elemento.id,
               "Lectura":true,
               "Valor":(Valor1+Valor2+Valor3),
               "TipoNumero":(Valor1+Valor2+Valor3)<0 ? 1 : 2,
               "ValorMostrar": ((Valor1+Valor2+Valor3))<0 ? 
               ('-$ ' + (Number((((Valor1+Valor2+Valor3)*-1)).toFixed(0))).toLocaleString('en-US')) :
               '$ ' + (Number(((Valor1+Valor2+Valor3)).toFixed(0))).toLocaleString('en-US')
             }) 
            //Promedio
            let ValorPromedio=DatosElementosAcumulados[`${cab.Anio}-10-04`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 

           }          
        }

        else if(catalogo.id=='11'){
          if(elemento.id=='11-01'){
            let Valor=DatosElementosAcumulados[`${cab.Anio}-VmmQpdpunMTqkoSjhzzj`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
            let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-11-01`]?.[0]?.Valor || 0 ) /12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            }) 
          }
          else if(elemento.id=='11-02'){
            let Valor= DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0
               DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
               }) 
               RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
               }) 
            //Promedio
              let ValorPromedio=Number( DatosElementosAcumulados[`${cab.Anio}-11-02`]?.[0]?.Valor || 0 ) /12
               DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
               })           
               RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
               })           
          } 
          else if(elemento.id=='11-03'){
            let Valor= DatosElementosAcumulados[`${cab.Anio}-04-05`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
              }) 
              RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
              }) 
              //Promedio
            let ValorPromedio=Number( DatosElementosAcumulados[`${cab.Anio}-11-03`]?.[0]?.Valor || 0 ) /12
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              }) 
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              }) 

          }  
          
          else if(elemento.id=='11-04'){
            let Valor= DatosElementosAcumulados[`${cab.Anio}-05-05`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
              }) 
               RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
              }) 
            //Promedio
              let ValorPromedio=Number( DatosElementosAcumulados[`${cab.Anio}-11-04`]?.[0]?.Valor || 0 ) /12
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })           
              RegistrosManagerRecaptPromedios.push({ 
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })           
          } 

          else if(elemento.id=='11-05'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-08-04`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-08-01`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor1-Valor2,
                "TipoNumero":Valor1-Valor2<0 ? 1 : 2,
                "ValorMostrar": (Valor1-Valor2)<0 ? ('-$ ' + (Number(((Valor1-Valor2) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor1-Valor2).toFixed(0))).toLocaleString('en-US')
              })
              RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":Valor1-Valor2,
                "TipoNumero":Valor1-Valor2<0 ? 1 : 2,
                "ValorMostrar": (Valor1-Valor2)<0 ? ('-$ ' + (Number(((Valor1-Valor2) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor1-Valor2).toFixed(0))).toLocaleString('en-US')
              })
            //Promedio
              let ValorPromedio=Number( DatosElementosAcumulados[`${cab.Anio}-11-05`]?.[0]?.Valor || 0 ) /12
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })            
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })            
          }  
          else if(elemento.id=='11-06'){
            let Valor=DatosElementosAcumulados[`${cab.Anio}-06-05`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
            let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-11-06`]?.[0]?.Valor || 0 ) /12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })           
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })           
          }
          
          else if(elemento.id=='11-07'){
            let Valor1=DatosElementosAcumulados[`${cab.Anio}-10-04`]?.[0]?.Valor || 0
            let Valor2=DatosElementosAcumulados[`${cab.Anio}-10-01`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor1-Valor2,
                "TipoNumero":Valor1-Valor2<0 ? 1 : 2,
                "ValorMostrar": (Valor1-Valor2)<0 ? ('-$ ' + (Number(((Valor1-Valor2) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor1-Valor2).toFixed(0))).toLocaleString('en-US')
              })
              RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":Valor1-Valor2,
                "TipoNumero":Valor1-Valor2<0 ? 1 : 2,
                "ValorMostrar": (Valor1-Valor2)<0 ? ('-$ ' + (Number(((Valor1-Valor2) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor1-Valor2).toFixed(0))).toLocaleString('en-US')
              })
            //Promedio
              let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-11-07`]?.[0]?.Valor || 0 ) /12
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })            
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })            
          } 

        }

        else if(catalogo.id=='12'){
          if(elemento.id=='12-01'){
          let Valor=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          //Promedio
          let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-12-01`]?.[0]?.Valor || 0 ) /12
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })           
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })           

          }
          else if(elemento.id=='12-02'){
            let Valor=DatosElementosAcumulados[`${cab.Anio}-06-02`]?.[0]?.Valor|| 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
            let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-12-02`]?.[0]?.Valor || 0 ) /12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })           
            RegistrosManagerRecaptPromedios.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,               
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })           
          }  
          else if(elemento.id=='12-03'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-12-02`]?.[0]?.Valor|| 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-12-01`]?.[0]?.Valor|| 0
            let Valor= (Valor2/30)==0 ? 0 :Valor1/(Valor2/30)
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Number(Valor.toFixed(0)).toLocaleString('en-US')
              }) 
              DatosElementosAcumulados[`${keyAnual}`].push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                 
                "Valor":Valor,
                "TipoNumero":Valor<0 ? 1 : 2,
                "ValorMostrar": Number(Valor.toFixed(0)).toLocaleString('en-US')
              }) 
        
              //Promedio
              let Valor1Prom=Number( DatosElementosPromedios[`${cab.Anio}-12-01`]?.[0]?.Valor.toFixed(0)) || 0
              let Valor2Prom=Number( DatosElementosPromedios[`${cab.Anio}-12-02`]?.[0]?.Valor.toFixed(0)) || 0

              let ValorPromedio=(Valor1Prom/30)==0?0:Valor2Prom/(Valor1Prom/30)
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })         
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })         

          } 
          else if(elemento.id=='12-04'){
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-03-6`]?.[0]?.Valor || 0) *-1 || 0
            DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":Valor,
              "TipoNumero":Valor<0 ? 1 : 2,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
            }) 
          //Promedio
            let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-12-04`]?.[0]?.Valor || 0 ) /12
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
              '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
            })  

          } 
          else if(elemento.id=='12-05'){
            let Valor=1-DatosElementosAcumulados[`${cab.Anio}12-11`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":
              (
              Valor
              )<0 ? 1 : 2 
            })
            RegistrosManagerRecaptAcumulados.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                          
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":
              (
              Valor
              )<0 ? 1 : 2 
            })

          //Promedio
            let ValorPromedio=1-DatosElementosPromedios[`${cab.Anio}-12-11`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })            

          }  
          
          else if(elemento.id=='12-06'){
            let Valor= DatosElementosAcumulados[`${cab.Anio}-03-7`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({              
                "Valor":
                 Valor,
                "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
                "TipoNumero":
                (
                 Valor
                )<0 ? 1 : 2
              })
              RegistrosManagerRecaptAcumulados.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,                              
                "Valor":
                 Valor,
                "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
                "TipoNumero":
                (
                 Valor
                )<0 ? 1 : 2
              })
            //Promedio
              let ValorPromedio=DatosElementosPromedios[`${cab.Anio}-03-7`]?.[0]?.Valor || 0
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
              })  
              RegistrosManagerRecaptPromedios.push({ 
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,              
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
              })               
          }   
          else if(elemento.id=='12-07'){
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-02-08`]?.[0]?.Valor || 0)*-1
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
              //Promedio
              let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-12-07`]?.[0]?.Valor || 0 ) /12
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })           
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })            



          }  
          else if(elemento.id=='12-08'){
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-KtA2Cxpd79TJrW9afqR9`]?.[0]?.Valor || 0)*-1
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor, 
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":
              (
               Valor
              )<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor, 
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":
              (Valor)<0 ? 1 : 2
            })
              //Promedio
              let ValorPromedio=Number(DatosElementosAcumulados[`${cab.Anio}-12-08`]?.[0]?.Valor || 0 ) /12
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })           
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })            
          }
          
          else if(elemento.id=='12-09'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-08`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor=(Valor2)==0 ? 0 : ((Valor1/Valor2)*-1)
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

          //Promedio
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-08`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0          
            let ValorPromedio=(Valor2Promedio)==0 ? 0 : ((Valor1Promedio/Valor2Promedio)*-1)
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })             
          } 
          else if(elemento.id=='12-10'){
            let Valor= DatosElementosAcumulados[`${cab.Anio}-03-5`]?.[0]?.Valor || 0
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":
                (
                 Valor
                )<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":
                (
                Valor
                )<0 ? 1 : 2
            })
          //Promedio         
            let ValorPromedio=DatosElementosPromedios[`${cab.Anio}-03-5`]?.[0]?.Valor || 0
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })             


          } 
          else if(elemento.id=='12-11'){
          let Valor1=DatosElementosAcumulados[`${cab.Anio}-02-03`]?.[0]?.Valor || 0
          let Valor2=DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
          let Valor=(Valor2)==0 ? 0 : ((Valor1/Valor2))
          DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
            "TipoNumero":(Valor)<0 ? 1 : 2
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,                          
            "Valor":Valor,
            "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
            "TipoNumero":(Valor)<0 ? 1 : 2
          })

          //Promedio
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-03`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0          
            let ValorPromedio=(Valor2Promedio)==0 ? 0 : ((Valor1Promedio/Valor2Promedio))
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })          
          }
          else if(elemento.id=='12-12'){
            let Valor1= DatosElementos[`${cab.Anio}-02-09`]?.[0]?.Valor || 0
            let Valor2= DatosElementos[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor=(Valor2)==0 ? 0 : ((Valor1/Valor2))
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
          //Promedio
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-09`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0          
            let ValorPromedio=(Valor2Promedio)==0 ? 0 : ((Valor1Promedio/Valor2Promedio))
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })             


          } 
          else if(elemento.id=='12-13'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor=(Valor2)==0 ? 0 : (((Valor1)/Valor2))
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":(Valor),
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

          //Promedio
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-15`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0          
            let ValorPromedio=(Valor2Promedio)==0 ? 0 : ((Valor1Promedio/Valor2Promedio))
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })             

          } 
          else if(elemento.id=='12-14'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-17`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor=(Valor2)==0 ? 0 : (((Valor1)/Valor2))
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

          //Promedio
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-17`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0          
            let ValorPromedio=(Valor2Promedio)==0 ? 0 : ((Valor1Promedio/Valor2Promedio))
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })            

          } 
          else if(elemento.id=='12-15'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-05`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-02-01`]?.[0]?.Valor || 0
            let Valor=(Valor2)==0 ? 0 : (((Valor1*-1)/Valor2))
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":(Valor),
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":(Valor),
              "ValorMostrar": ((Valor)*100).toFixed(0) +'%',
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
          //Promedio
            let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-05`]?.[0]?.Valor || 0
            let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-02-01`]?.[0]?.Valor || 0          
            let ValorPromedio=(Valor2Promedio)==0 ? 0 : (((Valor1Promedio*-1)/Valor2Promedio))
            DatosElementosPromedios[`${keyAnual}`].push({ 
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })  
            RegistrosManagerRecaptPromedios.push({ 
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,              
              "Valor":ValorPromedio,
              "TipoNumero":ValorPromedio<0 ? 1 : 2,
              "ValorMostrar": ((ValorPromedio)*100).toFixed(0) +'%',
            })            

          } 
          
          else if(elemento.id=='12-16'){
            let Valor1= DatosElementosAcumulados[`${cab.Anio}-02-08`]?.[0]?.Valor || 0
            let Valor2= DatosElementosAcumulados[`${cab.Anio}-12-11`]?.[0]?.Valor || 0
            let Valor=(Valor2)==0 ? 0 : ((Valor1/Valor2)*-1)
            DatosElementosAcumulados[`${keyAnual}`].push({              
              "Valor":Valor,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
              //Promedio
              let Valor1Promedio= DatosElementosPromedios[`${cab.Anio}-02-08`]?.[0]?.Valor || 0
              let Valor2Promedio= DatosElementosPromedios[`${cab.Anio}-12-11`]?.[0]?.Valor || 0
              let ValorPromedio=(Valor2Promedio)==0 ? 0 : ((Valor1Promedio/Valor2Promedio)*-1)
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })           
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              }) 

          }
          
          else if(elemento.id=='12-17'){
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-12-16`]?.[0]?.Valor || 0) /12
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
            "TipoNumero":((DatosElementosAcumulados[`${cab.Anio}-12-16`]?.[0]?.Valor || 0) /12)<0 ? 1 : 2
            })
            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US'),
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

              //Promedio
              let ValorPromedio=(DatosElementosPromedios[`${cab.Anio}-12-16`]?.[0]?.Valor || 0) /4.33
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })           
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
                '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
              })             

          }    

        
        }

        // Actividad y gestión

        else if(catalogo.id=='13'){
          if(elemento.id=='13-01')
          {
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-04-06`]?.[0]?.Valor || 0)
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            
            let ValorPromedio=(DatosElementosPromedios[`${cab.Anio}-04-06`]?.[0]?.Valor || 0)
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              }) 
              
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              })               
          }
         else if(elemento.id=='13-02')
          {
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-05-06`]?.[0]?.Valor || 0)
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            
            let ValorPromedio=(DatosElementosPromedios[`${cab.Anio}-05-06`]?.[0]?.Valor || 0)
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              }) 
              
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              })               
          }
         else if(elemento.id=='13-03')
          {
            let Valor=(DatosElementosAcumulados[`${cab.Anio}-06-06`]?.[0]?.Valor || 0)
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            
            let ValorPromedio=(DatosElementosPromedios[`${cab.Anio}-06-06`]?.[0]?.Valor || 0)
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              }) 
              
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              })               
          }
         else if(elemento.id=='13-04')
          {
            let Valor1=(DatosElementosAcumulados[`${cab.Anio}-13-01`]?.[0]?.Valor || 0)
            let Valor2=(DatosElementosAcumulados[`${cab.Anio}-13-02`]?.[0]?.Valor || 0)
            let Valor3=(DatosElementosAcumulados[`${cab.Anio}-13-03`]?.[0]?.Valor || 0)
            let Valor=Valor1 + Valor2 - Valor3
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })
            
            let ValorPromedio1=(DatosElementosPromedios[`${cab.Anio}-13-01`]?.[0]?.Valor || 0)
            let ValorPromedio2=(DatosElementosPromedios[`${cab.Anio}-13-02`]?.[0]?.Valor || 0)
            let ValorPromedio3=(DatosElementosPromedios[`${cab.Anio}-13-03`]?.[0]?.Valor || 0)
            let ValorPromedio=ValorPromedio1+ValorPromedio2+ValorPromedio3
              DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              }) 
              
              RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
              })               
          }

        }
        // Retorno y rentabilidad

        else if(catalogo.id=='14'){
          if(elemento.id=='14-01')
          {
            let Valor1=(DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0)
            let Valor2=(DatosElementosAcumulados[`${cab.Anio}-02-17`]?.[0]?.Valor || 0)
            let Valor=Valor2==0? 0: Valor1/Valor2
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

            //Promedios
            let ValorPromedio1=(DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0)
            let ValorPromedio2=(DatosElementosAcumulados[`${cab.Anio}-02-17`]?.[0]?.Valor || 0)
            let ValorPromedio=ValorPromedio2==0? 0: ValorPromedio1/ValorPromedio2            
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            }) 
              
            RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            })             
            
          }
    
         else if(elemento.id=='14-02')
          {
            let Valor1=(DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0)
            let Valor2=(DatosElementosAcumulados[`${cab.Anio}-02-05`]?.[0]?.Valor || 0)
            let Valor=(Valor2*-1)==0? 0: Valor1/(Valor2*-1)
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

            //Promedios
            let ValorPromedio1=(DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0)
            let ValorPromedio2=(DatosElementosAcumulados[`${cab.Anio}-02-05`]?.[0]?.Valor || 0)
            let ValorPromedio=ValorPromedio2==0? 0: ValorPromedio1/ValorPromedio2            
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            }) 
              
            RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            })             
            
          }  
         else if(elemento.id=='14-03')
          {
            let Valor1=(DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0)
            let Valor2=(DatosElementosAcumulados[`${cab.Anio}-04-01`]?.[0]?.Valor || 0)
            let Valor3=(DatosElementosAcumulados[`${cab.Anio}-05-01`]?.[0]?.Valor || 0)
            let Valor=(Valor2+Valor3)==0? 0: Valor1/(Valor2+Valor3)
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

            //Promedios
            let ValorPromedio1=(DatosElementosAcumulados[`${cab.Anio}-02-15`]?.[0]?.Valor || 0)
            let ValorPromedio2=(DatosElementosAcumulados[`${cab.Anio}-04-01`]?.[0]?.Valor || 0)
            let ValorPromedio3=(DatosElementosAcumulados[`${cab.Anio}-05-01`]?.[0]?.Valor || 0)
            let ValorPromedio=(ValorPromedio2+ValorPromedio3)==0? 0: ValorPromedio1/(ValorPromedio2+ValorPromedio3)           
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            }) 
              
            RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            })                         
          }   
          
        }
        // Liquidez y solvencia
        else if(catalogo.id=='15'){
          if(elemento.id=='15-01'){
          let Valor1=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          let Valor2=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          let Valor3=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          let Valor=(Valor2+Valor3)==0? 0: Valor1/(Valor2+Valor3)
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          //Promedio
          let ValorPromedio1=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          let ValorPromedio2=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          let ValorPromedio3=(DatosElementosAcumulados[`${cab.Anio}-02-02`]?.[0]?.Valor || 0)*-1 || 0
          let ValorPromedio=(ValorPromedio2+ValorPromedio3)==0? 0: ValorPromedio1/(ValorPromedio2+ValorPromedio3)          
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })           
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })           

          }   
          else if(elemento.id=='15-02')
          {
            let Valor1=(DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0)
            let Valor2=(DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0)
            let Valor3=(DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0)
            let Valor=Valor3==0?0 :(Valor1 + Valor2) / Valor3
            DatosElementosAcumulados[`${keyAnual}`].push({              
            "Valor":Valor,
            "ValorMostrar": Valor,
            "TipoNumero":(Valor)<0 ? 1 : 2
            }) 

            RegistrosManagerRecaptAcumulados.push({
              "key": `${keyAnual}`,
              "Anio":cab.Anio,
              "idCatalogo":catalogo.id,
              "idElemento":elemento.id,
              "Lectura":true,                            
              "Valor":Valor,
              "ValorMostrar": Valor,
              "TipoNumero":(Valor)<0 ? 1 : 2
            })

            //Promedios
            let ValorPromedio1=(DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0)
            let ValorPromedio2=(DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0)
            let ValorPromedio3=(DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0)
            let ValorPromedio=ValorPromedio3==0?0 :(ValorPromedio1 + ValorPromedio2) / Valor3           
            
            DatosElementosPromedios[`${keyAnual}`].push({ 
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            }) 
              
            RegistrosManagerRecaptPromedios.push({
                "key": `${keyAnual}`,
                "Anio":cab.Anio,
                "idCatalogo":catalogo.id,
                "idElemento":elemento.id,
                "Lectura":true,             
                "Valor":ValorPromedio,
                "TipoNumero":ValorPromedio<0 ? 1 : 2,
                "ValorMostrar": ValorPromedio
            })             
            
          }  
          else if(elemento.id=='15-03'){
          let Valor1=(DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0)*-1 || 0
          let Valor2=(DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0)*-1 || 0
          let Valor3=(DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0)*-1 || 0
          let Valor=Valor1 + Valor2 - Valor3
          DatosElementosAcumulados[`${keyAnual}`].push({ 
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          RegistrosManagerRecaptAcumulados.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":Valor,
            "TipoNumero":Valor<0 ? 1 : 2,
            "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
          })
          //Promedio
          let ValorPromedio1=(DatosElementosAcumulados[`${cab.Anio}-04-04`]?.[0]?.Valor || 0)*-1 || 0
          let ValorPromedio2=(DatosElementosAcumulados[`${cab.Anio}-05-04`]?.[0]?.Valor || 0)*-1 || 0
          let ValorPromedio3=(DatosElementosAcumulados[`${cab.Anio}-06-04`]?.[0]?.Valor || 0)*-1 || 0
          let ValorPromedio=ValorPromedio1 + ValorPromedio2 - ValorPromedio3        
          DatosElementosPromedios[`${keyAnual}`].push({ 
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })           
          RegistrosManagerRecaptPromedios.push({
            "key": `${keyAnual}`,
            "Anio":cab.Anio,
            "idCatalogo":catalogo.id,
            "idElemento":elemento.id,
            "Lectura":true,             
            "Valor":ValorPromedio,
            "TipoNumero":ValorPromedio<0 ? 1 : 2,
            "ValorMostrar": ValorPromedio<0 ? ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : 
            '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
          })           

          }                          

        }

        }
         
      });
    });
  });
  return {
    "RegistrosManagerRecapt":RegistrosManagerRecapt,
    "RegistrosManagerRecaptAcumulados":RegistrosManagerRecaptAcumulados,
    "RegistrosManagerRecaptPromedios":RegistrosManagerRecaptPromedios
  }
}

                  let Valor=this.getDataAcumulado(keyAnual,catalogo.id)
                  DatosElementosAcumulados[`${keyAnual}`].push({ 
                    "Valor":Valor,
                    "TipoNumero":Valor<0 ? 1 : 2,
                    "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                  })                
                   DatosElementosPromedios[`${keyAnual}`].push({ 
                     "Valor":(Valor/12),
                     "TipoNumero":(Valor/12)<0 ? 1 : 2,
                     "ValorMostrar": (Valor/12)<0 ? 
                     ('-$ ' + (Number(((Valor/12) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor/12)).toFixed(0))).toLocaleString('en-US')
                   })

                    this.actualizarValorSimple(
                    elemento.id,keyPromedioAnio,
                    DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
  
                    this.actualizarValorSimple(
                    elemento.id,keyAcumuladoAnio,
                    DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

actualizarData(Anio:any,Mes:any,MesNombre:any,Valor:any,idElemento:any,idCatalogo:any){
   try {

      let DatosElementos = [];
      let DatosElementosPromedios = [];
      let DatosElementosAcumulados = [];
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
       let Registro = 
       {
         "FechaRegistro":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
         "MesRegistro":MesNombre,
         "NumMesRegistro":Mes,
         "Trimestre":this.setTrim(MesNombre),
         "idEmpresa":this.usuario.idEmpresa,
         "FechaActualizacion":"",
         "AnioRegistro": Anio,    
         "idElemento": idElemento,    
         "Valor": Number(Valor),    
         "idCatalogo": idCatalogo  
       }
       console.log('Registro',Registro)
   
       //this.conS.guardarOModificarRegistro(Registro).then(resp=>{         
         this. CatalogoElementos.forEach((catalogo) => {
             const copiaCatalogoElementos = [...catalogo.Elementos].sort(
             (a, b) => a.OrdenData - b.OrdenData  );
           copiaCatalogoElementos.forEach((elemento) => {
           const key = `${Anio}-${Mes}-${elemento.id}`;
           const keyAnioMes = `${MesNombre} ${Anio}`;
           const keyAcumuladoAnio = `Acumulado ${Anio}`;
           const keyPromedioAnio = `Promedio ${Anio}`;
           
     
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
               else if(elemento.id == "01-09"){
                   let Valor =this.getValoresManagerRecapValorNumero(key)
             
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                       : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura: Valor==
                       0
                         ? false
                         : true});
                 this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)                
               } 
               else if(
                elemento.id == "01-09" || 
                elemento.id == "02-17" || 
                elemento.id == "02-02" || 
                elemento.id == "02-05" || 
                elemento.id == "02-06" || 
                elemento.id == "02-07" || 
                elemento.id == "02-11" || 
                elemento.id == "02-12" || 
                elemento.id == "02-13" || 
                elemento.id == "04-02" || 
                elemento.id == "04-03" || 
                elemento.id == "05-02" || 
                elemento.id == "02-14"  
               )
               {
                   let Valor =this.getValoresManagerRecapValorNumero(key)
             
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                       : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
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
                   let Valor1 =DatosElementos[`${Anio}-${Mes}-01-03`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-03`);
                   let Valor2 =DatosElementos[`${Anio}-${Mes}-01-01`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-01`);
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
                   let Valor1 =DatosElementos[`${Anio}-${Mes}-01-03`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-03`);
                   let Valor2 =DatosElementos[`${Anio}-${Mes}-01-04`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-04`);
                   let Valor =Valor1 + Valor2
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Valor,
                     Lectura: Valor==0
                         ? false
                         : true});
         
                 this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0) 
                  let MesesCabecera = this.construirTiempos().MesesSeleccionados.filter((mes:any)=>mes.NumMes!=1)
                   MesesCabecera.forEach((mesCab:any)=>{   
                   if (!DatosElementos[`${Anio}-${mesCab.NumMes}-01-05`]) {
                       DatosElementos[`${Anio}-${mesCab.NumMes}-01-05`] = [];
                   } 
                   let Valor1 =DatosElementos[`${Anio}-${Mes}-01-03`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-03`);
                   let Valor2 =DatosElementos[`${Anio}-${Mes}-01-04`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-04`);
                   let Valor =Valor1 + Valor2
                   DatosElementos[`${Anio}-${mesCab.NumMes}-01-05`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Valor,
                     Lectura: true});
                     
                   this.actualizarValorSimple('01-05',`${mesCab.Mes} ${Anio}`,DatosElementos[`${Anio}-${mesCab.NumMes}-01-05`]?.[0]?.ValorMostrar || 0) 
                  })   
                  MesesCabecera.forEach((mesCab:any)=>{   
                   if (!DatosElementos[`${Anio}-${mesCab.NumMes}-01-04`]) {
                       DatosElementos[`${Anio}-${mesCab.NumMes}-01-04`] = [];
                   } 
                  let ValorElemento =DatosElementos[`${Anio}-${mesCab.NumMes-1}-01-05`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${mesCab.NumMes-1}-01-05`);
                   DatosElementos[`${Anio}-${mesCab.NumMes}-01-04`].push({
                     Valor:ValorElemento,
                     TipoNumero:ValorElemento < 0 ? 1 : 2,
                     ValorMostrar:ValorElemento,
                     Lectura: true});
                     
                   this.actualizarValorSimple('01-04',`${mesCab.Mes} ${Anio}`,DatosElementos[`${Anio}-${mesCab.NumMes}-01-04`]?.[0]?.ValorMostrar || 0) 
                  })   
     
     
                 }  
                 else if (elemento.id == "01-07") {
                   let Valor1 =DatosElementos[`${Anio}-${Mes}-01-05`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-05`);
                   let Valor2 =DatosElementos[`${Anio}-${Mes}-01-06`]?.[0]?.Valor || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-06`);
                   let Valor = Valor2 == 0 ? 0 : Valor1 / Valor2
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor).toFixed(2),
                     Lectura: Valor==0
                         ? false
                         : true});
         
                 this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0) 
                 }   
                 else if (elemento.id == "01-08") {
                   let Valor1 =
                     DatosElementos[`${Anio}-${Mes}-01-09`]?.[0]?.Valor ||
                     this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-09`);
                   let Valor2 =
                     DatosElementos[`${Anio}-${Mes}-01-07`]?.[0]?.Valor ||
                     this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-07`);
                   let Valor3 =
                     DatosElementos[`${Anio}-${Mes}-01-05`]?.[0]?.Valor ||
                     this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-05`);
                   let Valor =
                     Valor2 == 0 || Valor3 == 0 ? 0 : Valor1 / Valor2 / Valor3;
     
            
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:
                       Valor < 0 ? "-$ " + Number((Valor * -1).toFixed(3)).toLocaleString("en-US")
                       : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura: Valor < 0
                         ? false
                         : true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0) 
                 }  
                   
               }
               //Estado de Resultados
               else if (catalogo.id == "02") {
                 if (elemento.id == "02-01") {
                   let Valor =
                     DatosElementos[`${Anio}-${Mes}-01-09`]?.[0]?.Valor || 
                     this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-01-09`)
     
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor 
                   ||  this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-02`]?.[0]?.Valor 
                   || this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-02`)
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-03`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor ||
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-05`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-06`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-02-07`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-07`)
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-03`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-08`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-08`)
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-09`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-09`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-09`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-09`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-10`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-10`)
     
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-02-11`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-11`)
     
                   let Valor4 = DatosElementos[`${Anio}-${Mes}-02-12`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-12`)
     
                   let Valor5 = DatosElementos[`${Anio}-${Mes}-02-13`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-13`)
     
                   let Valor6 = DatosElementos[`${Anio}-${Mes}-02-14`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-14`)
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
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-15`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 0
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
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
               //Cuentas por cobrar
               else if (catalogo.id == "04") {
                 if (elemento.id == "04-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-01`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-04-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-02`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-04-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-03`)
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
                 else if (elemento.id == "04-05") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-04`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-04-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-01`)
     
                   let Valor = Valor1-Valor2
     
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
                 else if (elemento.id == "04-06") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-04`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-04-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-02`)
     
     
                   let Valor = Valor2 / 30 == 0 ? 0 : Valor1 / (Valor2 / 30)
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "04-07") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-06`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-04-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-02`)
     
                   let Valor = (30 - Valor1) * (Valor2 / 30);
     
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
               }
               // Inventarios
               else if (catalogo.id == "05") {
                 if (elemento.id == "05-03") {
              
                   let Valor =DatosElementos[`${Anio}-${Mes}-02-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-02`)
     
     
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
                 else if (elemento.id == "05-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-05-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-01`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-02`)
     
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-05-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-03`)
     
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
                 else if (elemento.id == "05-05") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-05-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-04`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-01`)
     
                   let Valor = Valor1-Valor2
     
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
                 else if (elemento.id == "05-06") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-05-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-04`)
                   
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-03`)
     
                   let Valor = Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }  
                 else if (elemento.id == "05-07") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-05-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-06`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-03`)
     
                   let Valor = (Valor1 - 15) * (Valor2 / 30);
     
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
               }
               // Proveedores
               else if (catalogo.id == "06") {
                 if (elemento.id == "06-02") {        
                   let Valor =DatosElementos[`${Anio}-${Mes}-05-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-02`)
     
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
                 else if (elemento.id == "06-03") {        
                   let Valor =DatosElementos[`${Anio}-${Mes}-03-6`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-03-6`)
     
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
                 else if (elemento.id == "06-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-01`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-06-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-02`)
     
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-06-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-03`)
     
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
                 else if (elemento.id == "06-05") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-04`]?.[0]?.Valor ||  
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-04`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-06-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-01`)
     
                   let Valor = Valor1-Valor2
     
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
                 else if (elemento.id == "06-06") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-04`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-06-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-03`)
     
                   let Valor = Valor2 * -1 == 0 ? 0 : (Valor1 / (Valor2 * -1)) * 30
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "06-07") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-06`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-06-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-03`)
     
                   let Valor = (Valor1 - 30) * (Valor2 / 30);
     
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
               }
               // Afectación al flujo de efectivo
               else if (catalogo.id == "07") {
                 if (elemento.id == "07-01") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-05`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-05`)
     
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-06-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-05`)
     
     
                   let Valor = (Valor1 + Valor2) * -1 + Valor3;
     
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
                 else if (elemento.id == "07-02" || elemento.id == "07-08") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-07-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-07-01`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-EESGPM4hWXvDlXSRnCwA`)
                   let Valor =Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2;
     
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
                 else if (elemento.id == "07-03") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-EESGPM4hWXvDlXSRnCwA`)
                   let Valor =Valor1 
     
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
                 else if (elemento.id == "07-04") {  
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 0
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-07-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-07-02`)
                   let Valor =Valor1 == 0 ? 0 : Valor2 / Valor1; 
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)               
                 }   
                 else if (elemento.id == "07-05") {  
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-07-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-07-03`)
                   let Valor =Valor1 == 0 ? 0 : Valor2 / Valor1;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)               
                 } 
                 else if (elemento.id == "07-06") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-07`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-07`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-07`]?.[0]?.Valor ||
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-07`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-06-07`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-07`)
                   let Valor = Valor1 + Valor2 + Valor3;
     
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
                 else if (elemento.id == "07-07") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-07-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-07-06`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`)
     
                   let Valor = Valor1 < 0 ? Valor2 + Valor1 * -1 : Valor2;
     
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
                 else if (elemento.id == "07-09") {  
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-07-07`]?.[0]?.Valor || 0
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-07-07`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-EESGPM4hWXvDlXSRnCwA`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-EESGPM4hWXvDlXSRnCwA`)
                   let Valor =Valor1 == 0 ? 0 : Valor2 / Valor1;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)               
                 }  
                 else if (elemento.id == "07-10") {  
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-od11V2OHVgaLG1RiXMiz`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-07-08`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-07-08`)
                   let Valor =Valor1 == 0 ? 0 : Valor2 / Valor1;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)               
                 }    
               }  
               // Activo Fijo
               else if (catalogo.id == "08") {
                 if (elemento.id == "08-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-08-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-08-01`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-08-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-08-02`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-08-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-08-03`)
     
                   let Valor =Valor1+Valor2+Valor3
     
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
     
               }
               // Otros pasivos de Corto Plazo
               else if (catalogo.id == "09") {
                 if (elemento.id == "09-02") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-08-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-08-02`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "09-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-09-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-09-01`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-09-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-09-02`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-09-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-09-03`)
     
                   let Valor =Valor1+Valor2+Valor3
     
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
     
               }
               // Pasivos de Largo Plazo
               else if (catalogo.id == "10") {
                 if (elemento.id == "10-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-10-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-10-01`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-10-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-10-02`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-10-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-10-03`)
     
                   let Valor =Valor1+Valor2+Valor3
     
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
               }
               // Comparativas
               else if (catalogo.id == "11") {
                 if (elemento.id == "11-01") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-VmmQpdpunMTqkoSjhzzj`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-VmmQpdpunMTqkoSjhzzj`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "11-02") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-15`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "11-03") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-05`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "11-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-05-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-05`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "11-05") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-08-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-08-04`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-08-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-08-01`)
                   let Valor =Valor1-Valor2
     
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
                 else if (elemento.id == "11-06") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-05`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "11-07") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-10-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-10-04`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-10-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-10-01`)
                   let Valor =Valor1-Valor2
     
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
               }
               // Eficiencia y control
               else if (catalogo.id == "12") {
                 if (elemento.id == "12-01") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-02`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "12-02") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-02`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "12-03") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-12-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-12-01`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-12-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-12-02`)
                   let Valor =Valor1 / 30 == 0 ? 0 : Valor2 / (Valor1 / 30)
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }   
                 else if (elemento.id == "12-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-03-6`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-03-6`)
                   let Valor =Valor1
     
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
                 else if (elemento.id == "12-05") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-12-11`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-12-11`)
                   let Valor =1 - Valor1
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }
                 else if (elemento.id == "12-06") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-03-7`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-03-7`)
                   let Valor =Valor1
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }
                 else if (elemento.id == "12-07") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-08`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-08`)
                   let Valor =Valor1*-1
     
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
                 else if (elemento.id == "12-08") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-KtA2Cxpd79TJrW9afqR9`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-KtA2Cxpd79TJrW9afqR9`)
                   let Valor =Valor1*-1
     
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
                 else if (elemento.id == "12-09") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-08`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-08`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor =Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }  
                 else if (elemento.id == "12-10") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-03-5`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-03-5`)
                   let Valor =Valor1
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }  
                 else if (elemento.id == "12-11") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-03`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor =Valor2 == 0 ? 0 : Valor1 / Valor2;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }  
                 else if (elemento.id == "12-12") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-09`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-09`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor =Valor2 == 0 ? 0 : Valor1 / Valor2;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }    
                 else if (elemento.id == "12-13") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-15`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor =Valor2 == 0 ? 0 : Valor1 / Valor2;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }  
                 else if (elemento.id == "12-14") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-17`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-17`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor =Valor2 == 0 ? 0 : Valor1 / Valor2;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }  
                 else if (elemento.id == "12-15") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-05`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-01`)
                   let Valor =Valor2 == 0 ? 0 : (Valor1 * -1) / Valor2;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "12-16") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-08`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-08`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-11`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-11`)
                   let Valor =Valor2 == 0 ? 0 : (Valor1 / Valor2) * -1;
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:(Valor * 100).toFixed(0) + "%",
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "12-17") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-12-16`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-16`)
                   let Valor =Valor1 * 4.33
     
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
                                                        
               }
               // Actividad y gestión
               else if (catalogo.id == "13") {
                 if (elemento.id == "13-01") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-06`)
                   let Valor =Valor1
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "13-02") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-05-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-06`)
                   let Valor =Valor1
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "13-03") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-06-06`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-06`)
                   let Valor =Valor1
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "13-04") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-13-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-13-01`)
     
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-13-02`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-13-02`)
     
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-13-03`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-13-03`)
                   let Valor =Valor1 + Valor2 - Valor3
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
               }
               //Retorno y rentabilidad
               else if (catalogo.id == "14") {
                 if (elemento.id == "14-01") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-15`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-17`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-17`)
                   let Valor =Valor2 == 0 ? 0 : Valor1 / Valor2
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "14-02") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-15`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-02-05`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-05`)
                   let Valor =Valor2 * -1 == 0 ? 0 : Valor1 / (Valor2 * -1)
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "14-03") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-02-15`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-02-15`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-04-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-01`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-05-01`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-01`)
                   let Valor =Valor2 + Valor3 == 0 ? 0 : Valor1 / (Valor2 + Valor3)
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
               }
               // Liquidez y solvencia
               else if (catalogo.id == "15") { 
                 if (elemento.id == "15-01") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-07`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-07`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-07`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-07`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-06-07`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-07`)
                   let Valor =Valor1 + Valor2 + Valor3
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Valor < 0
                         ? "-$ " +
                           Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                         : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "15-02") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-04`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-04`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-06-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-04`)
                   let Valor =Valor3 == 0 ? 0 : (Valor1 + Valor2) / Valor3
     
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 } 
                 else if (elemento.id == "15-03") {
                   let Valor1 = DatosElementos[`${Anio}-${Mes}-04-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-04-04`)
                   let Valor2 = DatosElementos[`${Anio}-${Mes}-05-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-05-04`)
                   let Valor3 = DatosElementos[`${Anio}-${Mes}-06-04`]?.[0]?.Valor || 
                   this.getValoresManagerRecapValorNumero(`${Anio}-${Mes}-06-04`)
                   let Valor =Valor1 + Valor2 - Valor3
                   DatosElementos[`${key}`].push({
                     Valor:Valor,
                     TipoNumero:Valor < 0 ? 1 : 2,
                     ValorMostrar:Valor < 0
                         ? "-$ " +
                           Number((Valor * -1).toFixed(0)).toLocaleString("en-US")
                         : "$ " + Number(Valor.toFixed(0)).toLocaleString("en-US"),
                     Lectura:true
                     });
                   this.actualizarValorSimple(elemento.id,keyAnioMes,DatosElementos[key]?.[0]?.ValorMostrar || 0)             
                 }            
               }
     
             }

             // Actualizar acumulados y promedios
             const keyAnual = `${Anio}-${elemento.id}`;
            if (!DatosElementosAcumulados[keyAnual]) {
              DatosElementosAcumulados[keyAnual] = [];
            }
            if (!DatosElementosPromedios[keyAnual]) {
              DatosElementosPromedios[keyAnual] = [];
            }
            if (catalogo.id == "01") {
              if (elemento.id == "01-09") {
                let Valor=this.getDataAcumulado(keyAnual,catalogo.id)
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor,
                  "TipoNumero":Valor<0 ? 1 : 2,
                  "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                })
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":(Valor/12),
                  "TipoNumero":(Valor/12)<0 ? 1 : 2,
                  "ValorMostrar": (Valor/12)<0 ? 
                  ('-$ ' + (Number(((Valor/12) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor/12)).toFixed(0))).toLocaleString('en-US')
                })
  
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
  
                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
              }
              else if(elemento.id=="01-08"){
              let Valor1 =
                  DatosElementosAcumulados[`${Anio}-01-05`]?.[0]?.Valor || 0;
              let Valor2 =
                  DatosElementosAcumulados[`${Anio}-01-07`]?.[0]?.Valor || 0;
              let Valor3 =
                  DatosElementosAcumulados[`${Anio}-01-09`]?.[0]?.Valor || 0;
              let ValorElemento=Valor2 == 0 || Valor1 == 0 ? 0 : Valor3 / Valor2 / Valor1;
              
              DatosElementosAcumulados[`${keyAnual}`].push({ 
              "Valor":ValorElemento,
              "TipoNumero":ValorElemento<0 ? 1 : 2,
              "ValorMostrar": ValorElemento<0 ? ('-$ ' + (Number((ValorElemento * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorElemento).toFixed(0))).toLocaleString('en-US')
              })
              let Valor1Promedio =
                  DatosElementosAcumulados[`${Anio}-01-05`]?.[0]?.Valor || 0;
              let Valor2Promedio =
                  DatosElementosAcumulados[`${Anio}-01-07`]?.[0]?.Valor || 0;
              let Valor3Promedio =
                  DatosElementosAcumulados[`${Anio}-01-09`]?.[0]?.Valor || 0;
  
              let ValorPromedio =
                  Valor2Promedio == 0 || Valor1Promedio == 0 ? 0 : Valor3Promedio / Valor2Promedio / Valor1Promedio;                
              DatosElementosPromedios[`${keyAnual}`].push({
                  Valor: Valor3 / Valor2 / Valor1,
                  TipoNumero: ValorPromedio < 0 ? 1 : 2,
                  ValorMostrar:
                    ValorPromedio < 0
                      ? "-$ " +
                        Number((ValorPromedio * -1).toFixed(0)).toLocaleString(
                          "en-US"
                        )
                      : "$ " +
                        Number(ValorPromedio.toFixed(0)).toLocaleString("en-US"),
              }); 
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
  
                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)                                         
  
              }
              else if(elemento.id=='01-02'){
              let Valor1= DatosElementosAcumulados[`${Anio}-01-01`]?.[0]?.Valor || 0
              let Valor2= DatosElementosAcumulados[`${Anio}-01-03`]?.[0]?.Valor || 0
              DatosElementosAcumulados[`${keyAnual}`].push({ 
                "Valor":Valor1==0 ? 0 : Valor2/Valor1 ,
                "TipoNumero":(Valor1==0 ? 0 : Valor2/Valor1)<0 ? 1 : 2,
                "ValorMostrar": ((Valor1==0 ? 0 : Valor2/Valor1)*100).toFixed(0) +'%'
              })
  
              let ValorPromedio=this.promedioAnual(keyAnual,idCatalogo)
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
                })            
              this.actualizarValorSimple(
              elemento.id,keyAcumuladoAnio,
              DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
  
              this.actualizarValorSimple(
              elemento.id,keyPromedioAnio,
              DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
  
  
              }
              else if(elemento.id=='01-05'){
                let Valor=this.getValoresManagerRecapValorNumero(`${Anio}-12-01-05`)
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor,
                  "TipoNumero":Valor<0 ? 1 : 2,
                  "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                })
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":(Valor/12),
                  "TipoNumero":(Valor/12)<0 ? 1 : 2,
                  "ValorMostrar": (Valor/12)<0 ? 
                  ('-$ ' + (Number(((Valor/12) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor/12)).toFixed(0))).toLocaleString('en-US')
                })
  
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
  
                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)              
              }
              else if(elemento.id=='01-07'){
  
                let Valor1=(DatosElementosAcumulados[`${Anio}-01-06`]?.[0]?.Valor || 0)  
                let Valor2=(DatosElementosAcumulados[`${Anio}-01-05`]?.[0]?.Valor || 0) 
                let Valor=Valor2==0?0 :  Valor1/Valor2
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor,
                  "TipoNumero":Valor<0 ? 1 : 2,
                  "ValorMostrar": Valor.toFixed(1)
                })
                DatosElementosPromedios[`${keyAnual}`].push({ 
                    "Valor":(Valor),
                    "TipoNumero":(Valor)<0 ? 1 : 2,
                    "ValorMostrar": Valor.toFixed(1)
                })
                    this.actualizarValorSimple(
                    elemento.id,keyAcumuladoAnio,
                    DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
  
                    this.actualizarValorSimple(
                    elemento.id,keyPromedioAnio,
                    DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
              }  
              else if(elemento.id=='01-06' || elemento.id=='01-04' || elemento.id=='01-03' || elemento.id=='01-01'){
                let Valor=this.getDataAcumulado(keyAnual,catalogo.id)
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                    "Valor":Valor,
                    "TipoNumero":Valor<0 ? 1 : 2,
                    "ValorMostrar": Valor
                })                
                DatosElementosPromedios[`${keyAnual}`].push({ 
                     "Valor":(Valor/12),
                     "TipoNumero":(Valor/12)<0 ? 1 : 2,
                     "ValorMostrar": (Valor/12).toFixed(2)
                })
                this.actualizarValorSimple(
                    elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
  
                this.actualizarValorSimple(
                    elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
              }          
              else {   
                  let Valor=this.getDataAcumulado(keyAnual,catalogo.id)
                  DatosElementosAcumulados[`${keyAnual}`].push({ 
                    "Valor":Valor,
                    "TipoNumero":Valor<0 ? 1 : 2,
                    "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                  })                
                   DatosElementosPromedios[`${keyAnual}`].push({ 
                     "Valor":(Valor/12),
                     "TipoNumero":(Valor/12)<0 ? 1 : 2,
                     "ValorMostrar": (Valor/12)<0 ? 
                     ('-$ ' + (Number(((Valor/12) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor/12)).toFixed(0))).toLocaleString('en-US')
                   })
                    this.actualizarValorSimple(
                    elemento.id,keyPromedioAnio,
                    DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
  
                    this.actualizarValorSimple(
                    elemento.id,keyAcumuladoAnio,
                    DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)
              }
            }

            else if(catalogo.id=='02'){
              if(elemento.id=='02-01' || 
                 elemento.id=='02-02' || 
                 elemento.id=='02-05' ||
                 elemento.id=='02-06' ||
                 elemento.id=='02-07' ||
                 elemento.id=='02-11' ||
                 elemento.id=='02-12' || 
                 elemento.id=='02-13' || 
                 elemento.id=='02-14' || 
                 elemento.id=='02-17' 
                )
                {
                  let Valor=this.getDataAcumulado(keyAnual,catalogo.id)
                  DatosElementosAcumulados[`${keyAnual}`].push({ 
                    "Valor":Valor,
                    "TipoNumero":Valor<0 ? 1 : 2,
                    "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                  })                
                   DatosElementosPromedios[`${keyAnual}`].push({ 
                     "Valor":(Valor/12),
                     "TipoNumero":(Valor/12)<0 ? 1 : 2,
                     "ValorMostrar": (Valor/12)<0 ? 
                     ('-$ ' + (Number(((Valor/12) * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number(((Valor/12)).toFixed(0))).toLocaleString('en-US')
                   })

                    this.actualizarValorSimple(
                    elemento.id,keyPromedioAnio,
                    DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
  
                    this.actualizarValorSimple(
                    elemento.id,keyAcumuladoAnio,
                    DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

              }
              else if(elemento.id=='02-03')
              {
               let Valor1= DatosElementosAcumulados[`${Anio}-02-01`]?.[0]?.Valor || 0
               let Valor2= DatosElementosAcumulados[`${Anio}-02-02`]?.[0]?.Valor || 0
               let Valor=Valor1+Valor2
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor,
                  "TipoNumero":Valor<0 ? 1 : 2,
                  "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                })
               let ValorPromedio=Valor/12
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? 
                  ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                }) 
                
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)                 
              }
              
              else if(elemento.id=='02-04')
              {
                let Valor1= DatosElementosAcumulados[`${Anio}-02-01`]?.[0]?.Valor || 0
                let Valor2= DatosElementosAcumulados[`${Anio}-02-03`]?.[0]?.Valor || 0
                let Valor=Valor2==0? 0: Valor2/Valor1
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor ,
                  "TipoNumero":(Valor)<0 ? 1 : 2,
                  "ValorMostrar": (Valor*100).toFixed(0) +'%'
                })

                let Valor1Promedio= DatosElementosPromedios[`${Anio}-02-01`]?.[0]?.Valor || 0
                let Valor2Promedio= DatosElementosPromedios[`${Anio}-02-03`]?.[0]?.Valor || 0
                let ValorPromedio=Valor2Promedio==0? 0: Valor2Promedio/Valor1Promedio
                
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
                })                

                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
                
                

              }

              else if(elemento.id=='02-08')
              {
                let Valor1= DatosElementosAcumulados[`${Anio}-02-05`]?.[0]?.Valor || 0
                let Valor2= DatosElementosAcumulados[`${Anio}-02-06`]?.[0]?.Valor || 0
                let Valor3= DatosElementosAcumulados[`${Anio}-02-07`]?.[0]?.Valor || 0
                let Valor=Valor1+Valor2+Valor3 
                  DatosElementosAcumulados[`${keyAnual}`].push({ 
                    "Valor":Valor,
                    "TipoNumero":Valor<0 ? 1 : 2,
                    "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                  })
                
                let Valor1Promedio= DatosElementosPromedios[`${Anio}-02-05`]?.[0]?.Valor || 0
                let Valor2Promedio= DatosElementosPromedios[`${Anio}-02-06`]?.[0]?.Valor || 0
                let Valor3Promedio= DatosElementosPromedios[`${Anio}-02-07`]?.[0]?.Valor || 0
                let ValorPromedio=Valor1Promedio+Valor2Promedio+Valor3Promedio
                  DatosElementosPromedios[`${keyAnual}`].push({ 
                    "Valor":ValorPromedio,
                    "TipoNumero":ValorPromedio<0 ? 1 : 2,
                    "ValorMostrar": ValorPromedio<0 ? 
                    ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                  })                                
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)
                               
              }

              else if(elemento.id=='02-09')
              {
                let Valor1= DatosElementosAcumulados[`${Anio}-02-03`]?.[0]?.Valor || 0
                let Valor2= DatosElementosAcumulados[`${Anio}-02-08`]?.[0]?.Valor || 0
                let Valor=Valor1+Valor2 
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor,
                  "TipoNumero":Valor<0 ? 1 : 2,
                  "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                })
                let Valor1Promedio= DatosElementosPromedios[`${Anio}-02-03`]?.[0]?.Valor || 0
                let Valor2Promedio= DatosElementosPromedios[`${Anio}-02-08`]?.[0]?.Valor || 0
                let ValorPromedio=Valor1Promedio+Valor2Promedio
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? 
                  ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                })                
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)                
                
                
              }
              else if(elemento.id=='02-10')
              {
                let Valor1= DatosElementosAcumulados[`${Anio}-02-01`]?.[0]?.Valor || 0
                let Valor2= DatosElementosAcumulados[`${Anio}-02-09`]?.[0]?.Valor || 0
                let Valor=Valor2==0? 0: Valor2/Valor1
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor ,
                  "TipoNumero":(Valor)<0 ? 1 : 2,
                  "ValorMostrar": (Valor*100).toFixed(0) +'%'
                })

                let Valor1Promedio= DatosElementosPromedios[`${Anio}-02-01`]?.[0]?.Valor || 0
                let Valor2Promedio= DatosElementosPromedios[`${Anio}-02-09`]?.[0]?.Valor || 0
                let ValorPromedio=Valor2Promedio==0? 0: Valor2Promedio/Valor1Promedio
                
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
                })                

                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)                
              }
              
              else if(elemento.id=='02-15')
              {
                let Valor1= DatosElementosAcumulados[`${Anio}-02-09`]?.[0]?.Valor || 0
                let Valor2= DatosElementosAcumulados[`${Anio}-02-11`]?.[0]?.Valor || 0
                let Valor3= DatosElementosAcumulados[`${Anio}-02-12`]?.[0]?.Valor || 0
                let Valor=Valor1+Valor2+Valor3
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor,
                  "TipoNumero":Valor<0 ? 1 : 2,
                  "ValorMostrar": Valor<0 ? ('-$ ' + (Number((Valor * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((Valor).toFixed(0))).toLocaleString('en-US')
                })
                let Valor1Promedio= DatosElementosPromedios[`${Anio}-02-09`]?.[0]?.Valor || 0
                let Valor2Promedio= DatosElementosPromedios[`${Anio}-02-11`]?.[0]?.Valor || 0
                let Valor3Promedio= DatosElementosPromedios[`${Anio}-02-12`]?.[0]?.Valor || 0
                let ValorPromedio=Valor1Promedio+Valor2Promedio+Valor3Promedio
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": ValorPromedio<0 ? 
                  ('-$ ' + (Number((ValorPromedio * -1).toFixed(0))).toLocaleString('en-US')) : '$ ' + (Number((ValorPromedio).toFixed(0))).toLocaleString('en-US')
                })                
                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)                
                
                
              }
              
              else if(elemento.id=='02-16')
              {
                let Valor1= DatosElementosAcumulados[`${Anio}-02-01`]?.[0]?.Valor || 0
                let Valor2= DatosElementosAcumulados[`${Anio}-02-15`]?.[0]?.Valor || 0
                let Valor=Valor2==0? 0: Valor2/Valor1
                DatosElementosAcumulados[`${keyAnual}`].push({ 
                  "Valor":Valor ,
                  "TipoNumero":(Valor)<0 ? 1 : 2,
                  "ValorMostrar": (Valor*100).toFixed(0) +'%'
                })

                let Valor1Promedio= DatosElementosPromedios[`${Anio}-02-01`]?.[0]?.Valor || 0
                let Valor2Promedio= DatosElementosPromedios[`${Anio}-02-15`]?.[0]?.Valor || 0
                let ValorPromedio=Valor2Promedio==0? 0: Valor2Promedio/Valor1Promedio
                
                DatosElementosPromedios[`${keyAnual}`].push({ 
                  "Valor":ValorPromedio,
                  "TipoNumero":ValorPromedio<0 ? 1 : 2,
                  "ValorMostrar": (ValorPromedio*100).toFixed(0)+'%'
                })                

                this.actualizarValorSimple(
                elemento.id,keyAcumuladoAnio,
                DatosElementosAcumulados[keyAnual]?.[0]?.ValorMostrar || 0)

                this.actualizarValorSimple(
                elemento.id,keyPromedioAnio,
                DatosElementosPromedios[keyAnual]?.[0]?.ValorMostrar || 0)                
              }              
              
              

            }




           })
         }) 
         this.toastr.success('Guardado', '¡Exito!');
       //})
   }
   catch(error:any){
     this.toastr.error('Ha ocurrido un error, inténtelo nuevamente', '¡Alerta!');
   }




   

   


   