import API from 'auth/FetchInterceptor'

const AuthService = {}

AuthService.login = async (data) => {
    try {
        const res = await API.post('/auth/signin', data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

AuthService.register = async (data) => {
    try {
        const res = await API.post('/auth/signup', data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

AuthService.changePassword = async (data) => {
    try {
        const res = await API.post('/auth/change-password', data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default AuthService;