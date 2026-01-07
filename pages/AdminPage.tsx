
import React, { useState } from 'react';
import { useData } from '../hooks/useMockData';
import { Race, RaceResult } from '../types';
import { parseResultsCsv } from '../services/csvParser';

const CsvUploader: React.FC<{ onUpload: (content: string) => void; label: string }> = ({ onUpload, label }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                onUpload(text);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-400"
            />
        </div>
    );
};


const AdminPage: React.FC = () => {
    const { addRace, addResult, races } = useData();
    const [raceName, setRaceName] = useState('');
    const [raceDate, setRaceDate] = useState('');
    const [raceDeadline, setRaceDeadline] = useState('');
    const [resultRaceId, setResultRaceId] = useState<string>(races.filter(r => r.status === 'upcoming')[0]?.id || '');

    const handleAddRace = (e: React.FormEvent) => {
        e.preventDefault();
        if (raceName && raceDate && raceDeadline) {
            addRace({ 
                name: raceName, 
                date: new Date(raceDate).toISOString(),
                deadline: new Date(raceDeadline).toISOString()
            });
            setRaceName('');
            setRaceDate('');
            setRaceDeadline('');
            alert('Race added!');
        }
    };

    const handleResultsUpload = (csvContent: string) => {
        if (!resultRaceId) {
            alert('Please select a race for the results.');
            return;
        }
        try {
            const results = parseResultsCsv(csvContent);
            const raceResult: RaceResult = {
                raceId: resultRaceId,
                results
            };
            addResult(raceResult);
            alert(`Results for race ${resultRaceId} uploaded and scores recalculated!`);
        } catch (error) {
            console.error(error);
            alert('Failed to parse results CSV. Check console for details.');
        }
    };

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold border-b-2 border-gray-700 pb-2">Admin Panel</h1>

            {/* Add Race */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Add New Race & Set Deadline</h2>
                <form onSubmit={handleAddRace} className="space-y-4">
                    <div>
                        <label htmlFor="raceName" className="block text-sm font-medium text-gray-300">Race Name</label>
                        <input
                            type="text"
                            id="raceName"
                            value={raceName}
                            onChange={(e) => setRaceName(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="raceDate" className="block text-sm font-medium text-gray-300">Race Date</label>
                        <input
                            type="date"
                            id="raceDate"
                            value={raceDate}
                            onChange={(e) => setRaceDate(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="raceDeadline" className="block text-sm font-medium text-gray-300">Prediction Deadline</label>
                        <input
                            type="datetime-local"
                            id="raceDeadline"
                            value={raceDeadline}
                            onChange={(e) => setRaceDeadline(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold">Add Race</button>
                </form>
            </div>

            {/* Upload Results */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Upload Race Results</h2>
                <p className="text-sm text-gray-400 mb-4">CSV format: `riderId,rank` (with header)</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="resultRace" className="block text-sm font-medium text-gray-300">Select Race</label>
                        <select
                            id="resultRace"
                            value={resultRaceId}
                            onChange={(e) => setResultRaceId(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        >
                            <option value="">-- Select a race --</option>
                            {races.filter(r => r.status === 'upcoming').map(race => (
                                <option key={race.id} value={race.id}>{race.name}</option>
                            ))}
                        </select>
                    </div>
                    <CsvUploader onUpload={handleResultsUpload} label="Results CSV File" />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
