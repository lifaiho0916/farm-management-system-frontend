import { DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const userNavigationConfig = [
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
        key: 'farm',
        path: `${APP_PREFIX_PATH}/farm`,
        title: 'sidenav.farm',
        icon: UserOutlined,
        breadcrumb: true,
        submenu: []
    }
]

export default userNavigationConfig;
