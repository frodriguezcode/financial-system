// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BuscarPipe } from '../../theme/shared/filter/buscar.pipe';
@Component({
  selector: 'app-elemento',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule,ReactiveFormsModule,RadioButtonModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export default class ItemsComponent  implements OnInit{
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService,private formBuilder: FormBuilder) {}
  Items:any=[]
  Categorias:any=[]
  Sucursales:any=[]
  SucursalesSelected:any=[]
  Empresas:any=[]
  ItemForm!:FormGroup
  ItemFound:boolean = false;
  Fecha:any= new Date();
  usuario:any
  buscarItem:string=''
  todasSucursales!:boolean
  BlocCheck!:boolean
  ngOnInit(): void {
    this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    this.obtenerCategorias()
    this.obtenerEmpresas()
    this.obtenerSucursales()
    this.obtenerItems()

  }

  cargarFormulario(){
    this.ItemForm = new FormGroup({
      Nombre: new FormControl('',[Validators.required]), 
      Activo: new FormControl(true), 
      Orden: new FormControl(this.Items.length+1), 
      Editando: new FormControl(false), 
      Sucursales: new FormControl(''), 
      Tipo: new FormControl(''), 
      idEmpresa: new FormControl(this.usuario.idEmpresa,[Validators.required]), 
      FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
      idCategoria: new FormControl('',[Validators.required]), 

     })
  }

  verificarSelect(idSucursal){
    console.log('idSucursal',idSucursal)
    if(idSucursal==0){
      this.BlocCheck=true

    }
    else {
      this.BlocCheck=false
    }
  }

  getTodasSucursales(){
    this.todasSucursales=!this.todasSucursales
    if(this.todasSucursales==true){
      this.ItemForm.get('Sucursales').disable();
      this.SucursalesSelected=this.Sucursales
    }
    else{
      this.ItemForm.get('Sucursales').enable();
      this.SucursalesSelected=[];
    }
    console.log("Seleccionadas",this.SucursalesSelected)
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
      console.log('Categorias',this.Categorias)
    })
  }
  obtenerSucursales(){
    this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe(resp=>{
      this.Sucursales=resp
    })
  }
  obtenerItems(){
    this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
      this.Items=resp
      this.cargarFormulario()
    })
  }
  obtenerEmpresas(){
    this.conS.obtenerEmpresas(this.usuario.idMatriz).subscribe(resp=>{
      this.Empresas=resp
    })
  }

  crearItem(){
    let ItemForm:any
    ItemForm=this.ItemForm.value
    if(this.SucursalesSelected.length>0){
      this.ItemForm.get('Sucursales').setValue(this.SucursalesSelected);
      ItemForm.Sucursales=this.SucursalesSelected
    }
    else {
      let _SucursalSeleccionada:any=[]
      _SucursalSeleccionada=this.Sucursales.filter((suc:any)=>suc.id==this.ItemForm.value['Sucursales'])
      this.ItemForm.get('Sucursales').setValue(_SucursalSeleccionada);
      ItemForm.Sucursales=_SucursalSeleccionada
    }
    console.log('ItemForm',ItemForm)
    this.conS.crearItem(ItemForm).then(resp=>{
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Item creado",
        showConfirmButton: false,
        timer: 1500
      });
      this.cargarFormulario()
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
      console.log('itemEncontrado',itemEncontrado[0])
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


}
