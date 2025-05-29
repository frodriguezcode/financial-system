// angular import
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, SharedModule,FormsModule,ReactiveFormsModule,CalendarModule,TableModule,DialogModule,MultiSelectModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export default class ProyectosComponent implements OnInit {
  @Input() empresaID:string=''
  @Output() proyectoCreado = new EventEmitter<any>();
  Proyectos:any=[]
  Empresas:any=[]
  Sucursales:any=[]
  SucursalesTodasBack:any=[]
  proyectoFound:boolean=false
  ProyectoForm!:FormGroup
  Fecha:any= new Date();
  usuario:any
  MostrarRangoFechas:boolean=true
  Usuarios:any
  UsuariosSeleccionados:any=[]
  es: any;
  visible: boolean = false;
  cargando: boolean = true;
  CambiarRegistros: boolean = false;
  idEmpresa:string=''
  nombreEmpresa:any
  Sucursal:FormControl=new FormControl ('')
  visibleSucursal: boolean = false;
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,
    private toastr: ToastrService,
    private authS: AuthService,
    private primengConfig: PrimeNGConfig,
    private readonly router: Router
  ) {}

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
    if(this.empresaID!=''){
        this.idEmpresa=this.empresaID
    }

    else {
        this.idEmpresa=this.usuario.idEmpresa
    }

  

    this.obtenerEmpresas()
    if(this.usuario.Rol=='Super Usuario'){

      this.obtenerSucursalesByMatriz()
    }
    else {
      this.obtenerSucursales()

    }
  this.obtenerUsuarios()
 
  });

  
}

getSelecteUsuariosLabelCrear(): any {
  const count = this.ProyectoForm.value['Usuarios']? this.ProyectoForm.value['Usuarios'].length : 0
  
  return count >= 2 ? `${count} usuarios seleccionados` : null;
}

obtenerUsuarios(){
 this.authS.obtenerUsuariosByMatriz(this.usuario.idMatriz).subscribe(resp=>{

  if(this.usuario.isAdmin==true){
    this.Usuarios=resp
  }

  else {
    this.Usuarios=resp.filter((resp:any)=>resp.idEmpresa==this.idEmpresa)
    
  }
  this.Usuarios.map((user:any)=>user.NombreEmpresa=user.Nombres + ' - ' + user.Empresa)
 })
}

getUsuarioByEmpresa(idEmpresa:any){
  if(this.Usuarios!=undefined){
    return this.Usuarios.filter((emp:any)=>emp.idEmpresa==idEmpresa)

  }
  else {
    return []
  }
}
showDialog() {
  this.visible = true;
}

showCrearSucursal() {
  this.visibleSucursal = true;
}
selectSucursalByEmpresa(idEmpresa:any){
  if(idEmpresa=='0') {
   this.Sucursales=this.SucursalesTodasBack
   this.ProyectoForm.get('idSucursal')!.disable();
  }
  else {
    this.nombreEmpresa=this.getNombreEmpresa(idEmpresa)
    this.idEmpresa=idEmpresa
    this.Sucursales=this.SucursalesTodasBack.filter((resp:any)=>resp.idEmpresa==idEmpresa)
    this.ProyectoForm.get('idSucursal')!.enable();
  }
  
 }

 crearSucursal(){
  let _Sucursal={
    Nombre:this.Sucursal.value, 
    idMatriz: this.usuario.idMatriz, 
    idEmpresa: this.idEmpresa, 
    Activo: true, 
    Editando: false, 
    FechaCreacion: this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'), 
  }
  this.conS.crearSucursal(_Sucursal).then((resp: any)=>{
    this.visibleSucursal=false
    this.Sucursal.setValue('')
    this.toastr.success('Sucursal Creada', '¡Exito!');
  })
}


