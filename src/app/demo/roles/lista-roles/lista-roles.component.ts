// angular import
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TreeModule } from 'primeng/tree';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeModule,InputSwitchModule],
  templateUrl: './lista-roles.component.html',
  styleUrls: ['./lista-roles.component.scss']
})
export default class ListaRolesComponent implements OnInit {
  @Input() Atributos:any
  Roles:any=[]
  RolSeleccionado:any
  usuario:any=[]
  selectedNodes:any=[]
  Modulos:any=[]
  ItemsModulosAtributos: TreeNode[]=[]
  metaKeySelection: boolean = false;
  constructor(private authS:AuthService,private toastr: ToastrService, private cdr: ChangeDetectorRef ){}
@Input() ModulosTodos:any
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerRoles()


}

obtenerModulos(){
  this.authS.obtenerModulos().subscribe((data:any)=>{
    this.Modulos=data.map((modulo: any) => {
      return { ...modulo, Seleccionado: false };
    });



  })
}

obtenerRoles(){
  this.authS.obtenerRoles(this.usuario.idEmpresa).subscribe((resp:any)=>{
    this.Roles=resp
    this.obtenerModulos()
  })
}

rolSelect(rolSelecionado:any){
  this.metaKeySelection=false
  //this.ItemsModulosAtributos=rolSelecionado.ItemsModulosAtributos
  this.RolSeleccionado=rolSelecionado

this.ItemsModulosAtributos=[]
  let contador:any=0
  this.Modulos.forEach((modulo:any) => {
    let _data:any={
      key: modulo.Nombre + contador,
      label: modulo.Nombre,
      disabled: false,
      data: { modulo: modulo, Seleccionado: modulo.Seleccionado },
      icon: 'pi pi-fw pi-inbox',
      parent:modulo.Nombre,
      Seleccionado: modulo.Seleccionado,
      children:this.obtenerAtributosByModulo(modulo.id,modulo.Nombre + contador,this.RolSeleccionado.Atributos)

    }

      _data.partialSelected=this.getPartialSelected(modulo.id,this.RolSeleccionado.Atributos)
      _data.Seleccionado=this.getPartialSelected(modulo.id,this.RolSeleccionado.Atributos) ==undefined? false : !this.getPartialSelected(modulo.id,this.RolSeleccionado.Atributos)
      _data.data.Seleccionado=this.getPartialSelected(modulo.id,this.RolSeleccionado.Atributos) ==undefined? false : !this.getPartialSelected(modulo.id,this.RolSeleccionado.Atributos)


    


    this.ItemsModulosAtributos.push(_data)
    contador+=1
  });
  this.selectedNodes = this.getSelectedNodes(this.ItemsModulosAtributos);

}

getPartialSelected(idModulo:string,Atributos:any){
  let dataAtributos:any=[]
  dataAtributos=Atributos.filter((atr:any)=>atr.idModulo==idModulo)

  let haySeleccionados = dataAtributos.some((obj:any) => obj.Seleccionado);
  let  todosFalsos = dataAtributos.some((obj:any) => !obj.Seleccionado);

  if (haySeleccionados && todosFalsos) {
    return true;
  } else if (haySeleccionados) {
    return false;
  }
  return undefined;

}

obtenerAtributosByModulo(idModulo:string,parentKey: string,Atributos:any){
  let _Atributos:any=[]
  let contador:any=0
  Atributos.filter((atr:any)=>atr.idModulo==idModulo).forEach((element:any) => {
  let _dataAtributo=    {
    key: parentKey + element.Nombre + contador,
    label: element.Nombre,
    disabled: false,
    data: { atributo: element, Seleccionado: element.Seleccionado },
    icon: 'pi pi-fw pi-cog'
}

  contador+=1
  _Atributos.push(_dataAtributo)
});


  return _Atributos
  
}


  actualizarRol(){
    console.log('ItemsModulosAtributos',this.ItemsModulosAtributos)
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

this.RolSeleccionado.Atributos=_AtributosRol
    this.authS.actualizarRol(this.RolSeleccionado).then((resp:any)=>{
      this.toastr.success('Rol actualizado', '¡Exito!');
    })
}


  updateSeleccionado(node: any, seleccionado: boolean) {
    node.data.Seleccionado = seleccionado;
    if (node.children) {
      node.children.forEach((child: any) => {
        this.updateSeleccionado(child, seleccionado);
      });
    }
  }
  
  onNodeSelect(event: any) {
    if(this.authS.validarAtributo('9QlYESWYSjAMSrgJfqQ2',[])==true){

      this.updateSeleccionado(event.node, true);
  
    }
    else {
      this.toastr.warning('', '¡Acceso Denegado!',{
        timeOut: 1000,
      });
}
  
  }
  
  onNodeUnselect(event: any) {

    if(this.authS.validarAtributo('9QlYESWYSjAMSrgJfqQ2',[])==true){

      this.updateSeleccionado(event.node, false);
  
    }
    else {

      this.ItemsModulosAtributos.forEach((atributo: any) => {
        atributo.disabled = true;
        if (atributo.children) {
          atributo.children.forEach((child: any) => {
           child.disabled=true
          });
        }
        
      });
      this.toastr.warning('', '¡Acceso Denegado!',{
        timeOut: 1000,
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
    let selectedNodes:any = [];
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
