import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useMockData';
import Countdown from '../components/Countdown';
import { TrophyIcon } from '../components/icons/TrophyIcon';

const HomePage: React.FC = () => {
  const { races, results, rankings, users, riders } = useData();

  const nextRace = races.find(race => race.status === 'upcoming');
  const lastResult = results.length > 0 ? results[results.length - 1] : null;
  const lastRace = lastResult ? races.find(r => r.id === lastResult.raceId) : null;
  const topRanking = rankings.slice(0, 5);

  const getRiderName = (id: string) => riders.find(r => r.id === id)?.name || 'Unknown Rider';
  const getUserName = (id: string) => users.find(u => u.id === id)?.username || 'Unknown User';
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center bg-gray-800 p-10 rounded-lg shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">Welcome to BelgaCycling</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">The ultimate prediction game for UCI World Tour fans. Test your cycling knowledge, compete with friends, and claim the top spot on the podium.</p>
        <Link to="/pronostiek" className="mt-8 inline-block bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-transform transform hover:scale-105 duration-300">
          Make Your Prediction!
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Next Race */}
        {nextRace && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2">Next Race: {nextRace.name}</h2>
            <Countdown targetDate={nextRace.date} />
          </div>
        )}

        {/* Last Result */}
        {lastResult && lastRace && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2">Last Result: {lastRace.name}</h2>
            <ul className="space-y-3">
              {lastResult.results.slice(0, 3).map(res => (
                <li key={res.riderId} className="flex items-center space-x-3 text-lg">
                  <span className={`font-bold w-6 text-center ${res.rank === 1 ? 'text-yellow-400' : res.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`}>{res.rank}.</span>
                  <span>{getRiderName(res.riderId)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Ranking Snippet */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center"><TrophyIcon className="w-6 h-6 mr-3 text-yellow-400" /> Overall Ranking</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-3">Rank</th>
                <th className="p-3">User</th>
                <th className="p-3">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {topRanking.map(r => (
                <tr key={r.userId} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="p-3 font-bold">{r.rank}</td>
                  <td className="p-3">{getUserName(r.userId)}</td>
                  <td className="p-3 text-yellow-400 font-semibold">{r.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-4">
          <Link to="/ranking" className="text-yellow-400 hover:underline">View Full Ranking &rarr;</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;