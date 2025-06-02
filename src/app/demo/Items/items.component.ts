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

      this.obtenerCategorias()
      this.obtenerEmpresas()
      this.obtenerSucursales()
      this.obtenerUsuarios()
     
   
    });
  
 

  }

  showDialog() {
    this.visible = true;
}

obtenerUsuarios(){
  if(this.usuario.isAdmin==false){
    this.authS.obtenerUsuarios(this.idEmpresa).subscribe((resp:any)=>{
      this.Usuarios=resp
      this.UsuariosSeleccionados=resp
    })
  }
  else {
    this.authS.obtenerUsuariosByMatriz(this.usuario.idMatriz).subscribe((resp:any)=>{
 
    this.authS.obtenerUsuarios(this.idEmpresa).subscribe((resp:any)=>{
      this.Usuarios=resp
      this.UsuariosSeleccionados=resp
   
    })
    })
  }
  

}

borrarCuenta(idCuenta:string){
  let Subscription:Subscription
  Subscription= this.conS.getElementsFromMultipleCollections(idCuenta).subscribe(resp=>{
    Subscription.unsubscribe()

    if(resp.length>0){
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "La puede suspender si no desea usarla",
        title: "Esta cuenta está asociada a varios registros",
        showConfirmButton: false,
        timer: 2000
      });
    }
    else{
      this.conS.borrarItem(idCuenta).then(resp=>{
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cuenta borrada exitosamente",
          showConfirmButton: false,
          timer: 1500
        });
      })
    }
  })
}

  obtenerProyectos(){
    this.conS.obtenerProyectos(this.idEmpresa).subscribe((resp: any)=>{
    this.Proyectos=resp
    
      this.obtenerItems()
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal,proyect.idEmpresa) )
    this.cargarFormulario()
  
    })
  }

  getNameSucursal(idSucursal:any,idEmpresa:string){
    if(idSucursal=='0'){
        return this.getNombreEmpresa(idEmpresa)

    }
    else {

      let sucursal = this.Sucursales.filter((suc: any) => suc.id==idSucursal)
      if(sucursal.length){
        return sucursal[0].Nombre
      }
      else{
        return 'General'
      }
    }
  }

  getidCategoria(event:any){
      this.CategoriasBack=this.Categorias.filter((cat:any)=>cat.Tipo==event.target.value && cat.id!='KtA2Cxpd79TJrW9afqR9' && cat.id!='od11V2OHVgaLG1RiXMiz')

    this.ItemForm.get("idCategoria").enable()
  }

  getItemsGroup(){
    this.ItemsGroup=[]
    let _Items:any=[]
    _Items=this.Items.filter((i:any)=>i.idEmpresa==this.idEmpresa)

    _Items.forEach((item:any) => {

      
    const SucursalesIds = 
     item.Sucursales==undefined ? item.idSucursales
     : item.Sucursales.map(sucursal => sucursal.id)

    const userIds = 
     item.Usuarios==undefined ? item.idUsuarios
     : item.Usuarios.map(usuarios => usuarios.id)

    const ProyectosIds = 
     item.Proyectos==undefined ? item.idProyectos
     : item.Proyectos.map(proyecto => proyecto.id)
      let _Item ={
        "id":item.id,
        "name":item.Nombre,
        "alias":item.Alias,
        "Orden":item.Orden,
        "Activo":item.Activo,
        "Dinamica":item.Dinamica == undefined? false :item.Dinamica, 
        "animation":item.animation,
        "Editando":item.Editando,
        "Empresa":this.getNombreEmpresa(item.idEmpresa),
        "idEmpresa":item.idEmpresa,
        "TipoRubro":item.TipoRubro,
        "Tipo":item.Tipo,
        expanded: false,
        "Sucursales":this.getSucursalesItem(item.idSucursales),
        "NombreSucursales":this.getNameSucursales(SucursalesIds),
        "NombreProyectos":this.getNameProyectos(ProyectosIds,item.idEmpresa),
        "NombresUsuarios":this.getNameUsuario(userIds),
        "Proyectos":this.getProyectosItem(item.idProyectos),
        "idCategoria":item.idPadre,
        "Children":item.CuentasHijos==undefined ? [] : item.CuentasHijos.sort((a:any, b:any) => a.Orden - b.Orden),
        "representative": {
          name: this.getNombreCategoria(item.idPadre),
          image: 'https://firebasestorage.googleapis.com/v0/b/sistemafinanciero-924ff.appspot.com/o/account.png?alt=media&token=a93e4ac2-7102-4920-aaed-13d0a1c3fd43'
      },
      }
      this.ItemsGroup.push(_Item)
    });
    this.ItemsGroup=this.ItemsGroup.sort((a, b) => a.Orden - b.Orden);

    console.log('ItemsGroup',this.ItemsGroup)
 this.cargando=false
  }

  getSucursalesItem(idSucursales:any){
   let Sucursales= this.Sucursales.filter(sucursal =>
      idSucursales.includes(sucursal.id)
    )

    return Sucursales
  }
  getProyectosItem(idProyectos:any){
   let Proyectos= this.Proyectos.filter(proyecto =>
    idProyectos.includes(proyecto.id)
    )

    return Proyectos
  }

  descargarExcel(){
    const headerRow: any[] = [];
    let Data: any[] = [];
    if(this.TipoRubro==1){
      headerRow.push('Categoría','Cuenta Contable','Empresa','Sucursales');
      this.Categorias
      .filter((cat: any) => cat.Orden != 3 && cat.Orden != 6 && cat.Orden != 9 && cat.Orden != 10)
      .sort((a: any, b: any) => a.Orden - b.Orden)
      .forEach((categ: any) => {
        let _CuentaContable: any = this.ItemsGroup.filter((item: any) => item.idCategoria == categ.id);
    
        if (_CuentaContable.length > 0) {
          _CuentaContable.forEach(element => {
            let fila: any = []; // Crear una nueva fila para cada elemento de _CuentaContable
            
            fila.push(categ.Nombre); // Agregar la categoría a la fila
            fila.push(element.name); // Agregar el nombre del elemento
            fila.push(element.Empresa); // Agregar la empresa del elemento
            fila.push(element.NombreSucursales.join(', ')); // Unir los proyectos con una coma
            
            Data.push(fila); // Añadir la fila a Data
          });
        }
      });
    }
    else {
      headerRow.push('Categoría','Cuenta Contable','Empresa','Proyectos');
      this.Categorias
      .filter((cat: any) => cat.Orden != 3 && cat.Orden != 6 && cat.Orden != 9 && cat.Orden != 10)
      .sort((a: any, b: any) => a.Orden - b.Orden)
      .forEach((categ: any) => {
        let _CuentaContable: any = this.ItemsGroup.filter((item: any) => item.idCategoria == categ.id);
    
        if (_CuentaContable.length > 0) {
          _CuentaContable.forEach(element => {
            let fila: any = []; // Crear una nueva fila para cada elemento de _CuentaContable
            
            fila.push(categ.Nombre); // Agregar la categoría a la fila
            fila.push(element.name); // Agregar el nombre del elemento
            fila.push(element.Empresa); // Agregar la empresa del elemento
            fila.push(element.NombreProyectos.join(', ')); // Unir los proyectos con una coma
            
            Data.push(fila); // Añadir la fila a Data
          });
        }
      });
    
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Datos');

  worksheet.addRow(headerRow);


  worksheet.getRow(1).eachCell((cell, colNumber) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  Data.forEach(d => worksheet.addRow(d));


  worksheet.columns.forEach(column => {
    column.width = 30; 
  });


  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `cuentas-contables ${this.usuario.Empresa}.xlsx`);
  });


  }
  getSelectedPoryectosLabel(): any {
    const count = this.ProyectosSeleccionado ? this.ProyectosSeleccionado.length : 0
    
    return count >= 2 ? `${count} proyectos seleccionados` : null;
  }
  getSelectedSucursalesLabel(): any {
    const count = this.SucursalesSeleccionadas ? this.SucursalesSeleccionadas.length : 0
    
    return count >= 2 ? `${count} sucursales seleccionadas` : null;
  }
  getSelectedSucursalesLabelList(SucursalesSeleccionadas:any): any {
    const count = SucursalesSeleccionadas? SucursalesSeleccionadas.length : 0
    
    return count >= 2 ? `${count} sucursales seleccionadas` : null;
  }
  getSelecteProyectosLabelList(ProyectosSeleccionados:any): any {
    const count = ProyectosSeleccionados? ProyectosSeleccionados.length : 0
    return count >= 2 ? `${count} proyectos seleccionados` : null;
  }
  getSelecteUsuariosLabelList(UsuariosSeleccionados:any): any {
    const count = UsuariosSeleccionados? UsuariosSeleccionados.length : 0
    return count >= 2 ? `${count} usuarios seleccionados` : null;
  }
  getSelecteProyectosLabelCrear(): any {
    const count = this.ItemForm.value['Proyectos']? this.ItemForm.value['Proyectos'].length : 0
    
    return count >= 2 ? `${count} proyectos seleccionados` : null;
  }
  getSelecteUsuariosLabelCrear(): any {
    const count = this.ItemForm.value['Usuarios']? this.ItemForm.value['Usuarios'].length : 0
    
    return count >= 2 ? `${count} usuarios seleccionados` : null;
  }
  getSelecteSucursalesLabelCrear(): any {
    const count = this.ItemForm.value['Sucursales']? this.ItemForm.value['Sucursales'].length : 0

    return count >= 2 ? `${count} sucursales seleccionadas` : null;
  }

  getNameSucursales(sucursales:any){
    let Sucursales=[]
    if (sucursales.length>0){
      sucursales.forEach((suc:any) => {
        Sucursales.push(' ' + this.getNameSucursal(suc,''))
      })
    }
    else {
      Sucursales=[]
    }
    return Sucursales
  }

  getNameUsuario(Usuarios:any){

    if(Usuarios==undefined || Usuarios.length==0){
      return []
    }
    else {
      
      let NombresUsuarios:any=[]
      Usuarios.forEach(usuario => {       

        let Usuario = this.Usuarios.filter((user: any) => user.id==usuario)
        if(Usuario.length>0){
          NombresUsuarios.push(' ' + Usuario[0].Nombres)
          
        }
        else {
          NombresUsuarios.push(' ')
        }
        
      });
    
          return NombresUsuarios
    }
      
    
  }
  getNameProyecto(idProyecto:any,idEmpresa:any){
    if(idProyecto=='0'){
      return this.getNombreEmpresa(idEmpresa)
    }
    else {
      let Proyecto = this.Proyectos.filter((proy: any) => proy==idProyecto)
      if(Proyecto.length>0){
        return ' ' + Proyecto[0].Nombre
      }
      else{
        return this.getNombreEmpresa(idEmpresa)
      }
    }
  }
  getNameProyectos(proyectos:any,idEmpresa:any){
    let Proyectos=[]
    if (proyectos.length>0){
      
      proyectos.forEach((proy:any) => {
        Proyectos.push(this.getNameProyecto(proy,idEmpresa))
      })
    }
    else {
      Proyectos=[]
    }
    return Proyectos
  }
  getNameUsuarios(usuarios:any,idEmpresa:any){
    let Usuarios=[]
    if (usuarios.length>0){
      
      usuarios.forEach((proy:any) => {
        Usuarios.push(this.getNameProyecto(proy,idEmpresa))
      })
    }
    else {
      Usuarios=[]
    }
    return Usuarios
  }

  SelectGeneral(){
    this.TipoRubro=1
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)

    this.ItemForm.get('Proyectos')?.setValue([])
    this.getItemsGroup()
  }
  SelectProyecto(){
    this.TipoRubro=2
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)
    this.ItemForm.value.Sucursales=[]
    this.ItemForm.get('Sucursales')?.setValue([])
    this.getItemsGroup()
   

  }
  
  cargarFormulario(){
    this.ItemForm = new FormGroup({
      Nombre: new FormControl('',[Validators.required]), 
      Activo: new FormControl(true), 
      Orden: new FormControl(this.MaxOrden), 
      Sucursales: new FormControl(this.Sucursales), 
      Proyectos: new FormControl(this.Proyectos), 
      Usuarios: new FormControl(this.Usuarios), 
      Editando: new FormControl(false), 
      idEmpresa: new FormControl(this.idEmpresa), 
      FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
      idCategoria: new FormControl('',[Validators.required]), 

     })
     this.ItemForm.get("idCategoria").disable()
  }

  verificarSelect(idSucursal){
    if(idSucursal==0){
      this.BlocCheck=true

    }
    else {
      this.BlocCheck=false
    }
  }



  verificarItem(){
    let ItemEncontrado:any=[]
    ItemEncontrado=this.Items.filter((categ:any)=>categ.Nombre==this.ItemForm.value['Nombre'])
    if(ItemEncontrado.length>0){
      this.ItemFound=true
    }
    else {
      this.ItemFound=false
    }
  }

  obtenerCategorias(){
    this.conS.obtenerCategorias().subscribe(resp=>{
      this.Categorias=resp
      this.CategoriasBack=resp
      console.log('Categorias',this.Categorias)

    })
  }

  
  filtrarByCategoria(){
    if(this.CategoriasSeleccionadas.length>0){
      this.Items = this.ItemsBack.filter((item: any) => 
        item.TipoRubro == this.TipoRubro &&
        
        this.CategoriasSeleccionadas.some((catego: any) => catego.id == item.idCategoria) &&
        
        (
          (this.SucursalesSeleccionadas.length === 0 || 
            item.Sucursales.some(sucursal => 
              this.SucursalesSeleccionadas.some(seleccionada => seleccionada.id === sucursal.id)
            )
          ) 
          ||
          (this.ProyectosSeleccionado.length === 0 || 
            item.Proyectos.some(proyecto => 
              this.ProyectosSeleccionado.some(seleccionada => seleccionada.id === proyecto.id)
            )
          )
        )
      );
 
    }
    else {
      this.filtrarCuentasBySucursal()
    }
  } 

  filtrarCuentasBySucursal(){
    if(this.TipoRubro==1){
      if( this.SucursalesSeleccionadas.length==0){
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro
        && 
        (this.CategoriasSeleccionadas.length === 0 || 
          this.CategoriasSeleccionadas.some((catego: any) => catego.id == item.idCategoria)
        )
      
      )
      }
      else {
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro
        &&    
        (this.CategoriasSeleccionadas.length === 0 || 
          this.CategoriasSeleccionadas.some((catego: any) => catego.id == item.idCategoria)
        ) &&
        this.SucursalesSeleccionadas.filter(sucursal =>
          item.idSucursales.includes(sucursal.id)
        )
      
      )
        

      }
   

    }
    else {
      if( this.ProyectosSeleccionado.length==0){
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro
        && 
        (this.CategoriasSeleccionadas.length === 0 || 
          this.CategoriasSeleccionadas.some((catego: any) => catego.id == item.idCategoria)
        )
      )
      }
      else {

        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro
        && 
        (this.CategoriasSeleccionadas.length === 0 || 
          this.CategoriasSeleccionadas.some((catego: any) => catego.id == item.idCategoria)
        )
        &&
        this.ProyectoSeleccionado.filter(proyecto =>
          item.idProyectos.includes(proyecto.id)
        )
      
      )
        
      }
    }
    this.getItemsGroup()
  }

  obtenerSucursales(){
    this.conS.obtenerSucursales(this.idEmpresa).subscribe(resp=>{
      this.Sucursales=resp.filter((suc:any)=>suc.Activo==true)
      this.obtenerProyectos()
    })
  }


  agregarHijo(item:any){
    console.log('item',item)
    const texto = item.name 
    const patron = /^(\d+(?:\.\d+)*)/;
    const resultado = texto.match(patron);
    item.Children.push( {
      "Nombre":"",
      "Activo":true,
      "Alias":"",
      "Prefijo":resultado[0],
      "Editando":true,
      "ItemId":item.id,
      "idPadre":item.idCategoria,
      "ItemName":item.name,
      "id":`${item.id}${item.Children.length + 1}`,
      "Orden":item.Children.length + 1,
      })
  }

  guardarCuentaHijo(child:any){

    const ItemsBack = [...this.ItemsBack]
    let ItemEncontrado=ItemsBack.filter((it:any)=>it.id==child.ItemId)
    console.log(' child', child)
    console.log(' ItemEncontrado[0]', ItemEncontrado[0])
    if(ItemEncontrado.length>0){
      ItemEncontrado[0].CuentasHijos.push( 
        {
        "Nombre":`${child.Prefijo}.${child.Orden} ${child.Alias}`,
        "Alias":child.Alias,
        "ItemId":child.ItemId,
        "idPadre":child.idPadre,
        "idAbuelo":this.getIdAbuelo(child.idPadre),
        "Prefijo":child.Prefijo,
        "Activo":true,
        "Editando":false,
        "id":child.id,
        "Orden":child.Orden,
        }
      )
      ItemEncontrado[0].CuentasHijos=ItemEncontrado[0].CuentasHijos.filter((it:any)=>it.Editando!=true)
        
      
      this.getItemsGroup()
        this.ItemsGroup=  
        
        this.ItemsGroup
        .sort((a:any, b:any) => a.Orden - b.Orden)
        .map(item => 
            item.id === child.ItemId ? { ...item, expanded: true } : item
          );
 
      this.conS.ActualizarItem(ItemEncontrado[0]).then(resp=>{
        this.toastr.success('Cuenta  actualizada', '¡Exito!');
      })
    
    }
  }

  actualizarEstadoHijo(child:any,Estado:any){

    child.Activo=Estado
    const ItemsBack = [...this.ItemsBack]
    let ItemEncontrado=ItemsBack.filter((it:any)=>it.id==child.ItemId)
    this.conS.ActualizarItem(ItemEncontrado[0]).then(resp=>{
      this.toastr.success('Cuenta  actualizada', '¡Exito!');
    })
  }


  obtenerItems(){
    let Subscribe:Subscription
    Subscribe= this.conS.obtenerItems(this.idEmpresa).subscribe(resp=>{
      // resp.forEach((item:any)=>{
      //   this.conS.ActualizarItem(item).then(resp=>{
      //     console.log('Actualizado')
      //   })
      // })
    
      Subscribe.unsubscribe()
      // Ingresos de Operación
      let CuentasCobrosVentasContadoRubro1=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.1.1 Cobros por ventas de contado' && cuenta.TipoRubro==1)
      let CuentasCobrosVentasContadoRubro2=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.1.1 Cobros por ventas de contado' && cuenta.TipoRubro==2)

      let CuentasCobrosVentasCreditoRubro1=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.1.2 Cobros por ventas a crédito' && cuenta.TipoRubro==1)
      let CuentasCobrosVentasCreditoRubro2=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.1.2 Cobros por ventas a crédito' && cuenta.TipoRubro==2)

      let CuentasOtrosIngresosOperacionRubro1=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.1.3 Otros ingresos de operación' && cuenta.TipoRubro==1)
      let CuentasOtrosIngresosOperacionRubro2=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.1.3 Otros ingresos de operación' && cuenta.TipoRubro==2)
      this.ItemsBack=resp.sort((a:any, b:any) => a.Orden - b.Orden)



      // Egresos de Operación
      let CuentasPagosProveedoresRubro1=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.2.1 Pago a Proveedores' && cuenta.TipoRubro==1)
      let CuentasPagosProveedoresRubro2=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.2.1 Pago a Proveedores' && cuenta.TipoRubro==2)

      let CuentasCostosOperacionRubro1=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.2.2 Costos de la Operación' && cuenta.TipoRubro==1)
      let CuentasCostosOperacionRubro2=resp
      .filter((cuenta:any)=>cuenta.Nombre=='1.2.2 Costos de la Operación' && cuenta.TipoRubro==2)
      this.ItemsBack=resp.sort((a:any, b:any) => a.Orden - b.Orden)

      try{
        // Ingresos de Operacion
        if(CuentasCobrosVentasContadoRubro1.length==0){
          const SucursalesIds = this.Sucursales.map(sucursal => sucursal.id)
          let CobrosVentasContado={
            "idSucursales":SucursalesIds,
            "idProyectos":[],
            "Activo":true,
            "Editando":false,
            "Alias":"Cobros por ventas de contado",
            "animation":"",
            "Dinamica":false,
            "idPadre":"od11V2OHVgaLG1RiXMiz",
            "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
            "idEmpresa":this.idEmpresa,
            "idMatriz":this.usuario.idMatriz,
            "Orden":1,
            "TipoRubro":1,
            "OrdenReal":1,
            "CuentasHijos":[],
            "Tipo":1,
            "Nombre":"1.1.1 Cobros por ventas de contado",
            "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
            }
  
          this.ItemsBack.push(CobrosVentasContado)
          this.conS.crearItem(CobrosVentasContado).then(resp=>{
          })
        }
        if(CuentasCobrosVentasContadoRubro2.length==0){
          const ProyectosIds = this.Proyectos.map(proyect => proyect.id);
          let CobrosVentasContado={
            "idSucursales":[],
            "idProyectos":ProyectosIds,
            "Activo":true,
            "Editando":false,
            "Alias":"Cobros por ventas de contado",
            "animation":"",
            "Dinamica":false,
            "idPadre":"od11V2OHVgaLG1RiXMiz",
            "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
            "idEmpresa":this.idEmpresa,
            "idMatriz":this.usuario.idMatriz,
            "Orden":1,
            "TipoRubro":2,
            "OrdenReal":2,
            "CuentasHijos":[],
            "Tipo":1,
            "Nombre":"1.1.1 Cobros por ventas de contado",
            "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
            }
  
          this.ItemsBack.push(CobrosVentasContado)
          this.conS.crearItem(CobrosVentasContado).then(resp=>{
          })
        }

        if(CuentasCobrosVentasCreditoRubro1.length==0){
          const SucursalesIds = this.Sucursales.map(sucursal => sucursal.id)
          let CuentaCobrosVentasCredito={
          "idSucursales":SucursalesIds,
          "idProyectos":[],
          "Activo":true,
          "Editando":false,
          "Alias":"Cobros por ventas a crédito",
          "animation":"",
          "Dinamica":false,
          "idPadre":"od11V2OHVgaLG1RiXMiz",
          "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "Orden":2,
          "TipoRubro":1,
          "OrdenReal":2,
          "CuentasHijos":[
            {
              "Nombre":"1.1.2.1 Facturas vencidas en el mes",
              "idPadre":"od11V2OHVgaLG1RiXMiz",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"od11V2OHVgaLG1RiXMiz_1",
              "Orden":1,
              "Editando":false,
            },
            {
              "Nombre":"1.1.2.2 Facturas vencidas en el mes en curso",
              "idPadre":"od11V2OHVgaLG1RiXMiz",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"od11V2OHVgaLG1RiXMiz_2",
              "Orden":2,
              "Editando":false,
            },
            {
              "Nombre":"1.1.2.3 Facturas con vencimiento en meses futuros",
              "idPadre":"od11V2OHVgaLG1RiXMiz",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"od11V2OHVgaLG1RiXMiz_3",
              "Orden":3,
              "Editando":false,
            },
          ],
          "Tipo":2,
          "Nombre":"1.1.2 Cobros por ventas a crédito",
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
  
          }
  
          this.ItemsBack.push(CuentaCobrosVentasCredito)
          this.conS.crearItem(CuentaCobrosVentasCredito).then(resp=>{
          })
        }

        if(CuentasCobrosVentasCreditoRubro2.length==0){
          const ProyectosIds = this.Proyectos.map(proyect => proyect.id);
          let CuentaCobrosVentasCredito={
          "idSucursales":[],
          "idProyectos":ProyectosIds,
          "Activo":true,
          "Editando":false,
          "Alias":"Cobros por ventas a crédito",
          "animation":"",
          "Dinamica":false,
          "idPadre":"od11V2OHVgaLG1RiXMiz",
          "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "Orden":2,
          "TipoRubro":2,
          "OrdenReal":2,
          "CuentasHijos":[
            {
              "Nombre":"1.1.2.1 Facturas vencidas en el mes",
              "idPadre":"od11V2OHVgaLG1RiXMiz",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"od11V2OHVgaLG1RiXMiz_4",
              "Orden":1,
              "Editando":false,
            },
            {
              "Nombre":"1.1.2.2 Facturas vencidas en el mes en curso",
              "idPadre":"od11V2OHVgaLG1RiXMiz",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"od11V2OHVgaLG1RiXMiz_5",
              "Orden":2,
              "Editando":false,
            },
            {
              "Nombre":"1.1.2.3 Facturas con vencimiento en meses futuros",
              "idPadre":"od11V2OHVgaLG1RiXMiz",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"od11V2OHVgaLG1RiXMiz_6",
              "Orden":3,
              "Editando":false,
            },
          ],
          "Tipo":2,
          "Nombre":"1.1.2 Cobros por ventas a crédito",
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
  
          }
  
          this.ItemsBack.push(CuentaCobrosVentasCredito)
          this.conS.crearItem(CuentaCobrosVentasCredito).then(resp=>{
          })
        }

        if(CuentasOtrosIngresosOperacionRubro1.length==0){
          const SucursalesIds = this.Sucursales.map(sucursal => sucursal.id)
          let CuentaPagoProveedores={
            "idSucursales":SucursalesIds,
            "idProyectos":[],
            "Activo":true,
            "Editando":false,
            "Alias":"Otros ingresos de operación",
            "animation":"",
            "Dinamica":true,
            "idPadre":"od11V2OHVgaLG1RiXMiz",
            "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
            "idEmpresa":this.idEmpresa,
            "idMatriz":this.usuario.idMatriz,
            "Orden":3,
            "TipoRubro":1,
            "OrdenReal":3,
            "CuentasHijos":[],
            "Tipo":2,
            "Nombre":"1.1.3 Otros ingresos de operación",
            "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
            }
  
          this.ItemsBack.push(CuentaPagoProveedores)
          this.conS.crearItem(CuentaPagoProveedores).then(resp=>{
          })
        }

        if(CuentasOtrosIngresosOperacionRubro2.length==0){
          const ProyectosIds = this.Proyectos.map(proyect => proyect.id);
          let CuentaPagoProveedores={
            "idSucursales":[],
            "idProyectos":ProyectosIds,
            "Activo":true,
            "Editando":false,
            "Alias":"Otros ingresos de operación",
            "animation":"",
            "Dinamica":true,
            "idPadre":"od11V2OHVgaLG1RiXMiz",
            "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
            "idEmpresa":this.idEmpresa,
            "idMatriz":this.usuario.idMatriz,
            "Orden":3,
            "TipoRubro":2,
            "OrdenReal":3,
            "CuentasHijos":[],
            "Tipo":2,
            "Nombre":"1.1.3 Otros ingresos de operación",
            "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
            }
  
          this.ItemsBack.push(CuentaPagoProveedores)
          this.conS.crearItem(CuentaPagoProveedores).then(resp=>{
          })
        }

        // Egresos de Operación

        if(CuentasPagosProveedoresRubro1.length==0){
          const userIds = this.Usuarios.map(user => user.id);
          const SucursalesIds = this.Sucursales.map(sucursal => sucursal.id)
          let CuentaPagoProveedores={
          "idUsuarios":userIds,
          "idSucursales":SucursalesIds,
          "idProyectos":[],
          "Activo":true,
          "Editando":false,
          "Alias":"Pago a proveedores",
          "animation":"",
          "Dinamica":false,
          "idPadre":"KtA2Cxpd79TJrW9afqR9",
          "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "userIds":userIds,
          "Orden":1,
          "TipoRubro":1,
          "OrdenReal":2,
          "CuentasHijos":[
            {
              "Nombre":"1.2.1.1 Facturas vencidas en meses anteriores",
              "idPadre":"KtA2Cxpd79TJrW9afqR9",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"KtA2Cxpd79TJrW9afqR9_1",
              "Orden":1,
              "Editando":false,
            },
            {
              "Nombre":"1.2.1.2 Facturas vencidas en el mes en curso",
              "idPadre":"KtA2Cxpd79TJrW9afqR9",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"KtA2Cxpd79TJrW9afqR9_2",
              "Orden":2,
              "Editando":false,
            },
            {
              "Nombre":"1.2.1.3 Facturas con vencimiento en meses futuros",
              "idPadre":"KtA2Cxpd79TJrW9afqR9",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"KtA2Cxpd79TJrW9afqR9_3",
              "Orden":3,
              "Editando":false,
            },
          ],
          "Tipo":2,
          "Nombre":"1.2.1 Pago a Proveedores",
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
  
          }
  
          this.ItemsBack.push(CuentaPagoProveedores)
          this.conS.crearItem(CuentaPagoProveedores).then(resp=>{
          })
        }
        if(CuentasPagosProveedoresRubro2.length==0){
          const userIds = this.Usuarios.map(user => user.id);
          const ProyectosIds = this.Proyectos.map(proyect => proyect.id);
  
          let CuentaPagoProveedores={
          "idUsuarios":userIds,
          "idSucursales":[],
          "idProyectos":ProyectosIds,
          "Activo":true,
          "Editando":false,
          "Dinamica":false,
          "Alias":"Pago a proveedores",
          "animation":"",
          "idPadre":"KtA2Cxpd79TJrW9afqR9",
          "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "userIds":userIds,
          "Orden":1,
          "TipoRubro":2,
          "CuentasHijos":[
            {
              "Nombre":"1.2.1.1 Facturas vencidas en meses anteriores",
              "idPadre":"KtA2Cxpd79TJrW9afqR9",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"KtA2Cxpd79TJrW9afqR9_4",
              "Orden":1,
              "Editando":false,
            },
            {
              "Nombre":"1.2.1.2 Facturas vencidas en el mes en curso",
              "idPadre":"KtA2Cxpd79TJrW9afqR9",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"KtA2Cxpd79TJrW9afqR9_5",
              "Orden":2,
              "Editando":false,
            },
            {
              "Nombre":"1.2.1.3 Facturas con vencimiento en meses futuros",
              "idPadre":"KtA2Cxpd79TJrW9afqR9",
              "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
              "id":"KtA2Cxpd79TJrW9afqR9_6",
              "Orden":3,
              "Editando":false,
            },
          ],
          "OrdenReal":2,
          "Tipo":2,
          "Nombre":"1.2.1 Pago a Proveedores",
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
          }
         
          this.ItemsBack.push(CuentaPagoProveedores)
          this.conS.crearItem(CuentaPagoProveedores).then(resp=>{
          })
        }
  
  
        if(CuentasCostosOperacionRubro1.length==0){
          const userIds = this.Usuarios.map(user => user.id);
          const SucursalesIds = this.Sucursales.map(sucursal => sucursal.id)
  
          let CuentaCostoOperacion={
          "idUsuarios":userIds,
          "idSucursales":SucursalesIds,
          "idProyectos":[],
          "Activo":true,
          "Editando":false,
          "Alias":"Costos de la Operación",
          "animation":"",
          "Dinamica":true,
          "idPadre":"KtA2Cxpd79TJrW9afqR9",
          "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "userIds":userIds,
          "Orden":2,
          "TipoRubro":1,
          "OrdenReal":2,
          "CuentasHijos":[],
          "Tipo":2,
          "Nombre":"1.2.2 Costos de la Operación",
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
  
          }
          this.ItemsBack.push(CuentaCostoOperacion)
          this.conS.crearItem(CuentaCostoOperacion).then(resp=>{
          })
        }
        if(CuentasCostosOperacionRubro2.length==0){
          const ProyectosIds = this.Proyectos.map(proyect => proyect.id);
  
          let CuentaCostoOperacion={
          "idSucursales":[],
          "idProyectos":ProyectosIds,
          "Activo":true,
          "Editando":false,
          "Alias":"Costos de la Operación",
          "animation":"",
          "Dinamica":true,
          "idPadre":"KtA2Cxpd79TJrW9afqR9",
          "idAbuelo":"EESGPM4hWXvDlXSRnCwA",
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "Orden":2,
          "TipoRubro":2,
          "OrdenReal":2,
          "CuentasHijos":[],
          "Tipo":2,
          "Nombre":"1.2.2 Costos de la Operación",
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
  
          }
          this.ItemsBack.push(CuentaCostoOperacion)
          this.conS.crearItem(CuentaCostoOperacion).then(resp=>{
          })
        }


  
      }

      catch(error){

      }


      if(this.ItemsBack.length>0){
        this.ItemsBack=this.ItemsBack.sort((a, b) => a.Orden - b.Orden);
        this.MaxOrden=Math.max(...this.ItemsBack.map(obj => obj.Orden))+1
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)
    

        this.Items.map((item:any)=>item.animation='')
  

      
    

      }

      else {
        this.MaxOrden=1
      
      }
      console.log('Items',this.ItemsBack)
      this.getItemsGroup()

    })
  }


  sortItemsByOrder(_Items:any): void {
    _Items.forEach((updatedItem: any) => {
      const index = this.ItemsBack.findIndex((it: any) => it.id === updatedItem.id);
      if (index !== -1) {
        this.Items[index] = updatedItem; // Reemplazamos el item modificado
      }
    });
    this.Items.sort((a, b) => a.Orden - b.Orden);

   // this.getItemsGroup()
  }
