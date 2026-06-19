import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Lottery from "./Lottery";

export default function LotteryContainer() {
    const lottery = useSelector((state) => state.lotteryStore);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        dispatch({ type: "COLUMN_CHANGED", value: Number(event.target.value) });
    };

    const draw = () => dispatch({ type: "DRAW" });
    const reset = () => dispatch({ type: "RESET" });

    const removeLotteryNumbers = (index) => {
        dispatch({ type: "REMOVE_LOTTERY_NUMBERS", value: index });
    };

    return (
        <Lottery
            lottery={lottery}
            handleChange={handleChange}
            draw={draw}
            reset={reset}
            removeLotteryNumbers={removeLotteryNumbers}
        />
    );
}
