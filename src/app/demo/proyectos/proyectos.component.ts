// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, SharedModule,FormsModule,ReactiveFormsModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export default class ProyectosComponent implements OnInit {
  Proyectos:any=[]
  Empresas:any=[]
  Sucursales:any=[]
  proyectoFound:boolean=false
  ProyectoForm!:FormGroup
  Fecha:any= new Date();
  usuario:any
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService) {}

ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    this.obtenerProyectos()
    this.obtenerEmpresas()
    this.obtenerSucursales()
  
 
  });

  
}

cargarFormulario(){
  this.ProyectoForm = new FormGroup({
    Nombre: new FormControl('',[Validators.required]), 
    idMatriz: new FormControl(this.usuario.idMatriz,[Validators.required]), 
    idEmpresa: new FormControl(this.usuario.idEmpresa,[Validators.required]), 
    Activo: new FormControl(true), 
    Editando: new FormControl(false), 
    idSucursal: new FormControl('0'), 
    FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 
   })
}
toggleEdicion(Proyecto: any) {

  Proyecto.Editando = !Proyecto.Editando;
}


actualizarProyecto(proyecto:any){
  let _Proyecto= this.Proyectos;
  const proyectoEncontrado = _Proyecto.filter((suc:any) => suc.id == proyecto.id);
  proyectoEncontrado[0].Nombre=proyecto.Nombre
  proyectoEncontrado[0].Editando = !proyecto.Editando;

  this.conS.ActualizarProyecto(proyectoEncontrado[0]).then(resp=>{
    this.toastr.success('Proyecto editado', '¡Exito!');
  })
}

ActualizaEstadoProyecto(Proyecto:any,Estado:boolean){
  this.conS.ActualizaEstadoProyecto(Proyecto,Estado).then(resp=>{
    if(Estado==true){
      this.toastr.success('Proyecto activada', '¡Exito!');
    }
    else{
      this.toastr.success('Proyecto desactivada', '¡Exito!');
    }
  })
}

verificarProyecto(){
  let proyectoEncontrado:any=[]
  proyectoEncontrado=this.Proyectos.filter((proyecto:any)=>proyecto.Nombre==this.ProyectoForm.value['Proyecto'])
  if(proyectoEncontrado.length>0){
    this.proyectoFound=true
  }
  else {
    this.proyectoFound=false
  }
}

crearProyecto(){
  this.conS.crearProyecto(this.ProyectoForm.value).then((resp: any)=>{
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Proyecto creado",
      showConfirmButton: false,
      timer: 1500
    });
    this.cargarFormulario()
  })
}
obtenerProyectos(){
  this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe((resp: any)=>{
  this.Proyectos=resp
  })
}
obtenerSucursales(){
  this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe((resp: any)=>{
  this.Sucursales=resp.filter(data=>data.Activo==true)

  })
}


obtenerEmpresas(){
  this.conS.obtenerEmpresas(this.usuario.idMatriz).subscribe((resp: any)=>{

  this.Empresas=resp
  this.cargarFormulario()
  })
}


}
