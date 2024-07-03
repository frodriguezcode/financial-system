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
          id: 'planeacion',
          title: 'Planeación Financiera',
          type: 'item',
          url: '/planeacion',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-business-time',
       
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
          id: 'item',
          title: 'Crear Registro',
          type: 'item',
          url: '/registros',
          // icon: 'feather icon-bold',
          icon: 'fa-solid fa-file-pen',
       
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
          title: 'Sign in',
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
