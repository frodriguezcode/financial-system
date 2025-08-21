// angular import
import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
export default class ItemsComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}
  usuario: any;
  Items: any = [];
  Abuelos: any = [];
  Padres: any = [];
  Hijos: any = [];
  CatalogoCuentas: any = [];
  idEmpresa: string = '';
  expandedKeys: any = [];
  expandedNodes: Set<string> = new Set();
  Sucursales: any = [];
  Proyectos: any = [];
  @Input() empresaID: string = '';
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
      this.obtenerProyectos();
      this.obtenerSucursales();
      this.obtenerAbuelos();
    });
  }
  obtenerProyectos() {
    this.conS.obtenerProyectos(this.idEmpresa).subscribe((proyectos: any) => {
      this.Proyectos = proyectos;
    });
  }
  obtenerSucursales() {
    this.conS.obtenerSucursales(this.idEmpresa).subscribe((sucursales: any) => {
      this.Sucursales = sucursales;
    });
  }

  onNodeExpand(event: any) {
    console.log('event', event.node.key);
    this.expandedKeys.push(event.node.key);
    this.expandedNodes[event.node.key] = true;
  }

  onNodeCollapse(event: any) {
    this.expandedKeys = this.expandedKeys.filter((exp: any) => exp != event.node.key);
    delete this.expandedNodes[event.node.key];
  }

  obtenerAbuelos() {
    this.conS.obtenerCategoriasFlujos().subscribe((resp: any) => {
      this.Abuelos = resp;

      console.log('Categorias', this.Abuelos);
      this.obtenerItems();
    });
  }

  ObtenerHijos(idPadre: any, idAbuelo: any, cargaInicial: boolean) {
    this.Hijos = [];
    this.Items.filter((hijo: any) => hijo.idPadre == idPadre).forEach((hij: any) => {
      this.Hijos.push({
        key: idPadre + '-' + this.Hijos.length + 1,
        data: {
          name: hij.Nombre,
          Alias: hij.Alias,
          Prefijo: hij.Prefijo,
          idHijo: hij.idHijo == undefined ? '' : hij.idHijo,
          idPadre: idPadre,
          PrefijoPadre: hij.PrefijoPadre,
          PrefijoHijo: hij.PrefijoHijo,
          Editable: hij.Editable,
          Orden: hij.Orden,
          OrdenReal: hij.OrdenReal,
          idAbuelo: idAbuelo,
          Tipo: 'Hijo'
        },
        expanded: cargaInicial == true ? false : this.verificarExpanded(hij.id)
      });
    });
    return this.Hijos;
  }
  ObtenerNietos(idAbuelo: any) {
    return this.Abuelos.filter((abuelo: any) => abuelo.idAbuelo == idAbuelo);
  }
  obtenerItems() {
    let Subscripcion:Subscription
  Subscripcion=  this.conS.obtenerItems(this.idEmpresa).subscribe((items: any) => {
    Subscripcion.unsubscribe()
      this.Items = items;
      this.construirCatalogoItems(true);
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
    console.log('CatalogoCuentas', this.CatalogoCuentas);
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
    let Orden: any = this.Items.filter((it: any) => it.idPadre == idPadre).length;

    this.Items.push({
      Nombre: '',
      Prefijo: idCateg + '.' + (Orden + 1),
      PrefijoPadre: Number(idCateg),
      PrefijoHijo: Orden + 1,
      Alias: '',
      Tipo: 'Hijo',
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
  }

  guardarHijo(hijo: any) {
        Swal.fire({
      title: 'Cargando...'
    });
    Swal.showLoading();
    const index = this.Items.findIndex(
      (item: any) => item.idHijo === hijo.idHijo
    );

    if (index !== -1) {
      this.Items[index].Nombre = `${hijo.Prefijo} ${hijo.Alias}`;
      this.Items[index].Alias = `${hijo.Alias}`;
      this.Items[index].Editable = false;

      this.conS.ActualizarItem(this.Items[index]).then(resp=>{
                this.expandedKeys.push(hijo.idAbuelo);
        this.expandedKeys.push(hijo.idPadre);
  
        Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
        this.construirCatalogoItems(false);
      })
    }
    else {

    let Item=  {
      Nombre: `${hijo.Prefijo} ${hijo.Alias}` ,
      Prefijo: hijo.Prefijo,
      PrefijoPadre: hijo.PrefijoPadre,
      PrefijoHijo: hijo.PrefijoHijo,
      Alias:hijo.Alias,
      Tipo: 'Hijo',
      idPadre: hijo.idPadre,
      idAbuelo: hijo.idAbuelo,
      Editable: true,
      Orden: hijo.Orden,
      OrdenReal: hijo.OrdenReal,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz,
      Created_User:this.usuario.id
    }
      
      this.conS.crearItem(Item).then((resp: any) => {
        hijo.Editable = false;
        hijo.name = `${hijo.Prefijo} ${hijo.Alias}`;
        hijo.Alias = `${hijo.Alias}`;
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

    console.log('hijo', hijo);
  }
}
