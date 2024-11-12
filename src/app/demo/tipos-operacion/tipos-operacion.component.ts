// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-tipos-operacion',
  standalone: true,
  imports: [CommonModule, SharedModule,TableModule],
  templateUrl: './tipos-operacion.component.html',
  styleUrls: ['./tipos-operacion.component.scss']
})
export default class TiposOperacionComponent implements OnInit {
NombreOperacion:FormControl=new FormControl('')
TiposOperacion:any=[]
usuario:any
Fecha: any = new Date();
constructor( private conS:ConfigurationService,   private datePipe: DatePipe){

}

ngOnInit(): void {
  this.conS.usuario$.subscribe(usuario => {
    if (usuario) {
    this.usuario=usuario
    }
    else {
      this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    }

    this.obtenerTiposOperacionByEmpresa()
  });
}

obtenerTiposOperacionByEmpresa(){
  this.conS.obtenerTiposOperacionByEmpresa(this.usuario.idEmpresa).subscribe(resp=>{
    this.TiposOperacion=resp
  })

}
crearTipoOperacion(){
  let _TipoOperacion={
    "Activo":true,
    "Editando":false,
    "Orden":this.TiposOperacion.length+1,
    "Nombre":this.NombreOperacion.value,
    "idEmpresa":this.usuario.idEmpresa,
    "idMatriz":this.usuario.idMatriz,
    "Fecha":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
  }
  this.conS.crearTipoOperacion(_TipoOperacion).then(resp=>{
    this.NombreOperacion.setValue('')
  })
}

toggleEdicion(Usuario: any) {
    Usuario.Editando = !Usuario.Editando;
}


actualizarTipo(Tipo:any){
  let _tipo= this.TiposOperacion;
  const tipoEncontrado = _tipo.filter((tipo:any) => tipo.id == Tipo.id);
  tipoEncontrado[0].Nombre=Tipo.Nombre
  tipoEncontrado[0].Editando = !Tipo.Editando;
  this.conS.ActualizarTipo(tipoEncontrado[0]).then(resp=>{
   
  })
}

ActualizarTipoEstado(Tipo:any,Estado:boolean){
  this.conS.ActualizarTipoEstado(Tipo,Estado).then(resp=>{
    if(Estado==true){
    
    }
    else{
    
    }
  })
}
}
