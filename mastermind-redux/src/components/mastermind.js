import React, {useEffect} from "react";
import GameStatistics from "./statistics";
import CardTitle from "./card_title";
import Badge from "./badge";
import Move from "../model/move";
import {useNavigate} from "react-router";

// stateful -> stateless
export default function Mastermind({game, handleInputGuess, play}) {
    const navigate = useNavigate();
    useEffect(() => {
        if (game.status === "PLAYER_WINS") {
            navigate("/wins");
            return;
        }
        if (game.status === "PLAYER_LOSES") {
            navigate("/loses");
            return;
        }
    }, [navigate]);
    let tableMoves = "";
    if (game.moves.length > 0) {
        tableMoves = <table className="table table-striped table-hover table-responsive table-bordered">
            <thead>
            <tr>
                <th>Guess</th>
                <th>Message</th>
            </tr>
            </thead>
            <tbody>{
                game.moves.map((move, index) =>
                    <tr key={move.guess * index}>
                        <td>{move.guess}</td>
                        <td>{move.evaluation.evalString}</td>
                    </tr>
                )
            }</tbody>
        </table>;
    }
    let badgeTries = "";
    if (game.tries > 0) {
        badgeTries = <Badge label="Tries" value={game.tries}/>
    }
    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <CardTitle title="Game Console"/>
                </div>
                <div className="card-body">
                    <Badge label="Game Level" value={game.gameLevel}/>
                    {badgeTries}
                    <Badge label="Secret" value={game.secret}/>
                    <div className="form-group">
                        <label htmlFor="guess">Guess: </label>
                        <input type="number"
                               id="guess"
                               value={game.guess}
                               onChange={handleInputGuess}
                               className="form-control"></input>
                    </div>
                    <div className="form-group">
                        <button onClick={play}
                                className="btn btn-success">Play
                        </button>
                    </div>
                    <p></p>
                    <div className="form-group">
                        {tableMoves}
                    </div>
                </div>
            </div>
            <p></p>
            <GameStatistics stats={game.statistics}/>
        </div>
    );
}
