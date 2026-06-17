import type { MouseEventHandler, JSX } from "react";

interface ButtonProps {
  color: string;
  click: MouseEventHandler<HTMLButtonElement>;
  label: string;
}

export default function Button({ color, click, label }: ButtonProps): JSX.Element {
  return (
    <button className={`btn ${color}`} onClick={click} type="button">
      {label}
    </button>
  );
}
