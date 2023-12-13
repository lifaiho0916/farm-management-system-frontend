import API from 'auth/FetchInterceptor'

const CropService = {}

CropService.getCropsByFarm = async (id) => {
    try {
        const res = await API.get(`crops/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CropService.createCrop = async (data) => {
    try {
        const res = await API.post(`/crop`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CropService.updateCrop = async (id, data) => {
    try {
        const res = await API.put(`/crop/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CropService.deleteCrop = async (id) => {
    try {
        const res = await API.delete(`/crop/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default CropService;