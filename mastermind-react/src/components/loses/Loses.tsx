import { Link } from "react-router-dom";
import Card from "../common/Card";
import Container from "../common/Container";
import type { JSX } from "react";

export default function PlayerLoses(): JSX.Element {
  const clearItem = (): void => localStorage.removeItem("mastermind-sbm");

  return (
    <Container>
      <Card title="Player Loses">
        <h4>Nice game!</h4>
        <Link onClick={clearItem} to="/">
          Would you like to play again?
        </Link>
      </Card>
    </Container>
  );
}
