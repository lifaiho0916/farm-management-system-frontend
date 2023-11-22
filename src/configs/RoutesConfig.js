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