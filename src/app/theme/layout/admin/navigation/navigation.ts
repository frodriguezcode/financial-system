export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
    {
      id: 'administracion',
      title: 'Administracion',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'item',
          title: 'Registros',
          type: 'item',
          url: '/registros',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-file-pen',
       
          breadcrumbs: false
        },
        {
          id: 'flujos',
          title: 'Flujo de Efectivo',
          type: 'item',
          url: '/flujos',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-money-bill-trend-up',
       
          breadcrumbs: false
        },
        {
          id: 'planeacion',
          title: 'Planeación Financiera',
          type: 'item',
          url: '/planeacion',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-business-time',
       
          breadcrumbs: false
        },
        {
          id: 'manager-recapt-mensual',
          title: 'Manager Recapt',
          type: 'item',
          url: '/manager-recapt',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-magnifying-glass-chart',
       
          breadcrumbs: false
        },
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/analytics',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-chart-line',
       
          breadcrumbs: false
        },
    
        {
          id: 'roles',
          title: 'Roles',
          type: 'item',
          url: '/roles',
          // icon: 'feather icon-log-in',
          icon: 'fa-solid fa-lock',
          target: false,
          breadcrumbs: false
        }
    
    ,
        {
          id: 'signin',
          title: 'Salir',
          type: 'item',
          url: '/auth/signin',
          // icon: 'feather icon-log-in',
          icon: 'fa-solid fa-right-to-bracket',
          target: false,
          breadcrumbs: false
        }
      ]
    },
  {
    id: 'configuracion',
    title: 'Configuración',
    type: 'group',
    icon: 'fa-solid fa-building',
    children: [
      {
        id: 'empresas',
        title: 'Empresas',
        type: 'item',
        url: 'empresas',
        icon: 'fa-solid fa-building',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'sucursales',
        title: 'Sucursales',
        type: 'item',
        url: 'sucursales',
        icon: 'fa-solid fa-building-flag',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'proyectos',
        title: 'Proyectos',
        type: 'item',
        url: 'Proyectos',
        icon: 'fa-solid fa-diagram-project',
        target: false,
        breadcrumbs: false
      }
      ,
      {
        id: 'usuarios',
        title: 'Usuarios',
        type: 'item',
        url: 'Usuarios',
        icon: 'fa-solid fa-users',
        target: false,
        breadcrumbs: false
      }
      ,
      {
        id: 'cuenta_contable',
        title: 'Cuentas Contables',
        type: 'item',
        url: 'item',
        icon: 'fa-solid fa-list',
        target: false,
        breadcrumbs: false
      }
      ,
      {
        id: 'cuenta_banco',
        title: 'Cuentas Bancarias',
        type: 'item',
        url: 'bancos',
        icon: 'fa-solid fa-table-list',
        target: false,
        breadcrumbs: false
      }
      ,
      {
        id: 'socios_negocio',
        title: 'Socios de Negocio',
        type: 'item',
        url: 'socios',
        icon: 'fa-solid fa-users-rectangle',
        target: false,
        breadcrumbs: false
      }
    ]
  },
  // {
  //   id: 'chart',
  //   title: 'Chart',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'apexchart',
  //       title: 'ApexChart',
  //       type: 'item',
  //       url: '/chart',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart'
  //     }
  //   ]
  // },
  // {
  //   id: 'forms & tables',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms',
  //       title: 'Basic Elements',
  //       type: 'item',
  //       url: '/forms',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'tables',
  //       type: 'item',
  //       url: '/tables',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar'
  //     },
  //     {
  //       id: 'menu-level',
  //       title: 'Menu Levels',
  //       type: 'collapse',
  //       icon: 'feather icon-menu',
  //       children: [
  //         {
  //           id: 'menu-level-2.1',
  //           title: 'Menu Level 2.1',
  //           type: 'item',
  //           url: 'javascript:',
  //           external: true
  //         },
  //         {
  //           id: 'menu-level-2.2',
  //           title: 'Menu Level 2.2',
  //           type: 'collapse',
  //           children: [
  //             {
  //               id: 'menu-level-2.2.1',
  //               title: 'Menu Level 2.2.1',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             },
  //             {
  //               id: 'menu-level-2.2.2',
  //               title: 'Menu Level 2.2.2',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
];
