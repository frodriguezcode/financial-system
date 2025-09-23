// angular import
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subscriber, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/services/auth.service';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-elemento',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    TabViewModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    TabViewModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    MultiSelectModule,
    DialogModule,
    TreeTableModule,
    InputTextModule,
    FloatLabelModule,
    NgSelectModule
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export default class ItemsComponent implements OnInit,AfterViewInit  {
   @ViewChild('InputCuentaHijo', { static: false }) InputCuentaHijo!: ElementRef;
   @ViewChild('InputCuentaNieto', { static: false }) InputCuentaNieto!: ElementRef;
  constructor(
    private datePipe: DatePipe,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }
  visibleProyecto: boolean = false;
  visibleSucursal: boolean = false;
  NombresProyectos: any
  ProyectosSeleccionadosCuenta: any
  SucursalesSeleccionadasCuenta: any
  CuentaSeleccionada: any
  usuario: any;
  Items: any = [];
  CuentasNietos: any = [];
  Abuelos: any = [];
  Padres: any = [];
  Hijos: any = [];
  Nietos: any = [];
  CatalogoCuentas: any = [];
  idEmpresa: string = '';
  expandedKeys: any = [];
  expandedNodes: Set<string> = new Set();
  Sucursales: any = [];
  Proyectos: any = [];
  Empresas: any = [];
  anchoTabla: string = '70rem';
  @Input() empresaID: string = '';

   ngAfterViewInit() {
    this.focusInput();
    this.focusInputCuentaNieto();
  }

  ngOnInit(): void {
    this.conS.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      } else {
        this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }

      if (this.empresaID != '') {
        this.idEmpresa = this.empresaID;
      } else {
        this.idEmpresa = this.usuario.idEmpresa;
      }

      this.obtenerProyectos()


    });
  }

