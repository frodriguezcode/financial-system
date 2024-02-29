// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-bancos',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule,ReactiveFormsModule],
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss']
})
export default class BancosComponent implements OnInit {
  constructor(private datePipe: DatePipe,private conS:ConfigurationService) {}
  Monedas:any=[]
  Bancos:any=[]
  cuentaFound:boolean=false
  BancoForm!:FormGroup
  Fecha:any= new Date();
  ngOnInit(): void {
  this.obtenerMonedas()
  this.obtenerBancos()
  }
  obtenerMonedas(){
    this.conS.obtenerMonedas().subscribe(resp=>{
      this.Monedas=resp
    })
  }
  obtenerBancos(){
    this.conS.obtenerBancos().subscribe(resp=>{
      this.Bancos=resp
      this.cargarFormulario()
    })
  }

  cargarFormulario(){
    this.BancoForm = new FormGroup({
      Nombre: new FormControl('',[Validators.required]), 
      Cuenta: new FormControl('',[Validators.required]), 
      Activo: new FormControl(true), 
      idMoneda: new FormControl('',[Validators.required]), 
      idSucursal: new FormControl('0',[Validators.required]), 
      FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')), 

     })
  }

  verificarBanco(){
    let CuentaEncontrada:any=[]
    CuentaEncontrada=this.Bancos.filter((banco:any)=>banco.Cuenta==this.BancoForm.value['Cuenta'])
    if(CuentaEncontrada.length>0){
      this.cuentaFound=true
    }
    else {
      this.cuentaFound=false
    }
  }
  crearBanco(){
    this.conS.crearBanco(this.BancoForm.value).then(resp=>{
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cuenta creada",
        showConfirmButton: false,
        timer: 1500
      });
    })
  }


}
