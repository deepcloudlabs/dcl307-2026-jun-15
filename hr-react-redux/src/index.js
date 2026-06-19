import React from 'react';
import ReactDOM from 'react-dom/client';
import EmployeeDetails from "./component/employee-details";
import 'bootstrap/dist/css/bootstrap.css';
import {Provider} from "react-redux";
import HrAppConnector from "./hr/HrAppConnector";
import HrAppReducer from "./hr/HrAppReducer";
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {BrowserRouter, Route, Routes} from "react-router";

// Combine reducers
const rootReducer = combineReducers({
    hrStore: HrAppReducer
});

// Create Redux store with Redux Toolkit
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

let routing = <Routes>
    <Route path="/" element={<HrAppConnector/>}></Route>
    <Route path="/details/:identityNo" element={<EmployeeDetails/>}></Route>
</Routes>;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            {routing}
        </BrowserRouter>
    </Provider>
);
