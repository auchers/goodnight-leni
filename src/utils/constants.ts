import * as d3 from 'd3'

export enum MODES {
    BAR_RELATIVE = 'BAR RELATIVE',
    BAR_ABSOLUTE = 'BAR ABSOLUTE',
    RADIAL = 'RADIAL',
}

export const FORMATTERS = ({
    date: d3.utcFormat("%Y-%m-%d"),
    dateParse: d3.utcParse("%Y-%m-%d"),
    yTickFormat: (d):string => (d < 24 ? `${d - 12}pm` : `${d - 24}am`)
  })

export const KEYS = ({
    TIME_TO_START: "timeToStart",    
    TIME_TO_END: "timeToEnd",    
    STD_TIME_TO_START: "stdTimeToStart",    
    STD_TIME_TO_END: "stdTimeToEnd",    
})