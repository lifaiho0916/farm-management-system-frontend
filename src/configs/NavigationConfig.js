import { DashboardOutlined, UserOutlined, TableOutlined, MoneyCollectOutlined } from '@ant-design/icons';
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
        key: 'pricing',
        path: `${APP_PREFIX_PATH}/pricing`,
        title: 'sidenav.pricing',
        icon: MoneyCollectOutlined,
        breadcrumb: true,
        submenu: []
    }
]

export default navigationConfig;
