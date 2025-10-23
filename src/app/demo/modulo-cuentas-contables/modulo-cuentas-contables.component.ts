// angular import
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccordionModule } from 'primeng/accordion'; // project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeDragDropService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import Swal from 'sweetalert2';
import { TreeTableModule } from 'primeng/treetable';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-modulo-cuentas-contables',
  standalone: true,
  imports: [CommonModule, SharedModule, AccordionModule, NgSelectModule, TreeModule, NgbAccordionModule, InputSwitchModule, TreeTableModule, FloatLabelModule],
  templateUrl: './modulo-cuentas-contables.component.html',
  providers: [TreeDragDropService],
  styleUrls: ['./modulo-cuentas-contables.component.scss']
})
export default class ModuloCuentasContableComponent implements OnInit {
  NombreCuentaHijo: FormControl = new FormControl('');
  NombreCuentaNieto: FormControl = new FormControl('');
  Proyectos: any = [];
  ProyectosSeleccionados: any = [];
  ProyectosSeleccionadosFiltro: any = [];
  Sucursales: any = [];
  SucursalesSeleccionadas: any = [];
  SucursalesSeleccionadasFiltro: any = [];
  Categorias: any = [];
  CuentasPadres: any = [];
  CuentaPadreSeleccionada: any;
  CuentaHijoSeleccionada: any = null;
  CuentaNietoSeleccionada: any = null;
  CuentasHijos: any = [];
  CuentasHijosBack: any = [];
  CuentasNietos: any = [];
  CuentasNietosBack: any = [];
  usuario: any;
  idEmpresa: string = '';
  DataCatalogos: any = [];
  OpcionesTipoCuenta: any = [];
  CatalagoCuentasEmpresa: any = [];
  OpcionSeleccionada: any;
  cargando: boolean = true;
  TreeData: any = [];
  expandedKeys: any = [];
  selectedNode: any = [];
  activeIndex = 0;
  checkedHijo: boolean = true;
  anchoTabla: string = '70rem';
  mostrarOpcionesCuenta: boolean = true;
  @ViewChild('InputCuentaHijo', { static: false }) InputCuentaHijo!: ElementRef;
  @ViewChild('InputCuentaNieto', { static: false }) InputCuentaNieto!: ElementRef;
  @ViewChild('treeTable') treeTable: any;
  newRowId: string = '';
  constructor(
    private datePipe: DatePipe,
    private conS: ConfigurationService,
    private authS: AuthService,
    private toastr: ToastrService,
    private afs: AngularFirestore
  ) { }
  ngOnInit(): void {
    this.NombreCuentaHijo.disable();
    this.OpcionesTipoCuenta = [
      {
        Nombre: 'Ingreso',
        id: 1,
        Seleccionado: true
      },
      {
        Nombre: 'Egreso',
        id: 2,
        Seleccionado: false
      }
    ];
    this.conS.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      } else {
        this.usuario = JSON.parse(localStorage.getItem('usuarioFinancialSystems')!);
      }

      this.idEmpresa = this.usuario.idEmpresa;

