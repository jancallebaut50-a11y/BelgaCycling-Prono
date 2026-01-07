
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useMockData';
import RaceCard from '../components/RaceCard';
import { Rider, Prediction, Race } from '../types';

// Child component defined outside parent to prevent re-renders
interface PredictionFormProps {
    race: Race;
    riders: Rider[];
    userPrediction: string[] | undefined;
    onSubmit: (raceId: string, selectedRiders: string[]) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ race, riders, userPrediction, onSubmit }) => {
    const [selectedRiders, setSelectedRiders] = useState<string[]>(userPrediction || []);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectRider = (riderId: string) => {
        setSelectedRiders(prev => {
            if (prev.includes(riderId)) {
                return prev.filter(id => id !== riderId);
            }
            if (prev.length < 3) {
                return [...prev, riderId];
            }
            return prev;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRiders.length === 3) {
            onSubmit(race.id, selectedRiders);
            alert(`Prediction for ${race.name} saved!`);
        } else {
            alert('Please select exactly 3 riders.');
        }
    };
    
    const filteredRiders = useMemo(() => 
        riders.filter(rider => rider && rider.name && rider.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [riders, searchTerm]
    );

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
                <h4 className="font-semibold mb-2">Your selected riders:</h4>
                <div className="flex flex-wrap gap-2 min-h-[40px] bg-gray-900 p-2 rounded-md">
                    {selectedRiders.map((id, index) => {
                        const rider = riders.find(r => r.id === id);
                        return (
                            <span key={id} className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                               {index + 1}. {rider?.name || 'Unknown'}
                            </span>
                        );
                    })}
                    {selectedRiders.length === 0 && <p className="text-gray-500 text-sm">Select 3 riders below</p>}
                </div>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search for a rider..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-md p-2">
                <ul className="space-y-1">
                    {filteredRiders.map(rider => (
                        <li key={rider.id}>
                            <label className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedRiders.includes(rider.id) ? 'bg-yellow-600' : 'hover:bg-gray-700'}`}>
                                <div>
                                    <span className="font-semibold">{rider.name}</span>
                                    <span className="text-sm text-gray-400 ml-2">{rider.team}</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedRiders.includes(rider.id)}
                                    onChange={() => handleSelectRider(rider.id)}
                                    disabled={!selectedRiders.includes(rider.id) && selectedRiders.length >= 3}
                                    className="form-checkbox h-5 w-5 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-600"
                                />
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            
            <button type="submit" disabled={selectedRiders.length !== 3} className="w-full bg-green-600 font-bold py-2 px-4 rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                Save Prediction
            </button>
        </form>
    );
};


const PronostiekPage: React.FC = () => {
  const { races, riders, predictions, currentUser, addPrediction } = useData();

  const upcomingRaces = races.filter(r => r.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePredictionSubmit = (raceId: string, selectedRiders: string[]) => {
    if (currentUser) {
        const newPrediction: Prediction = {
            userId: currentUser.id,
            raceId,
            riders: selectedRiders as [string, string, string],
        };
        addPrediction(newPrediction);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">Make Your Predictions</h1>
      <p className="mb-8 text-gray-400">Select three riders for each upcoming race. Your score will be calculated after the race results are published.</p>
      
      {upcomingRaces.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingRaces.map(race => {
                const userPrediction = predictions.find(p => p.raceId === race.id && p.userId === currentUser?.id)?.riders;
                const deadlinePassed = new Date(race.deadline) <= new Date();
                return (
                    <RaceCard key={race.id} race={race}>
                        {deadlinePassed ? (
                            <div className="text-center text-red-500 font-bold p-4 bg-gray-900 rounded-md">
                                The prediction deadline has passed.
                            </div>
                        ) : (
                            <PredictionForm 
                                race={race} 
                                riders={riders} 
                                userPrediction={userPrediction}
                                onSubmit={handlePredictionSubmit}
                            />
                        )}
                    </RaceCard>
                );
            })}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 py-10">No upcoming races available for prediction.</p>
      )}
    </div>
  );
};

export default PronostiekPage;
