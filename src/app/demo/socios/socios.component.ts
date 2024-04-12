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
  selector: 'app-socios',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule,ReactiveFormsModule],
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.scss']
})
export default class SocioNegocioComponent implements OnInit {
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService) {}

  Socios:any=[]
  
  socioFound:boolean=false
  SocioForm!:FormGroup
  Fecha:any= new Date();
  usuario:any;
  tipoSocios: any = [
    {id: "1", name: "Cliente"},
    {id: "2", name: "Proveedor"},
    
  ]

  ngOnInit(): void {
  
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  // this.obtenerSucursales()
    this.obtenerSocios();
  }

  obtenerSocios(){
    this.conS.obtenerSocios(this.usuario.idEmpresa).subscribe(resp=>{
      this.Socios=resp
      this.cargarFormulario()
    console.log("socios",this.Socios);

    })
  }

  getNameTipo(idTipo:string){
    let _Tipo:any=[]
    _Tipo=this.tipoSocios.filter((x:any) => x.id===idTipo)
    return _Tipo[0].name
  }

  cargarFormulario(){
    let _Fecha:any=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
    this.SocioForm = new FormGroup({
      Nombre: new FormControl('',[Validators.required]), 
      Tipo: new FormControl('',[Validators.required]), 
      Activo: new FormControl(true), 
      idEmpresa: new FormControl(this.usuario.idEmpresa), 
      Editando: new FormControl(false), 
      FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 

     })
  }

  verificarSocio(){
    let SocioEncontrado:any=[]
    SocioEncontrado=this.Socios.filter((socio:any)=>socio.Nombre==this.SocioForm.value['Socios'])
    if(SocioEncontrado.length>0){
      this.socioFound=true
    }
    else {
      this.socioFound=false
    }
  }


  crearSocio(){
    this.conS.crearSocio(this.SocioForm.value).then(resp=>{
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Socio creado",
        showConfirmButton: false,
        timer: 1500
      });
      this.cargarFormulario()
    })

  
  }


  toggleEdicion(Socio: any) {

    Socio.Editando = !Socio.Editando;
  }
  actualizarSocio(socio:any){
    let _socio= this.Socios;
    const socioEncontrado = _socio.filter((soc:any) => soc.id == socio.id);
    socioEncontrado[0].Nombre=socio.Nombre
    socioEncontrado[0].Tipo=socio.Tipo
    socioEncontrado[0].Editando = !socio.Editando;
    this.conS.ActualizarSocio(socioEncontrado[0]).then(resp=>{
      this.toastr.success('Socio editado', '¡Exito!');
    })
  }

  
  ActualizarSocioEstado(Socio:any,Estado:boolean){
    this.conS.ActualizarSocioEstado(Socio,Estado).then(resp=>{
      if(Estado==true){
        this.toastr.success('Socio Activado', '¡Exito!');
      }
      else{
        this.toastr.success('Socio desactivado', '¡Exito!');
      }
    })
  }

  // getNombreSucursal(idSucursal:string){
  //   let _sucursal:any=[]
  //   _sucursal=this.Sucursales.filter((s:any)=> s.id == idSucursal)
  //   return _sucursal[0].Nombre
  // }


}
