import {format, compareAsc, parse, parseISO, getWeekYear, getWeek, getYear, differenceInDays} from 'date-fns'
import chumpsRawData from './chumps.json'

function loadRawChumps(){
    return chumpsRawData;
}

function Chumps(){
    let rawChumps = loadRawChumps()
    rawChumps.forEach(function(singleChump, index) {
        singleChump['parsedDate'] = parse( singleChump['date'], 'yyyy-MM-dd', new Date() )
        singleChump['date_year'] = getYear( singleChump['parsedDate'] )
        singleChump['date_weekyear'] = getWeekYear( singleChump['parsedDate'] )
        singleChump['date_week'] = getWeek( singleChump['parsedDate'] )
    }, rawChumps); // use arr as this

    // Load streak for current chump
    rawChumps[0].streak = differenceInDays(new Date(), rawChumps[0].parsedDate)
    return rawChumps


}

export default Chumps