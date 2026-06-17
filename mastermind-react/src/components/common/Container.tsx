import type { ReactNode, JSX } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps): JSX.Element {
  return <div className="container py-4">{children}</div>;
}
