
import { Prediction, RaceResult, Score } from '../types';
import { BONUS_POINTS } from '../constants';

const calculateScore = (prediction: Prediction, raceResult: RaceResult): Score => {
    const resultRanks = new Map<string, number>();
    raceResult.results.forEach(r => resultRanks.set(r.riderId, r.rank));

    let basePoints = 0;
    const predictedRiderRanks: (number | undefined)[] = [];
    
    prediction.riders.forEach(riderId => {
        const rank = resultRanks.get(riderId);
        predictedRiderRanks.push(rank);
        if (rank && rank >= 1 && rank <= 20) {
            basePoints += (21 - rank);
        }
    });

    let bonusPoints = 0;
    let bonusType: string | undefined = undefined;

    const [p1, p2, p3] = prediction.riders;
    const [r1, r2, r3] = raceResult.results.slice(0, 3).map(r => r.riderId);
    
    // Top 3 Exact
    if (p1 === r1 && p2 === r2 && p3 === r3) {
        bonusPoints = BONUS_POINTS.TOP_3_EXACT.points;
        bonusType = BONUS_POINTS.TOP_3_EXACT.type;
    } 
    // Top 3 Any Order
    else if (new Set(prediction.riders) .size === 3 && new Set([r1, r2, r3]).size === 3 && [p1,p2,p3].every(p => [r1,r2,r3].includes(p))) {
        bonusPoints = BONUS_POINTS.TOP_3_ANY.points;
        bonusType = BONUS_POINTS.TOP_3_ANY.type;
    }
    // 3 in Top 5
    else if (predictedRiderRanks.every(r => r && r <= 5)) {
        bonusPoints = BONUS_POINTS.THREE_IN_TOP_5.points;
        bonusType = BONUS_POINTS.THREE_IN_TOP_5.type;
    }
    // 3 in Top 10
    else if (predictedRiderRanks.every(r => r && r <= 10)) {
        bonusPoints = BONUS_POINTS.THREE_IN_TOP_10.points;
        bonusType = BONUS_POINTS.THREE_IN_TOP_10.type;
    }
    // 3 in Top 20
    else if (predictedRiderRanks.every(r => r && r <= 20)) {
        bonusPoints = BONUS_POINTS.THREE_IN_TOP_20.points;
        bonusType = BONUS_POINTS.THREE_IN_TOP_20.type;
    }

    return {
        userId: prediction.userId,
        raceId: prediction.raceId,
        basePoints,
        bonusPoints,
        totalPoints: basePoints + bonusPoints,
        bonusType,
    };
};

export const calculateScoresForRace = (predictions: Prediction[], raceResult: RaceResult): Score[] => {
    return predictions.map(prediction => calculateScore(prediction, raceResult));
};
