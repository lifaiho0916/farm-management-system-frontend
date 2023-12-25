import API from 'auth/FetchInterceptor'

const PurchaseService = {}

PurchaseService.getPurchaseByFarm = async (id) => {
    try {
        const res = await API.get(`purchases/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseService.getPurchaseByAdmin = async (id) => {
    try {
        const res = await API.get(`purchasesAdmin/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseService.getPurchaseById = async (id) => {
    try {
        const res = await API.get(`purchase/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseService.createPurchase = async (data) => {
    try {
        const res = await API.post(`/purchase`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseService.updatePurchase = async (id, data) => {
    try {
        const res = await API.put(`/purchase/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseService.deletePurchase = async (id) => {
    try {
        const res = await API.delete(`/purchase1/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default PurchaseService;