ngOnInit() {
    // Otras inicializaciones
    
    // Cargar las opciones después de obtener los datos de Firebase
    this.cargarDatosFirebase().then(() => {
      this.cargarOpcionesCuentas();
    });
  }
  
  // Método que simula la carga de datos desde Firebase
  cargarDatosFirebase() {
    return new Promise<void>((resolve) => {
      // Aquí iría tu lógica para obtener los datos de Firebase
      // Por ejemplo:
      this.conS.obtenerCategoriasFlujos().subscribe(resp => {
        this.Categorias = resp.filter((data: any) => data.Tipo != 3 && data.Mostrar == true);
        this.CategoriasTodas = resp.filter((re: any) => re.Mostrar == true);
        
        // Luego cargas los Items
        this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(items => {
          this.ItemsBack = items;
          // Cuando todo esté cargado, resolver la promesa
          resolve();
        });
      });
    });
  }


  //!EN EL HTML

  
  <p-treeSelect
  class="md:w-20rem w-full"
  containerStyleClass="w-full"
  appendTo="body"
  (onChange)="renderizarBarra()"
  (onNodeExpand)="expandirNodo($event)"
  [filter]="true"
  [filterInputAutoFocus]="true"
  [(ngModel)]="registros.CuentaSeleccionada"
  [disabled]="false"
  [options]="opcionesCuentas"
  [selectionMode]="'single'"
  emptyMessage="Sin opciones disponibles"
  placeholder="Seleccione una cuenta">
</p-treeSelect>




expandirNodo(event: any) {
    console.log('Nodo a expandir:', event.node);
    
    // Si el nodo tiene hijos, alternar su estado expandido
    if (event.node && event.node.children && event.node.children.length > 0) {
      event.node.expanded = !event.node.expanded;
      
      // Si expandimos y por error se seleccionó, quitamos la selección
      if (this.registros.CuentaSeleccionada === event.node) {
        setTimeout(() => {
          this.registros.CuentaSeleccionada = null;
        });
      }
    }
  }


  cargarOpcionesCuentas() {
    // Verificar que tengamos un idPadre válido
    if (!this.registros.idPadre) {
      console.warn('idPadre no está definido');
      return;
    }
    
    // Llamar al método original getCuentabyCategoria
    const cuentasContables = this.getCuentabyCategoria(this.registros.idPadre);
    
    // Log para verificar lo que estamos obteniendo
    console.log('Cuentas obtenidas:', cuentasContables);
    
    // Asignar a la propiedad que usa el TreeSelect
    this.opcionesCuentas = cuentasContables;
  }


  getCuentabyCategoria(Categoria: any) {
    let cuentaContable: any = [];
    
    console.log('Filtrando items con idPadre:', Categoria);
    console.log('Items disponibles:', this.ItemsBack);
    
    // Filtrar los items que corresponden a la categoría
    const itemsFiltrados = this.ItemsBack.filter((item: any) => 
      (item.idPadre == Categoria?.id || item.idPadre == Categoria) && 
      item.TipoRubro == this.idTipoRegistro
    );
    
    console.log('Items filtrados:', itemsFiltrados);
    
    // Convertir los items al formato que necesita el TreeSelect
    itemsFiltrados.forEach((cuenta: any) => {
      // Verificar si tiene hijos
      const tieneHijos = cuenta.CuentasHijos && Array.isArray(cuenta.CuentasHijos) && cuenta.CuentasHijos.length > 0;
      
      const nodoPadre = {
        key: cuenta.Orden?.toString() || cuenta.id?.toString() || Math.random().toString(),
        label: cuenta.Nombre,
        data: cuenta.id,
        Tipo: 'Padre',
        ItemId: cuenta.id,
        idPadre: cuenta.idPadre,
        idAbuelo: cuenta.idAbuelo,
        icon: 'pi pi-folder',
        expanded: false,
        selectable: !tieneHijos, // No es seleccionable si tiene hijos
        children: []
      };
      
      // Si tiene hijos, procesarlos
      if (tieneHijos) {
        cuenta.CuentasHijos.forEach((hijo: any) => {
          nodoPadre.children.push({
            key: `${nodoPadre.key}-${hijo.Orden?.toString() || Math.random().toString()}`,
            label: hijo.Nombre,
            data: hijo.id,
            Tipo: 'Hijo',
            idPadre: hijo.idPadre || cuenta.id,
            idAbuelo: hijo.idAbuelo || cuenta.idPadre,
            icon: 'pi pi-file',
            leaf: true,
            selectable: true
          });
        });
      }
      
      cuentaContable.push(nodoPadre);
    });
    
    console.log('Cuentas transformadas para TreeSelect:', cuentaContable);
    return cuentaContable;
  }