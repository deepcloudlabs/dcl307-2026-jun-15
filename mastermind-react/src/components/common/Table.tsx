import type { ReactNode, JSX } from "react";

interface TableProps<T extends object> {
  headers: string[];
  values: T[];
  fields: Array<keyof T>;
  keyField: keyof T;
}

export default function Table<T extends object>({ headers, values, fields, keyField }: TableProps<T>): JSX.Element {
  return (
    <table className="table table-striped table-bordered table-responsive table-hover">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((value) => (
          <tr key={String(value[keyField])}>
            {fields.map((field) => (
              <td key={`${String(value[keyField])}-${String(field)}`}>{value[field] as ReactNode}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
