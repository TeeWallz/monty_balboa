import {format, parse, getWeekYear, getWeek, getYear, differenceInDays} from 'date-fns'
import chumpsRawData from './chumps.json'
import images from "../images";

function loadRawChumps(){
    return chumpsRawData;
}

function Chumps(){
    let rawChumps = loadRawChumps()

    const largestStreak = Math.max.apply(Math, rawChumps.map(function(bout) { return bout.streak; }))

    rawChumps.forEach(function(singleChump, index) {
        console.log(singleChump['parsedDate'])

        singleChump['idx'] = index
        singleChump['parsedDate'] = parse( singleChump['date'], 'yyyy-MM-dd', new Date() )
        singleChump['date_weekyear'] = getWeekYear( singleChump['parsedDate'] )
        singleChump['streak_max_proportion'] = Math.max(0.1, singleChump['streak'] / largestStreak)

        const additionAmount =  Math.round((largestStreak - singleChump['streak']) * 0.1)
        const finalAmount =  singleChump['streak'] + additionAmount
        singleChump['streak_max_proportion'] = finalAmount / largestStreak

        // singleChump['local_image'] = window.location.origin + images[singleChump['date'] + '.jpg'].default
        singleChump['local_image'] = 'images/' + singleChump['image']
        // singleChump['streak_max_proportion'] = 1
    }, rawChumps); // use arr as this

    // Load streak for current chump
    rawChumps[0].streak = differenceInDays(new Date(), rawChumps[0].parsedDate)
    return rawChumps


}

export default Chumps