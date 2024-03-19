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
      id: 'configuracion',
      title: 'Configuración',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'flujos',
          title: 'Flujos Financieros',
          type: 'item',
          url: '/flujos',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-money-bill-trend-up',
       
          breadcrumbs: false
        },
        {
          id: 'bancos',
          title: 'Bancos',
          type: 'item',
          url: '/bancos',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-building-columns',
       
          breadcrumbs: false
        },
        {
          id: 'empresa',
          title: 'Empresa',
          type: 'item',
          url: '/empresas',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-building',
       
          breadcrumbs: false
        },
        {
          id: 'sucursales',
          title: 'Sucursales',
          type: 'item',
          url: '/sucursales',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-store',
       
          breadcrumbs: false
        },
        {
          id: 'socios',
          title: 'Socios de negocios',
          type: 'item',
          url: '/socios',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-user-tie',
       
          breadcrumbs: false
        },
        {
          id: 'item',
          title: 'Items',
          type: 'item',
          url: '/item',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-list',
       
          breadcrumbs: false
        },
        {
          id: 'item',
          title: 'Crear Registro',
          type: 'item',
          url: '/registros',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-file-pen',
       
          breadcrumbs: false
        },
        {
          id: 'departamentos',
          title: 'Departamentos',
          type: 'item',
          url: '/departamentos',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-file-invoice',
       
          breadcrumbs: false
        },
        {
          id: 'signin',
          title: 'Sign in',
          type: 'item',
          url: '/auth/signin',
          // icon: 'feather icon-log-in',
          icon: 'fa-solid fa-right-to-bracket',
          target: true,
          breadcrumbs: false
        }
      ]
    },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/auth/signup',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/auth/signin',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms',
        title: 'Basic Elements',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];
