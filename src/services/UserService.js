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

UserService.createUser = async (data) => {
    try {
        const res = await API.post(`/user`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UserService.deleteUser = async (id) => {
    try {
        const res = await API.delete(`/user/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UserService.updateUser = async (id, data) => {
    try {
        const res = await API.put(`/user/${id}`, data);
        return res;
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UserService.AssignFarm = async (data) => {
    try {
        const res = await API.post('/user/assign-farm', data)
        return res;
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default UserService;