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
    DialogModule 
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export default class ItemsComponent  implements OnInit{
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,
    private authS:AuthService,
    private toastr: ToastrService,private renderer: Renderer2) {}
  Items:any=[]
  expandedChildrenRows: any[] = [];
  ItemsGroup:any=[]
  ItemsBack:any=[]
  Usuarios:any=[]
  UsuariosSeleccionados:any=[]
  Categorias:any=[]
  CategoriasSeleccionadas:any=[]
  CategoriasBack:any=[]
  Sucursales:any=[]
  SucursalesSeleccionadas:any=[]
  SucursalSeleccionada:any=[]
  Proyectos:any =[]
  ProyectosSeleccionado:any=[]
  ProyectoSeleccionado:any=[]
  SucursalesSelected:any=[]
  Empresas:any=[]
  ItemForm!:FormGroup
  ItemFound:boolean = false;
  Fecha:any= new Date();
  usuario:any
  buscarItem:string=''
  todasSucursales:boolean=true
  BlocCheck!:boolean
  TipoCateg:number=1
  TipoRubro:number=1
  MaxOrden:number=1
  selectedTab: string = 'sucursales';
  claseTabla:string='p-datatable-sm'
  visible: boolean = false;
  cargando: boolean = true;
  TipoCategoria:any=0
  idItems=[]
  idEmpresa:string=''
  @Input() empresaID:string=''
  ngOnInit(): void {
    this.todasSucursales=true
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

    
   
    });
  
 

  }




}
