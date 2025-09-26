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
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DialogModule } from 'primeng/dialog';
import RolesComponent from '../roles.component';
import type { CellValueChangedEvent, ColDef, GridOptions, RowClassRules } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule, RowStyle, RowClassParams } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

ModuleRegistry.registerModules([ AllCommunityModule]); 
@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [CommonModule, 
    SharedModule,TreeModule,
    AgGridAngular, AgGridModule,
    InputSwitchModule,DialogModule,RolesComponent],
  templateUrl: './lista-roles.component.html',
  styleUrls: ['./lista-roles.component.scss']
})
export default class ListaRolesComponent implements OnInit {
  @Input() Atributos:any
  @Input() ConfigInicial:boolean=false
  @Input() empresaID:string=''
  idEmpresa:string=''
  Roles:any=[]
  CatalagoRoles:any=[]
  RowData:any=[]
  RolSeleccionado:any
  usuario:any=[]
  selectedNodes:any=[]
  AtributosSistema:any=[]
  AtributosRoles:any=[]
  AtributosSeleccionados:any=[]
  Modulos:any=[]
  ModulosSeleccionados:any=[]
  ItemsModulosAtributos: TreeNode[]=[]
  CabeceraAtributos:any=[]
visibleCrearRol: boolean = false;
  metaKeySelection: boolean = false;
  cargando: boolean = true;
  constructor(private authS:AuthService,private toastr: ToastrService, 
    private conS:ConfigurationService,
    private cdr: ChangeDetectorRef ){}
@Input() ModulosTodos:any
 public gridOptions = {
  onCellValueChanged: (event: any) => this.onCellValueChanged(event)
 }
ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
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

 this.obtenerAtributos()
    this.obtenerRoles()
  });
 


}
onCellValueChanged(event){
  
  let idRol = event.data.idRol;
  let idAtributo = event.colDef.id;
  let Valor = event.value;
  let _Rol:any=[]

  _Rol = JSON.parse(JSON.stringify(this.Roles.find((rol:any)=>rol.id==idRol)));
  _Rol.Atributos.find((atr:any)=>atr.id==idAtributo).Seleccionado=Valor
  this.authS.actualizarRol(_Rol).then((resp:any)=>{

  })


}

showCrearRol() {
  this.visibleCrearRol = true;
}
obtenerAtributos(){
  let Subscripcion:Subscription
  this.AtributosSistema=[]
Subscripcion=  this.authS.obtenerAtributos().subscribe((data:any) => {
  Subscripcion.unsubscribe()
  this.AtributosSistema=data

  })
}
obtenerModulos(){
  let Subscripcion:Subscription
 Subscripcion= this.authS.obtenerModulos().subscribe((data:any)=>{
  Subscripcion.unsubscribe()
  this.Modulos=data.map((modulo: any) => {
      return { ...modulo, Seleccionado: false };
    });




    this.construirColsCabecera()
  })
}

construirColsCabecera(){
  this.CatalagoRoles=[]
  this.Roles.forEach(rol => {
    this.CatalagoRoles.push({
      Nombre: rol.Rol,
      idRol:rol.id
    })
  });
this.construirCabecera()  
  

}

getAtributosByModulo(idModulo:string,Atributos:any)
{
  return Atributos.filter((atr:any)=>atr.idModulo==idModulo)
}
construirCabecera(){
  this.CabeceraAtributos.push({
      headerName: 'Rol',
      field: 'Rol',
      idRol:'0',
      Tipo: 1,
      pinned: 'left',
      sortable: false,
      filter: false
  })
  const ModulosCabecera = this.ModulosSeleccionados.length > 0 ? this.ModulosSeleccionados : this.Modulos;
  const AtributosCabecera = this.AtributosSeleccionados.length > 0 ? this.AtributosSeleccionados : this.AtributosSistema;

  ModulosCabecera.forEach((modulo:any) => {

    const children = this.getAtributosByModulo(modulo.id,AtributosCabecera).map((atr: any) => {
    const uniqueField = `${modulo.id}_${atr.id}`;  
    return {
      headerName: atr.Nombre,
      field: uniqueField,
      id:atr.id,
      idModulo:modulo.id,
      editable:true,
      cellEditor: "agCheckboxCellEditor",
      sortable: false,
      filter: false,
    }

    })
  this.CabeceraAtributos.push({
      headerName: modulo.Nombre,
      field: modulo.Nombre,
      Tipo: 2,
      sortable: false,
      filter: false,
      children: children
  })    


    
  });

  this.construirData()
}

construirData(){
 const rowData: any[] = [];
 this.CatalagoRoles
 .forEach((catalogo:any) => {
  const fila: any = {
    Rol: catalogo.Nombre, // OJO: debe coincidir con el field 'Concepto' en CabeceraBack
    Nombre: catalogo.Nombre, // OJO: debe coincidir con el field 'Concepto' en CabeceraBack
    idRol:catalogo.idRol,
   
  };

  this.CabeceraAtributos
  .filter((cat:any)=>cat.idRol!="0")
  .forEach((cabecera:any) => {
    cabecera.children.forEach((child: any) => {
      const dato = this.AtributosRoles.find(
        (d: any) =>
        d.id === child.id &&
        d.idRol==catalogo.idRol &&
        d.idModulo === child.idModulo
      ); 

 
        fila[child.field] = dato ? dato.Seleccionado : false;

      

    })

  
    
  });


  rowData.push(fila);
 });
 console.log('rowData',rowData)
 this.RowData=rowData
   this.cargando=false
}


obtenerRoles(){
  let Subscripcion:Subscription
Subscripcion=  this.authS.obtenerRoles(this.idEmpresa).subscribe((resp:any)=>{
    Subscripcion.unsubscribe()
    this.Roles=resp
    this.Roles.forEach((rol:any) => {
      rol.Atributos.forEach(atr => {
        atr.idRol=rol.id
        this.AtributosRoles.push(atr)
        
      });
      
    });
    this.obtenerModulos()
  })
}

rolSelect(rolSelecionado:any){
  let AtributosNuevos:any=[]
  AtributosNuevos= this.AtributosSistema.filter(itemA => !rolSelecionado.Atributos.some(itemB => itemB.id === itemA.id));

  if(AtributosNuevos.length>0){
    AtributosNuevos.forEach(element => {
      let AtributoNuevo={
        "Nombre":element.Nombre,
        "Seleccionado":false,
        "id":element.id,
        "idModulo":element.idModulo,
      }
      rolSelecionado.Atributos.push(AtributoNuevo)
    });
  }

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


      this.updateSeleccionado(event.node, true);
  
    
    

  
  }
  
  onNodeUnselect(event: any) {



      this.updateSeleccionado(event.node, false);
  
    

   
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
