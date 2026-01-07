
import React from 'react';
import { Race } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';

interface RaceCardProps {
  race: Race;
  children?: React.ReactNode;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, children }) => {
  const raceDate = new Date(race.date);
  const formattedDate = raceDate.toLocaleDateString('nl-BE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deadlineDate = new Date(race.deadline);
  const formattedDeadline = deadlineDate.toLocaleString('nl-BE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });


  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-yellow-400 tracking-wide">{race.name}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                race.status === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>
                {race.status}
            </span>
        </div>
        <div className="flex items-center text-gray-400 mt-2">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <p className="text-sm">{formattedDate}</p>
        </div>
         {race.status === 'upcoming' && race.deadline && (
          <div className="flex items-center text-red-400 mt-2">
            <ClockIcon className="w-4 h-4 mr-2" />
            <p className="text-sm font-semibold">Deadline: {formattedDeadline}</p>
          </div>
        )}
        <div className="mt-4">
            {children}
        </div>
      </div>
    </div>
  );
};

export default RaceCard;