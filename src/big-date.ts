export type BigDate = {
    /** **Can be negative** */
    year: number,
    /** **1-based** */
    month: number,
    /** **1-based** */
    day: number,
}

export function Min(a: BigDate, b: BigDate) {
    if (a.year < b.year) { return a }
    if (a.year > b.year) { return b }
    if (a.month < b.month) { return a }
    if (a.month > b.month) { return b }
    if (a.day < b.day) { return a }
    if (a.day > b.day) { return b }
    return a
}
export function Max(a: BigDate, b: BigDate) {
    if (a.year < b.year) { return b }
    if (a.year > b.year) { return a }
    if (a.month < b.month) { return b }
    if (a.month > b.month) { return a }
    if (a.day < b.day) { return b }
    if (a.day > b.day) { return a }
    return b
}

export function Parse(value: string | number | Date): BigDate {
    if (typeof value === 'string') {
        return Parse(new Date(Date.parse(value)))
    } else if (typeof value === 'number') {
        return Parse(new Date(value))
    } else {
        return {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
            day: value.getDate(),
        }
    }
}

/** **Can be negative** */
export function ToDays(date: BigDate): number {
    let sign = Math.sign(date.year)
    return (date.year * 365.25) + (date.month * 30 * sign) + (date.day * sign)
}
