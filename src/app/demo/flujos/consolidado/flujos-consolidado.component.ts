// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-flujo-consolidado',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './flujos-consolidado.component.html',
  styleUrls: ['./flujos-consolidado.component.scss']
})
export default class FlujoConsolidadoComponent implements OnInit {
  constructor(private conS:ConfigurationService ) {}
  Categorias:any=[]
  Items:any=[]
  usuario:any
 ngOnInit(): void {
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerCategorias()
 }
obtenerCategorias(){
this.conS.obtenerCategorias().subscribe((data)=>{
  this.Categorias=data.filter((cate:any)=>cate.Mostrar==true)

  this.obtenerItems()

})
 }

 getItems(idCategoria:any){
 let _Items:any=[]
 _Items=this.Items.filter((item:any)=>item.idCategoria==idCategoria)
 return _Items
 }

 obtenerItems(){
  this.conS.obtenerItems(this.usuario.idEmpresa).subscribe(resp=>{
      this.Items=resp;
      console.log('Items',this.Items)
  })
 }

}
