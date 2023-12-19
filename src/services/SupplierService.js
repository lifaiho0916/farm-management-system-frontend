import API from 'auth/FetchInterceptor'

const SupplierService = {}

SupplierService.getSuppliersByFarm = async (id) => {
    try {
        const res = await API.get(`suppliers/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SupplierService.getSupplierById = async (id) => {
    try {
        const res = await API.get(`supplier/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SupplierService.createSupplier = async (data) => {
    try {
        const res = await API.post(`/supplier`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SupplierService.updateSupplier = async (id, data) => {
    try {
        const res = await API.put(`/supplier/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SupplierService.deleteSupplier = async (id) => {
    try {
        const res = await API.delete(`/supplier1/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default SupplierService;