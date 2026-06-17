import type { ReactNode, JSX } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ children, title }: CardProps): JSX.Element {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3 className="card-title fw-light mb-0">{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
