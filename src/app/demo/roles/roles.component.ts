// angular import
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChangeDetectorRef } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import ListaRolesComponent from './lista-roles/lista-roles.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeModule,InputSwitchModule,TabViewModule,ListaRolesComponent],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export default class RolesComponent implements OnInit {
  @Input() ConfigInicial:boolean=false
  @Input() empresaID:string=''
  @Output() rolCreado = new EventEmitter<any>();
  idEmpresa:string=''
  constructor(
    private authS:AuthService,
    private conS:ConfigurationService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef) {
  }
  Modulos:any=[]
  Atributos :any=[]
  selectedNodes:any=[]
  ItemsModulosAtributos: TreeNode[]=[]
  nombreRol:FormControl=new FormControl('')
  usuario:any
  Fecha:any= new Date();
  metaKeySelection: boolean = false;
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
    console.log('idEmpresa',this.idEmpresa)
   
      this.obtenerAtributos()
    });
  }

  obtenerAtributos(){
    this.authS.obtenerAtributos().subscribe((data:any)=>{
      this.Atributos=data.map((atributo: any) => {
        return { ...atributo, Seleccionado: false };
      });
      this.obtenerModulos()
    })
  }
  guardarRol(){
    let _AtributosRol:any=[]
    this.ItemsModulosAtributos.forEach((atributo: any) => {
    atributo.children.forEach((element:any) => {
  
    let _DataAtributo={
      "Nombre":element.label,
      "Seleccionado":element.data.Seleccionado,
      "idModulo":element.data.atributo.idModulo,
      "id":element.data.atributo.id

    }
    _AtributosRol.push(_DataAtributo)
    
  });


});

  let _Rol={
    "Rol":this.nombreRol.value,
    "Atributos":_AtributosRol,
    "idEmpresa":this.idEmpresa,
    "isAdmin":_AtributosRol.every(item => item.Seleccionado === true),
    "idMatriz":this.usuario.idMatriz,
    "idUsuario":this.usuario.id,
    "Usuario":this.usuario.Usuario,

    "FechaRegistro":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
  }


  this.authS.guardarRol(_Rol).then(resp=>{
    this.rolCreado.emit(_Rol);
    this.toastr.success('Rol creado', '¡Exito!');
    this.nombreRol.setValue('')
    this.ItemsModulosAtributos.forEach((atributo: any) => {
      atributo.data.Seleccionado = false;
      if (atributo.children) {
        atributo.children.forEach((child: any) => {
          this.updateSeleccionado(child, false);
        });
      }
      
    });
    this.updateSelection();
    this.cdr.detectChanges();   
 
  })
     
    }
  obtenerModulos(){
    this.authS.obtenerModulos().subscribe((data:any)=>{
      this.Modulos=data.map((modulo: any) => {
        return { ...modulo, Seleccionado: false };
      });
      let contador:any=0
      this.Modulos.forEach((modulo:any) => {
        let _data={
          key: modulo.Nombre + contador,
          label: modulo.Nombre,
          data: { modulo: modulo, Seleccionado: modulo.Seleccionado },
          icon: 'pi pi-fw pi-inbox',
          parent:modulo.Nombre,
          Seleccionado: modulo.Seleccionado,
          children:this.obtenerAtributosByModulo(modulo.id,modulo.Nombre + contador)
        }
        
        contador+=1
        this.ItemsModulosAtributos.push(_data)
      });

    })
}

obtenerAtributosByModulo(idModulo:string,parentKey: string){
  let _Atributos:any=[]
  let contador:any=0
  this.Atributos.filter((atr:any)=>atr.idModulo==idModulo).forEach((element:any) => {
  let _dataAtributo=    {
    key: parentKey + element.Nombre + contador,
    label: element.Nombre,
    data: { atributo: element, Seleccionado: element.Seleccionado },
    icon: 'pi pi-fw pi-cog'
}
  contador+=1
  _Atributos.push(_dataAtributo)
});


  return _Atributos
  
}

updateSeleccionado(node: any, seleccionado: boolean) {
  node.data.Seleccionado = seleccionado;
  if (node.children) {
    node.children.forEach((child: any) => {
      this.updateSeleccionado(child, seleccionado);
    });
  }
}

selectAll(){
  this.ItemsModulosAtributos.forEach((atributo: any) => {
        atributo.data.Seleccionado = this.metaKeySelection;
        if (atributo.children) {
          atributo.children.forEach((child: any) => {
            this.updateSeleccionado(child, this.metaKeySelection);
          });
        }
        
      });
      this.updateSelection();
  
      // Fuerza la detección de cambios
      this.cdr.detectChanges();        
}

updateSelection() {
  this.selectedNodes = this.getSelectedNodes(this.ItemsModulosAtributos);
}

getSelectedNodes(nodes: any[]): any[] {
  let selectedNodes = [];
  nodes.forEach(node => {
    if (node.data.Seleccionado) {
      selectedNodes.push(node);
    }
    if (node.children) {
      selectedNodes = selectedNodes.concat(this.getSelectedNodes(node.children));
    }
  });
  return selectedNodes;
}

onNodeSelect(event: any) {
  this.updateSeleccionado(event.node, true);
}

onNodeUnselect(event: any) {
  this.updateSeleccionado(event.node, false);
}


expandAll() {
  this.ItemsModulosAtributos.forEach((node) => {
      this.expandRecursive(node, true);
  });
}

collapseAll() {
  this.ItemsModulosAtributos.forEach((node) => {
      this.expandRecursive(node, false);
  });
}

private expandRecursive(node: TreeNode, isExpand: boolean) {
  node.expanded = isExpand;
  if (node.children) {
      node.children.forEach((childNode) => {
          this.expandRecursive(childNode, isExpand);
      });
  }
}


}