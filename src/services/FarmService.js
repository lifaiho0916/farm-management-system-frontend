import API from 'auth/FetchInterceptor'

const FarmService = {}

FarmService.getFarmByUser = async () => {
    try {
        const res = await API.get('/user-farm')
        return res;
    } catch (err) {
        console.log(err)
    }
    return undefined
}

FarmService.getFarmsByAdmin = async (userId) => {
    try {
        const res = await API.get(`/farms/${userId}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

FarmService.createFarm = async (data) => {
    try {
        const res = await API.post(`/farm`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

FarmService.deleteFarm = async (id) => {
    try {
        const res = await API.delete(`/farm/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

FarmService.updateFarm = async (id, data) => {
    try {
        const res = await API.put(`/farm/${id}`, data);
        return res;
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default FarmService;