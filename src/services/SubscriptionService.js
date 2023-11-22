import API from 'auth/FetchInterceptor'

const SubscriptionService = {}

SubscriptionService.updatePayment = async (data) => {
    try {
        const res = await API.post('/subscription/update-payment', data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SubscriptionService.getCardInfo = async () => {
    try {
        const res = await API.get('/subscription/card-info')
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SubscriptionService.getSubscription = async () => {
    try {
        const res = await API.get('/subscription')
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

SubscriptionService.subscribe = async (data) => {
    try {
        const res = await API.post('/subscription', data)
        return res
    } catch (err) {
        console.log(err)
    }
    return undefined
}

export default SubscriptionService;