focusInput() {
  setTimeout(() => {
    if (this.InputCuentaHijo?.nativeElement) {
      this.InputCuentaHijo.nativeElement.focus();
    }
  });
}
focusInputCuentaNieto() {
  setTimeout(() => {
    if (this.InputCuentaNieto?.nativeElement) {
      this.InputCuentaNieto.nativeElement.focus();
    }
  });
}

  showDialogProyecto(proyectosSeleccionados: any, cuenta: any) {
    this.ProyectosSeleccionadosCuenta = proyectosSeleccionados
    this.CuentaSeleccionada = cuenta

    this.visibleProyecto = true;
  }
  showDialogSucursal(sucursalesSeleccionadas: any, cuenta: any) {
    this.SucursalesSeleccionadasCuenta = sucursalesSeleccionadas
    this.CuentaSeleccionada = cuenta

    this.visibleSucursal = true;
  }

  editarProyectos() {
    let idsProyectos = this.ProyectosSeleccionadosCuenta.map((proyecto: any) => proyecto.id)
    if (this.CuentaSeleccionada.Tipo == 'Hijo') {
      const index = this.Items.findIndex((item: any) => item.idHijo === this.CuentaSeleccionada.idHijo);
      this.Items[index].idsProyectos = idsProyectos
     
      this.expandedKeys.push(this.CuentaSeleccionada.idAbuelo);
      this.expandedKeys.push(this.CuentaSeleccionada.idPadre);
      this.construirCatalogoItems(false);
    }
    else {
      const index = this.CuentasNietos.findIndex((item: any) => item.idNieto === this.CuentaSeleccionada.idNieto);
      this.CuentasNietos[index].idsProyectos = idsProyectos
     
      this.expandedKeys.push(this.CuentaSeleccionada.idAbuelo);
      this.expandedKeys.push(this.CuentaSeleccionada.idPadre);
      this.expandedKeys.push(this.CuentaSeleccionada.idHijo);
      this.construirCatalogoItems(false); 
    }
  }

  guardarEdicionProyecto() {
    if (this.CuentaSeleccionada.Tipo == 'Hijo') {
      const index = this.Items.findIndex((item: any) => item.idHijo === this.CuentaSeleccionada.idHijo);
      this.conS.ActualizarItem(this.Items[index]).then((resp) => {
         this.expandedKeys=[]
        this.expandedKeys.push(this.Items[index].idAbuelo);
        this.expandedKeys.push(this.Items[index].idPadre);
        Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
        this.construirCatalogoItems(false);
        this.visibleProyecto=false
      });

    }
    else {
      const index = this.CuentasNietos.findIndex((item: any) => item.idNieto === this.CuentaSeleccionada.idNieto);
      this.conS.ActualizarCuentaNieto(this.CuentasNietos[index]).then((resp) => {
        this.expandedKeys.push(this.CuentasNietos[index].idAbuelo);
        this.expandedKeys.push(this.CuentasNietos[index].idPadre);
        this.expandedKeys.push(this.CuentasNietos[index].idHijo);
        Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
        this.construirCatalogoItems(false);
        this.visibleProyecto=false
      });      
    }
  }

  editarSucursales() {
    let idsSucursales = this.SucursalesSeleccionadasCuenta.map((sucursal: any) => sucursal.id)
    if (this.CuentaSeleccionada.Tipo == 'Hijo') {
      const index = this.Items.findIndex((item: any) => item.idHijo === this.CuentaSeleccionada.idHijo);
      this.Items[index].idsSucursales = idsSucursales
      this.expandedKeys.push(this.CuentaSeleccionada.idAbuelo);
      this.expandedKeys.push(this.CuentaSeleccionada.idPadre);
      this.construirCatalogoItems(false);
    }
    else {
      const index = this.CuentasNietos.findIndex((item: any) => item.idNieto === this.CuentaSeleccionada.idNieto);
      this.CuentasNietos[index].idsSucursales = idsSucursales
     
      this.expandedKeys.push(this.CuentaSeleccionada.idAbuelo);
      this.expandedKeys.push(this.CuentaSeleccionada.idPadre);
      this.expandedKeys.push(this.CuentaSeleccionada.idHijo);
      this.construirCatalogoItems(false); 
    } 
  }

  guardarEdicionSucursal() {

    if (this.CuentaSeleccionada.Tipo == 'Hijo') {
      const index = this.Items.findIndex((item: any) => item.idHijo === this.CuentaSeleccionada.idHijo);
      this.conS.ActualizarItem(this.Items[index]).then((resp) => {
        this.expandedKeys.push(this.Items[index].idAbuelo);
        this.expandedKeys.push(this.Items[index].idPadre);
        Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
        this.construirCatalogoItems(false);
        this.visibleSucursal=false
      });
    }
    else {
      const index = this.CuentasNietos.findIndex((item: any) => item.idNieto === this.CuentaSeleccionada.idNieto);
      this.conS.ActualizarCuentaNieto(this.CuentasNietos[index]).then((resp) => {
        this.expandedKeys.push(this.CuentasNietos[index].idAbuelo);
        this.expandedKeys.push(this.CuentasNietos[index].idPadre);
        this.expandedKeys.push(this.CuentasNietos[index].idHijo);
        Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
        this.construirCatalogoItems(false);
        this.visibleProyecto=false
      });      
    }  

  }

  obtenerEmpresas() {
    let Subscribe: Subscription
    Subscribe = this.conS.obtenerEmpresas(this.usuario.idMatriz).subscribe((resp: any) => {
      Subscribe.unsubscribe()
      this.Empresas = resp;
      this.crearCuentasFijas();
    });
  }

  ajustarAnchoTabla() {
    setTimeout(() => {
      const colNombre = document.querySelector('.col-nombre span');

      if (colNombre) {
        const anchoTexto = (colNombre as HTMLElement).scrollWidth;
        // Sumo un margen adicional para botones y paddings
        this.anchoTabla = 90 + 'rem';
        console.log('anchoTabla', this.anchoTabla);
      }
    });
  }
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  crearCuentasFijas() {
    let ConfigCuentas: boolean;
    let EmpresaUsuario = this.Empresas.filter((emp: any) => emp.id == this.idEmpresa)[0];
    ConfigCuentas = EmpresaUsuario.CuentasConfig;
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;

    if (ConfigCuentas == false) {
      let CuentasHijos = [];
      let idsProyectos = this.Proyectos.map((proyect: any) => proyect.id)
      let idsSucursales = this.Sucursales.map((sucursal: any) => sucursal.id)
      CuentasHijos.push(
        {
          Nombre: '1.1.1 Cobros por ventas de contado',
          Prefijo: '1.1.1',
          FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
          HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
          PrefijoPadre: 1.1,
          PrefijoHijo: 1,
          Customizable: false,
          CuentasNieto:false,
          CuentaFija:true,
          idsProyectos: idsProyectos,
          idsSucursales: idsSucursales,
          Alias: 'Cobros por ventas de contado',
          Tipo: 'Hijo',
          idPadre: 'od11V2OHVgaLG1RiXMiz',
          idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
          Editable: false,
          Orden: 1,
          OrdenReal: 1,
          idEmpresa: this.idEmpresa,
          idCorporacion: this.usuario.idMatriz
        },
        {
          Nombre: '1.2.1 Pagos a proveedores (Costo de Operación)',
          Prefijo: '1.2.1',
          PrefijoPadre: 1.2,
          Customizable: false,
          CuentasNieto:false,
          CuentaFija:true,
          idsProyectos: idsProyectos,
          idsSucursales: idsSucursales,
          FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
          HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
          PrefijoHijo: 1,
          Alias: 'Pagos a proveedores (Costo de Operación)',
          Tipo: 'Hijo',
          idPadre: 'KtA2Cxpd79TJrW9afqR9',
          idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
          Editable: false,
          Orden: 1,
          OrdenReal: 2,
          idEmpresa: this.idEmpresa,
          idCorporacion: this.usuario.idMatriz
        },
        {
          Nombre: '1.2.2 Gastos de Operación',
          Prefijo: '1.2.2',
          PrefijoPadre: 1.2,
          PrefijoHijo: 2,
          CuentasNieto:true,
          CuentaFija:true,
          idsProyectos: idsProyectos,
          idsSucursales: idsSucursales,
          Customizable: true,
          FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
          HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
          Alias: 'Gastos de Operación',
          Tipo: 'Hijo',
          idPadre: 'KtA2Cxpd79TJrW9afqR9',
          idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
          Editable: false,
          Orden: 2,
          OrdenReal: 3,
          idEmpresa: this.idEmpresa,
          idCorporacion: this.usuario.idMatriz
        }
      );

      this.conS.guardarCuentasEnLote(CuentasHijos, this.idEmpresa).then((resp: any) => {
        this.obtenerAbuelos();
        this.usuario.CuentasConfig = true;
        localStorage.setItem('usuarioFinancialSystems', JSON.stringify(this.usuario));
      });
    } else {
      this.obtenerAbuelos();
    }
  }

  onNodeExpand(event: any) {
    this.expandedKeys.push(event.node.key);
    this.expandedNodes[event.node.key] = true;
  }

  onNodeCollapse(event: any) {
    this.expandedKeys = this.expandedKeys.filter((exp: any) => exp != event.node.key);
    delete this.expandedNodes[event.node.key];
  }

  obtenerAbuelos() {
    this.conS.obtenerCategoriasFlujos().subscribe((resp: any) => {
      this.Abuelos = resp.filter((r: any) => r.id != 'VmmQpdpunMTqkoSjhzzj');
      this.obtenerCuentasNietos();
    });
  }

  obtenerProyectos() {
    let Subscribe: Subscription
    Subscribe = this.conS.obtenerProyectos(this.idEmpresa).subscribe((resp: any) => {
      Subscribe.unsubscribe()
      this.Proyectos = resp
      this.obtenerSucursales()
    })
  }
  obtenerSucursales() {
    let Subscribe: Subscription
    Subscribe = this.conS.obtenerSucursales(this.idEmpresa).subscribe((resp: any) => {
      this.Sucursales = resp
      Subscribe.unsubscribe()
      this.obtenerEmpresas();
    })
  }


  obtenerProyectosbyCuenta(idsProyectos: any) {
    return this.Proyectos.filter((proy: any) => idsProyectos.includes(proy.id))
  }
  obtenerSucursalesbyCuenta(idsSucursales: any) {
    return this.Sucursales.filter((sucursal: any) => idsSucursales.includes(sucursal.id))
  }

  ObtenerHijos(idPadre: any, idAbuelo: any, cargaInicial: boolean) {
    this.Hijos = [];
    this.Items.filter((hijo: any) => hijo.idPadre == idPadre).forEach((hij: any) => {
      this.Hijos.push({
        key: idPadre + '-' + this.Hijos.length + 1,
        data: {
          name: hij.Nombre,
          Alias: hij.Alias,
          Activo:hij.Activo,
          Prefijo: hij.Prefijo,
          Customizable: hij.Customizable,
          idHijo: hij.idHijo == undefined ? '' : hij.idHijo,
          idPadre: idPadre,
          id:hij.id,
          CuentasNieto:hij.CuentasNieto,
          CuentaFija:hij.CuentaFija,
          PrefijoPadre: hij.PrefijoPadre,
          PrefijoHijo: hij.PrefijoHijo,
          ProyectosSeleccionados: this.obtenerProyectosbyCuenta(hij.idsProyectos),
          SucursalesSeleccionadas: this.obtenerSucursalesbyCuenta(hij.idsSucursales),
          Editable: hij.Editable,
          Orden: hij.Orden,
          OrdenReal: hij.OrdenReal,
          idAbuelo: idAbuelo,
          Tipo: 'Hijo'
        },
        expanded: cargaInicial == true ? false : this.verificarExpanded(hij.id),
        children: this.ObtenerNietos(hij, cargaInicial)
      });
    });
    return this.Hijos;
  }

  ObtenerNietos(rowData: any, cargaInicial: boolean) {
    this.Nietos = [];
    this.CuentasNietos.filter((nieto: any) => nieto.idHijo == rowData.idHijo).forEach((niet: any) => {
      this.Nietos.push({
        key: rowData.idHijo + '-' + this.Nietos.length + 1,
        data: {
          name: niet.Nombre,
          Alias: niet.Alias,
          Prefijo: niet.Prefijo,
          Activo:niet.Activo,
          CuentaFija:niet.CuentaFija,
          idNieto: niet.idNieto == undefined ? '' : niet.idNieto,
          id: niet.id == undefined ? '' : niet.id,
          idHijo: niet.idHijo == undefined ? '' : niet.idHijo,
          idPadre: rowData.idPadre,
          PrefijoPadre: niet.PrefijoPadre,
          PrefijoHijo: niet.PrefijoHijo,
          ProyectosSeleccionados: this.obtenerProyectosbyCuenta(niet.idsProyectos),
          SucursalesSeleccionadas: this.obtenerSucursalesbyCuenta(niet.idsSucursales),
          Editable: niet.Editable,
          Tipo: niet.Tipo,
          Orden: niet.Orden,
          OrdenReal: niet.OrdenReal,
          idAbuelo: rowData.idAbuelo
        },
        expanded: cargaInicial == true ? false : this.verificarExpanded(niet.id)
      });
    });
    return this.Nietos;
  }
  obtenerItems() {
    let Subscripcion: Subscription;
    Subscripcion = this.conS.obtenerItems(this.idEmpresa).subscribe((items: any) => {
      Subscripcion.unsubscribe();
      this.Items = items;
      this.construirCatalogoItems(true);
    });
  }


  obtenerCuentasNietos() {
    let Subscripcion: Subscription;
    Subscripcion = this.conS.obtenerCuentasNietos(this.idEmpresa).subscribe((cuentas: any) => {
      Subscripcion.unsubscribe();
      this.CuentasNietos = cuentas;
      this.obtenerItems();
    });
  }

  guardarExpandibles(nodos: any[], abiertos: Set<string>) {
    nodos?.forEach((n) => {
      if (n.expanded) abiertos.add(String(n.key));
      if (n.children?.length) this.guardarExpandibles(n.children, abiertos);
    });
  }

  restaurarExpandibles(nodos: any[], abiertos: Set<string>) {
    nodos?.forEach((n) => {
      n.expanded = abiertos.has(String(n.key));
      if (n.children?.length) this.restaurarExpandibles(n.children, abiertos);
    });
  }

  construirCatalogoItems(cargaInicial: boolean) {
    const abiertos = new Set<string>(this.expandedNodes);
    this.guardarExpandibles(this.CatalogoCuentas, abiertos);

    this.CatalogoCuentas = [];
    this.Abuelos.filter((abuelo: any) => abuelo.Tipo == 3).forEach((flujo: any) => {
      this.CatalogoCuentas.push({
        key: flujo.id,
        data: {
          name: flujo.Nombre,
          idAbuelo: flujo.id,
          Tipo: 'Abuelo',
          Editable: false,
          idCateg: flujo.idCateg
        },
        expanded: cargaInicial == true ? false : this.verificarExpanded(flujo.id),
        children: this.ObtenerPadres(flujo.id, cargaInicial)
      });
    });
  }

  verificarExpanded(idElemento: any) {
    return this.expandedKeys.filter((exp: any) => exp == idElemento).length > 0 ? true : false;
  }
  ObtenerPadres(idAbuelo: any, cargaInicial: boolean) {
    this.Padres = [];
    this.Abuelos.filter((abuelo: any) => abuelo.idAbuelo == idAbuelo).forEach((padre: any) => {
      this.Padres.push({
        key: idAbuelo + '-' + this.Padres.length + 1,
        data: {
          name: padre.Nombre,
          Tipo: 'Padre',
          idPadre: padre.id,
          Customizable: true,
          Editable: false,
          idCateg: padre.idCateg,
          idAbuelo: idAbuelo
        },
        expanded: cargaInicial == true ? false : this.verificarExpanded(padre.id),
        children: this.ObtenerHijos(padre.id, idAbuelo, cargaInicial)
      });
    });
    return this.Padres;
  }

  AddCuentaHijo(idPadre: any, idAbuelo: any, idCateg: any) {
    let idsProyectos = this.Proyectos.map((proyect: any) => proyect.id)
    let idsSucursales = this.Sucursales.map((sucursal: any) => sucursal.id)
    let Orden: any = this.Items.filter((it: any) => it.idPadre == idPadre).length;

    this.Items.push({
      Nombre: '',
      Activo: true,
      Prefijo: idCateg + '.' + (Orden + 1),
      PrefijoPadre: Number(idCateg),
      PrefijoHijo: Orden + 1,
      Alias: '',
      Tipo: 'Hijo',
      CuentasNieto:false,
      CuentaFija:false,
      Customizable: true,
      idsSucursales: idsSucursales,
      idsProyectos: idsProyectos,
      ProyectosSeleccionados: this.obtenerProyectosbyCuenta(idsProyectos),
      SucursalesSeleccionadas: this.obtenerSucursalesbyCuenta(idsSucursales),
      idPadre: idPadre,
      idAbuelo: idAbuelo,
      Editable: true,
      Orden: Orden + 1,
      OrdenReal: this.Items.length + 1,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz
    });

    this.expandedKeys.push(idAbuelo);
    this.expandedKeys.push(idPadre);
    this.construirCatalogoItems(false);
    this.focusInput();
  }

  AddCuentaNieto(rowData: any) {
    let idsProyectos = this.Proyectos.map((proyect: any) => proyect.id)
    let idsSucursales = this.Sucursales.map((sucursal: any) => sucursal.id)
    let Orden: any = this.CuentasNietos.filter((it: any) => it.idHijo == rowData.idHijo).length;
    this.CuentasNietos.push({
      Nombre: '',
      Activo: true,
      Prefijo: rowData.PrefijoPadre + '.' + rowData.PrefijoHijo + '.' + (Orden + 1),
      PrefijoPadre: Number(rowData.PrefijoPadre),
      PrefijoHijo: Number(rowData.PrefijoHijo),
      PrefijoNieto: Orden + 1,
      Alias: '',
      Tipo: 'Nieto',
      CuentaFija:false,
      idsSucursales: idsSucursales,
      idsProyectos: idsProyectos,
      ProyectosSeleccionados: this.obtenerProyectosbyCuenta(idsProyectos),
      SucursalesSeleccionadas: this.obtenerSucursalesbyCuenta(idsSucursales),
      idPadre: rowData.idPadre,
      idAbuelo: rowData.idAbuelo,
      idHijo: rowData.idHijo,
      Editable: true,
      Orden: Orden + 1,
      OrdenReal: this.CuentasNietos.length + 1,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz
    });

    this.expandedKeys.push(rowData.idAbuelo);
    this.expandedKeys.push(rowData.idPadre);
    this.expandedKeys.push(rowData.idHijo);
    this.construirCatalogoItems(false);
    this.focusInputCuentaNieto();
  }

  guardarHijo(hijo: any) {
    Swal.fire({
      title: 'Cargando...'
    });
    Swal.showLoading();
    const index = this.Items.findIndex((item: any) => item.idHijo === hijo.idHijo);
    if (hijo.Tipo == 'Hijo') {
      let idsProyectos = hijo.ProyectosSeleccionados.map((proyect: any) => proyect.id)
      let idsSucursales = hijo.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)
      if (hijo.Alias == '') {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Debe colocar un nombre a la cuenta',
          showConfirmButton: false,
          timer: 1500
        });
      }
      else {
        if (index !== -1) {
          this.Items[index].Nombre = `${hijo.Prefijo} ${hijo.Alias}`;
          this.Items[index].Alias = `${hijo.Alias}`;
          this.Items[index].Editable = false;
          this.Items[index].idsProyectos = idsProyectos;
          this.Items[index].idsSucursales = idsSucursales;
          this.conS.ActualizarItem(this.Items[index]).then((resp) => {
            this.expandedKeys.push(hijo.idAbuelo);
            this.expandedKeys.push(hijo.idPadre);

            Swal.close();
            this.toastr.success('Cuenta actualizada', '¡Éxito!', {
              timeOut: 1000,
              positionClass: 'toast-center-center'
            });
            this.construirCatalogoItems(false);
          });
        } else {
          const currentDate = new Date();
          const hours = currentDate.getHours();
          const minutes = currentDate.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHour = hours % 12 || 12;

          let Item = {
            Activo:true,
            Nombre: `${hijo.Prefijo} ${hijo.Alias}`,
            Prefijo: hijo.Prefijo,
            PrefijoPadre: hijo.PrefijoPadre,
            PrefijoHijo: hijo.PrefijoHijo,
            CuentaFija:false,
            Alias: hijo.Alias,
            FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
            HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
            Tipo: 'Hijo',
            idPadre: hijo.idPadre,
            idsSucursales: idsSucursales,
            idsProyectos: idsProyectos,
            idAbuelo: hijo.idAbuelo,
            Customizable: true,
            Editable: false,
            Orden: hijo.Orden,
            OrdenReal: hijo.OrdenReal,
            idEmpresa: this.idEmpresa,
            idCorporacion: this.usuario.idMatriz,
            Created_User: this.usuario.id
          };

          this.conS.crearItem(Item).then((id:any)=>{ 
            const index = this.Items.findIndex((item: any) => item.Prefijo === hijo.Prefijo);
            this.Items[index].Nombre = `${hijo.Prefijo} ${hijo.Alias}`;
            this.Items[index].Alias = `${hijo.Alias}`;
            this.Items[index].Editable = false;
            this.Items[index].idsSucursales = idsSucursales;
            this.Items[index].idsProyectos = idsProyectos;
            this.Items[index].idHijo = id;
            this.Items[index].id = id;
            this.expandedKeys.push(hijo.idAbuelo);
            this.expandedKeys.push(hijo.idPadre);

            Swal.close();
            this.toastr.success('Cuenta guardada', '¡Éxito!', {
              timeOut: 1000,
              positionClass: 'toast-center-center'
            });
            this.construirCatalogoItems(false);
          });
        }

      }
    } else {
      this.guardarNieto(hijo);
    }
  }

  guardarNieto(nieto: any) {
    if (nieto.Alias == '') {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Debe colocar un nombre a la cuenta',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      Swal.fire({
        title: 'Cargando...'
      });
      Swal.showLoading();
      const index = this.CuentasNietos.findIndex((item: any) => item.idNieto === nieto.idNieto);
      let idsProyectos = nieto.ProyectosSeleccionados.map((proyect: any) => proyect.id)
      let idsSucursales = nieto.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)
      if (index !== -1) {
        this.CuentasNietos[index].Nombre = `${nieto.Prefijo} ${nieto.Alias}`;
        this.CuentasNietos[index].Alias = `${nieto.Alias}`;
        this.CuentasNietos[index].Editable = false;
        this.CuentasNietos[index].idsProyectos = idsProyectos;
        this.CuentasNietos[index].idsSucursales = idsSucursales;

        this.conS.ActualizarCuentaNieto(this.CuentasNietos[index]).then((resp) => {
          this.expandedKeys.push(nieto.idAbuelo);
          this.expandedKeys.push(nieto.idPadre);
          this.expandedKeys.push(nieto.idHijo);

          Swal.close();
          this.toastr.success('Cuenta actualizada', '¡Éxito!', {
            timeOut: 1000,
            positionClass: 'toast-center-center'
          });
          this.construirCatalogoItems(false);
        });
      } else {
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;

        let CuentaNieto = {
          Activo:true,
          Nombre: `${nieto.Prefijo} ${nieto.Alias}`,
          Prefijo: nieto.Prefijo,
          PrefijoPadre: nieto.PrefijoPadre,
          PrefijoHijo: nieto.PrefijoHijo,
          Alias: nieto.Alias,
          CuentaFija:false,
          FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
          HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
          Tipo: 'Nieto',
          idPadre: nieto.idPadre,
          idAbuelo: nieto.idAbuelo,
          idHijo: nieto.idHijo,
          idsProyectos: idsProyectos,
          idsSucursales: idsSucursales,
          ProyectosSeleccionados: this.obtenerProyectosbyCuenta(idsProyectos),
          SucursalesSeleccionadas: this.obtenerSucursalesbyCuenta(idsSucursales),
          Editable: false,
          Orden: nieto.Orden,
          OrdenReal: nieto.OrdenReal,
          idEmpresa: this.idEmpresa,
          idCorporacion: this.usuario.idMatriz,
          Created_User: this.usuario.id
        };
        this.conS.crearCuentaNieto(CuentaNieto).then((resp: any) => {
          const index = this.CuentasNietos.findIndex((item: any) => item.Prefijo === nieto.Prefijo);
          this.CuentasNietos[index].Nombre = `${nieto.Prefijo} ${nieto.Alias}`;
          this.CuentasNietos[index].Alias = `${nieto.Alias}`;
          this.CuentasNietos[index].Editable = false;
          this.CuentasNietos[index].idsSucursales = idsSucursales;
          this.CuentasNietos[index].idsProyectos = idsProyectos;
          this.CuentasNietos[index].id = resp;
          this.CuentasNietos[index].idNieto = resp;
          this.expandedKeys.push(nieto.idAbuelo);
          this.expandedKeys.push(nieto.idPadre);
          this.expandedKeys.push(nieto.idHijo);

          Swal.close();
          this.toastr.success('Cuenta guardada', '¡Éxito!', {
            timeOut: 1000,
            positionClass: 'toast-center-center'
          });
          this.construirCatalogoItems(false);
        });
      }
    }
  }

  ActualizarEstadoCuenta(cuenta:any){
    cuenta.Activo=!cuenta.Activo
    if(cuenta.Tipo=='Hijo'){
      this.conS.ActualizarItemEstado(cuenta,cuenta.Activo).then((resp) => {
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
      })
    }
   else if(cuenta.Tipo=='Nieto'){
      this.conS.ActualizarCuentaNietoEstado(cuenta,cuenta.Activo).then((resp) => {
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
      })
    }
  }
}