getLengItem(idCategoria:string){
  let _Items:any=[]
  _Items=this.Items.filter((it:any)=>it.idCategoria==idCategoria)
  return _Items.length
}
moveDown(item: any): void {
  let _Items: any[] = this.ItemsBack.filter(it => it.idCategoria === item.idCategoria);
  const index = _Items.findIndex(i => i.id === item.id);
  if (index < _Items.length - 1) {
    const currentOrder = _Items[index].Orden;
    const nextOrder = _Items[index + 1].Orden;

    // Aplica animación


    _Items[index].Orden = nextOrder;
    _Items[index].Nombre = this.getIdCategoria(_Items[index].idCategoria) + '.' + nextOrder + ' ' + _Items[index].Alias;

    _Items[index + 1].Orden = currentOrder;
    _Items[index + 1].Nombre = this.getIdCategoria(_Items[index + 1].idCategoria) + '.' + currentOrder + ' ' + _Items[index + 1].Alias;

    // _Items[index].animation = 'animate__animated animate__bounceInDown';
    // _Items[index + 1].animation = 'animate__animated animate__bounceInUp';
   // this.sortItemsByOrder(_Items);  
    this.ItemsBack[index] = _Items[index];
    this.ItemsBack[index + 1] = _Items[index + 1];


    this.getItemsGroup()

    this.conS.ActualizarItem(_Items[index]).then(() => {

    });
    this.conS.ActualizarItem(_Items[index + 1]).then(() => {
  
    });
  }
}

