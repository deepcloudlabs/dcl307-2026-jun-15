import CardTitle from "./card_title";
import {Link} from "react-router-dom";

export default function UserWins(props){
    return(
        <div className="container">
            <div className="card">
                <div className="card-header">Mastermind</div>
                <div className="card-body">
                    <h3>Tebrikler! Oyunu Kazandınız!</h3>
                    <p></p>
                    <Link to="/">Yeniden oynamak ister misin?</Link>
                </div>
            </div>
        </div>
    )
}
