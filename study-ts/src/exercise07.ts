type Rate = number;
type Department = "IT" | "HR" | "Finance";
type ProgrammingLanguage = "TypeScript" | "JavaScript" | "Python" | "Rust";
type ModelName = string;

// Contract
interface Employee {
    name: string;
    age: number;
    salary: number;
    department: Department[];
    increaseSalary(rate: Rate): number;
    promote(department: Department, rate: Rate): void;
}

interface SoftwareDeveloper extends Employee {
    languages: ProgrammingLanguage[];
    vibeCoding(model: ModelName, language: ProgrammingLanguage): void;
}