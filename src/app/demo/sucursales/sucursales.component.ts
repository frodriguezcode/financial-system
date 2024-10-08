// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [CommonModule, SharedModule,FormsModule,ReactiveFormsModule],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export default class SucursalesComponent implements OnInit {
  Sucursales:any=[]
  Empresas:any=[]
  sucursalFound:boolean=false
  SucursalForm!:FormGroup
  Fecha:any= new Date();
  usuario:any
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService, private readonly router: Router) {}

ngOnInit(): void {
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    this.obtenerSucursales()
  this.obtenerEmpresas()
  
 
  });



  
}

cargarFormulario(){
  this.SucursalForm = new FormGroup({
    Nombre: new FormControl('',[Validators.required]), 
    idMatriz: new FormControl(this.usuario.idMatriz,[Validators.required]), 
    idEmpresa: new FormControl(this.usuario.idEmpresa,[Validators.required]), 
    Activo: new FormControl(true), 
    Editando: new FormControl(false), 
    FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
   })
}
toggleEdicion(Sucursal: any) {

  Sucursal.Editando = !Sucursal.Editando;
}


actualizarSucursal(sucursal:any){
  let _Sucursal= this.Sucursales;
  const sucursalEncontrado = _Sucursal.filter((suc:any) => suc.id == sucursal.id);
  sucursalEncontrado[0].Nombre=sucursal.Nombre
  sucursalEncontrado[0].Editando = !sucursal.Editando;

  this.conS.ActualizarSucursal(sucursalEncontrado[0]).then(resp=>{
    this.toastr.success('Sucursal editada', '¡Exito!');
  })
}

ActualizaEstadoSucursal(Sucursal:any,Estado:boolean){
  this.conS.ActualizaEstadoSucursal(Sucursal,Estado).then(resp=>{
    if(Estado==true){
      this.toastr.success('Sucursal activada', '¡Exito!');
    }
    else{
      this.toastr.success('Sucursal desactivada', '¡Exito!');
    }
  })
}

verificarSucursal(){
  let sucursalEncontrada:any=[]
  sucursalEncontrada=this.Sucursales.filter((sucursal:any)=>sucursal.Nombre==this.SucursalForm.value['Sucursal'])
  if(sucursalEncontrada.length>0){
    this.sucursalFound=true
  }
  else {
    this.sucursalFound=false
  }
}

crearSucursal(){
  Swal.fire({
    title: 'Ahora crearemos los usuarios para la nueva empresa'
   });
   Swal.showLoading();
  this.conS.crearSucursal(this.SucursalForm.value).then((resp: any)=>{
    Swal.hideLoading();
    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.router.navigate(['/Usuarios'])
  }, 3000);

    this.cargarFormulario()
  })
}
obtenerSucursales(){
  this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe((resp: any)=>{
  this.Sucursales=resp
  console.log('Sucursales',this.Sucursales)
  })
}
obtenerEmpresas(){
  this.conS.obtenerEmpresas(this.usuario.idMatriz).subscribe((resp: any)=>{

  this.Empresas=resp
  this.cargarFormulario()
  })
}


}
