// angular import
import { Component, OnInit } from '@angular/core';
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
    MultiSelectModule 
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export default class ItemsComponent  implements OnInit{
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService,private formBuilder: FormBuilder) {}
  Items:any=[]
  ItemsBack:any=[]
  Categorias:any=[]
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

  ngOnInit(): void {
    this.todasSucursales=true
    this.conS.usuario$.subscribe(usuario => {
      if (usuario) {
      this.usuario=usuario
      }
      else {
        this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }
      this.obtenerCategorias()
      this.obtenerEmpresas()
      this.obtenerSucursales()
      this.obtenerProyectos()
      this.obtenerItems()
   
    });
  
 

  }

  obtenerProyectos(){
    this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe((resp: any)=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect:any)=>proyect.NombreSucursal= proyect.Nombre + " - " + this.getNameSucursal(proyect.idSucursal) )
    this.cargarFormulario()
  
    })
  }

  getNameSucursal(idSucursal:any){
    if(idSucursal=='0'){
      return 'General'
    }
    else {
      let sucursal = this.Sucursales.filter((suc: any) => suc.id==idSucursal)
      if(sucursal.length){
        return sucursal[0].Sucursal
      }
      else{
        return 'General'
      }
    }
  }

  getidCategoria(event:any){
    this.CategoriasBack=this.Categorias.filter((cat:any)=>cat.Tipo==event.target.value)
  }

  SelectGeneral(){
    this.TipoRubro=1
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)

    this.ItemForm.get('Proyectos')?.setValue([])

  }
  SelectProyecto(){
    this.TipoRubro=2
    this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)
    this.ItemForm.value.Sucursales=[]
    this.ItemForm.get('Sucursales')?.setValue([])
    console.log('itemForm',this.ItemForm.value)
   

  }
  
  cargarFormulario(){
    this.ItemForm = new FormGroup({
      Nombre: new FormControl('',[Validators.required]), 
      Activo: new FormControl(true), 
      Orden: new FormControl(this.MaxOrden), 
      Sucursales: new FormControl(this.Sucursales), 
      Proyectos: new FormControl(this.Proyectos), 
      Editando: new FormControl(false), 
      idEmpresa: new FormControl(this.usuario.idEmpresa), 
      FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
      idCategoria: new FormControl('',[Validators.required]), 

     })
    
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

    })
  }

  filtrarCuentasBySucursal(){
    if(this.TipoRubro==1){
      if( this.SucursalesSeleccionadas.length==0){
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)
      }
      else {
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro
        &&    
          item.Sucursales.some(sucursal =>
          this.SucursalesSeleccionadas.some(seleccionada => seleccionada.id === sucursal.id)
        )
      
      )
        

      }
      
    }
    else {
      if( this.ProyectosSeleccionado.length==0){
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)
      }
      else {

        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro
        && 
        item.Proyectos.some(proyecto =>
        this.ProyectosSeleccionado.some(seleccionada => seleccionada.id === proyecto.id)
        )
      
      )
        
      }
    }

  }

  obtenerSucursales(){
    this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe(resp=>{
      this.Sucursales=resp

    })
  }
  obtenerItems(){
    this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
      if(resp.length>0){
        this.ItemsBack=resp
        this.MaxOrden=Math.max(...this.ItemsBack.map(obj => obj.Orden))
        this.Items=this.ItemsBack.filter((item:any)=>item.TipoRubro==this.TipoRubro)
    

      }
      else {
        this.MaxOrden=1
      
      }

    })
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
    let ItemForm:any
    ItemForm=this.ItemForm.value
    ItemForm.Tipo=this.getTipo(ItemForm.idCategoria)
    
    ItemForm.TipoRubro=this.TipoRubro


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

    if(ItemForm.Sucursales.length>0){
      ItemForm.Proyectos=[]
    }

    else if(ItemForm.Proyectos.length>0){
      ItemForm.Sucursales=[]
    }

      console.log('Registro creado',ItemForm)
      this.conS.crearItem(ItemForm).then(resp=>{
        let SucursalesSeleccionadas:any=ItemForm.Sucursales
        let ProyectosSeleccionados:any=ItemForm.Proyectos
        let idCategoria:any=ItemForm.idCategoria
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cuenta contable creada",
          showConfirmButton: false,
          timer: 1500
        });
        this.ItemForm.get('Nombre').setValue('');
        this.ItemForm.get('Sucursales').setValue(SucursalesSeleccionadas);
        this.ItemForm.get('Proyectos').setValue(ProyectosSeleccionados);
        this.ItemForm.get('idCategoria').setValue(idCategoria);
     
      })

    
    
  }

  toggleEdicion(Item: any) {

    Item.Editando = !Item.Editando;
  }

  actualizarItem(item:any){
    let _Item= this.Items;
    const itemEncontrado = _Item.filter((it:any) => it.id == item.id);
    itemEncontrado[0].Nombre=item.Nombre
    itemEncontrado[0].idCategoria=item.idCategoria
    //itemEncontrado[0].idSucursal=item.idSucursal
    itemEncontrado[0].idEmpresa=item.idEmpresa
    itemEncontrado[0].Editando = !item.Editando;
    this.conS.ActualizarItem(itemEncontrado[0]).then(resp=>{
   
      this.toastr.success('Item  editado', '¡Exito!');
    })
  }

  ActualizarItemEstado(Item:any,Estado:boolean){
    this.conS.ActualizarItemEstado(Item,Estado).then(resp=>{
      if(Estado==true){
        this.toastr.success('Cuenta activada', '¡Exito!');
      }
      else{
        this.toastr.success('Cuenta desactivada', '¡Exito!');
      }
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
