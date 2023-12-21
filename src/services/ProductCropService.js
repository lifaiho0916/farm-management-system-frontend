import API from 'auth/FetchInterceptor'

const ProductCropService = {}

ProductCropService.getProductCropsByFarm = async (id) => {
    try {
        const res = await API.get(`productCrops/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductCropService.createProductCrop = async (data) => {
    try {
        const res = await API.post(`/productCrop`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductCropService.getProductCropById = async (id) => {
    try {
        const res = await API.put(`/productCrop/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductCropService.updateProductCrop = async (id, data) => {
    try {
        const res = await API.put(`/productCrop/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

ProductCropService.deleteProductCrop = async (id) => {
    try {
        const res = await API.delete(`/productCrop/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default ProductCropService;