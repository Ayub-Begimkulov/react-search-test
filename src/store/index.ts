import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { searchReducer } from "./reducer";

const rootReducer = combineReducers({
  search: searchReducer,
});

export type IAppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
