import API from 'auth/FetchInterceptor'

const PayMethodService = {}

PayMethodService.getAllPayMethod = async () => {
    try {
        const res = await API.get(`/payMethods`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PayMethodService.createPayMethod = async (data) => {
    try {
        const res = await API.post(`/payMethod`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PayMethodService.updatePayMethod = async (id, data) => {
    try {
        const res = await API.put(`/payMethod/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PayMethodService.deletePayMethod = async (id) => {
    try {
        const res = await API.delete(`/payMethod/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default PayMethodService;