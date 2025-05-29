//* angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

//~ project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresasService } from 'src/app/services/empresa.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export default class EmpresasComponent implements OnInit {
  empresaFound: boolean = false;
  MostrarEmpresas: boolean = true;
  Empresas: any = [];
  Matrices: any = [];
  Atributos: any = [];
  EmpresaForm!: FormGroup;
  Fecha: any = new Date();
  usuario:any
  constructor(
    private readonly router: Router,
    private datePipe: DatePipe,
    private empS: EmpresasService,
    private authS: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.usuario= JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
    this.obtenerEmpresas();
    this.obtenerCorporaciones();
    this.obtenerAtributos();
    
  }

  obtenerAtributos(){
    this.authS.obtenerAtributos().subscribe((data:any)=>{
      this.Atributos=data.map((atributo: any) => {
        return { ...atributo, Seleccionado: true };
      });

  })
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

    let _Empresa={
      Activo:true,
      Editando:false,
      FechaCreacion:this.EmpresaForm.value.FechaCreacion,
      Nombre:this.EmpresaForm.value.Nombre,
      idMatriz:this.usuario.idMatriz,
      ConfigInicial:true
    }

      this.Matrices[0].Empresas.push(_Empresa)
      let _Rol={
        "Rol":'Super Usuario',
        "Atributos":this.Atributos,
        "idEmpresa":this.usuario.idEmpresa,
        "idMatriz":this.usuario.idMatriz,
        "idUsuario":this.usuario.id,
        "Usuario":this.usuario.Usuario,
        "FechaRegistro":this.datePipe.transform(this.Fecha.setDate(this.Fecha.getDate()), 'yyyy-MM-dd')
      }
    

      this.empS.crearEmpresa(_Empresa,this.Matrices[0],_Rol).then((resp) => {
       
        Swal.fire({
          title: "¿Desea crear una sucursal o un proyecto?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Sucursal",
          denyButtonText: `Proyecto`
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/sucursales'])
          } else if (result.isDenied) {
            this.router.navigate(['/Proyectos'])
          }
        });
      });


  }
  // ~Crear empresa


  toggleEdicion(Empresa: any) {

    Empresa.Editando = !Empresa.Editando;
  }
  actualizarEmpresa(empresa:any){
    let _empresa= this.Empresas;
   
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
    this.empS.obtenerEmpresa(this.usuario.idMatriz).subscribe(resp=>{
      this.Empresas=resp
      this.cargarFormulario()
    })
  }
  obtenerCorporaciones(){
    this.empS.obtenerCorporaciones(this.usuario.idMatriz).subscribe(resp=>{
      this.Matrices=resp

     
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
