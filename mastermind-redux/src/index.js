import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import UserWins from "./components/user-wins";
import UserLoses from "./components/user-loses";
import {Route} from "react-router-dom"
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import GameReducer from "./reducers/game_reducer";
import MastermindConnector from "./components/mastermind_connector";
import {BrowserRouter, Routes} from "react-router";
// reducer: function -> state change
//          i) stateless ii) pure/high-order function -> does not have side-effects
//          inputs: 2 parameters: 1) state 2) action -> event -> command
//          output: return new state

// Combine reducers
const rootReducer = combineReducers({
    gameStore: GameReducer,
});

// Create Redux store with Redux Toolkit
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

// 1. Mastermind --> stateful function component
// 2. Feature: 1 min
const routing = (
    <Provider store={store}>
        <Routes>
            <Route path="/" element={<MastermindConnector></MastermindConnector>}></Route>
            <Route path="/wins" element={<UserWins></UserWins>}></Route>
            <Route path="/loses" element={<UserLoses></UserLoses>}></Route>
        </Routes>
    </Provider>
)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <BrowserRouter>
            {routing}
        </BrowserRouter>
    </Provider>
);
