//* angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

//~ project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresasService } from 'src/app/services/empresa.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export default class EmpresasComponent implements OnInit {
  empresaFound: boolean = false;
  Empresas: any = [];
  EmpresaForm!: FormGroup;
  Fecha: any = new Date();

  constructor(
    private datePipe: DatePipe,
    private empS: EmpresasService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerEmpresas();
    
  }

  // ~Creo Formulario de Empresa
  cargarFormulario() {
    this.EmpresaForm = new FormGroup({
      Nombre: new FormControl('', [Validators.required]),
      Activo: new FormControl(true),
      FechaCreacion: new FormControl(this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd'))
    });
  }
  // ~Creo Formulario de Empresa

  // ~Crear empresa
  crearEmpresa() {
    this.empS.crearEmpresa(this.EmpresaForm.value).then((resp) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Empresa creada',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
  // ~Crear empresa


  toggleEdicion(Empresa: any) {

    Empresa.Editando = !Empresa.Editando;
  }
  actualizarEmpresa(empresa:any){
    let _empresa= this.Empresas;
    console.log(this.Empresas);
    const empresaEncontrada = _empresa.filter((empr:any) => empr.id == empresa.id);
    empresaEncontrada[0].Nombre=empresa.Nombre
    // bancoEncontrado[0].Cuenta=empresa.Cuenta
    // empresaEncontrada[0].idSucursal=empresa.idSucursal
    empresaEncontrada[0].Editando = !empresa.Editando;

    this.empS.actualizarEmpresa(empresaEncontrada[0]).then(resp=>{
      this.toastr.success('Empresa editado', '¡Exito!');
    })
  }

  obtenerEmpresas(){
    this.empS.obtenerEmpresa().subscribe(resp=>{
      this.Empresas=resp
      this.cargarFormulario()
    })
  }

  // ~Verificar Empresa
  verificarEmpresa() {
    let EmpresaEncontrada: any = [];
    EmpresaEncontrada = this.Empresas.filter((banco: any) => banco.Cuenta == this.EmpresaForm.value['Empresa']);
    if (EmpresaEncontrada.length > 0) {
      this.empresaFound = true;
    } else {
      this.empresaFound = false;
    }
  } // ~Verificar Empresa

  // ~Actualizar Estado Emprewsa

  ActualizarEmpresaEstado(Empresa:any,Estado:boolean){
    this.empS.ActualizarEmpresaEstado(Empresa,Estado).then(resp=>{
      if(Estado==true){
        this.toastr.success('Empresa activada', '¡Exito!');
      }
      else{
        this.toastr.success('Empresa desactivada', '¡Exito!');
      }
    })
  }

  // ~Actualizar Estado Emprewsa
}
