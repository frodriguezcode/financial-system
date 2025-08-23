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
  anchoTabla: string = '50rem';
  @Input() empresaID: string = '';
  ngOnInit(): void {
    this.conS.usuario$.subscribe((usuario) => {
      console.log('anchoTabla',this.anchoTabla)
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
      this.crearCuentasFijas(this.usuario.CuentasConfig)
    });
  }

  ajustarAnchoTabla() {
  setTimeout(() => {
    const colNombre = document.querySelector('.col-nombre span');

    if (colNombre) {
      const anchoTexto = (colNombre as HTMLElement).scrollWidth;
      // Sumo un margen adicional para botones y paddings
      this.anchoTabla = 90 + 'rem';
          console.log('anchoTabla',this.anchoTabla)
    }
  });
}
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  crearCuentasFijas(CuentasConfig:any){
      const currentDate = new Date();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 || 12;
    if(CuentasConfig==false){
     let CuentasHijos=[]

     CuentasHijos.push(
      {
      Nombre: '1.1.1 Cobros por ventas de contado',
      Prefijo: "1.1.1",
      FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
      HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
      PrefijoPadre: 1.1,
      PrefijoHijo: 1,
      Customizable:true,
      Alias: 'Cobros por ventas de contado',
      Tipo: 'Hijo',
      idPadre: 'od11V2OHVgaLG1RiXMiz',
      idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
      Editable: false,
      Orden:1,
      OrdenReal: 1,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz
    },
    {
      Nombre: '1.2.1 Pagos a proveedores (Costo de Operación)',
      Prefijo: "1.2.1",
      PrefijoPadre: 1.2,
      Customizable:false,
      FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
      HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
      PrefijoHijo: 1,
      Alias: 'Pagos a proveedores (Costo de Operación)',
      Tipo: 'Hijo',
      idPadre: 'KtA2Cxpd79TJrW9afqR9',
      idAbuelo: 'od11V2OHVgaLG1RiXMiz',
      Editable: false,
      Orden:1,
      OrdenReal: 2,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz
    },
    {
      Nombre: '1.2.2 Gastos de Operación',
      Prefijo: "1.2.2",
      PrefijoPadre: 1.2,
      PrefijoHijo: 2,
      Customizable:true,
      FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
      HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,      
      Alias: 'Gastos de Operación',
      Tipo: 'Hijo',
      idPadre: 'KtA2Cxpd79TJrW9afqR9',
      idAbuelo: 'EESGPM4hWXvDlXSRnCwA',
      Editable: false,
      Orden:2,
      OrdenReal: 3,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz
    },
     )   

     this.conS.guardarCuentasEnLote(CuentasHijos,this.idEmpresa).then((resp:any)=>{
      this.obtenerAbuelos();
      this.usuario.CuentasConfig=true
      localStorage.setItem('usuarioFinancialSystems', JSON.stringify(this.usuario)); 

     })

    }
    else {
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
      console.log('resp',resp)
      this.Abuelos = resp.filter((r:any)=>r.id!='VmmQpdpunMTqkoSjhzzj');
      this.obtenerCuentasNietos();
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
          Customizable:hij.Customizable,
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
        expanded: cargaInicial == true ? false : this.verificarExpanded(hij.id),
        children:this.ObtenerNietos(hij,cargaInicial)
      });
    });
    return this.Hijos;
  }


  ObtenerNietos(rowData:any,cargaInicial:boolean) {
  this.Nietos = [];
    this.CuentasNietos.filter((nieto: any) => nieto.idHijo == rowData.idHijo).forEach((niet: any) => {
      this.Nietos.push({
        key: rowData.idHijo + '-' + this.Nietos.length + 1,
        data: {
          name: niet.Nombre,
          Alias: niet.Alias,
          Prefijo: niet.Prefijo,
          idNieto: niet.idNieto == undefined ? '' : niet.idNieto,
          idHijo: niet.idHijo == undefined ? '' : niet.idHijo,
          idPadre: rowData.idPadre,
          PrefijoPadre: niet.PrefijoPadre,
          PrefijoHijo: niet.PrefijoHijo,
          Editable: niet.Editable,
          Orden: niet.Orden,
          OrdenReal: niet.OrdenReal,
          idAbuelo: rowData.idAbuelo,
          Tipo: 'Nieto'
        },
        expanded: cargaInicial == true ? false : this.verificarExpanded(niet.id)

      });
    });
    return this.Nietos;
  }
  obtenerItems() {
    let Subscripcion:Subscription
  Subscripcion=  this.conS.obtenerItems(this.idEmpresa).subscribe((items: any) => {
    Subscripcion.unsubscribe()
      this.Items = items;
      this.construirCatalogoItems(true);
    });
  }

  obtenerCuentasNietos(){
    let Subscripcion: Subscription
    Subscripcion=this.conS.obtenerCuentasNietos(this.idEmpresa).subscribe((cuentas:any)=>{
      Subscripcion.unsubscribe()
      this.CuentasNietos=cuentas
      this.obtenerItems()
    })
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
    console.log('CatalogoCuentas',this.CatalogoCuentas)
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
          Customizable:true,
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
      Customizable:true,
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

  AddCuentaNieto(rowData:any) {
    let Orden: any = this.CuentasNietos.filter((it: any) => it.idHijo == rowData.idHijo).length;
    this.CuentasNietos.push({
      Nombre: '',
      Prefijo: rowData.PrefijoPadre + '.' + rowData.PrefijoHijo + '.' + (Orden + 1),
      PrefijoPadre: Number(rowData.PrefijoPadre),
      PrefijoHijo: Number(rowData.PrefijoHijo),
      PrefijoNieto: (Orden + 1),
      Alias: '',
      Tipo: 'Nieto',
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
  }

  guardarHijo(hijo: any) {
        Swal.fire({
      title: 'Cargando...'
    });
    Swal.showLoading();
    const index = this.Items.findIndex(
      (item: any) => item.idHijo === hijo.idHijo
    );
  
    if(hijo.Tipo=='Hijo'){
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
      const currentDate = new Date();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 || 12; 
  
      let Item=  {
        Nombre: `${hijo.Prefijo} ${hijo.Alias}` ,
        Prefijo: hijo.Prefijo,
        PrefijoPadre: hijo.PrefijoPadre,
        PrefijoHijo: hijo.PrefijoHijo,
        Alias:hijo.Alias,
        FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
        HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,        
        Tipo: 'Hijo',
        idPadre: hijo.idPadre,
        idAbuelo: hijo.idAbuelo,
        Customizable:true,
        Editable: false,
        Orden: hijo.Orden,
        OrdenReal: hijo.OrdenReal,
        idEmpresa: this.idEmpresa,
        idCorporacion: this.usuario.idMatriz,
        Created_User:this.usuario.id
      }
    
        this.conS.crearItem(Item).then((resp: any) => {

          const index = this.Items.findIndex(
          (item: any) => item.Prefijo === hijo.Prefijo
          );
          this.Items[index].Nombre = `${hijo.Prefijo} ${hijo.Alias}`;
          this.Items[index].Alias = `${hijo.Alias}`;
          this.Items[index].Editable = false;
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

    else {
      this.guardarNieto(hijo)
    }


  }

  guardarNieto(nieto: any) {
        Swal.fire({
      title: 'Cargando...'
    });
    Swal.showLoading();
    const index = this.CuentasNietos.findIndex(
      (item: any) => item.idNieto === nieto.idNieto
    );

    if (index !== -1) {
      this.CuentasNietos[index].Nombre = `${nieto.Prefijo} ${nieto.Alias}`;
      this.CuentasNietos[index].Alias = `${nieto.Alias}`;
      this.CuentasNietos[index].Editable = false;

      this.conS.ActualizarItem(this.Items[index]).then(resp=>{
        
     


        this.expandedKeys.push(nieto.idAbuelo);
        this.expandedKeys.push(nieto.idPadre);
        this.expandedKeys.push(nieto.idHijo);
  
        Swal.close();
        this.toastr.success('Cuenta actualizada', '¡Éxito!', {
          timeOut: 1000,
          positionClass: 'toast-center-center'
        });
        this.construirCatalogoItems(false);
      })
    }
    else {
      const currentDate = new Date();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 || 12;      

    let CuentaNieto=  {
      Nombre: `${nieto.Prefijo} ${nieto.Alias}` ,
      Prefijo: nieto.Prefijo,
      PrefijoPadre: nieto.PrefijoPadre,
      PrefijoHijo: nieto.PrefijoHijo,
      Alias:nieto.Alias,
      FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
      HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,       
      Tipo: 'Nieto',
      idPadre: nieto.idPadre,
      idAbuelo: nieto.idAbuelo,
      idHijo: nieto.idHijo,
      Editable: false,
      Orden: nieto.Orden,
      OrdenReal: nieto.OrdenReal,
      idEmpresa: this.idEmpresa,
      idCorporacion: this.usuario.idMatriz,
      Created_User:this.usuario.id
    }
      this.conS.crearCuentaNieto(CuentaNieto).then((resp: any) => {

        const index = this.CuentasNietos.findIndex(
        (item: any) => item.Prefijo === nieto.Prefijo
        );
        this.CuentasNietos[index].Nombre = `${nieto.Prefijo} ${nieto.Alias}`;
        this.CuentasNietos[index].Alias = `${nieto.Alias}`;
        this.CuentasNietos[index].Editable = false;
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
