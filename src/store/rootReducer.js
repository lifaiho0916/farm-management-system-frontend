import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import user from "./slices/userSlice"
import farm from "./slices/farmSlice"
import plot from "./slices/plotSlice"
import supplier from "./slices/supplierSlice"
import productCrop from "./slices/productCropSlice"
import crop from "./slices/cropSlice"
import product from "./slices/productSlice"
import category from "./slices/categorySlice"
import payMethod from "./slices/payMethodSlice"
import unit from "./slices/unitSlice"
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
        crop,
        product,
        category,
        payMethod,
        unit,
        subscription,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
