import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import CardTitle from "./card-title";
import {useParams} from "react-router";

export default function EmployeeDetails(props) {
    const { identityNo } = useParams();

    const [employee, setEmployee] = useState("");

    useEffect(() => {
        const REST_API_BASE_URL = "http://localhost:4001/employees";
        fetch(`${REST_API_BASE_URL}/${identityNo}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
            .then(res => res.json())
            .then(retrievedEmployee => {
                setEmployee(retrievedEmployee);
            });
    }, [identityNo]);

    // well-formed: 1) single root element
    return (
        <div className="container-md">
            <p></p>
            <div className="card">
                <CardTitle title="Employee Details"></CardTitle>
                <div className="card-body">
                    <div className="form-group">
                        <label className="form-label" htmlFor="identity">Identity:</label>
                        <span className="badge bg-info" id="identity">{identityNo}</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullname">Full Name:</label>
                        <span className="badge bg-secondary" id="fullname">{employee.fullname}</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="iban">Iban:</label>
                        <span className="badge bg-warning" id="iban">{employee.iban}</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="salary">Salary:</label>
                        <span className="badge bg-primary" id="salary">{employee.salary}</span>
                    </div>

                    <Link className="btn btn-success" to="/">Back to HR Panel</Link>
                </div>
            </div>
        </div>
    );
}
