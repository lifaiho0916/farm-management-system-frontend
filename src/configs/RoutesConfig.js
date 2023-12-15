import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
    {
        key: 'register',
        path: `${AUTH_PREFIX_PATH}/register`,
        component: React.lazy(() => import('views/auth-views/authentication/register')),
    },
    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    }
]

export const protectedRoutes = [
    {
        key: 'dashboard.default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/dashboards/default')),
    },
    {
        key: 'users',
        path: `${APP_PREFIX_PATH}/users`,
        component: React.lazy(() => import('views/app-views/users')),
    },
    {
        key: 'farms',
        path: `${APP_PREFIX_PATH}/farms`,
        component: React.lazy(() => import('views/app-views/farms')),
    },
    {
        key: 'plots',
        path: `${APP_PREFIX_PATH}/plots`,
        component: React.lazy(() => import('views/app-views/plots')),
    },
    {
        key: 'period',
        path: `${APP_PREFIX_PATH}/crops/period`,
        component: React.lazy(() => import('views/app-views/crops/period')),
    },
    {
        key: 'productCrops',
        path: `${APP_PREFIX_PATH}/crops/productCrops`,
        component: React.lazy(() => import('views/app-views/crops/productCrops')),
    },
    {
        key: 'suppliers',
        path: `${APP_PREFIX_PATH}/suppliers`,
        component: React.lazy(() => import('views/app-views/suppliers')),
    },
    {
        key: 'procurement',
        path: `${APP_PREFIX_PATH}/procurement`,
        component: React.lazy(() => import('views/app-views/procurement')),
    },
    {
        key: 'purchase',
        path: `${APP_PREFIX_PATH}/purchase`,
        component: React.lazy(() => import('views/app-views/purchase')),
    },
    {
        key: 'products',
        path: `${APP_PREFIX_PATH}/products`,
        component: React.lazy(() => import('views/app-views/products')),
    },
    {
        key: 'category',
        path: `${APP_PREFIX_PATH}/settings/category`,
        component: React.lazy(() => import('views/app-views/settings/category')),
    },
    {
        key: 'payMethod',
        path: `${APP_PREFIX_PATH}/settings/payMethod`,
        component: React.lazy(() => import('views/app-views/settings/payMethod')),
    },
    {
        key: 'unit',
        path: `${APP_PREFIX_PATH}/settings/unit`,
        component: React.lazy(() => import('views/app-views/settings/unit')),
    },
    {
        key: 'setting',
        path: `${APP_PREFIX_PATH}/setting/*`,
        component: React.lazy(() => import('views/app-views/setting')),
    },
    {
        key: 'pricing',
        path: `${APP_PREFIX_PATH}/pricing`,
        component: React.lazy(() => import('views/app-views/pricing')),
    },
]

export const userProtectedRoutes = [
    {
        key: 'dashboard.default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/dashboards/default')),
    },
    {
        key: 'farm',
        path: `${APP_PREFIX_PATH}/farm`,
        component: React.lazy(() => import('views/app-views/farm')),
    },
    {
        key: 'setting',
        path: `${APP_PREFIX_PATH}/setting/*`,
        component: React.lazy(() => import('views/app-views/setting')),
    },
]