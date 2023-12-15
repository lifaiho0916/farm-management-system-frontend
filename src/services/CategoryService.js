import API from 'auth/FetchInterceptor'

const CategoryService = {}

CategoryService.getAllCategory = async () => {
    try {
        const res = await API.get(`/categories`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CategoryService.getCategoryById = async (id) => {
    try {
        const res = await API.get(`/category/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CategoryService.createCategory = async (data) => {
    try {
        const res = await API.post(`/category`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CategoryService.updateCategory = async (id, data) => {
    try {
        const res = await API.put(`/category/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

CategoryService.deleteCategory = async (id) => {
    try {
        const res = await API.delete(`/category/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default CategoryService;