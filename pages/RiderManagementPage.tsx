
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useMockData';
import { Rider } from '../types';
import { parseRidersCsv } from '../services/csvParser';

const CsvUploader: React.FC<{ onUpload: (content: string) => void; label: string }> = ({ onUpload, label }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                onUpload(text);
                // Reset file input to allow re-uploading the same file
                event.target.value = '';
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

const RiderManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
    const { riders, addRiders } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const handleRidersUpload = (csvContent: string) => {
        try {
            const newRiders = parseRidersCsv(csvContent);
            addRiders(newRiders);
            alert(`${newRiders.length} riders processed! The rider list has been updated.`);
            setActiveTab('list'); // Switch to list view after upload
        } catch (error) {
            console.error(error);
            alert('Failed to parse riders CSV. Check console for details.');
        }
    };

    const filteredRiders = useMemo(() =>
        riders.filter(rider =>
            rider &&
            ((rider.name && rider.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (rider.team && rider.team.toLowerCase().includes(searchTerm.toLowerCase())))
        ).sort((a,b) => (a.name || '').localeCompare(b.name || '')),
        [riders, searchTerm]
    );

    const tabButtonClasses = (tabName: 'list' | 'upload') => 
        `px-4 py-2 font-semibold rounded-md transition-colors ${
            activeTab === tabName
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold border-b-2 border-gray-700 pb-2">Rider Management</h1>

            <div className="flex space-x-2 border-b border-gray-700 pb-2">
                <button onClick={() => setActiveTab('list')} className={tabButtonClasses('list')}>
                    Rider List
                </button>
                <button onClick={() => setActiveTab('upload')} className={tabButtonClasses('upload')}>
                    Upload CSV
                </button>
            </div>

            {activeTab === 'list' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Rider Database</h2>
                     <input
                        type="text"
                        placeholder="Search by name or team..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm mb-4 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Team</th>
                                    <th className="p-3">Nationality</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRiders.map(rider => (
                                    <tr key={rider.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                        <td className="p-3 font-medium">{rider.name}</td>
                                        <td className="p-3 text-gray-400">{rider.team}</td>
                                        <td className="p-3 text-gray-400">{rider.nationality}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'upload' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Upload Riders via CSV</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Upload a CSV file to add new riders or update existing ones. The file must have a header row with `id,name,team,nationality`.
                    </p>
                    <p className="text-sm text-yellow-300 mb-4">
                        <strong>Important:</strong> This process will not delete any riders. It only adds new riders or updates the information (like team name) for existing riders based on their ID.
                    </p>
                    <CsvUploader onUpload={handleRidersUpload} label="Riders CSV File" />
                </div>
            )}
        </div>
    );
};

export default RiderManagementPage;
