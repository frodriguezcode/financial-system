// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import SignInComponent from './demo/authentication/sign-in/sign-in.component';
import SignUpComponent from './demo/authentication/sign-up/sign-up.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import ConfiguracionInicialComponent from './demo/configuracion-inicial/configuracion-inicial.component';
import PlanesComponent from './demo/authentication/planes/planes.component';
import RecoverPassw from './demo/authentication/recover-passw/recover-passw.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/signin', // Redirigir la ruta raíz a SignInComponent
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: '/analytics',
      //   pathMatch: 'full'
      // },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'bancos',
        loadComponent: () => import('./demo/bancos/bancos.component')
      },
      {
        path: 'sucursales',
        loadComponent: () => import('./demo/sucursales/sucursales.component')
      },
      {
        path: 'Proyectos',
        loadComponent: () => import('./demo/proyectos/proyectos.component')
      },
      {
        path: 'empresas',
        loadComponent: () => import('./demo/empresas/empresas.component')
      },
      {
        path: 'Usuarios',
        loadComponent: () => import('./demo/crear-usuario/crear-usuario.component')
      },
      {
        path: 'departamentos',
        loadComponent: () => import('./demo/departamentos/departamentos.component')
      },
      {
        path: 'item',
        loadComponent: () => import('./demo/Items/items.component')
      },
      {
        path: 'socios',
        loadComponent: () => import('./demo/socios/socios.component')
      },
      {
        path: 'flujos',
        loadComponent: () => import('./demo/flujos/panel-flujos/flujos-panel.component')
      },
      {
        path: 'manager-recapt',
        loadComponent: () => import('./demo/manager-recap-admin/manager-recap-admincomponent')
      },
      {
        path: 'roles',
        loadComponent: () => import('./demo/roles/roles.component')
      },
      {
        path: 'planeacion',
        loadComponent: () => import('./demo/flujos/planeacion-financiera-mejorada/planeacion-financiera-mejorada.component')
      },
      {
        path: 'planeacion-antigua',
        loadComponent: () => import('./demo/flujos/planeacion-financiera/planeacion-financiera.component')
      },
      {
        path: 'registros',
        loadComponent: () => import('./demo/registros/panel-registros/panel-registros.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      }
    ]
  },

  {
    path: 'auth/signin',
    component:SignInComponent
  },
  {
    path: 'auth/recover/:idUsuario',
    component:RecoverPassw
  },
  {
    path: 'configuracion-inicial',
    component:ConfiguracionInicialComponent
  },
  {
    path: 'auth/signin/signup/:idPlan',
    component:SignUpComponent
  },
  {
    path: 'auth/signin/planes',
    component:PlanesComponent
  },
  // {
  //   path: '',
  //   component: GuestComponent,
  //   children: [
  //     {
  //       path: 'auth/signup',
  //       loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
  //     },
  //     {
  //       path: 'auth/signin',
  //       loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
