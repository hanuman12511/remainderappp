import { combineReducers } from "redux";
import buyerShowReducer from "./buyerShowSlice";
import homeReducer from "./homeSlice";
import sellerShowReducer from "./sellerShowSlice";
import userDetailReducer from "./userDetailSlice";

const rootReducer = combineReducers({
    homeState: homeReducer,
    buyerShowState: buyerShowReducer,
    sellerShowState: sellerShowReducer,
    userDetailState: userDetailReducer,
});

export default rootReducer