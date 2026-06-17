import {type ChangeEventHandler, Component} from "react";

type State = {
    lotteryNumbers: number[][],
    n: number
};
// Stateful Component
// Since 2018 -> Stateles/Stateful Component -> functional component
// State management: Root component -> Component
// Stateless Component -> Context API + Reducer API
export default class App extends Component<object, State> {
    timerId: number | null = null;

    constructor(props: object) {
        super(props);
        this.state = {
            lotteryNumbers: [],
            n: 42
        };
        console.log(`Constructor: ${this.state.n}`);
    }


    handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({
            n: Number(event.target.value)
        }, () => {
            console.log(`State has changed: ${this.state.n}`)
        })
        console.log(`After setState(): ${this.state.n}`)
    }


    componentDidMount() {
        this.timerId = setInterval(() => {
            this.setState({
                n: this.state.n + 1
            });
        }, 3_000)
        console.log(`Component mounted!`);
    }


    componentWillUnmount() {
        if (this.timerId !== null)
            clearInterval(this.timerId);
        console.log(`Component unmounted!`);
    }

    draw = () => {}
    reset = () => {}

    render() {
        return (
            <>
                <label htmlFor={"n"}>Rows: </label>
                <input type={"number"}
                       id={"n"}
                       name={"n"}
                       onChange={this.handleChange}
                       value={this.state.n}/>
                <button id={"draw"}
                        onClick={this.draw}>Draw</button>
                <button id={"reset"}
                        onClick={this.reset} >Reset</button>
            </>
        );
    }
}

