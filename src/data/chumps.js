import {format, compareAsc, parse, parseISO, getWeekYear, getWeek, getYear, differenceInDays} from 'date-fns'
import chumpsRawData from './chumps.json'

function loadRawChumps(){
    return chumpsRawData;
}

function Chumps(){
    let rawChumps = loadRawChumps()

    const largestStreak = Math.max.apply(Math, rawChumps.map(function(bout) { return bout.streak; }))

    rawChumps.forEach(function(singleChump, index) {
        singleChump['idx'] = index
        singleChump['parsedDate'] = parse( singleChump['date'], 'yyyy-MM-dd', new Date() )
        singleChump['date_aus_string'] = format(singleChump['parsedDate'], 'dd/MM/yyyy')
        singleChump['date_year'] = getYear( singleChump['parsedDate'] )
        singleChump['date_weekyear'] = getWeekYear( singleChump['parsedDate'] )
        singleChump['date_week'] = getWeek( singleChump['parsedDate'] )
        singleChump['streak_max_proportion'] = Math.max(0.3, singleChump['streak'] / largestStreak)
        // singleChump['streak_max_proportion'] = 1
    }, rawChumps); // use arr as this

    // Load streak for current chump
    rawChumps[0].streak = differenceInDays(new Date(), rawChumps[0].parsedDate)
    return rawChumps


}

export default Chumps