moveUp(item: any): void {
  let _Items: any[] = this.ItemsBack.filter(it => it.idCategoria === item.idCategoria);
  const index = _Items.findIndex(i => i.id === item.id);
  if (index > 0) {
    const currentOrder = _Items[index].Orden;
    const previousOrder = _Items[index - 1].Orden;

    // Aplica animación
    _Items[index].animation = 'animate__animated animate__backInUp';
    _Items[index - 1].animation = 'animate__animated animate__backInDown';

    _Items[index].Orden = previousOrder;
    _Items[index].Nombre = this.getIdCategoria(_Items[index].idCategoria) + '.' + previousOrder + ' ' + _Items[index].Alias;

    _Items[index - 1].Orden = currentOrder;
    _Items[index - 1].Nombre = this.getIdCategoria(_Items[index - 1].idCategoria) + '.' + currentOrder + ' ' + _Items[index - 1].Alias;

    //this.sortItemsByOrder(_Items);

    this.ItemsBack[index] = _Items[index];
    this.ItemsBack[index - 1] = _Items[index - 1];

    this.getItemsGroup()
    this.conS.ActualizarItem(_Items[index]).then(() => {
    
    });
    this.conS.ActualizarItem(_Items[index - 1]).then(() => {
    
    });
  }
}



applyAnimation(element: HTMLElement | null, animationClass: string) {
  if (element) {
    this.renderer.addClass(element, animationClass);
  }
}

