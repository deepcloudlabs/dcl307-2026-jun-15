import type { ChangeEventHandler, JSX } from "react";

interface InputTextProps {
  id: string;
  explain: string;
  label: string;
  value: string | number;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}

export default function InputText({ id, explain, label, value, handleChange }: InputTextProps): JSX.Element {
  return (
    <div className="form-group mb-3">
      <label htmlFor={id} className="form-label">
        {label}:
      </label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        placeholder={explain}
        className="form-control"
      />
    </div>
  );
}