cargarFormulario(){
  this.ProyectoForm = new FormGroup({
    Nombre: new FormControl('',[Validators.required]), 
    idMatriz: new FormControl(this.usuario.idMatriz,[Validators.required]), 
    idEmpresa: new FormControl('',[Validators.required]), 
    Activo: new FormControl(true), 
    Usuarios: new FormControl([]), 
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
  this.MostrarRangoFechas=!this.MostrarRangoFechas
}

cambiarEmpresa(){
  this.CambiarRegistros=true
}


actualizarProyecto(proyecto:any){
  let _Proyecto= this.Proyectos;

  
  const proyectoEncontrado = _Proyecto.filter((suc:any) => suc.id == proyecto.id);

  proyectoEncontrado[0].Nombre=proyecto.Nombre
  proyectoEncontrado[0].Editando = !proyecto.Editando;
  proyectoEncontrado[0].idEmpresa = proyecto.idEmpresa;
  this.MostrarRangoFechas=!this.MostrarRangoFechas
  proyectoEncontrado[0].FechaInicio = proyecto.RangoFechas[0]=='' ? '' : this.datePipe.transform(new Date(proyecto.RangoFechas[0]).setDate(new Date(proyecto.RangoFechas[0]).getDate()), 'yyyy-MM-dd');
  proyectoEncontrado[0].FechaFinal = proyecto.RangoFechas[1]== '' ? '' :  this.datePipe.transform(new Date(proyecto.RangoFechas[1]).setDate(new Date(proyecto.RangoFechas[1]).getDate()), 'yyyy-MM-dd');
  proyectoEncontrado[0].RangoFechas =proyecto.RangoFechas

  if(proyectoEncontrado[0].FechaInicio!='' && proyectoEncontrado[0].FechaFinal!=''){
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

actualizarRegistrosContables(idProyecto:string,idEmpresa:string){
  let Subscribe:Subscription
  Subscribe=  this.conS.obtenerRegistrosByProyecto(idProyecto).subscribe(resp=>{
    Subscribe.unsubscribe()
    if(resp.length>0){

      
      resp.map((reg:any)=>reg.idEmpresa=idEmpresa)
      console.log('resp',resp)
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




  this.conS.crearProyecto(this.ProyectoForm.value).then((resp: any)=>{
    this.proyectoCreado.emit(this.ProyectoForm.value);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Éxito, proyecto creado",
      showConfirmButton: false,
      timer: 1500
    });


    this.cargarFormulario()
  })

}
}
ActualizarUsuario(usuario:any){
  this.authS.ActualizarUsuario(usuario).then(resp=>{

  })
}
calcularDuracion(fechaInicio: Date, fechaFinal: Date): string {
  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinalObj = new Date(fechaFinal);

  let diffAnios = fechaFinalObj.getFullYear() - fechaInicioObj.getFullYear();
  let diffMeses = fechaFinalObj.getMonth() - fechaInicioObj.getMonth();
  let diffDias = fechaFinalObj.getDate() - fechaInicioObj.getDate();

  // Ajustar si los días son negativos
  if (diffDias < 0) {
    diffMeses--;
    diffDias += new Date(fechaFinalObj.getFullYear(), fechaFinalObj.getMonth(), 0).getDate();
  }

  // Ajustar si los meses son negativos
  if (diffMeses < 0) {
    diffAnios--;
    diffMeses += 12;
  }

  const resultado = diffDias==0 ?  `${diffAnios * 12 + diffMeses} meses` : `${diffAnios * 12 + diffMeses} meses y ${diffDias} días`
  return ` ${resultado}`;
}

getNombreEmpresa(idEmpresa){
  let _Empresa:any=this.Empresas.filter((emp:any)=>emp.id==idEmpresa)
  if(_Empresa.length>0){
    return _Empresa[0].Nombre
  }
  else{
    return ''
  }
}
obtenerProyectos(){
  this.cargando=true
  // if(this.usuario.isAdmin==true){
  //   this.conS.obtenerProyectosByMatriz(this.usuario.idMatriz).subscribe((resp: any)=>{
  //   this.Proyectos=resp
  
  
  
  //   this.Proyectos.map((proyect: any) => {
  //     proyect.RangoFechas[0] = proyect.RangoFechas[0] && proyect.RangoFechas[0].seconds 
  //       ? new Date(proyect.RangoFechas[0].seconds * 1000) 
  //       : new Date()
      
  //     proyect.RangoFechas[1] = proyect.RangoFechas[1] && proyect.RangoFechas[1].seconds 
  //       ? new Date(proyect.RangoFechas[1].seconds * 1000) 
  //       : new Date(),

  //       proyect.Duracion =    proyect.FechaInicio=="" || proyect.FechaFinal==" " ? 'Sin fechas de proyecto definidas' :  this.calcularDuracion(proyect.FechaInicio,proyect.FechaFinal),
  //       proyect.Empresa =    this.getNombreEmpresa(proyect.idEmpresa)


  //   }
  
  
  
  // );
    
  // this.cargando=false
  //   })
    
  // }
    this.conS.obtenerProyectos(this.idEmpresa).subscribe((resp: any)=>{
    this.Proyectos=resp
    this.Proyectos.map((proyect: any) => {
      proyect.RangoFechas[0] = proyect.RangoFechas[0] && proyect.RangoFechas[0].seconds 
        ? new Date(proyect.RangoFechas[0].seconds * 1000) 
        : new Date();  // Fecha actual si está indefinida
      
      proyect.RangoFechas[1] = proyect.RangoFechas[1] && proyect.RangoFechas[1].seconds 
        ? new Date(proyect.RangoFechas[1].seconds * 1000) 
        : new Date(),
        proyect.Duracion =    proyect.FechaInicio=="" || proyect.FechaFinal==" " ? 'Sin fechas de proyecto definidas' :  this.calcularDuracion(proyect.FechaInicio,proyect.FechaFinal),
        proyect.Empresa =    this.getNombreEmpresa(proyect.idEmpresa)

    });
    this.cargando=false
  
    })

  
}
obtenerSucursales(){
  this.conS.obtenerSucursales(this.idEmpresa).subscribe((resp: any)=>{
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
    this.obtenerProyectos()
  this.cargarFormulario()
  })
}


}
