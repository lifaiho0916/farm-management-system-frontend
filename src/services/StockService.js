import API from 'auth/FetchInterceptor'

const StockService = {}

StockService.getStocksByAdmin = async (id) => {
    try {
        const res = await API.get(`/stocks/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

StockService.getStockById = async (id) => {
    try {
        const res = await API.get(`/stock/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

StockService.createStock = async (data) => {
    try {
        const res = await API.post(`/stock`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

StockService.updateStock = async (id, data) => {
    try {
        const res = await API.put(`/stock/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

StockService.deleteStock = async (id) => {
    try {
        const res = await API.delete(`/stock/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default StockService;