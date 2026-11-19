import styles from "./styles.module.scss";

export type NumberFlipSegmentProps = { itemArray: Array<string | React.ReactNode>, number: number }
export function NumberFlipSegment(props: NumberFlipSegmentProps) {
    return (
        <div className={styles.number_container}>
            <p className={styles.number_sizer}>{props.itemArray[0]}</p>
            <div className={styles.number_slider} style={{ transform: `translateY(-${props.number / props.itemArray.length * 100}%)` }}>
                {props.itemArray.map((item, index) => <div className={styles.number} key={index}>{item}</div>)}
            </div>
        </div>
    )
}

export type NumberFlipProps = { itemArray?: string[], number: number, suffix?: string | React.ReactNode, prefix?: string | React.ReactNode } & Omit<React.HTMLAttributes<HTMLDivElement>, "prefix">;
// the NumberFlip-only props are pulled out so they don't land on the <div>
export default function NumberFlip({ itemArray: items, number, suffix, prefix, className, ...props }: NumberFlipProps) {
    const numbers = number.toString().split("").map(Number);
    const itemArray = items ?? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div {...props} className={[styles.number_flip, className].filter(Boolean).join(" ")}>
            {[
                <NumberFlipSegment key={(typeof prefix === "string") ? prefix : "prefix"} itemArray={[prefix ?? ""]} number={0}></NumberFlipSegment>,
                ...numbers.map((number, index) => <NumberFlipSegment key={index} itemArray={itemArray} number={number}></NumberFlipSegment>),
                <NumberFlipSegment key={(typeof suffix === "string") ? suffix : "suffix"} itemArray={[suffix ?? ""]} number={0}></NumberFlipSegment>
            ]}
        </div>
    )
}
