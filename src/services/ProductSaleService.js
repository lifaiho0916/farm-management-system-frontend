import API from 'auth/FetchInterceptor'

const ProductSaleService = {}

ProductSaleService.getProductSalesByFarm= async (id) => {
    try {
        const res = await API.get(`productSales/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductSaleService.createProductSale = async (data) => {
    try {
        const res = await API.post(`/productSale`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductSaleService.getProductSaleById = async (id) => {
    try {
        const res = await API.get(`/productSale/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductSaleService.updateProductSale = async (id, data) => {
    try {
        const res = await API.put(`/productSale/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductSaleService.deleteProductSale = async (id) => {
    try {
        const res = await API.delete(`/productSale/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default ProductSaleService;