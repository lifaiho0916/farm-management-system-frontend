import Service from 'auth/FetchInterceptor'

const AuthService = {}

AuthService.login = async (data) => {
    try {
        const response = await Service.post('/auth/signin', data)
        return response.data
    } catch (err) {
        console.log(err)
    }
}

AuthService.register = async (data, navigate) => {
    try {
        const res = await Service.post('/auth/signup', data)
        return res
    } catch (err) {
        console.log(err)
    }
}

AuthService.logout = function () {
    return fetch({
        url: '/auth/signout',
        method: 'post'
    })
}


export default AuthService;