import API from 'auth/FetchInterceptor'

const UserService = {}

UserService.authUser = async () => {
    try {
        const res = await API.get('/user/me')
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UserService.getUsersByAdmin = async (userId) => {
    try {
        const res = await API.get(`/users/${userId}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default UserService;