import { DashboardOutlined, UserOutlined, TableOutlined, MoneyCollectOutlined, ApartmentOutlined, FundOutlined, TeamOutlined, ShoppingCartOutlined, GiftOutlined, CarryOutOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
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
            }
        ]
    },
    {
        key: 'users',
        path: `${APP_PREFIX_PATH}/users`,
        title: 'sidenav.users',
        icon: UserOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'farms',
        path: `${APP_PREFIX_PATH}/farms`,
        title: 'sidenav.farms',
        icon: TableOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'plots',
        path: `${APP_PREFIX_PATH}/plots`,
        title: 'sidenav.plots',
        icon: ApartmentOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'crops',
        path: `${APP_PREFIX_PATH}/crops`,
        title: 'sidenav.crops',
        icon: CarryOutOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'productCrops',
        path: `${APP_PREFIX_PATH}/productCrops`,
        title: 'sidenav.productCrops',
        icon: FundOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'suppliers',
        path: `${APP_PREFIX_PATH}/suppliers`,
        title: 'sidenav.suppliers',
        icon: TeamOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'procurement',
        path: `${APP_PREFIX_PATH}/procurement`,
        title: 'sidenav.procurement',
        icon: ShoppingCartOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'products',
        path: `${APP_PREFIX_PATH}/products`,
        title: 'sidenav.products',
        icon: GiftOutlined,
        breadcrumb: true,
        submenu: []
    },
    {
        key: 'pricing',
        path: `${APP_PREFIX_PATH}/pricing`,
        title: 'sidenav.pricing',
        icon: MoneyCollectOutlined,
        breadcrumb: true,
        submenu: []
    }
]

export default navigationConfig;
