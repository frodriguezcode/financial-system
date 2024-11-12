// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-tipos-operacion',
  standalone: true,
  imports: [CommonModule, SharedModule],
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
  });
}
crearTipoOperacion(){
  let _TipoOperacion={
    "Activo":true,
    "Nombre":this.NombreOperacion.value,
    "idEmpresa":this.usuario.idEmpresa,
    "idMatriz":this.usuario.idMatriz,
    "Fecha":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
  }
  this.conS.crearTipoOperacion(_TipoOperacion).then(resp=>{

  })
}

}
