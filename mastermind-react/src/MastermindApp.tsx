import * as React from "react";
import {type ChangeEventHandler, type MouseEventHandler, useEffect} from "react";
import ProgressBar from "./components/common/ProgressBar.tsx";
import Container from "./components/common/Container.tsx";
import Card from "./components/common/Card.tsx";
import Table from "./components/common/Table.tsx";
import InputText from "./components/common/InputText.tsx";
import Button from "./components/common/Button.tsx";

type Move = {
    guess: number;
    evaluation: string;
    perfectMatch: number;
    partialMatch: number;
};

function evaluateMove(guess: number, secret: number): Move {
    const guessAsString = guess.toString();
    const secretAsString = secret.toString();
    let perfectMatch = 0;
    let partialMatch = 0;
    for (let i = 0; i < guessAsString.length; i++) {
        const g = guessAsString.charAt(i);
        for (let j = 0; j < secretAsString.length; j++) {
            const s = secretAsString.charAt(j);
            if (s === g) {
                if (i === j) {
                    perfectMatch++;
                } else {
                    partialMatch++;
                }
            }
        }
    }
    let evaluation = "";
    if (perfectMatch === 0 && partialMatch === 0) {
        evaluation = "No match"!
    }
    if (partialMatch > 0) {
        evaluation = `-${partialMatch}`;
    }
    if (perfectMatch > 0) {
        evaluation = `${evaluation}+${perfectMatch}`;
    }
    return {
        "perfectMatch": perfectMatch,
        "partialMatch": partialMatch,
        "evaluation": evaluation,
        "guess": guess
    }
}

function createDigit(min: number = 0, max: number = 9) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createSecret(level: number): number {
    const digits = [createDigit(1)];
    while (digits.length < level) {
        const digit = createDigit();
        if (!digits.includes(digit)) {
            digits.push(digit);
        }
    }
    return Number(digits.join(""));
}

const initialSecret = createSecret(3);

function MastermindApp() {
    const [gameLevel, setGameLevel] = React.useState<number>(3);
    const [lives, setLives] = React.useState<number>(3);
    const [counter, setCounter] = React.useState<number>(60);
    const [maxCount, setMaxCount] = React.useState<number>(60);
    const [moves, setMoves] = React.useState<Move[]>([]);
    const [maxMoves, setMaxMoves] = React.useState<number>(10);
    const [secret, setSecret] = React.useState<number>(initialSecret);
    const [guess, setGuess] = React.useState<number>(123);

    useEffect(() => {
        const timerId = setInterval(() => {
            setCounter(prevCounter => prevCounter - 1);
        }, 1_000);
        return () => {
            clearInterval(timerId);
        };
    })

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setGuess(Number(e.target.value));
    };

    const play: MouseEventHandler<HTMLButtonElement> = () => {
        if (guess === secret) {
            setMoves([]);
            setGameLevel(level => level + 1);
            setMaxCount(prevMaxCount => prevMaxCount + 10);
            setMaxMoves(prevMaxMoves => prevMaxMoves + 4);
            setCounter(maxCount + 10);
            setLives(prevLives => prevLives + 1);
            setSecret(createSecret(gameLevel + 1));
        } else {
            const move = evaluateMove(guess, secret);
            setMoves(prevMoves => [...prevMoves, move]);
        }
    };

    return (
        <Container>
            <Card title={"Mastermind Game Console"}>
                <div className="form-group mb-3">
                    <label className={"form-label"}>Game Level:</label>
                    <span className="badge bg-success">{gameLevel}</span>
                </div>
                <div className="form-group mb-3">
                    <label>Lives: </label>
                    <span className="badge bg-success">{lives}</span>
                </div>
                <div className="form-group mb-3">
                    <label>Counter: </label>
                    <span className="badge bg-success">{counter}</span>
                </div>
                <div className="form-group mb-3">
                    <ProgressBar max={maxCount}
                                 min={0}
                                 value={counter}/>
                </div>
                <div className="form-group mb-3">
                    <label>Moves: </label>
                    <div className="badge bg-success">{moves.length}</div>
                    <span> out of </span> <div className="badge bg-danger">{maxMoves}</div>
                </div>
                <div className="form-group mb-3">
                    <label className={"form-label"}
                           htmlFor={"guess"}>Guess: </label>
                    <InputText id="guess" label="Guess" value={guess} handleChange={handleChange} explain="Enter your guess" />
                    <Button label="Play" click={play} color="btn-success" />
                </div>
            </Card>
            <Card title={"Moves"}>
                <Table
                    values={moves}
                    headers={["Guess", "Perfect Match", "Partial Match", "Evaluation"]}
                    fields={["guess", "perfectMatch", "partialMatch", "evaluation"]}
                    keyField="guess"
                />
            </Card>
        </Container>
    )
}

export default MastermindApp