      this.getCatalogos();
    });
  }

  getCatalogos() {
    this.conS.obtenerDataCatalogosEmpresa(this.usuario.idMatriz).subscribe((data: any) => {
      this.DataCatalogos = data;
      console.log('DataCatalogos', this.DataCatalogos);

      this.construirData();
    });
  }

  getCuentasPadres() {
    this.CuentaPadreSeleccionada = null;
    this.CuentaHijoSeleccionada = null;
    this.NombreCuentaHijo.setValue('');
    this.NombreCuentaHijo.disable();
    if (this.OpcionSeleccionada == 1) {
      this.CuentasPadres = this.Categorias.filter((categ: any) => categ.Tipo == 1);
    } else if (this.OpcionSeleccionada == 2) {
      this.CuentasPadres = this.Categorias.filter((categ: any) => categ.Tipo == 2);
    }
  }

  focusInput() {
    this.NombreCuentaHijo.enable();
    setTimeout(() => {
      if (this.InputCuentaHijo?.nativeElement) {
        this.InputCuentaHijo.nativeElement.focus();
      }
    });
  }

  filtradoProyectos()
  {

    let idsProyectos=
    this.ProyectosSeleccionadosFiltro.map((proyecto:any)=>proyecto.id)
    const idsProyectosSet = new Set(idsProyectos);
    if(idsProyectos.length>0){
      this.CuentasHijos = this.CuentasHijosBack.filter((cta: any) => {
      const tieneProyectos = cta.idsProyectos?.some((id: string) => idsProyectosSet.has(id));
      return tieneProyectos; // o || según necesites
      });
  
      this.CuentasNietos = this.CuentasNietosBack.filter((cta: any) => {
      const tieneProyectos = cta.idsProyectos?.some((id: string) => idsProyectosSet.has(id));
      return tieneProyectos; // o || según necesites
      });

    }

    else
    {
      this.CuentasNietos = this.CuentasNietosBack
      this.CuentasHijos = this.CuentasHijosBack

    }
  this.NombreCuentaHijo.setValue('')  
  this.ProyectosSeleccionados=[]
  this.SucursalesSeleccionadas=[]
    this.construirTreeData()
  }
  filtradoSucursales()
  {
    let idsSucursales=
    this.SucursalesSeleccionadasFiltro.map((proyecto:any)=>proyecto.id)

    const idsSucursalesSet = new Set(idsSucursales);

    if(idsSucursales.length>0){
      this.CuentasHijos = this.CuentasHijosBack.filter((cta: any) => {
      const tieneSucursales = cta.idsSucursales?.some((id: string) => idsSucursalesSet.has(id));
      return tieneSucursales; // o || según necesites
      });
  
      this.CuentasNietos = this.CuentasNietosBack.filter((cta: any) => {
      const tieneSucursales = cta.idsSucursales?.some((id: string) => idsSucursalesSet.has(id));
      return tieneSucursales; // o || según necesites
      });

    }

    else
    {
      this.CuentasNietos = this.CuentasNietosBack
      this.CuentasHijos = this.CuentasHijosBack

    }
  this.NombreCuentaHijo.setValue('')  
  this.ProyectosSeleccionados=[]
  this.SucursalesSeleccionadas=[]
  this.construirTreeData()
  }

  construirData() {
    let DataEmpresa = this.DataCatalogos.filter((data: any) => data.idEmpresa == this.idEmpresa)[0];
    this.Categorias = DataEmpresa.Categorias;
    this.CuentasPadres = this.Categorias.filter((categ: any) => categ.Tipo == 1 || categ.Tipo == 2);
    this.CatalagoCuentasEmpresa = DataEmpresa.CatalogoCuentasEmpresa;
    this.Proyectos = DataEmpresa.Proyectos;
    this.Sucursales = DataEmpresa.Sucursales;
    this.CuentasHijos = DataEmpresa._CuentasContables;
    this.CuentasHijosBack = DataEmpresa._CuentasContables;
    this.CuentasHijos.forEach((cuenta: any) => {
      cuenta.CuentasNieto.forEach((cuentaNieto: any) => {
        this.CuentasNietos.push(cuentaNieto);
        this.CuentasNietosBack.push(cuentaNieto);
      });
    });

    this.construirTreeData();
  }
  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  // guardarCuentaHijo() {
  //   if (this.CuentaHijoSeleccionada) {
  //     let idsProyectos = this.ProyectosSeleccionados.map((proyecto: any) => proyecto.id)
  //     let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)


  //     this.CatalagoCuentasEmpresa[0].CuentasHijos
  //       .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
  //       .Alias = this.NombreCuentaHijo.value

  //     this.CatalagoCuentasEmpresa[0].CuentasHijos
  //       .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
  //       .Nombre = this.CuentaHijoSeleccionada.Prefijo + ' ' + this.NombreCuentaHijo.value

  //     this.CatalagoCuentasEmpresa[0].CuentasHijos
  //       .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
  //       .idsProyectos = idsProyectos

  //     this.CatalagoCuentasEmpresa[0].CuentasHijos
  //       .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
  //       .idsSucursales = idsSucursales

  //     this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
  //       this.expandedKeys.push(this.CuentaHijoSeleccionada.idAbuelo);
  //       this.expandedKeys.push(this.CuentaHijoSeleccionada.idPadre);
  //       this.expandedKeys.push(this.CuentaHijoSeleccionada.id);
  //       this.NombreCuentaHijo.setValue('');
  //       this.NombreCuentaHijo.disable();
  //       this.CuentaHijoSeleccionada = null
  //       this.CuentaPadreSeleccionada = null
  //       this.ProyectosSeleccionados = []
  //       this.SucursalesSeleccionadas = []
  //       this.construirTreeData();
  //       this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
  //         timeOut: 2000,
  //         positionClass: 'toast-center-center'
  //       });
  //     });


  //   }
  //   else {
  //     const currentDate = new Date();
  //     const hours = currentDate.getHours();
  //     const minutes = currentDate.getMinutes();
  //     const ampm = hours >= 12 ? 'PM' : 'AM';
  //     const formattedHour = hours % 12 || 12;
  //     let idsProyectos = this.ProyectosSeleccionados.map((proyect: any) => proyect.id);
  //     let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id);
  //     let Orden: any = this.CuentasHijos.filter((it: any) => it.idPadre == this.CuentaPadreSeleccionada.id).length;

  //     if (this.NombreCuentaHijo.value == '') {
  //       this.toastr.warning('Debe colocar el nombre de la cuenta', '¡Alerta!', {
  //         timeOut: 2000,
  //         positionClass: 'toast-center-center'
  //       });
  //     }

  //     let Item: any = {
  //       Activo: this.checkedHijo,
  //       TipoProforma: 1,
  //       Nombre: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1) + ' ' + this.NombreCuentaHijo.value,
  //       Prefijo: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1),
  //       PrefijoPadre: Number(this.CuentaPadreSeleccionada.idCateg),
  //       PrefijoHijo: Orden + 1,
  //       CuentaFija: false,
  //       TipoCuenta: this.CuentaPadreSeleccionada.Tipo,
  //       Alias: this.NombreCuentaHijo.value,
  //       FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
  //       HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
  //       Tipo: 'Hijo',
  //       idPadre: this.CuentaPadreSeleccionada.id,
  //       idsSucursales: idsSucursales,
  //       idsProyectos: idsProyectos,
  //       idAbuelo: this.CuentaPadreSeleccionada.idAbuelo,
  //       Customizable: true,
  //       Editable: false,
  //       Orden: Orden + 1,
  //       OrdenReal: this.CuentasHijos.length + 1,
  //       idEmpresa: this.idEmpresa,
  //       idCorporacion: this.usuario.idMatriz,
  //       Created_User: this.usuario.id
  //     };

  //     console.log('Item', Item)

  //     const id = this.afs.createId();
  //     Item.id = id;

  //     this.CuentasHijos.push(Item);
  //     this.CatalagoCuentasEmpresa[0].CuentasHijos.push(Item);
  //     this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
  //       this.expandedKeys.push(Item.idAbuelo);
  //       this.expandedKeys.push(Item.idPadre);
  //       this.expandedKeys.push(Item.id);
  //       this.NombreCuentaHijo.setValue('');
  //       this.construirTreeData();
  //       this.toastr.success('Se guardó la cuenta contable', '¡Éxito!', {
  //         timeOut: 2000,
  //         positionClass: 'toast-center-center'
  //       });
  //     });
  //   }
  // }




  addCuentaHijo() {
   if(!this.CuentaHijoSeleccionada) 
   {
     const newItemId = 'new-item-' + Date.now();
     const id = this.afs.createId();
     const currentDate = new Date();
     const hours = currentDate.getHours();
     const minutes = currentDate.getMinutes();
     const ampm = hours >= 12 ? 'PM' : 'AM';
     const formattedHour = hours % 12 || 12;
     let idsProyectos = this.ProyectosSeleccionados.map((proyect: any) => proyect.id);
     let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id);
     let Orden: any = this.CuentasHijos.filter((it: any) => it.idPadre == this.CuentaPadreSeleccionada.id).length;
 
     let Item: any =
     {
       Activo: true,
       TipoProforma: 1,
       Nombre: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1) + ' ' + this.NombreCuentaHijo.value,
       Prefijo: this.CuentaPadreSeleccionada.idCateg + '.' + (Orden + 1),
       PrefijoPadre: Number(this.CuentaPadreSeleccionada.idCateg),
       PrefijoHijo: Orden + 1,
       CuentaFija: false,
       TipoCuenta: this.CuentaPadreSeleccionada.Tipo,
       Alias: this.NombreCuentaHijo.value,
       FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
       HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
       Tipo: 'Hijo',
       id: id,
       idPadre: this.CuentaPadreSeleccionada.id,
       idsSucursales: idsSucursales,
       idsProyectos: idsProyectos,
       idAbuelo: this.CuentaPadreSeleccionada.idAbuelo,
       Customizable: true,
       Editable: false,
       Orden: Orden + 1,
       OrdenReal: this.CuentasHijos.length + 1,
       idEmpresa: this.idEmpresa,
       idCorporacion: this.usuario.idMatriz,
       Created_User: this.usuario.id
     }
 
     
     this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
       this.CuentasHijos.push(Item);
       this.CatalagoCuentasEmpresa[0].CuentasHijos.push(Item);
       this.expandedKeys.push(this.CuentaPadreSeleccionada.idAbuelo);
       this.expandedKeys.push(Item.idPadre);
       this.expandedKeys.push(Item.id);
       this.NombreCuentaHijo.setValue('')
       this.construirTreeData()
   
       setTimeout(() => {
         this.scrollToNewInput(Item.id);
       }, 100);
       this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
         timeOut: 2000,
         positionClass: 'toast-center-center'
       });
     });
   }
   else 
   {
    console.log('CuentaHijo', this.CuentaHijoSeleccionada)
    
      let idsProyectos = this.ProyectosSeleccionados.map((proyecto: any) => proyecto.id)
      let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)


      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .Alias = this.NombreCuentaHijo.value

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .Nombre = this.CuentaHijoSeleccionada.Prefijo + ' ' + this.NombreCuentaHijo.value

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .idsProyectos = idsProyectos

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .idsSucursales = idsSucursales

      this.CatalagoCuentasEmpresa[0].CuentasHijos
        .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)
        .Activo = this.checkedHijo

      let CuentaEditada=this.CatalagoCuentasEmpresa[0].CuentasHijos
      .find((ch: any) => ch.id == this.CuentaHijoSeleccionada.id)

      const indice = this.CuentasHijos.findIndex(item => item.id 
        === CuentaEditada.id);
      if (indice !== -1) {
      this.CuentasHijos[indice] = CuentaEditada; // ← ¡Actualizado!
      }
      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
        this.expandedKeys.push(this.CuentaHijoSeleccionada.idAbuelo);
        this.expandedKeys.push(this.CuentaHijoSeleccionada.idPadre);
        this.expandedKeys.push(this.CuentaHijoSeleccionada.id);
        this.NombreCuentaHijo.setValue('');
        this.CuentaHijoSeleccionada = null
        this.CuentaPadreSeleccionada = null
        this.ProyectosSeleccionados = []
        this.SucursalesSeleccionadas = []
        this.construirTreeData();
        this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
          timeOut: 2000,
          positionClass: 'toast-center-center'
        });
      });
    
    


   }
  }

  addCuentaNieto(cuentaHijo:any){
     const id = this.afs.createId();
     const currentDate = new Date();
     const hours = currentDate.getHours();
     const minutes = currentDate.getMinutes();
     const ampm = hours >= 12 ? 'PM' : 'AM';
     const formattedHour = hours % 12 || 12;
    let idsProyectos = this.Proyectos.map((proyect: any) => proyect.id)
    let idsSucursales = this.Sucursales.map((sucursal: any) => sucursal.id)
    let cuentaSeleccionada=this.CuentasHijos.find((cuenta:any)=>cuenta.id==cuentaHijo.id)
    let Orden: any = this.CuentasNietos.filter((it: any) => it.idHijo == cuentaSeleccionada.id).length+1;

  let CuentaNieto = {
          Activo:true,
          id:id,
          Nombre: "",
          Prefijo: cuentaSeleccionada.Prefijo + '.' + Orden,
          PrefijoPadre: cuentaSeleccionada.PrefijoPadre,
          PrefijoHijo: cuentaSeleccionada.Prefijo,
          Alias: "",
          CuentaFija:false,
          FechaCreacion: this.datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd'),
          HoraCreacion: formattedHour + ':' + this.padZero(minutes) + ' ' + ampm,
          Tipo: 'Nieto',
          idPadre: cuentaSeleccionada.idPadre,
          idAbuelo: cuentaSeleccionada.idAbuelo,
          idHijo: cuentaSeleccionada.id,
          idsProyectos: idsProyectos,
          idsSucursales: idsSucursales,
          Editable: true,
          Orden:Orden,
          OrdenReal: this.CuentasNietos.length + 1,
          idEmpresa: this.idEmpresa,
          idCorporacion: this.usuario.idMatriz,
          Created_User: this.usuario.id
  };
  
       this.CuentasNietos.push(CuentaNieto);
       this.CatalagoCuentasEmpresa[0].CuentasNietos.push(CuentaNieto);
       this.expandedKeys.push(CuentaNieto.idAbuelo);
       this.expandedKeys.push(CuentaNieto.idPadre);
       this.expandedKeys.push(CuentaNieto.idHijo);
       this.construirTreeData()
      setTimeout(() => {
      if (this.InputCuentaNieto?.nativeElement) {
        this.InputCuentaNieto.nativeElement.focus();
      }
    });
       
  
       setTimeout(() => {
         this.scrollToNewInput(CuentaNieto.id);
       }, 100);

       console.log('CuentaNieto',CuentaNieto)
  }

  guardarCuentaNieto(cuenta:any){
    console.log('cuenta',cuenta)
    let cuentaNieto=this.CatalagoCuentasEmpresa[0].CuentasNietos.find((cuentaNieto:any)=>cuentaNieto.id==cuenta.id)

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == cuentaNieto.id)
        .Alias = cuenta.data.Alias

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == cuentaNieto.id)
        .Nombre = cuentaNieto.Prefijo + ' ' + cuenta.data.Alias

      let CuentaEditada=this.CatalagoCuentasEmpresa[0].CuentasNietos
      .find((ch: any) => ch.id == cuentaNieto.id)

      CuentaEditada.Editable=false

      const indice = this.CuentasNietos.findIndex(item => item.id 
        === CuentaEditada.id);
      if (indice !== -1) {
      this.CuentasNietos[indice] = CuentaEditada; // ← ¡Actualizado!
      }

      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
       this.expandedKeys.push(cuentaNieto.idAbuelo);
       this.expandedKeys.push(cuentaNieto.idPadre);
       this.expandedKeys.push(cuentaNieto.idHijo);
       this.construirTreeData()
        this.NombreCuentaHijo.setValue('');
        this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
          timeOut: 2000,
          positionClass: 'toast-center-center'
        });
      });

 


    console.log('cuentaNieto',cuentaNieto)
    console.log('CatalagoCuentasEmpresa',this.CatalagoCuentasEmpresa[0])
  }

  editarCuentaNieto(){
    console.log('cuenta',this.CuentaNietoSeleccionada)
    let idsProyectos = this.ProyectosSeleccionados.map((proyecto: any) => proyecto.id)
    let idsSucursales = this.SucursalesSeleccionadas.map((sucursal: any) => sucursal.id)

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == this.CuentaNietoSeleccionada.id)
        .Alias = this.NombreCuentaHijo.value

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == this.CuentaNietoSeleccionada.id)
        .Nombre = this.CuentaNietoSeleccionada.Prefijo + ' ' + this.NombreCuentaHijo.value

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == this.CuentaNietoSeleccionada.id)
        .idsProyectos = idsProyectos

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == this.CuentaNietoSeleccionada.id)
        .idsSucursales = idsSucursales

      this.CatalagoCuentasEmpresa[0].CuentasNietos
        .find((ch: any) => ch.id == this.CuentaNietoSeleccionada.id)
        .Activo = this.checkedHijo

      let CuentaEditada=this.CatalagoCuentasEmpresa[0].CuentasNietos
      .find((ch: any) => ch.id == this.CuentaNietoSeleccionada.id)

      const indice = this.CuentasNietos.findIndex(item => item.id 
        === CuentaEditada.id);
      if (indice !== -1) {
      this.CuentasNietos[indice] = CuentaEditada; // ← ¡Actualizado!
      }
      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
        this.expandedKeys.push(this.CuentaNietoSeleccionada.idAbuelo);
        this.expandedKeys.push(this.CuentaNietoSeleccionada.idPadre);
        this.expandedKeys.push(this.CuentaNietoSeleccionada.idHijo);
        this.construirTreeData();
        this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
          timeOut: 2000,
          positionClass: 'toast-center-center'
        });
      });    

  }




  nodeSelect(event: any) {
    console.log('event', event)
    this.NombreCuentaHijo.setValue('')
    if (event.node.Tipo == 'Padre') {
      this.CuentaHijoSeleccionada = null
      this.CuentaNietoSeleccionada = null
      this.CuentaPadreSeleccionada = this.CuentasPadres.find((padre: any) => padre.id == event.node.id)
      this.NombreCuentaHijo.enable();
      this.InputCuentaHijo.nativeElement.focus();
      this.toastr.success(`Ya puedes crear una cuenta hijo en ${this.CuentaPadreSeleccionada.Nombre} `, '¡Listo!', {
        timeOut: 2000,
        positionClass: 'toast-center-center'
      });
      console.log('CuentaPadreSeleccionada', this.CuentaPadreSeleccionada)
    }

    else if (event.node.Tipo == 'Hijo') 
    {
      this.CuentaPadreSeleccionada = null
      this.CuentaNietoSeleccionada = null
      this.CuentaHijoSeleccionada = this.CuentasHijos.find((hijo: any) => hijo.id == event.node.id)
      console.log('CuentaHijoSeleccionada', this.CuentaHijoSeleccionada)
      this.NombreCuentaHijo.setValue(this.CuentaHijoSeleccionada.Alias);
      this.NombreCuentaHijo.enable();
      this.checkedHijo=this.CuentaHijoSeleccionada.Activo
      this.InputCuentaHijo.nativeElement.focus();
      this.InputCuentaHijo.nativeElement.select();
      this.ProyectosSeleccionados = this.getProyectosByCuenta(this.CuentaHijoSeleccionada.idsProyectos);
      this.SucursalesSeleccionadas = this.getSucursalesByCuenta(this.CuentaHijoSeleccionada.idsSucursales);
    }
    else if (event.node.Tipo == 'Nieto') 
    {
      this.CuentaPadreSeleccionada = null
      this.CuentaHijoSeleccionada = null
      this.CuentaNietoSeleccionada = this.CuentasNietos.find((hijo: any) => hijo.id == event.node.id)
      console.log('CuentaNietoSeleccionada', this.CuentaNietoSeleccionada)
      this.NombreCuentaHijo.setValue(this.CuentaNietoSeleccionada.Alias);
      this.NombreCuentaHijo.enable();
      this.checkedHijo=this.CuentaNietoSeleccionada.Activo
      this.InputCuentaHijo.nativeElement.focus();
      this.InputCuentaHijo.nativeElement.select();
      this.ProyectosSeleccionados = this.getProyectosByCuenta(this.CuentaNietoSeleccionada.idsProyectos);
      this.SucursalesSeleccionadas = this.getSucursalesByCuenta(this.CuentaNietoSeleccionada.idsSucursales);
    }


  }
  nodeUnselect(event: any) {
    console.log('eventUnselect', event)
  }

  guardarCuentaHijo(Cuenta: any) {
    console.log('CuentaHijoSeleccionada',!this.CuentaHijoSeleccionada)
    // this.CatalagoCuentasEmpresa[0].CuentasHijos
    //   .find((ch: any) => ch.id == Cuenta.id)
    //   .Alias = Cuenta.data.Alias

    // this.CatalagoCuentasEmpresa[0].CuentasHijos
    //   .find((ch: any) => ch.id == Cuenta.id)
    //   .Nombre = Cuenta.Prefijo + ' '
    //   + Cuenta.data.Alias

    // this.CuentasHijos
    //   .find((ch: any) => ch.id == Cuenta.id).Editable = false

    // this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => {
    //   this.construirTreeData();
    //   this.toastr.success('Se actualizó la cuenta contable', '¡Éxito!', {
    //     timeOut: 2000,
    //     positionClass: 'toast-center-center'
    //   });
    // });




  }
  private scrollToNewInput(itemId: string) {
    setTimeout(() => {
      const element = document.querySelector(`[data-item-id="${itemId}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 150);
  }





  getCuentasPadre(idAbuelo: string) {
    let _CuentasPadre: any = [];
    this.Categorias.filter((cuentaPadre: any) => cuentaPadre.idAbuelo == idAbuelo).forEach((cuenta) => {
      _CuentasPadre.push({
        key: `${idAbuelo}-${cuenta.id}`,
        Orden: cuenta.Orden,
        id: cuenta.id,
        Tipo: 'Padre',
        Editable: false,
        droppable: false,
        draggable: false,
        label: cuenta.Nombre,
        idCateg: cuenta.idCateg,
        idAbuelo: cuenta.idAbuelo,
        TipoCuenta: cuenta.Tipo,
        expanded: this.verificarExpanded(cuenta.id),
        data: {
          id: cuenta.id,
          name: cuenta.Nombre,
          AddCuenta: false,
          Activo:cuenta.Activo,
          Editable: false,
          Texto: '+ Cuenta Hijo',
          Tipo: 'Padre',
        },
        icon: 'pi pi-fw pi-inbox',
        children: this.getCuentasHijo(cuenta.id).sort((a, b) => a.Orden - b.Orden)
      });
    });

    return _CuentasPadre;
  }

  getCuentasHijo(idPadre: string) {
    let _CuentasHijo: any = [];
    this.CuentasHijos.filter((cuentaHijo: any) => cuentaHijo.idPadre == idPadre).forEach((cuenta) => {
      _CuentasHijo.push({
        key: `${cuenta.idAbuelo}-${idPadre}-${cuenta.id}`,
        keyPadre: `${cuenta.idAbuelo}-${idPadre}`,
        id: cuenta.id,
        Orden: cuenta.Orden,
        Prefijo: cuenta.Prefijo,
        PrefijoPadre: cuenta.PrefijoPadre,
        Tipo: 'Hijo',
        TipoCuenta: cuenta.TipoCuenta,
        Editable: cuenta.Editable,
        label: cuenta.Nombre,
        idPadre: cuenta.idPadre,
        droppable: false,
        data: {
          name: cuenta.Nombre,
          id: cuenta.id,
          Tipo: 'Hijo',
          Activo:cuenta.Activo,
          AddCuenta: true,
          Editable: false,
          Texto: '+ Sub Cuenta'
        },
        icon: 'pi pi-fw pi-inbox',
        expanded: this.verificarExpanded(cuenta.id),
        children: this.getCuentasNieto(cuenta.id).sort((a, b) => a.Orden - b.Orden)
      });
    });

    return _CuentasHijo;
  }
  getCuentasNieto(idHijo: string) {
    let _CuentasNieto: any = [];
    this.CuentasNietos.filter((cuentaHijo: any) => cuentaHijo.idHijo == idHijo).forEach((cuenta: any) => {
      _CuentasNieto.push({
        key: `${cuenta.idAbuelo}-${cuenta.idPadre}-${idHijo}-${cuenta.id}`,
        keyHijo: `${cuenta.idAbuelo}-${cuenta.idPadre}-${idHijo}`,
        id: cuenta.id,
        Orden: cuenta.Orden,
        Tipo: 'Nieto',
        Editable: false,
        label: cuenta.Nombre,
        data: {
          name: cuenta.Nombre,
          AddCuenta: false,
          id: cuenta.id,
          Tipo: 'Nieto',
          Editable: cuenta.Editable,

        },
        droppable: false,
        icon: 'pi pi-fw pi-inbox'
      });
    });

    return _CuentasNieto;
  }

  verificarExpanded(idElemento: any) {
    return this.expandedKeys.filter((exp: any) => exp == idElemento).length > 0 ? true : false;
  }

  construirTreeData() {
    // limpia completamente la referencia
    this.TreeData = [];
    this.TreeData = this.Categorias.filter((abuelo: any) => abuelo.Tipo == 3).map((cuenta: any) => ({
      key: cuenta.id,
      id: cuenta.id,
      label: cuenta.Nombre,
      Tipo: 'Abuelo',
      Editable: false,
      droppable: false,
      draggable: false,
      expanded: this.verificarExpanded(cuenta.id),
      data: {
        name: cuenta.Nombre,
        AddCuenta: false,
        Editable: false,
        Tipo: 'Padre',
      },
      icon: 'pi pi-fw pi-inbox',
      children: this.getCuentasPadre(cuenta.id).sort((a, b) => a.Orden - b.Orden)
    }));

    console.log('TreeData', this.TreeData)
    this.cargando = false;
  }

  activeIndexChange(index: any) {
    this.activeIndex = index;
  }

  cambiarEstadoCuentaHijo() {
    if (this.CuentaHijoSeleccionada) {

      this.CatalagoCuentasEmpresa[0].CuentasHijos.find((cuenta: any) => cuenta.id == this.CuentaHijoSeleccionada.id).Activo =
        this.checkedHijo;
      this.conS.ActualizarCatalogoEmpresa(this.CatalagoCuentasEmpresa[0]).then((resp) => { });
    }
  }

  getProyectosByCuenta(idsProyectos: any) {
    if (idsProyectos.length > 0) {
      return this.Proyectos.filter((proyecto: any) => idsProyectos.includes(proyecto.id));
    } else {
      return [];
    }
  }
  getSucursalesByCuenta(idsSucursales: any) {
    if (idsSucursales.length > 0) {
      return this.Sucursales.filter((sucursal: any) => idsSucursales.includes(sucursal.id));
    } else {
      return [];
    }
  }

  onNodeSelected(event: any) {
    console.log('event', event)
    this.NombreCuentaHijo.setValue('')
    if (event.node.Tipo == 'Padre') {
      this.CuentaPadreSeleccionada = this.CuentasPadres.find((padre: any) => padre.id == event.node.id)
      this.NombreCuentaHijo.enable();
      this.InputCuentaHijo.nativeElement.focus();
      console.log('CuentaPadreSeleccionada', this.CuentaPadreSeleccionada)
    }
    else if (event.node.Tipo == 'Hijo') {
      Swal.fire({
        title: "¿Que desea hacer?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Editar esta cuenta",
        cancelButtonText: "Crear Sub Cuenta Contable"
      }).then((result) => {
        if (result.isConfirmed) {
          this.CuentaHijoSeleccionada = this.CuentasHijos.find((hijo: any) => hijo.id == event.node.id)
          console.log('CuentaHijoSeleccionada', this.CuentaHijoSeleccionada)
          this.ProyectosSeleccionados = this.getProyectosByCuenta(this.CuentaHijoSeleccionada.idsProyectos);
          this.SucursalesSeleccionadas = this.getSucursalesByCuenta(this.CuentaHijoSeleccionada.idsSucursales);
          this.NombreCuentaHijo.enable();
          this.NombreCuentaHijo.setValue(this.CuentaHijoSeleccionada.Alias)
          this.InputCuentaHijo.nativeElement.focus();
        }
      });
    }
    else if (event.node.Tipo == 'Nieto') {
      Swal.fire({
        title: "¿Que desea hacer?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Editar esta cuenta",
        cancelButtonText: "Crear Sub Cuenta Contable"
      }).then((result) => {
        if (result.isConfirmed) {
          this.CuentaHijoSeleccionada = this.CuentasHijos.find((hijo: any) => hijo.id == event.node.id)
          console.log('CuentaHijoSeleccionada', this.CuentaHijoSeleccionada)
          this.ProyectosSeleccionados = this.getProyectosByCuenta(this.CuentaHijoSeleccionada.idsProyectos);
          this.SucursalesSeleccionadas = this.getSucursalesByCuenta(this.CuentaHijoSeleccionada.idsSucursales);
          this.NombreCuentaHijo.enable();
          this.NombreCuentaHijo.setValue(this.CuentaHijoSeleccionada.Alias)
          this.InputCuentaHijo.nativeElement.focus();
        }
      });
    }
  }

  onNodeDrop(event: any) {
    const { dragNode, dropNode, dropPoint, accept } = event;

    console.log('event', event);
    let KeydragNode = event.dragNode.Tipo == 'Hijo' ? event.dragNode.keyPadre : event.dragNode.keyHijo;
    let KeydropNode = event.dropNode.Tipo == 'Hijo' ? event.dropNode.keyPadre : event.dropNode.keyHijo;

    // Evitar drop dentro del nodo
    if (dropPoint === 'node') return;
    // Solo permitir si tienen el mismo keyHijo
    if (KeydragNode === KeydropNode) {
      // ✅ permitido
      if (typeof accept === 'function') accept();
    } else {
      this.toastr.warning('La cuenta no debe moverse fuera de su flujo', '¡Alerta!', {
        timeOut: 2000,
        positionClass: 'toast-center-center'
      });
    }
  }
}
