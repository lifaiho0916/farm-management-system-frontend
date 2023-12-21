import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import user from "./slices/userSlice"
import farm from "./slices/farmSlice"
import plot from "./slices/plotSlice"
import supplier from "./slices/supplierSlice"
import productCrop from "./slices/productCropSlice"
import productSale from "./slices/productSaleSlice"
import crop from "./slices/cropSlice"
import product from "./slices/productSlice"
import category from "./slices/categorySlice"
import payMethod from "./slices/payMethodSlice"
import unit from "./slices/unitSlice"
import purchase from "./slices/purchaseSlice"
import toReceive from "./slices/toReceiveSlice";
import toPay from "./slices/toPaySlice";
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
        productSale,
        toReceive,
        toPay,
        crop,
        product,
        category,
        payMethod,
        unit,
        purchase,
        subscription,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