removeAnimation(element: HTMLElement | null, animationClass: string) {
  if (element) {
    this.renderer.removeClass(element, animationClass);
  }
}

  calculateItemsTotal(name: string) {
    let total = 0;

    if (this.ItemsGroup) {
        for (let customer of this.ItemsGroup) {
            if (customer.representative?.name === name) {
                total++;
            }
        }
    }

    return total;
}

calcularSubItems(hijos:any){
console.log('hijos',hijos)
}
  obtenerEmpresas(){
    this.conS.obtenerEmpresas(this.usuario.idMatriz).subscribe(resp=>{
      this.Empresas=resp
    })
  }
  getTipo(idCategoria:string){

    let _Tipo:any
    _Tipo=this.Categorias.find((categ:any)=>categ.id==idCategoria)
    if(_Tipo){
      return _Tipo.Tipo
    }
    else {
      return 0
    }
  }



  getProyectoSelect(idProyecto){
    if(idProyecto!='0'){

      let _ProyectoSelect:any
      _ProyectoSelect=this.Proyectos.filter((proyect:any)=>proyect.id==idProyecto)
      this.ProyectoSeleccionado=_ProyectoSelect[0]
    
    }
  }

  crearItem(){

    try{
      let ItemForm:any
      ItemForm=this.ItemForm.value
      ItemForm.Tipo=this.getTipo(ItemForm.idCategoria)
      
      ItemForm.TipoRubro=this.TipoRubro
      ItemForm.Orden=this.getOrdenItem(ItemForm.idCategoria)
      ItemForm.OrdenReal=this.MaxOrden
  
      if(this.TipoRubro==1 && ItemForm.Sucursales.length==0 ){
            Swal.fire({
            position: "center",
            icon: "warning",
            title: "Debe seleccionar una o varias sucursales",
            showConfirmButton: false,
            timer: 1500
          });
      }
     else if(this.TipoRubro==2 && ItemForm.Proyectos.length==0 ){
            Swal.fire({
            position: "center",
            icon: "warning",
            title: "Debe seleccionar una o varios proyectos",
            showConfirmButton: false,
            timer: 1500
          });
      }

  
      else {
        if(ItemForm.Sucursales.length>0){
          ItemForm.Proyectos=[]
        }
    
        else if(ItemForm.Proyectos.length>0){
          ItemForm.Sucursales=[]
        }
  
        ItemForm.Alias=ItemForm.Nombre 
        //ItemForm.Nombre= this.getIdCategoria(ItemForm.idCategoria) + '.' + this.getOrdenItem(ItemForm.idCategoria) + ' '+ ItemForm.Nombre 
        ItemForm.idMatriz=this.usuario.idMatriz
  
        const ProyectosIds = ItemForm.Proyectos.map(proyect => proyect.id);
        const SucursalesIds = ItemForm.Sucursales.map(sucursal => sucursal.id)
  
  
        let CuentaContable={
          "idSucursales":SucursalesIds,
          "idProyectos":ProyectosIds,
          "Activo":true,
          "Editando":false,
          "Alias":ItemForm.Nombre,
          "animation":"",
          "Dinamica":true,
          "idPadre":ItemForm.idCategoria,
          "idAbuelo":this.getIdAbuelo(ItemForm.idCategoria),
          "idEmpresa":this.idEmpresa,
          "idMatriz":this.usuario.idMatriz,
          "Orden":this.getOrdenItem(ItemForm.idCategoria),
          "TipoRubro":this.TipoRubro,
          "OrdenReal":this.MaxOrden,
          "CuentasHijos":[],
          "Tipo":this.getTipo(ItemForm.idCategoria),
          "Nombre":this.getIdCategoria(ItemForm.idCategoria) + '.' + this.getOrdenItem(ItemForm.idCategoria) + ' '+ ItemForm.Nombre,
          "FechaCreacion":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'),
  }
        this.Items.push(CuentaContable)
        this.ItemsBack.push(CuentaContable)
        this.getItemsGroup()
  
          this.conS.crearItem(CuentaContable).then(resp=>{
            let SucursalesSeleccionadas:any=ItemForm.Sucursales
            let ProyectosSeleccionados:any=ItemForm.Proyectos
            let idCategoria:any=ItemForm.idCategoria
            this.toastr.success('Cuenta  Creada', '¡Exito!');
            this.ItemForm.get('Nombre').setValue('');
            this.ItemForm.get('Sucursales').setValue(SucursalesSeleccionadas);
            this.ItemForm.get('Proyectos').setValue(ProyectosSeleccionados);
            this.ItemForm.get('Usuarios').setValue(this.UsuariosSeleccionados);
            this.ItemForm.get('idCategoria').setValue(idCategoria);
            
     
          })
  
      }
      
    }
    catch(error){

    }


    
    
  }

  getIdAbuelo(idPadre:string){
    let Padre=this.CategoriasBack.find((cat:any)=>cat.id==idPadre)
    if(Padre){
      return Padre.idAbuelo
    }
    else {
      return ""
    }

  }

