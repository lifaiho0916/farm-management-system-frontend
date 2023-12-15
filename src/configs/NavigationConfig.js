import { DashboardOutlined, UserOutlined, TableOutlined, MoneyCollectOutlined, 
    ApartmentOutlined, FundOutlined, TeamOutlined, ShoppingCartOutlined, GiftOutlined, 
    CarryOutOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const navigationConfig = [
    {
        key: 'dashboards',
        path: `${APP_PREFIX_PATH}/dashboards`,
        title: 'sidenav.dashboard',
        icon: DashboardOutlined,
        breadcrumb: false,
        isGroupTitle: true,
        submenu: [
            {
                key: 'dashboards-default',
                path: `${APP_PREFIX_PATH}/dashboards/default`,
                title: 'sidenav.dashboard.default',
                icon: DashboardOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'users',
                path: `${APP_PREFIX_PATH}/users`,
                title: 'sidenav.users',
                icon: UserOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'farms',
                path: `${APP_PREFIX_PATH}/farms`,
                title: 'sidenav.farms',
                icon: TableOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'plots',
                path: `${APP_PREFIX_PATH}/plots`,
                title: 'sidenav.plots',
                icon: ApartmentOutlined,
                breadcrumb: false,
                submenu: []
            },
        ]
    },
    {
        key: 'crops',
        path: `${APP_PREFIX_PATH}/crops`,
        title: 'sidenav.crops',
        icon: CarryOutOutlined,
        breadcrumb: true,
        submenu: [
            {
                key: 'period',
                path: `${APP_PREFIX_PATH}/crops/period`,
                title: 'sidenav.period',
                icon: '',
                breadcrumb: true,
                submenu: []
            },
            {
                key: 'productCrops',
                path: `${APP_PREFIX_PATH}/crops/productCrops`,
                title: 'sidenav.productCrops',
                icon: '',
                breadcrumb: true,
                submenu: []
            },
        ]
    },
    {
        key: 'suppliers',
        path: `${APP_PREFIX_PATH}/suppliers`,
        title: 'sidenav.sales.purchase',
        icon: DashboardOutlined,
        breadcrumb: false,
        isGroupTitle: true,
        submenu: [
            {
                key: 'suppliers',
                path: `${APP_PREFIX_PATH}/suppliers`,
                title: 'sidenav.suppliers',
                icon: TeamOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'products',
                path: `${APP_PREFIX_PATH}/products`,
                title: 'sidenav.products',
                icon: GiftOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'sales',
                path: `${APP_PREFIX_PATH}/sales`,
                title: 'sidenav.sales',
                icon: FundOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'purchase',
                path: `${APP_PREFIX_PATH}/purchase`,
                title: 'sidenav.purchase',
                icon: ShoppingCartOutlined,
                breadcrumb: false,
                submenu: []
            },
            {
                key: 'procurement',
                path: `${APP_PREFIX_PATH}/procurement`,
                title: 'sidenav.procurement',
                icon: FileTextOutlined,
                breadcrumb: false,
                submenu: []
            },
        ]
    },
    {
        key: 'others',
        path: `${APP_PREFIX_PATH}/others`,
        title: 'sidenav.others',
        icon: SettingOutlined,
        breadcrumb: true,
        isGroupTitle: true,
        submenu: [
          {
            key: 'settings',
            path: `${APP_PREFIX_PATH}/settings`,
            title: 'sidenav.settings',
            icon: SettingOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'category',
                path: `${APP_PREFIX_PATH}/settings/category`,
                title: 'sidenav.category',
                icon: '',
                breadcrumb: true,
                submenu: []
              },
              {
                key: 'payMethod',
                path: `${APP_PREFIX_PATH}/settings/payMethod`,
                title: 'sidenav.payMethod',
                icon: '',
                breadcrumb: true,
                submenu: []
              },
              {
                key: 'unit',
                path: `${APP_PREFIX_PATH}/settings/unit`,
                title: 'sidenav.unit',
                icon: '',
                breadcrumb: true,
                submenu: []
              }
            ]
          },
          {
              key: 'pricing',
              path: `${APP_PREFIX_PATH}/pricing`,
              title: 'sidenav.pricing',
              icon: MoneyCollectOutlined,
              breadcrumb: false,
              submenu: []
          }
        ]
    },
]

export default navigationConfig;
