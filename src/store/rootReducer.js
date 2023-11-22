import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import user from "./slices/userSlice"
import farm from "./slices/farmSlice"
import subscription from "./slices/subscriptionSlice";

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        user,
        farm,
        subscription,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
