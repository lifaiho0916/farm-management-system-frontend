import API from 'auth/FetchInterceptor'

const ToReceiveService = {}

ToReceiveService.getToReceiveById = async (id) => {
    try {
        const res = await API.get(`/toReceive/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToReceiveService.getToReceiveBySale = async (id) => {
    try {
        const res = await API.get(`/toReceives/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToReceiveService.createToReceive = async (data) => {
    try {
        const res = await API.post(`/toReceive`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToReceiveService.updatedToReceive = async (id, data) => {
    try {
        const res = await API.put(`/toReceive/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToReceiveService.deleteToReceive = async (id) => {
    try {
        const res = await API.delete(`/toReceive1/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default ToReceiveService;