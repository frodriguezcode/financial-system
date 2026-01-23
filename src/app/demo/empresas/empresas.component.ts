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
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import RolesComponent from '../roles/roles.component';
import CrearUsuarioComponent from '../crear-usuario/crear-usuario.component';
import SucursalesComponent from '../sucursales/sucursales.component';
import ProyectosComponent from '../proyectos/proyectos.component';
import ItemsComponent from '../Items/items.component';
import BancosComponent from '../bancos/bancos.component';
import SocioNegocioComponent from '../socios/socios.component';
import { MultiSelectModule } from 'primeng/multiselect';
import SaldosInicialesComponent from '../saldos-iniciales/saldos-iniciales.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    RolesComponent,
    CrearUsuarioComponent,
    SucursalesComponent,
    ProyectosComponent,
    ItemsComponent,
    BancosComponent,
    SocioNegocioComponent,
    MultiSelectModule,
    RouterModule,
    SaldosInicialesComponent
  ],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export default class EmpresasComponent implements OnInit {
  empresaFound: boolean = false;
  active: number | undefined = 0;
  idEmpresaCreada: string = '';
  MostrarEmpresas: boolean = true;
  Empresas: any = [];
  Matrices: any = [];
  Atributos: any = [];
  Roles: any = [];
  Usuarios: any = [];
  SaldosIniciales: any = [];
  Sucursales: any = [];
  SucursalesSeleccionadas: any = [];
  Proyectos: any = [];
  ProyectosSeleccionados: any = [];
  EmpresaForm!: FormGroup;
  Fecha: any = new Date();
  FlujoConfiguracion: any = [];
  usuario: any
  PasoAnterior: any
  Meses: any = []
  MesSeleccionado: any
  NombreEmpresa: string = ''
  SaldoInicialValor: FormControl = new FormControl(0)
  AnioSaldoInicial: FormControl = new FormControl(0)
  constructor(
    private readonly router: Router,
    private datePipe: DatePipe,
    private empS: EmpresasService,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.Meses = [
      {
        Mes: 'Enero',
        id: 1,
        seleccionado: false
      },
      {
        Mes: 'Febrero',
        id: 2,
        seleccionado: false
      },
      {
        Mes: 'Marzo',
        id: 3,
        seleccionado: false
      },
      {
        Mes: 'Abril',
        id: 4,
        seleccionado: false
      },
      {
        Mes: 'Mayo',
        id: 5,
        seleccionado: false
      },
      {
        Mes: 'Junio',
        id: 6,
        seleccionado: false
      },
      {
        Mes: 'Julio',
        id: 7,
        seleccionado: false
      },
      {
        Mes: 'Agosto',
        id: 8,
        seleccionado: false
      },
      {
        Mes: 'Septiembre',
        id: 9,
        seleccionado: false
      },
      {
        Mes: 'Octubre',
        id: 10,
        seleccionado: false
      },
      {
        Mes: 'Noviembre',
        id: 11,
        seleccionado: false
      },
      {
        Mes: 'Diciembre',
        id: 12,
        seleccionado: false
      },

    ]
    this.FlujoConfiguracion.push(
      {
        Nombre: 'Crear Roles',
        Descripcion: 'Definiremos los roles los cuales controlarás los accesos al los diferentes módulos del sistema',
        Opcional: false,
        Visitado: false,
        Orden: 1,
        OrdenAnterior: 0
      },
      {
        Nombre: 'Crear Usuarios',
        Opcional: false,
        Descripcion: 'Aquí podrás crear los usuarios que tendrán acceso al sistema',
        Visitado: false,
        Orden: 2,
        OrdenAnterior: 1
      },
      {
        Nombre: 'Crear Sucursales',
        Opcional: true,
        Descripcion: 'Ahora crearemos las sucursales de tu empresa. Si tu empresa no tiene sucursales puedes pasar al siguiente paso.',
        Visitado: false,
        Orden: 3,
        OrdenAnterior: 2
      },
      {
        Nombre: 'Crear Proyectos',
        Descripcion: 'Ahora crearemos los proyectos de tu empresa. Si tu empresa no tiene proyectos puedes crearlos posteriormente y pasar al siguiente paso.',
        Opcional: false,
        Visitado: false,
        Orden: 4,
        OrdenAnterior: 3

      },
      {
        Nombre: 'Crear Cuentas Contables',
        Opcional: false,
        Descripcion: 'Define las cuentas contables de tu empresa',
        Visitado: false,
        Orden: 5,
        OrdenAnterior: 4
      },
      {
        Nombre: 'Crear Cuentas Bancarias',
        Opcional: false,
        Descripcion: 'Define las cuentas bancarias de tu empresa',
        Visitado: false,
        Orden: 6,
        OrdenAnterior: 5
      },
      {
        Nombre: 'Crear Socios de Negocios',
        Opcional: false,
        Descripcion: 'Crea los socios de negocios que formarán parte de tu empresa.',
        Visitado: false,
        Orden: 7,
        OrdenAnterior: 6
      },
      {
        Nombre: 'Crear Saldos Iniciales',
        Opcional: false,
        Descripcion: 'Establece los saldos iniciales de las sucursales o proyectos',
        Visitado: false,
        Orden: 8,
        OrdenAnterior: 7
      },
    );

    const user = this.authS.getUserFromToken();
    const expirado=this.authS.isTokenExpired()
    if (!user || expirado) {
      this.router.navigate(['auth/signin']);
      Swal.close()
      return;
    }
    this.usuario =user
    this.obtenerEmpresas();
    this.obtenerCorporaciones();
    this.obtenerAtributos();
    this.obtenerColecciones();

  }

  obtenerColecciones() {
    let Subscripcion: Subscription
    Subscripcion = this.conS.obtenerColecciones(this.usuario.idMatriz).subscribe((resp: any) => {
      Subscripcion.unsubscribe()
      console.log('resp', resp)
      this.Roles = resp[0]
      this.Usuarios = resp[1]
      this.SaldosIniciales = resp[2]
      this.Sucursales = resp[3]
      this.Proyectos = resp[4]

    })
  }

  obtenerAtributos() {
    this.authS.obtenerAtributos().subscribe((data: any) => {
      this.Atributos = data.map((atributo: any) => {
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

    let _Empresa = {
      Activo: true,
      Editando: false,
      FechaCreacion: this.EmpresaForm.value.FechaCreacion,
      Nombre: this.EmpresaForm.value.Nombre,
      idMatriz: this.usuario.idMatriz,
      ConfigInicial: false
    }

    this.Matrices[0].Empresas.push(_Empresa)
    const { id, result } = this.authS.crearEmpresabyMatriz(_Empresa);

    this.idEmpresaCreada = id;

    result
      .then((resp) => {
        Swal.fire({
          title: `Empresa creada`,
          text: 'Ahora procederemos a hacer la configuración inicial para esta nueva empresa, cargando.....',
          showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
    `
          },
          hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
    `
          },
          timer: 4000, // 5 segundos
          timerProgressBar: true, // Muestra una barra de tiempo opcional
          showConfirmButton: false // Oculta el botón de confirmación
        });
        //this.router.navigate([`config-inicial/${id}`]);

        setTimeout(() => {
          this.MostrarEmpresas = false;
        }, 4005);

      })
      .catch((error) => {
        console.error('Error creando empresa:', error);
      });


  }

  terminarConfigInicial() {
    Swal.fire({
      title: "¿Desea terminar la configuración inicial de esta empresa?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.authS.actualizarConfigInicialEmpresa(this.idEmpresaCreada).then((resp: any) => {
          Swal.fire({
            title: "Hecho",
            text: "Configuración terminada",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          });
         this.obtenerEmpresas()
        })
      }
    });
  }
  // ~Crear empresa


  toggleEdicion(Empresa: any) {

    Empresa.Editando = !Empresa.Editando;
  }
  actualizarEmpresa(empresa: any) {
    let _empresa = this.Empresas;

    const empresaEncontrada = _empresa.filter((empr: any) => empr.id == empresa.id);
    empresaEncontrada[0].Nombre = empresa.Nombre
    // bancoEncontrado[0].Cuenta=empresa.Cuenta
    // empresaEncontrada[0].idSucursal=empresa.idSucursal
    empresaEncontrada[0].Editando = !empresa.Editando;

    this.empS.actualizarEmpresa(empresaEncontrada[0]).then(resp => {
      this.toastr.success('Empresa editado', '¡Exito!');
    })
  }

  obtenerEmpresas() {
    let Subsciption: Subscription
    Subsciption = this.empS.obtenerEmpresa(this.usuario.idMatriz).subscribe(resp => {
      Subsciption.unsubscribe()
      this.Empresas = resp
      let EmpresaSinConfigInicial = this.Empresas.filter((emp: any) => emp.ConfigInicial == false)
      if (EmpresaSinConfigInicial.length > 0) {
        this.idEmpresaCreada = EmpresaSinConfigInicial[0].id
        this.NombreEmpresa = EmpresaSinConfigInicial[0].Nombre
        Swal.fire({
          title: `Recordatorio:`,
          text: 'Aun tienes empresas que les falta la configuración inicial, cargando.....',
          showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
    `
          },
          hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
    `
          },
          timer: 4000, // 5 segundos
          timerProgressBar: true, // Muestra una barra de tiempo opcional
          showConfirmButton: false // Oculta el botón de confirmación
        });
        setTimeout(() => {
          if (this.obtenerRolesByEmpresa().length == 0) {
            this.active = 0
            this.toastr.success('Te quedaste en la sección de Roles', 'Bienvenido de nuevo!', {
              timeOut: 2000,
              positionClass: 'toast-center-center'
            });
          }
          else if (this.obtenerUsuariosByEmpresa().length == 0) {
            this.active = 1
            this.toastr.success('Te quedaste en la sección de Usuarios', 'Bienvenido de nuevo!', {
              timeOut: 2000,
              positionClass: 'toast-center-center'
            });
          }
          else if (this.obtenerSaldosInicialesByEmpresa().length == 0) {
            this.active = 7
            this.toastr.success('Te quedaste en la sección de Saldos Iniciales', 'Bienvenido de nuevo!', {
              timeOut: 2000,
              positionClass: 'toast-center-center'
            });
          }
          else {
            this.active = 4
          }
          this.MostrarEmpresas = false;
        }, 4005);


      }
      else {
        this.MostrarEmpresas = true;
      }
      

      this.cargarFormulario()
    })
  }
  obtenerCorporaciones() {
    this.empS.obtenerCorporaciones(this.usuario.idMatriz).subscribe(resp => {
      this.Matrices = resp


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

  ActualizarEmpresaEstado(Empresa: any, Estado: boolean) {
    this.empS.ActualizarEmpresaEstado(Empresa, Estado).then(resp => {
      if (Estado == true) {
        this.toastr.success('Empresa activada', '¡Exito!');
      }
      else {
        this.toastr.success('Empresa desactivada', '¡Exito!');
      }
    })
  }

  actualizarEstadoFlujo(orden: any) {
    const paso = this.FlujoConfiguracion.find((item: any) => item.Orden === orden + 1);
    if (paso) {
      paso.Visitado = true;
      Swal.fire({
        title: `${paso.Descripcion}`,
        showClass: {
          popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
        },
        timer: 3000, // 5 segundos
        timerProgressBar: true, // Muestra una barra de tiempo opcional
        showConfirmButton: false // Oculta el botón de confirmación
      });
    }
  }

  onPasoCambiado(nuevoPaso: number) {

    this.irAlSiguientePaso(nuevoPaso)
  }

  obtenerRolesByEmpresa() {
    return this.Roles.filter((user: any) => user.idEmpresa == this.idEmpresaCreada);
  }
  guardarRolByEmpresa(Rol: any) {
    this.Roles.push(Rol);
  }
  guardarSucursalByEmpresa(Sucursal: any) {
    this.Sucursales.push(Sucursal);
  }
  guardarProyectoByEmpresa(Proyecto: any) {
    this.Proyectos.push(Proyecto);
  }

  obtenerUsuariosByEmpresa() {
    return this.Usuarios.filter((user: any) => user.idEmpresa == this.idEmpresaCreada);
  }
  guardarUsuarioByEmpresa(Usuario: any) {
    this.Usuarios.push(Usuario);
  }

  obtenerSaldosInicialesByEmpresa() {
    return this.SaldosIniciales.filter((user: any) => user.idEmpresa == this.idEmpresaCreada);
  }

  guardarSaldoInicialByEmpresa(saldos: any) {
    this.SaldosIniciales.push(saldos);
  }

  irAlSiguientePaso(orden: any) {
    if (orden == 1) {
      if (this.obtenerRolesByEmpresa().length == 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Debe de crear al menos un rol',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          this.active = orden - 1
        }, 250);
      } else {
        this.actualizarEstadoFlujo(orden);
        this.active = orden
        //nextCallback.emit();
      }
    } else if (orden == 4) {
      if (this.obtenerUsuariosByEmpresa().length == 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Debe de crear al menos un usuario',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          this.active = orden - 3
        }, 250);
      } else {
        this.actualizarEstadoFlujo(orden);
        this.active = orden

      }
    } else if (orden == 8) {
      if (this.obtenerSaldosInicialesByEmpresa().length == 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Debe de crear al menos un saldo inicial',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          this.active = orden - 1
        }, 250);
      } else {

        // this.actualizarEstadoFlujo(orden);
        Swal.fire({
          title: "¿Desea iniciar sesión con la nueva empresa?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Si",
          denyButtonText: `No, ir al home`
        }).then((result) => {
          this.conS.ActualizarEmpresa(this.idEmpresaCreada).then(resp => {

          })
          if (result.isConfirmed) {
            this.router.navigate([`auth/signin`]);
          } else if (result.isDenied) {
            this.router.navigate([`analytics`]);
          }
        });
        this.active = orden

      }
    }
    else {
      this.actualizarEstadoFlujo(orden);
      this.active = orden

    }
    this.PasoAnterior = orden;
  }




}
