import API from 'auth/FetchInterceptor'

const UnitService = {}

UnitService.getAllUnit = async () => {
    try {
        const res = await API.get(`/units`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UnitService.getUnitById = async (id) => {
    try {
        const res = await API.get(`/unit/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UnitService.createUnit = async (data) => {
    try {
        const res = await API.post(`/unit`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UnitService.updateUnit = async (id, data) => {
    try {
        const res = await API.put(`/unit/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

UnitService.deleteUnit = async (id) => {
    try {
        const res = await API.delete(`/unit1/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default UnitService;