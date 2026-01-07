
import React from 'react';
import { useData } from '../hooks/useMockData';
import { TrophyIcon } from '../components/icons/TrophyIcon';

const RankingPage: React.FC = () => {
    const { rankings, users, currentUser } = useData();

    const getUserName = (id: string) => users.find(u => u.id === id)?.username || 'Unknown User';

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center"><TrophyIcon className="w-8 h-8 mr-3 text-yellow-400"/> Overall Ranking</h1>
            
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-4 w-20 text-center">Rank</th>
                                <th className="p-4">User</th>
                                <th className="p-4 text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map(r => (
                                <tr 
                                    key={r.userId} 
                                    className={`border-b border-gray-700 transition-colors ${
                                        r.userId === currentUser?.id ? 'bg-yellow-900/50' : 'hover:bg-gray-700/50'
                                    }`}
                                >
                                    <td className={`p-4 font-bold text-center text-lg ${
                                        r.rank === 1 ? 'text-yellow-400' :
                                        r.rank === 2 ? 'text-gray-300' :
                                        r.rank === 3 ? 'text-orange-400' : ''
                                    }`}>{r.rank}</td>
                                    <td className="p-4 font-medium">{getUserName(r.userId)} {r.userId === currentUser?.id && '(You)'}</td>
                                    <td className="p-4 text-right font-semibold text-yellow-400 text-lg">{r.totalScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RankingPage;
