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
  selector: 'app-bancos',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule,ReactiveFormsModule],
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss']
})
export default class BancosComponent implements OnInit {
  constructor(private datePipe: DatePipe,private conS:ConfigurationService,private toastr: ToastrService) {}
  Monedas:any=[]
  Bancos:any=[]
  Empresas:any=[]
  Sucursales:any=[]
  cuentaFound:boolean=false
  BancoForm!:FormGroup
  Fecha:any= new Date();
  usuario:any
  MesesTodos:any=[]
  
  ngOnInit(): void {
    this.MesesTodos= [
    
      {
        Mes: 'Sin Mes',
        id:0,
        seleccionado: false
      },
      {
        Mes: 'Enero',
        id:1,
        seleccionado: false
      },
      {
        Mes: 'Febrero',
        id:2,
        seleccionado: false
      },
      {
        Mes: 'Marzo',
        id:3,
        seleccionado: false
      },
      {
        Mes: 'Abril',
        id:4,
        seleccionado: false
      },
      {
        Mes: 'Mayo',
        id:5,
        seleccionado: false
      },
      {
        Mes: 'Junio',
        id:6,
        seleccionado: false
      },
      {
        Mes: 'Julio',
        id:7,
        seleccionado: false
      },
      {
        Mes: 'Agosto',
        id:8,
        seleccionado: false
      },
      {
        Mes: 'Septiembre',
        id:9,
        seleccionado: false
      },
      {
        Mes: 'Octubre',
        id:10,
        seleccionado: false
      },
      {
        Mes: 'Noviembre',
        id:11,
        seleccionado: false
      },
      {
        Mes: 'Diciembre',
        id:12,
        seleccionado: false
      },
    
    ]
  this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
  this.obtenerSucursales()

  }
  getMonthName(Fecha:string){
    return Number((Fecha.substring(5)).substring(0,2))
   }

  obtenerSucursales(){
    this.conS.obtenerSucursales(this.usuario.idEmpresa).subscribe(resp=>{
      this.Sucursales=resp
      this.obtenerMonedas()
      this.obtenerBancos()
    })
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
    let _Fecha:any=this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
    this.BancoForm = new FormGroup({
      Nombre: new FormControl('',[Validators.required]), 
      Cuenta: new FormControl('',[Validators.required]), 
      Activo: new FormControl(true), 
      Editando: new FormControl(false), 
      idMoneda: new FormControl('',[Validators.required]), 
      idSucursal: new FormControl('0',[Validators.required]), 
      idEmpresa: new FormControl(this.usuario.idEmpresa,[Validators.required]), 
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


  toggleEdicion(Banco: any) {

    Banco.Editando = !Banco.Editando;
  }
  actualizarBanco(banco:any){
    let _banco= this.Bancos;
    const bancoEncontrado = _banco.filter((banc:any) => banc.id == banco.id);
    bancoEncontrado[0].Nombre=banco.Nombre
    bancoEncontrado[0].Cuenta=banco.Cuenta
    bancoEncontrado[0].idSucursal=banco.idSucursal
    bancoEncontrado[0].Editando = !banco.Editando;

    this.conS.ActualizarBanco(bancoEncontrado[0]).then(resp=>{
      this.toastr.success('Banco editado', '¡Exito!');
    })
  }

  
  ActualizarBancoEstado(Banco:any,Estado:boolean){
    this.conS.ActualizarBancoEstado(Banco,Estado).then(resp=>{
      if(Estado==true){
        this.toastr.success('Cuenta activada', '¡Exito!');
      }
      else{
        this.toastr.success('Cuenta desactivada', '¡Exito!');
      }
    })
  }

  getNombreSucursal(idSucursal:string){
    let _sucursal:any=[]
    _sucursal=this.Sucursales.filter((s:any)=> s.id == idSucursal)
    return _sucursal[0].Nombre
  }


}
