interface ProgressBarProps {
    value: number;
    maxValue: number;
    label: string;
    id: string;
}

export default function ProgressBar({id, value, label, maxValue}: ProgressBarProps) {
    let pbCounter: number | string = Math.floor((value * 100) / maxValue);
    let pbColor = "bg-success";

    if (pbCounter <= 25) {
        pbColor = "bg-danger";
    } else if (pbCounter <= 50) {
        pbColor = "bg-warning";
    }

    pbCounter = pbCounter + '%';
    return (
        <>
            <label className="label" htmlFor={id}>{label}: </label>
            <div className="progress">
                <div id={id} className={"progress-bar ".concat(pbColor)} style={{width: pbCounter}}>{value}</div>
            </div>
        </>
    );
}