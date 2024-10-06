// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, SharedModule,FormsModule,ReactiveFormsModule,CalendarModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export default class ProyectosComponent implements OnInit {
  Proyectos:any=[]
  Empresas:any=[]
  Sucursales:any=[]
  SucursalesTodasBack:any=[]
  proyectoFound:boolean=false
  ProyectoForm!:FormGroup
  Fecha:any= new Date();
  usuario:any
  es: any;
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService,private primengConfig: PrimeNGConfig) {}

ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.primengConfig.setTranslation({
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
    monthNames: [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
    monthNamesShort: [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }
    this.obtenerProyectos()
    this.obtenerEmpresas()
    if(this.usuario.Rol=='Super Usuario'){

      this.obtenerSucursalesByMatriz()
    }
    else {
      this.obtenerSucursales()

    }
  
 
  });

  
}

selectSucursalByEmpresa(idEmpresa:any){
  if(idEmpresa=='0') {
   this.Sucursales=this.SucursalesTodasBack
   this.ProyectoForm.get('idSucursal')!.disable();
  }
  else {
    this.Sucursales=this.SucursalesTodasBack.filter((resp:any)=>resp.idEmpresa==idEmpresa)
    this.ProyectoForm.get('idSucursal')!.enable();
  }
  
 }

cargarFormulario(){
  this.ProyectoForm = new FormGroup({
    Nombre: new FormControl('',[Validators.required]), 
    idMatriz: new FormControl(this.usuario.idMatriz,[Validators.required]), 
    idEmpresa: new FormControl(this.usuario.idEmpresa,[Validators.required]), 
    Activo: new FormControl(true), 
    Editando: new FormControl(false), 
    RangoFechas: new FormControl(null),
    FechaInicio: new FormControl(''),
    FechaFinal: new FormControl(''),
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
  proyectoEncontrado[0].FechaInicio = proyecto.RangoFechas[0]=='' ? '' : this.datePipe.transform(new Date(proyecto.RangoFechas[0]).setDate(new Date(proyecto.RangoFechas[0]).getDate()), 'yyyy-MM-dd');
  proyectoEncontrado[0].FechaFinal = proyecto.RangoFechas[1]== '' ? '' :  this.datePipe.transform(new Date(proyecto.RangoFechas[1]).setDate(new Date(proyecto.RangoFechas[1]).getDate()), 'yyyy-MM-dd');
  proyectoEncontrado[0].RangoFechas =proyecto.RangoFechas

  if(proyectoEncontrado[0].FechaInicio!='' && proyectoEncontrado[0].FechaFinal!=''){
    console.log('FechaInicio',proyectoEncontrado[0].FechaInicio)
    console.log('FechaFinal',proyectoEncontrado[0].FechaFinal)
    const mesesAgrupados = this.conS.generarMesesAgrupadosPorAnio( proyectoEncontrado[0].FechaInicio, proyectoEncontrado[0].FechaFinal);
    const añosAgrupados = Object.keys(mesesAgrupados).map(year => {
      return {
          year: year,
          meses: mesesAgrupados[year].map(mes => ({
              numero: mes.numero,
              nombre: mes.nombre,
              anio: Number(year),
          }))
      };
  });
  proyectoEncontrado[0].MesesRango=añosAgrupados

  }
  console.log('proyectoEncontrado[0]',proyectoEncontrado[0])



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
console.log('FechaInicio',this.ProyectoForm.value.RangoFechas[0])
console.log('FechaFinal',this.ProyectoForm.value.RangoFechas[1])

if(this.ProyectoForm.value.RangoFechas[0]==null){
      Swal.fire({
      position: "center",
      icon: "warning",
      title: "Debe colocar una fecha de inicio",
      showConfirmButton: false,
      timer: 1500
    });
}
else if(this.ProyectoForm.value.RangoFechas[1]==null){
      Swal.fire({
      position: "center",
      icon: "warning",
      title: "Debe colocar una fecha final",
      showConfirmButton: false,
      timer: 1500
    });
}
else {
  let FechaInicio:any=this.datePipe.transform(new Date(this.ProyectoForm.value.RangoFechas[0]).setDate(new Date(this.ProyectoForm.value.RangoFechas[0]).getDate()), 'yyyy-MM-dd')
  let FechaFinal:any=this.datePipe.transform(new Date(this.ProyectoForm.value.RangoFechas[1]).setDate(new Date(this.ProyectoForm.value.RangoFechas[1]).getDate()), 'yyyy-MM-dd')
  const mesesAgrupados = this.conS.generarMesesAgrupadosPorAnio(FechaInicio, FechaFinal);
  const añosAgrupados = Object.keys(mesesAgrupados).map(year => {
    return {
        year: year,
        meses: mesesAgrupados[year].map(mes => ({
            numero: mes.numero,
            nombre: mes.nombre,
            anio: Number(year),
        }))
    };
});



this.ProyectoForm.value.MesesRango=añosAgrupados
this.ProyectoForm.value.FechaInicio=FechaInicio
this.ProyectoForm.value.FechaFinal=FechaFinal
console.log('Form',this.ProyectoForm.value);
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
}
obtenerProyectos(){
  this.conS.obtenerProyectos(this.usuario.idEmpresa).subscribe((resp: any)=>{
  this.Proyectos=resp



  this.Proyectos.map((proyect: any) => {
    proyect.RangoFechas[0] = proyect.RangoFechas[0] && proyect.RangoFechas[0].seconds 
      ? new Date(proyect.RangoFechas[0].seconds * 1000) 
      : new Date();  // Fecha actual si está indefinida
    
    proyect.RangoFechas[1] = proyect.RangoFechas[1] && proyect.RangoFechas[1].seconds 
      ? new Date(proyect.RangoFechas[1].seconds * 1000) 
      : new Date();  // Fecha actual si está indefinida
  });
  




  })
  
}
obtenerSucursales(){
  this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe((resp: any)=>{
  this.Sucursales=resp.filter(data=>data.Activo==true)

  })
}
obtenerSucursalesByMatriz(){
  this.conS.obtenerSucursalesByMatriz(this.usuario.idMatriz).subscribe((resp: any)=>{
  this.SucursalesTodasBack=resp.filter(data=>data.Activo==true)
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
