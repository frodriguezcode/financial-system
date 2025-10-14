// angular import
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccordionModule } from 'primeng/accordion'; // project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeDragDropService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import Swal from 'sweetalert2';
import { TreeNode } from 'primeng/api';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-modulo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule, AccordionModule, NgSelectModule, TreeModule, NgbAccordionModule, InputSwitchModule],
  templateUrl: './modulo-cuentas-contables.component.html',
  providers: [TreeDragDropService],
  styleUrls: ['./modulo-cuentas-contables.component.scss']
})
export default class ModuloCuentasContableComponent implements OnInit {
  NombreCuentaHijo: FormControl = new FormControl('');
  NombreCuentaNieto: FormControl = new FormControl('');
  Proyectos: any = [];
  ProyectosSeleccionados: any = [];
  Sucursales: any = [];
  SucursalesSeleccionadas: any = [];
  Categorias: any = [];
  CuentasPadres: any = [];
  CuentaPadreSeleccionada: any;
  CuentaHijoSeleccionada: any = null;
  CuentaNietoSeleccionada: any = null;
  CuentasHijos: any = [];
  CuentasNietos: any = [];
  usuario: any;
  idEmpresa: string = '';
  DataCatalogos: any = [];
  OpcionesTipoCuenta: any = [];
  CatalagoCuentasEmpresa: any = [];
  OpcionSeleccionada: any;
  cargando: boolean = true;
  TreeData: any = [];
  expandedKeys: any = [];
  selectedNode: any = [];
  activeIndex = 0;
  checkedHijo: boolean = true;
  mostrarOpcionesCuenta: boolean = true;
  @ViewChild('InputCuentaHijo', { static: false }) InputCuentaHijo!: ElementRef;
  constructor(
    private datePipe: DatePipe,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService,
    private afs: AngularFirestore
  ) { }
  ngOnInit(): void {
    this.NombreCuentaHijo.disable();
    this.OpcionesTipoCuenta = [
      {
        Nombre: 'Ingreso',
        id: 1,
        Seleccionado: true
      },
      {
        Nombre: 'Egreso',
        id: 2,
        Seleccionado: false
      }
    ];
    this.conS.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      } else {
        this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }

      this.idEmpresa = this.usuario.idEmpresa;

