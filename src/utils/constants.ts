import * as d3 from 'd3'

export enum MODES {
    BAR_RELATIVE = 'Relative Time Barchart',
    BAR_ABSOLUTE = 'Absolute Time Barchart',
    RADIAL = 'Radial Sunburst',
}

export const FORMATTERS = ({
    date: d3.utcFormat("%Y-%m-%d"),
    dateParse: d3.utcParse("%Y-%m-%d"),
    yTickFormat: (d):string => (d < 24 
        ? `${d - 12} pm` 
        : `${d - 24} am`),
    dateLabel: d3.utcFormat("%b %d, %Y"),
    hour: d3.format(".1f"),
    time: d3.utcFormat("%-I:%M %p")
  })

export const KEYS = ({
    TIME_TO_START: "timeToStart",    
    TIME_TO_END: "timeToEnd",    
    STD_TIME_TO_START: "stdTimeToStart",    
    STD_TIME_TO_END: "stdTimeToEnd",    
})

export const COLOR_PALATTE = d3.schemeYlGnBu[6]
// export const COLOR_PALATTE = [
//     '#F7E733', // yellow
//     '#52AC20', // lightgreen
//     '#378114', // green
//     // '#245D13', // green
//     // '#18460C', // darkgreen
//     '#4B98BA', // lightblue
//     '#235481', // midblue
//     '#203141' // darkblue
// ]

	// COLOR SCALE
export const COLOR_SCALE = d3.scaleQuantize(COLOR_PALATTE).domain([0, 12]).nice(); // sleep duration
