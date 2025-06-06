// angular import
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-consolidado-mejorado-anual',
  standalone: true,
  imports: [CommonModule, SharedModule,TreeTableModule,ButtonModule],
  templateUrl: './consolidado-mejorado-anual.component.html',
  styleUrls: ['./consolidado-mejorado-anual.component.scss']
})
export default class ConsolidadoMejoradoAnual implements OnInit {
constructor(private conS: ConfigurationService) { }
@ViewChild('dt') table: Table;
Anios: any[] = [];
AnioSeleccionados: any[] = [];
Cabecera: any[] = [];
ngOnInit(): void {

}
construirCabecera(){

  this.Cabecera=[]
  let AniosCabecera=this.AnioSeleccionados.length>0 ? this.AnioSeleccionados:this.Anios

  

}

}
