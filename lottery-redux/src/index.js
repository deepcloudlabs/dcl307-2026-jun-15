import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
//import LotteryConnector from "./component/LotteryConnector";
import LotteryReducer from "./component/LotteryReducer";
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import 'bootstrap/dist/css/bootstrap.css';
import LotteryContainer from "./component/LotteryContainer";

const rootReducer = combineReducers({
    lotteryStore: LotteryReducer
});
// Create Redux store with Redux Toolkit
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
            <LotteryContainer/>
    </Provider>
);
