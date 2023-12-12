import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import user from "./slices/userSlice"
import farm from "./slices/farmSlice"
import plot from "./slices/plotSlice"
import supplier from "./slices/supplierSlice"
import productCrop from "./slices/productCropSlice"
import subscription from "./slices/subscriptionSlice";

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        user,
        farm,
        plot,
        supplier,
        productCrop,
        subscription,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
