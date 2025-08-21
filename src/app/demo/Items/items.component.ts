// angular import
import { Component, Input, OnInit,Renderer2  } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
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
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-elemento',
  standalone: true,
  imports: [CommonModule, SharedModule, 
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
    TreeTableModule
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export default class ItemsComponent  implements OnInit{
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,
    private authS:AuthService,
    private toastr: ToastrService,private renderer: Renderer2) {}
  usuario:any
  Items:any=[]
  Abuelos:any=[]
  Padres:any=[]
  Hijos:any=[]
  CatalogoCuentas:any=[]
  idEmpresa:string=''
  expandedKeys: { [key: string]: boolean } = {};
  @Input() empresaID:string=''
  ngOnInit(): void {
    this.conS.usuario$.subscribe(usuario => {
      if (usuario) {
      this.usuario=usuario
      }
      else {
        this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);

      }

      if(this.empresaID!=''){
        this.idEmpresa=this.empresaID
      }

      else {
        this.idEmpresa=this.usuario.idEmpresa
      }
      this.obtenerAbuelos()
    
   
    });
  
 

  }

  onNodeExpand(event: any) {
  this.expandedKeys[event.node.key] = true;
}

onNodeCollapse(event: any) {
  delete this.expandedKeys[event.node.key];
}

  obtenerAbuelos(){
    this.conS.obtenerCategoriasFlujos().subscribe((resp:any)=>{
      this.Abuelos=resp

      console.log('Categorias',this.Abuelos)
      this.obtenerItems()
    })
  }
  

  ObtenerHijos(idPadre:any,idAbuelo:any){
   this.Hijos=[]
   this.Items.filter((hijo:any)=>hijo.idPadre==idPadre).forEach((hij:any) => {
    this.Hijos.push(
      {
        key: idPadre +'-'+ this.Hijos.length+1,
        data: {
            name: hij.Nombre,
            Alias: hij.Alias,
            idHijo: hij.id,
            idPadre: idPadre,
            Editable:hij.Editable,
            idAbuelo: idAbuelo,
            tipo: 'Hijo'
        },
              
      }
    )
   });
   return this.Hijos
  }
  ObtenerNietos(idAbuelo:any){
    return this.Abuelos.filter((abuelo:any)=>abuelo.idAbuelo==idAbuelo)
  }
  obtenerItems(){
    this.conS.obtenerItems(this.idEmpresa).subscribe((items:any)=>{
      this.Items=items
      this.construirCatalogoItems('')

    })
  }

guardarExpandibles(nodos: any[], abiertos: Set<string>) {
  nodos?.forEach(n => {
    if (n.expanded) abiertos.add(String(n.key));
    if (n.children?.length) this.guardarExpandibles(n.children, abiertos);
  });
}

restaurarExpandibles(nodos: any[], abiertos: Set<string>) {
  nodos?.forEach(n => {
    n.expanded = abiertos.has(String(n.key));
    if (n.children?.length) this.restaurarExpandibles(n.children, abiertos);
  });
}

construirCatalogoItems(id:string) {
  // 1. Guardar los que están abiertos
  const abiertos = new Set<string>();
  if(id!==''){
    abiertos.add(id);
  }
  this.guardarExpandibles(this.CatalogoCuentas, abiertos);
  console.log('abiertos',abiertos)
  // 2. Reconstruir data
  this.CatalogoCuentas = [];
  this.Abuelos.filter((abuelo: any) => abuelo.Tipo == 3).forEach((flujo: any) => {
    this.CatalogoCuentas.push({
      key: flujo.id,
      data: {
        name: flujo.Nombre,
        idAbuelo: flujo.id,
        "Editable":false,
        idCateg: flujo.idCateg,
        tipo: 'Abuelo'
      },
      expanded: true,
      children: this.ObtenerPadres(flujo.id)
    });
  });

  // 3. Restaurar los abiertos
  console.log('CatalogoCuentas',this.CatalogoCuentas)
  this.restaurarExpandibles(this.CatalogoCuentas, abiertos);
}

ObtenerPadres(idAbuelo:any){
  this.Padres=[]
   this.Abuelos.filter((abuelo:any)=>abuelo.idAbuelo==idAbuelo).forEach((padre:any) => {
    this.Padres.push(
      {
        key: idAbuelo +'-'+ this.Padres.length+1,
        data: {
            name: padre.Nombre,
            idPadre: padre.id,
            "Editable":false,
            idCateg: padre.idCateg,
            idAbuelo: idAbuelo,
            tipo: 'Padre'
        },
        children: this.ObtenerHijos(padre.id,idAbuelo)        
      }
    )
   });
   return this.Padres
  }

  AddCuentaHijo(idPadre: any, idAbuelo: any, idCateg: any) {
  let Orden: any = this.Items.filter((it: any) => it.idPadre == idPadre).length;

  this.Items.push({
    "Nombre": idCateg + "." + (Orden + 1) + ". ",
    "Alias": " ",
    "idPadre": idPadre,
    "idAbuelo": idAbuelo,
    "idHijo": "",
    "Editable": true,
    "idProyectos": [],
    "idSucursales": [],
    "Orden": Orden + 1,
    "idEmpresa": this.idEmpresa,
    "idCorporacion": this.usuario.idCorporacion
  });

  this.construirCatalogoItems(idPadre);
}



}
