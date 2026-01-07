
import React from 'react';
import { useData } from '../hooks/useMockData';
import { UserIcon } from '../components/icons/UserIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';

const UserPage: React.FC = () => {
    const { currentUser, predictions, scores, races, riders, rankings } = useData();

    if (!currentUser) {
        return <p>Please log in to see your profile.</p>;
    }

    const userPredictions = predictions.filter(p => p.userId === currentUser.id);
    const userRanking = rankings.find(r => r.userId === currentUser.id);

    const getRaceName = (id: string) => races.find(r => r.id === id)?.name || 'Unknown Race';
    const getRiderName = (id: string) => riders.find(r => r.id === id)?.name || 'Unknown Rider';
    
    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-6">
                <UserIcon className="h-20 w-20 text-yellow-400"/>
                <div>
                    <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                    <p className="text-gray-400">@{currentUser.username}</p>
                    <p className="text-gray-400">{currentUser.email}</p>
                </div>
                {userRanking && (
                    <div className="ml-auto text-center">
                        <TrophyIcon className="h-12 w-12 mx-auto text-yellow-400"/>
                        <p className="text-2xl font-bold mt-1">Rank #{userRanking.rank}</p>
                        <p className="text-gray-400">{userRanking.totalScore} points</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">My Predictions & Scores</h2>
                <div className="space-y-6">
                    {userPredictions.length > 0 ? userPredictions.map(prediction => {
                        const score = scores.find(s => s.raceId === prediction.raceId && s.userId === prediction.userId);
                        const race = races.find(r => r.id === prediction.raceId);
                        
                        return (
                            <div key={prediction.raceId} className="border-t border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-yellow-400">{getRaceName(prediction.raceId)}</h3>
                                    {score && (
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{score.totalPoints} pts</p>
                                            {score.bonusType && <p className="text-xs text-green-400">{score.bonusType}</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-gray-300">
                                    <p className="font-semibold">Predicted:</p>
                                    <ol className="list-decimal list-inside ml-2">
                                        {prediction.riders.map(riderId => (
                                            <li key={riderId}>{getRiderName(riderId)}</li>
                                        ))}
                                    </ol>
                                </div>
                                {race?.status === 'upcoming' && <p className="text-sm text-blue-400 mt-2">Race is upcoming</p>}
                            </div>
                        );
                    }) : <p>You haven't made any predictions yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default UserPage;