      this.getCatalogos();
    });
  }

  getCatalogos() {
    this.conS.obtenerDataCatalogosEmpresa(this.usuario.idMatriz).subscribe((data: any) => {
      this.DataCatalogos = data;
      console.log('DataCatalogos', this.DataCatalogos);

      this.construirData();
    });
  }

  getCuentasPadres() {
    this.CuentaPadreSeleccionada = null;
    this.CuentaHijoSeleccionada = null;
    this.NombreCuentaHijo.setValue('');
    this.NombreCuentaHijo.disable();
    if (this.OpcionSeleccionada == 1) {
      this.CuentasPadres = this.Categorias.filter((categ: any) => categ.Tipo == 1);
    } else if (this.OpcionSeleccionada == 2) {
      this.CuentasPadres = this.Categorias.filter((categ: any) => categ.Tipo == 2);
    }
  }

  focusInput() {
    this.NombreCuentaHijo.enable();
    setTimeout(() => {
      if (this.InputCuentaHijo?.nativeElement) {
        this.InputCuentaHijo.nativeElement.focus();
      }
    });
  }

  construirData() {
    let DataEmpresa = this.DataCatalogos.filter((data: any) => data.idEmpresa == this.idEmpresa)[0];
    this.Categorias = DataEmpresa.Categorias;
    this.CuentasPadres = this.Categorias.filter((categ: any) => categ.Tipo == 1 || categ.Tipo == 2);
    this.CatalagoCuentasEmpresa = DataEmpresa.CatalogoCuentasEmpresa;
    this.Proyectos = DataEmpresa.Proyectos;
    this.Sucursales = DataEmpresa.Sucursales;
    this.CuentasHijos = DataEmpresa._CuentasContables;
    this.CuentasHijos.forEach((cuenta: any) => {
      cuenta.CuentasNieto.forEach((cuentaNieto: any) => {
        this.CuentasNietos.push(cuentaNieto);
      });
    });
    console.log('CuentasHijos', this.CuentasHijos);
    console.log('CuentasNietos', this.CuentasNietos);
    console.log('CatalagoCuentasEmpresa', this.CatalagoCuentasEmpresa);
    this.construirTreeData();
  }
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  guardarCuentaHijo() {
    if (this.CuentaHijoSeleccionada) {
      let idsProyectos = this.ProyectosSeleccionados.map((proyecto: any) => proyecto.id)
      let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)


      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .Alias = this.NombreCuentaHijo.value

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .Nombre = this.CuentaHijoSeleccionada.Prefijo + ' ' + this.NombreCuentaHijo.value

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .idsProyectos = idsProyectos

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .idsSucursales = idsSucursales

      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
        this.expandedKeys.push(this.CuentaHijoSeleccionada.idAbuelo);
        this.expandedKeys.push(this.CuentaHijoSeleccionada.idPadre);
        this.expandedKeys.push(this.CuentaHijoSeleccionada.id);
        this.NombreCuentaHijo.setValue('');
        this.NombreCuentaHijo.disable();
        this.CuentaHijoSeleccionada = null
        this.CuentaPadreSeleccionada = null
        this.ProyectosSeleccionados = []
        this.SucursalesSeleccionadas = []
        this.construirTreeData();
        this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
          timeOut: 2000,
          positionClass: 'toast-center-center'
        });
      });


    }
    else {
      const currentDate = new Date();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 || 12;
      let idsProyectos = this.ProyectosSeleccionados.map((proyect: any) => proyect.id);
      let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id);
      let Orden: any = this.CuentasHijos.filter((it: any) => it.idPadre == this.CuentaPadreSeleccionada.id).length;

      if (this.NombreCuentaHijo.value == '') {
        this.toastr.warning('Debe colocar el nombre de la cuenta', '¡Alerta!', {
          timeOut: 2000,
          positionClass: 'toast-center-center'
        });
      }

      let Item: any = {
        Activo: this.checkedHijo,
        TipoProforma: 1,
        Nombre: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1) + ' ' + this.NombreCuentaHijo.value,
        Prefijo: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1),
        PrefijoPadre: Number(this.CuentaPadreSeleccionada.idCateg),
        PrefijoHijo: Orden + 1,
        CuentaFija: false,
        TipoCuenta: this.CuentaPadreSeleccionada.Tipo,
        Alias: this.NombreCuentaHijo.value,
        FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
        HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
        Tipo: 'Hijo',
        idPadre: this.CuentaPadreSeleccionada.id,
        idsSucursales: idsSucursales,
        idsProyectos: idsProyectos,
        idAbuelo: this.CuentaPadreSeleccionada.idAbuelo,
        Customizable: true,
        Editable: false,
        Orden: Orden + 1,
        OrdenReal: this.CuentasHijos.length + 1,
        idEmpresa: this.idEmpresa,
        idCorporacion: this.usuario.idMatriz,
        Created_User: this.usuario.id
      };

      console.log('Item', Item)

      const id = this.afs.createId();
      Item.id = id;

      this.CuentasHijos.push(Item);
      this.CatalagoCuentasEmpresa[0].CuentasHijos.push(Item);
      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
        this.expandedKeys.push(Item.idAbuelo);
        this.expandedKeys.push(Item.idPadre);
        this.expandedKeys.push(Item.id);
        this.NombreCuentaHijo.setValue('');
        this.construirTreeData();
        this.toastr.success('Se guardó la cuenta contable', '¡Éxito!', {
          timeOut: 2000,
          positionClass: 'toast-center-center'
        });
      });
    }
  }

  getCuentasPadre(idAbuelo: string) {
    let _CuentasPadre: any = [];
    this.Categorias.filter((cuentaPadre: any) => cuentaPadre.idAbuelo == idAbuelo).forEach((cuenta) => {
      _CuentasPadre.push({
        key: `${idAbuelo}-${cuenta.id}`,
        Orden: cuenta.Orden,
        id: cuenta.id,
        Tipo: 'Padre',
        Editable: false,
        droppable: false,
        draggable: false,
        label: cuenta.Nombre,
        expanded: this.verificarExpanded(cuenta.id),
        data: cuenta.Nombre,
        icon: 'pi pi-fw pi-inbox',
        children: this.getCuentasHijo(cuenta.id).sort((a, b) => a.Orden - b.Orden)
      });
    });

    return _CuentasPadre;
  }

  getCuentasHijo(idPadre: string) {
    let _CuentasHijo: any = [];
    this.CuentasHijos.filter((cuentaHijo: any) => cuentaHijo.idPadre == idPadre).forEach((cuenta) => {
      _CuentasHijo.push({
        key: `${cuenta.idAbuelo}-${idPadre}-${cuenta.id}`,
        keyPadre: `${cuenta.idAbuelo}-${idPadre}`,
        id: cuenta.id,
        Orden: cuenta.Orden,
        Tipo: 'Hijo',
        Editable: false,
        label: cuenta.Nombre,
        droppable: false,
        data: cuenta.Nombre,
        icon: 'pi pi-fw pi-inbox',
        expanded: this.verificarExpanded(cuenta.id),
        children: this.getCuentasNieto(cuenta.id).sort((a, b) => a.Orden - b.Orden)
      });
    });

    return _CuentasHijo;
  }
  getCuentasNieto(idHijo: string) {
    let _CuentasNieto: any = [];
    this.CuentasNietos.filter((cuentaHijo: any) => cuentaHijo.idHijo == idHijo).forEach((cuenta: any) => {
      _CuentasNieto.push({
        key: `${cuenta.idAbuelo}-${cuenta.idPadre}-${idHijo}-${cuenta.id}`,
        keyHijo: `${cuenta.idAbuelo}-${cuenta.idPadre}-${idHijo}`,
        id: cuenta.id,
        Orden: cuenta.Orden,
        Tipo: 'Nieto',
        Editable: false,
        label: cuenta.Nombre,
        data: cuenta.Nombre,
        droppable: false,
        icon: 'pi pi-fw pi-inbox'
      });
    });

    return _CuentasNieto;
  }

  verificarExpanded(idElemento: any) {
    return this.expandedKeys.filter((exp: any) => exp == idElemento).length > 0 ? true : false;
  }

  construirTreeData() {
    // limpia completamente la referencia
    this.TreeData = [];

    this.TreeData = this.Categorias.filter((abuelo: any) => abuelo.Tipo == 3).map((cuenta: any) => ({
      key: cuenta.id,
      id: cuenta.id,
      label: cuenta.Nombre,
      Tipo: 'Abuelo',
      Editable: false,
      droppable: false,
      draggable: false,
      expanded: this.verificarExpanded(cuenta.id),
      data: cuenta.Nombre,
      icon: 'pi pi-fw pi-inbox',
      children: this.getCuentasPadre(cuenta.id).sort((a, b) => a.Orden - b.Orden)
    }));

    this.cargando = false;
  }

  activeIndexChange(index: any) {
    this.activeIndex = index;
  }

  cambiarEstadoCuentaHijo() {
    if (this.CuentaHijoSeleccionada) {

      this.CatalagoCuentasEmpresa[0].CuentasHijos.find((cuenta: any) => cuenta.id == this.CuentaHijoSeleccionada.id).Activo =
        this.checkedHijo;
      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => { });
    }
  }

  getProyectosByCuenta(idsProyectos: any) {
    if (idsProyectos.length > 0) {
      return this.Proyectos.filter((proyecto: any) => idsProyectos.includes(proyecto.id));
    } else {
      return [];
    }
  }
  getSucursalesByCuenta(idsSucursales: any) {
    if (idsSucursales.length > 0) {
      return this.Sucursales.filter((sucursal: any) => idsSucursales.includes(sucursal.id));
    } else {
      return [];
    }
  }

  onNodeSelected(event: any) {
    console.log('event', event)
    this.NombreCuentaHijo.setValue('')
    if (event.node.Tipo == 'Padre') {
      this.CuentaPadreSeleccionada = this.CuentasPadres.find((padre: any) => padre.id == event.node.id)
      this.NombreCuentaHijo.enable();
      this.InputCuentaHijo.nativeElement.focus();
      console.log('CuentaPadreSeleccionada', this.CuentaPadreSeleccionada)
    }
    else if (event.node.Tipo == 'Hijo') {
      Swal.fire({
        title: "¿Que desea hacer?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Editar esta cuenta",
        cancelButtonText: "Crear Sub Cuenta Contable"
      }).then((result) => {
        if (result.isConfirmed) {
          this.CuentaHijoSeleccionada = this.CuentasHijos.find((hijo: any) => hijo.id == event.node.id)
          console.log('CuentaHijoSeleccionada',this.CuentaHijoSeleccionada)
          this.ProyectosSeleccionados = this.getProyectosByCuenta(this.CuentaHijoSeleccionada.idsProyectos);
          this.SucursalesSeleccionadas = this.getSucursalesByCuenta(this.CuentaHijoSeleccionada.idsSucursales);         
          this.NombreCuentaHijo.enable();
          this.NombreCuentaHijo.setValue(this.CuentaHijoSeleccionada.Alias)
          this.InputCuentaHijo.nativeElement.focus();
        }
      });
    }
  }

  onNodeDrop(event: any) {
    const { dragNode, dropNode, dropPoint, accept } = event;

    console.log('event', event);
    let KeydragNode = event.dragNode.Tipo == 'Hijo' ? event.dragNode.keyPadre : event.dragNode.keyHijo;
    let KeydropNode = event.dropNode.Tipo == 'Hijo' ? event.dropNode.keyPadre : event.dropNode.keyHijo;

    // Evitar drop dentro del nodo
    if (dropPoint === 'node') return;
    // Solo permitir si tienen el mismo keyHijo
    if (KeydragNode === KeydropNode) {
      // ✅ permitido
      if (typeof accept === 'function') accept();
    } else {
      this.toastr.warning('La cuenta no debe moverse fuera de su flujo', '¡Alerta!', {
        timeOut: 2000,
        positionClass: 'toast-center-center'
      });
    }
  }
}
