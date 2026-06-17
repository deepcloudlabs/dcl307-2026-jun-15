import {type ChangeEventHandler, useEffect, useState} from "react";
import LotteryTable from "./components/lottery/LotteryTable.tsx";
import InputNumber from "./components/common/InputNumber.tsx";
import Button from "./components/common/Button.tsx";

const initialLotteryNumbers: number[][] = [
    [4, 8, 15, 16, 23, 42],
    [10, 20, 30, 40, 50, 60]
];

export default function FunctionalApp() {
    const [lotteryNumbers, setLotteryNumbers] = useState<number[][]>(initialLotteryNumbers);
    const [rows, setRows] = useState<number>(1);


    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setRows(Number(event.target.value));
    }

    useEffect(() => {
        const timerId = setInterval(() => {
            setRows(previousRows => previousRows + 1);
        }, 3_000)
        console.log(`Component mounted!`);

        return () => {
            if (timerId !== null)
                clearInterval(timerId);
            console.log(`Component unmounted!`);
        };
    });


    const createLotteryNumbers = (max: number = 60, size: number = 6): number[] => {
        const numbers: number[] = [];
        while (numbers.length < size) {
            const number = Math.floor(Math.random() * max) + 1;
            if (!numbers.includes(number))
                numbers.push(Math.floor(Math.random() * max) + 1);
        }
        numbers.sort((a, b) => a - b);
        return numbers;
    }

    const draw = () => {
        setLotteryNumbers(prevLotteryNumbers => {
            const nextLotteryNumbers = [...prevLotteryNumbers];
            new Array(rows).fill(0).forEach(
                () => nextLotteryNumbers.push(createLotteryNumbers(60, 6))
            )
            return nextLotteryNumbers;
        });
    }

    const reset = () => {
        setLotteryNumbers([]);
    }


    return (
        <>
            <h2>Functional Stateful Component</h2>
            <InputNumber value={rows} onChange={handleChange} label={"Row"} name={"n"}/>
            <Button id={"draw"} onClick={draw} label={"Draw"}/>
            <Button id={"reset"} color={"btn-danger"} onClick={reset} label={"Reset"}/>
            <LotteryTable lotteryNumbers={lotteryNumbers}/>
        </>
    );

}

