
import React from 'react';
import { BONUS_POINTS } from '../constants';

const RulesPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-yellow-400 border-b-2 border-gray-700 pb-4">
        Rules & Scoring System
      </h1>

      {/* How to Play */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">How to Play</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>For each upcoming race, you must predict the top 3 riders in the correct order.</li>
          <li>You can submit or change your prediction anytime before the race's prediction deadline.</li>
          <li>Once the deadline passes, predictions are locked.</li>
          <li>After the official race results are uploaded, your scores will be calculated automatically.</li>
        </ul>
      </div>

      {/* Base Points */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Base Points</h2>
        <p className="text-gray-300 mb-4">
          You earn base points for each of your 3 selected riders who finish in the top 20 of the race. The points are awarded on a pro rata basis: 20 points for 1st place, down to 1 point for 20th place.
        </p>
        <div className="text-center text-lg font-mono bg-gray-900 p-4 rounded-md">
          Points = 21 - Rider's Rank
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">(For ranks 1 through 20)</p>
      </div>

      {/* Bonus Points */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Bonus Points</h2>
        <p className="text-gray-300 mb-4">
          In addition to base points, you can earn a significant bonus for accurately predicting the top finishers. You are eligible for the highest possible bonus you achieve; bonuses are <strong className="text-yellow-400">not cumulative</strong>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Bonus Type</th>
                <th className="p-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="p-3 font-semibold">{BONUS_POINTS.TOP_3_EXACT.type}</td>
                <td className="p-3 text-right font-bold text-green-400">{BONUS_POINTS.TOP_3_EXACT.points}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-3 font-semibold">{BONUS_POINTS.TOP_3_ANY.type}</td>
                <td className="p-3 text-right font-bold text-green-400">{BONUS_POINTS.TOP_3_ANY.points}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-3 font-semibold">{BONUS_POINTS.THREE_IN_TOP_5.type}</td>
                <td className="p-3 text-right font-bold text-green-400">{BONUS_POINTS.THREE_IN_TOP_5.points}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-3 font-semibold">{BONUS_POINTS.THREE_IN_TOP_10.type}</td>
                <td className="p-3 text-right font-bold text-green-400">{BONUS_POINTS.THREE_IN_TOP_10.points}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">{BONUS_POINTS.THREE_IN_TOP_20.type}</td>
                <td className="p-3 text-right font-bold text-green-400">{BONUS_POINTS.THREE_IN_TOP_20.points}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       {/* Example */}
       <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Example Calculation</h2>
        <p className="text-gray-300 mb-2">Let's say you predict:</p>
        <ul className="list-decimal list-inside text-gray-300 bg-gray-900 p-3 rounded mb-4">
            <li>1. Tadej Pogačar</li>
            <li>2. Mathieu van der Poel</li>
            <li>3. Wout van Aert</li>
        </ul>
        <p className="text-gray-300 mb-2">And the actual race result is:</p>
         <ul className="list-decimal list-inside text-gray-300 bg-gray-900 p-3 rounded mb-4">
            <li>1. Tadej Pogačar (Rank 1)</li>
            <li>2. Wout van Aert (Rank 2)</li>
            <li>3. Mathieu van der Poel (Rank 3)</li>
        </ul>
        <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
            <p><strong className="text-white">Base Points:</strong></p>
            <p className="ml-4">Pogačar (Rank 1): 21 - 1 = 20 points</p>
            <p className="ml-4">Van der Poel (Rank 3): 21 - 3 = 18 points</p>
            <p className="ml-4">Van Aert (Rank 2): 21 - 2 = 19 points</p>
            <p className="ml-4 font-semibold">Total Base Points = 57</p>

            <p className="pt-2"><strong className="text-white">Bonus Points:</strong></p>
            <p className="ml-4">You have the top 3 riders, but not in the exact order. This qualifies for the 'Top 3 Any Order' bonus.</p>
            <p className="ml-4 font-semibold">Bonus Points = {BONUS_POINTS.TOP_3_ANY.points}</p>

            <p className="pt-2 font-bold text-xl text-yellow-400">Total Score for the race = 57 (Base) + {BONUS_POINTS.TOP_3_ANY.points} (Bonus) = {57 + BONUS_POINTS.TOP_3_ANY.points} points</p>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
