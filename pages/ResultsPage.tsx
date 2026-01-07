
import React, { useState } from 'react';
import { useData } from '../hooks/useMockData';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';

const ResultsPage: React.FC = () => {
  const { races, results, riders, scores, users, currentUser } = useData();
  const finishedRaces = races.filter(r => r.status === 'finished').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(finishedRaces.length > 0 ? finishedRaces[0].id : null);

  const selectedRace = races.find(r => r.id === selectedRaceId);
  const selectedResult = results.find(r => r.raceId === selectedRaceId);

  const getRiderName = (id: string) => riders.find(r => r.id === id)?.name || 'Unknown Rider';
  
  // My score for the selected race
  const myScore = currentUser && selectedRaceId ? scores.find(s => s.userId === currentUser.id && s.raceId === selectedRaceId) : null;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">Race Results</h1>
      
      {finishedRaces.length > 0 ? (
        <>
            <div className="mb-6">
                <label htmlFor="race-select" className="block text-sm font-medium text-gray-400 mb-2">Select a race:</label>
                <div className="relative">
                    <select
                        id="race-select"
                        value={selectedRaceId || ''}
                        onChange={(e) => setSelectedRaceId(e.target.value)}
                        className="w-full appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        {finishedRaces.map(race => (
                            <option key={race.id} value={race.id}>{race.name}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {selectedRace && selectedResult && (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">Top 20 - {selectedRace.name}</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="p-3 w-16">Rank</th>
                                        <th className="p-3">Rider</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedResult.results.map(res => (
                                        <tr key={res.riderId} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                                            <td className={`p-3 font-bold text-center ${res.rank <= 3 ? 'text-yellow-400' : ''}`}>{res.rank}</td>
                                            <td className="p-3">{getRiderName(res.riderId)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {myScore && (
                        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-xl self-start">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
                                Your Score
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between"><span>Base Points:</span> <span>{myScore.basePoints}</span></div>
                                <div className="flex justify-between"><span>Bonus Points:</span> <span>{myScore.bonusPoints}</span></div>
                                {myScore.bonusType && <div className="flex justify-between text-sm text-green-400"><span>Bonus Type:</span> <span>{myScore.bonusType}</span></div>}
                                <div className="border-t border-gray-600 my-2"></div>
                                <div className="flex justify-between font-bold text-xl text-yellow-400"><span>Total:</span> <span>{myScore.totalPoints}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
      ) : (
        <p className="text-center text-xl text-gray-500 py-10">No race results are available yet.</p>
      )}
    </div>
  );
};

export default ResultsPage;
