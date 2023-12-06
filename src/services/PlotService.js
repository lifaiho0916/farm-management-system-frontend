import API from 'auth/FetchInterceptor'

const PlotService = {}

PlotService.getPlotsByFarm = async (id) => {
    try {
        const res = await API.get(`farm-plots/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PlotService.createPlot = async (data) => {
    try {
        const res = await API.post(`/plot`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PlotService.updatePlot = async (id, data) => {
    try {
        const res = await API.put(`/plot/${id}`, data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

PlotService.deletePlot = async (id) => {
    try {
        const res = await API.delete(`/plot/${id}`)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default PlotService;