getOrdenItem(idCategoria:any){
  let _Items:any=[]
  let MaxOrden:number=0
  _Items=this.Items.filter((i:any)=>i.idEmpresa==this.idEmpresa && i.idCategoria==idCategoria)
  if(_Items.length>0){
    MaxOrden=Math.max(..._Items.map(obj => obj.Orden))+1

  }
  else{
    MaxOrden=1
  }
  return MaxOrden
}

getIdCategoria(idCategoria:string){
  let _CategoriaFound:any=[]
  _CategoriaFound=this.Categorias.filter((categ:any)=>categ.id==idCategoria)
  if(_CategoriaFound.length>0){
    return _CategoriaFound[0].idCateg
  }
  else {
    return ''
  }

}
  toggleEdicion(Item: any) {

    Item.Editando = !Item.Editando;
  }

  borrarItems(){
    this.idItems.forEach((id:any)=>{
      this.conS.borrarItem(id).then(resp=>{

      })
    })
    this.idItems=[]
  }

  acumularIdItems(idItem:string){
    let idEncontrado:any=[]
    idEncontrado=this.idItems.filter((id:any)=>id==idItem)
    if(idEncontrado.length==0){
      this.idItems.push(idItem)
    }
    else{
      this.idItems.splice(this.idItems.indexOf(idItem),1)
    }

  }


  actualizarItem(item:any){
    let _Item= this.ItemsBack;
    const itemEncontrado = _Item.filter((it:any) => it.id == item.id);
    const numeros = item.name.match(/^\d+(\.\d+)*/)
    const ProyectosIds = item.Proyectos.map(proyect => proyect.id);
    const SucursalesIds = item.Sucursales.map(sucursal => sucursal.id)
    itemEncontrado[0].Nombre=numeros[0] + ' '+ item.alias
    itemEncontrado[0].Alias=item.alias
    itemEncontrado[0].idSucursales=SucursalesIds
    itemEncontrado[0].idProyectos=ProyectosIds

    const index = this.ItemsBack.findIndex((item:any) =>
      item.id === itemEncontrado[0].id
      );
      console.log('index',index)
       if (index !== -1) {
    
        this.ItemsBack[index] = itemEncontrado[0];
       } 
      
       this.conS.ActualizarItem(itemEncontrado[0]).then(resp=>{
         this.getItemsGroup()
         this.toastr.success('Item  editado', '¡Exito!');
       })

    // const numeros = item.name.match(/^\d+(\.\d+)*/)
    // itemEncontrado[0].Nombre='',
    // itemEncontrado[0].Nombre=numeros[0] + ' '+ item.alias,
    // itemEncontrado[0].Alias= item.alias,
    // itemEncontrado[0].idCategoria=item.idCategoria
    // itemEncontrado[0].idEmpresa=item.idEmpresa
    // itemEncontrado[0].Editando = !item.Editando;
    // itemEncontrado[0].Sucursales = item.Sucursales;
    // itemEncontrado[0].Proyectos =item.Proyectos;
    // itemEncontrado[0].Usuarios =item.Usuarios;

    // itemEncontrado[0].idUsuarios=[]
    // itemEncontrado[0].Usuarios.forEach(user => {
    //   itemEncontrado[0].idUsuarios.push(user.id)
    // });

  }

  ActualizarItemEstado(Item:any,Estado:boolean){
    this.conS.ActualizarItemEstado(Item,Estado).then(resp=>{
      if(Estado==true){
        this.toastr.success('Cuenta activada', '¡Exito!');
      }
      else{
        this.toastr.success('Cuenta desactivada', '¡Exito!');
      }
      this.getItemsGroup()
    })
  }

  getNombreCategoria(idCategoria:string){
    let _Categoria:any=[]
    _Categoria=this.Categorias.filter((c:any)=> c.id == idCategoria)
    return _Categoria[0].Nombre
  }

  getNombreSucursal(idSucursal:string){
    let _sucursal:any=[]
    _sucursal=this.Sucursales.filter((s:any)=> s.id == idSucursal)
    if(_sucursal.length>0){
      return _sucursal[0].Nombre

    }
    else {
      return 'Sin sucursal'
    }
  }
  getNombreEmpresa(idEmpresa:string){
    let _empresa:any=[]
    _empresa=this.Empresas.filter((s:any)=> s.id == idEmpresa)
    if (_empresa.length>0){
      return _empresa[0].Nombre

    }
    else {
      return 'Sin empresa'
    }
  }



onTabChange(event: any) {
  this.selectedTab = event.index === 0 ? 'sucursales' : 'proyectos';
}



}
