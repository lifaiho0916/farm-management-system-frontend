import Service from 'auth/FetchInterceptor'

const AuthService = {}

AuthService.login = function (data) {
    return Service.post('/auth/signin', data)
}

AuthService.register = function (data) {
    return Service.post('/auth/signup', data)
}

AuthService.logout = function () {
    return fetch({
        url: '/auth/signout',
        method: 'post'
    })
}


export default AuthService;