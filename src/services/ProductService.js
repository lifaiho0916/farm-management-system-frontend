import API from 'auth/FetchInterceptor'

const ProductService = {}

ProductService.getAllProduct = async () => {
    try {
        const res = await API.get(`/products`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductService.getProductById = async (id) => {
    try {
        const res = await API.get(`/product/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductService.createProduct = async (data) => {
    try {
        const res = await API.post(`/product`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductService.updateProduct = async (id, data) => {
    try {
        const res = await API.put(`/product/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductService.deleteProduct = async (id) => {
    try {
        const res = await API.delete(`/product/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default ProductService;