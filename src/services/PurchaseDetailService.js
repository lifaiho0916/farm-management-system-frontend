import API from 'auth/FetchInterceptor'

const PurchaseDetailService = {}

PurchaseDetailService.getPurchaseDetailByPurchase = async (id) => {
    try {
        const res = await API.get(`purchaseDetails/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseDetailService.createPurchaseDetail = async (data) => {
    try {
        const res = await API.post(`/purchaseDetail`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseDetailService.updatePurchaseDetail = async (id, data) => {
    try {
        const res = await API.put(`/purchaseDetail/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PurchaseDetailService.deletePurchaseDetail = async (id) => {
    try {
        const res = await API.delete(`/purchaseDetail/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default PurchaseDetailService;