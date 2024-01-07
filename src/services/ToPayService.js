import API from 'auth/FetchInterceptor'

const ToPayService = {}

ToPayService.getToPayById = async (id) => {
    try {
        const res = await API.get(`/toPay/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToPayService.getToPayByPurchase = async (id) => {
    try {
        const res = await API.get(`/toPays/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToPayService.createToPay = async (data) => {
    try {
        const res = await API.post(`/toPay`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToPayService.updatedToPay = async (id, data) => {
    try {
        const res = await API.put(`/toPay/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ToPayService.deleteToPay = async (id) => {
    try {
        const res = await API.delete(`/toPay/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default ToPayService;