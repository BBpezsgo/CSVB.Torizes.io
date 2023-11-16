import * as Time from './big-date'

export type TimelinePoint = {
    date: Time.BigDate
    label: string
}

export type TimelineInterval = {
    interval: { start: Time.BigDate, end: Time.BigDate }
    label: string
}

function FormatDate(date: Time.BigDate) {
    return `${date.year}. ${date.month}. ${date.day}.`
}

function AppendCircle(index: number, percent: number, label: string/*, spanClass: 'center' | 'right'*/) {
    $("#line")
        .append(
        `<div class="circle" id="circle${index}" style="left: ${percent * 100}%;">` +
            `<div class="popupSpan">` +
            label +
            `</div>` +
        `</div>`)
}

function HandleDateClick(e: MouseEvent, callback: (index: number) => void) {
    if (!e.target) { return }
    let spanNum = (e.target as HTMLElement).id
    if (!spanNum) { return }
    spanNum = spanNum.replace('circle', '')
    try {
        console.log('clicked on date', spanNum)
        const i = parseInt(spanNum)
        // $(".active").removeClass("active")
        // $("#circle" + i).addClass("active")
        callback(i)
    } catch (error) {
        console.warn(error)
    }
}

function HandleRangeClick(e: MouseEvent, callback: (index: number) => void) {
    if (!e.target) { return }
    let spanNum = (e.target as HTMLElement).id
    if (!spanNum) { return }
    spanNum = spanNum.replace('range', '')
    try {
        console.log('clicked on range', spanNum)
        const i = parseInt(spanNum)
        // $(".active").removeClass("active")
        // $("#range" + i).addClass("active")
        callback(i)
    } catch (error) {
        console.warn(error)
    }
}

function CalculatePosition(first: Time.BigDate, last: Time.BigDate, current: Time.BigDate) {
    const firstTotal = Time.ToDays(first)
    const lastTotal = Time.ToDays(last)
    const currentTotal = Time.ToDays(current)

    const lastTotalRel = lastTotal - firstTotal
    const currentTotalRel = currentTotal - firstTotal

    console.log(currentTotalRel, lastTotalRel)

    return currentTotalRel / lastTotalRel

    const firstMonth = first.month
    const firstDay = first.day

    const lastMonth = last.month
    const lastDay = last.day

    const lastInt = ((lastMonth - firstMonth) * 30) + (lastDay - firstDay)

    const thisMonth = current.month
    const thisDay = current.day

    const thisInt = ((thisMonth - firstMonth) * 30) + (thisDay - firstDay)

    return thisInt / lastInt
}

export function Show(dates: TimelinePoint[], ranges: TimelineInterval[], onDateClick: (index: number) => void, onRangeClick: (index: number) => void) {
    console.log('Timeline points:', dates)
    console.log('Timeline intervals:', ranges)
    
    function GetMinDate() {
        let result = dates[0].date
        if (!result) {
            result = ranges[0].interval.start
        }
        if (!result) {
            return null
        }
        for (const date of dates) {
            result = Time.Min(result, date.date)
        }
        for (const range of ranges) {
            result = Time.Min(result, range.interval.start)
            result = Time.Min(result, range.interval.end)
        }
        return result
    }
    function GetMaxDate() {
        let result = dates[0].date
        if (!result) {
            result = ranges[0].interval.end
        }
        if (!result) {
            return null
        }
        for (const date of dates) {
            result = Time.Max(result, date.date)
        }
        for (const range of ranges) {
            result = Time.Max(result, range.interval.start)
            result = Time.Max(result, range.interval.end)
        }
        return result
    }

    if (dates.length < 2 && ranges.length === 0) {
        $("#line").hide()
    } else {
        const first = GetMinDate()
        const last = GetMaxDate()

        if (!first || !last) { return }

        console.log(first, last)
        
        for (let i = 0; i < dates.length; i++) {
            AppendCircle(i, CalculatePosition(first, last, dates[i].date), dates[i].label)
        }

        for (let i = 0; i < ranges.length; i++) {
            const startPos = CalculatePosition(first, last, ranges[i].interval.start)
            const endPos = CalculatePosition(first, last, ranges[i].interval.end)

            $("#line").append(
                `<div class="range" id="range${i}" style="left: calc(${startPos * 100}% + 10px); width: ${(endPos - startPos) * 100}%;">` +
                    `<div class="popupSpan">` +
                        ranges[i].label +
                    `</div>` +
                `</div>`)
        }
    }

    const allCircles = document.getElementsByClassName('circle') as HTMLCollectionOf<HTMLElement>
    for (let i = 0; i < allCircles.length; i++) {
        const circle = allCircles.item(i)
        circle?.addEventListener('click', e => HandleDateClick(e, onDateClick))
    }
    
    const allRanges = document.getElementsByClassName('range') as HTMLCollectionOf<HTMLElement>
    for (let i = 0; i < allRanges.length; i++) {
        const range = allRanges.item(i)
        range?.addEventListener('click', e => HandleRangeClick(e, onRangeClick))
    }
}
