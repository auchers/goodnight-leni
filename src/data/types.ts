
export enum LOG_TYPE {
    FEED='feed',
    SLEEP='sleep',
}

export interface SleepLog {
    Type: LOG_TYPE,
    Start: Date,
    aStart: Date,/** adjusted date back so that night shows up under a single calendar day */
    End: Date,
    aEnd: Date,/** adjusted date back so that night shows up under a single calendar day */
    timeToStart: number,/**Time from Midnight the start of the adjusted day, in hours */
    timeToEnd: number, /**Time from Midnight the start of the adjusted day, in hours */
    stdTimeToStart: number,/**Time the start of night of the adjusted day, in hours */
    stdTimeToEnd: number, /**Time the start of night of the adjusted day, in hours */
    Duration: string, 
    id: number
}

