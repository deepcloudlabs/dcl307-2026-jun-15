import React from "react";

export default function Badge({label, value}) {
    return (
        <div className="form-group">
            <label htmlFor="gamelevel">{label}: </label>
            <span className="badge bg-warning">{value}</span>
        </div>
    );
}
