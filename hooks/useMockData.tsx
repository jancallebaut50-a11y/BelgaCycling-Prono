
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Race, Rider, User, Prediction, RaceResult, Score, Ranking } from '../types';
import { calculateScoresForRace } from '../services/scoringService';

// --- MOCK DATA ---
const initialRiders: Rider[] = [
  { id: '1', name: 'Tadej Pogačar', team: 'UAE Team Emirates', nationality: 'SLO' },
  { id: '2', name: 'Jonas Vingegaard', team: 'Team Visma | Lease a Bike', nationality: 'DEN' },
  { id: '3', name: 'Mathieu van der Poel', team: 'Alpecin-Deceuninck', nationality: 'NED' },
  { id: '4', name: 'Wout van Aert', team: 'Team Visma | Lease a Bike', nationality: 'BEL' },
  { id: '5', name: 'Remco Evenepoel', team: 'Soudal Quick-Step', nationality: 'BEL' },
  { id: '6', name: 'Primož Roglič', team: 'BORA - hansgrohe', nationality: 'SLO' },
  { id: '7', name: 'Mads Pedersen', team: 'Lidl-Trek', nationality: 'DEN' },
  { id: '8', name: 'Jasper Philipsen', team: 'Alpecin-Deceuninck', nationality: 'BEL' },
  { id: '9', name: 'Tom Pidcock', team: 'INEOS Grenadiers', nationality: 'GBR' },
  { id: '10', name: 'Filippo Ganna', team: 'INEOS Grenadiers', nationality: 'ITA' },
  { id: '11', name: 'Christophe Laporte', team: 'Team Visma | Lease a Bike', nationality: 'FRA' },
  { id: '12', name: 'Biniam Girmay', team: 'Intermarché - Wanty', nationality: 'ERI' },
  { id: '13', name: 'Julian Alaphilippe', team: 'Soudal Quick-Step', nationality: 'FRA' },
  { id: '14', name: 'Sepp Kuss', team: 'Team Visma | Lease a Bike', nationality: 'USA' },
  { id: '15', name: 'David Gaudu', team: 'Groupama - FDJ', nationality: 'FRA' },
  { id: '16', name: 'Enric Mas', team: 'Movistar Team', nationality: 'ESP' },
  { id: '17', name: 'Jai Hindley', team: 'BORA - hansgrohe', nationality: 'AUS' },
  { id: '18', name: 'Adam Yates', team: 'UAE Team Emirates', nationality: 'GBR' },
  { id: '19', name: 'Carlos Rodríguez', team: 'INEOS Grenadiers', nationality: 'ESP' },
  { id: '20', name: 'Simon Yates', team: 'Team Jayco AlUla', nationality: 'GBR' },
  { id: '21', name: 'Ben O\'Connor', team: 'Decathlon AG2R La Mondiale Team', nationality: 'AUS' },
  { id: '22', name: 'Matteo Jorgenson', team: 'Team Visma | Lease a Bike', nationality: 'USA' },
];

const initialRaces: Race[] = [
  { id: '1', name: 'Milano-Sanremo', date: '2024-03-16T10:00:00Z', deadline: '2024-03-16T09:00:00Z', status: 'finished' },
  { id: '2', name: 'Ronde van Vlaanderen', date: '2024-03-31T10:00:00Z', deadline: '2024-03-31T09:00:00Z', status: 'finished' },
  { id: '3', name: 'Paris-Roubaix', date: '2024-04-07T10:00:00Z', deadline: '2024-04-07T09:00:00Z', status: 'finished' },
  { id: '4', name: 'Liège-Bastogne-Liège', date: '2024-04-21T10:00:00Z', deadline: '2024-04-21T09:00:00Z', status: 'finished' },
  { id: '5', name: 'Il Lombardia', date: '2024-10-12T10:00:00Z', deadline: '2024-10-12T09:00:00Z', status: 'upcoming' },
  { id: '6', name: 'Tour de France - Stage 1', date: '2024-06-29T12:00:00Z', deadline: '2024-06-29T11:00:00Z', status: 'upcoming' },
  { id: '7', name: 'Clásica San Sebastián', date: '2024-08-10T13:00:00Z', deadline: '2024-08-10T12:00:00Z', status: 'upcoming' },
  { id: '8', name: 'Vuelta a España - Stage 1', date: '2024-08-17T14:00:00Z', deadline: '2024-08-17T13:00:00Z', status: 'upcoming' },
  { id: '9', name: 'World Championships - Road Race', date: '2024-09-29T10:00:00Z', deadline: '2024-09-29T09:00:00Z', status: 'upcoming' },
];

const initialUsers: User[] = [
  { id: '1', username: 'CycloFan', name: 'Jan Janssen', email: 'jan@example.com' },
  { id: '2', username: 'SuperTifoso', name: 'Maria Rossi', email: 'maria@example.com' },
];

const initialPredictions: Prediction[] = [
    { userId: '1', raceId: '1', riders: ['3', '8', '1'] },
    { userId: '2', raceId: '1', riders: ['8', '3', '7'] },
    { userId: '1', raceId: '2', riders: ['3', '4', '2'] },
    { userId: '2', raceId: '2', riders: ['3', '7', '2'] },
    { userId: '1', raceId: '3', riders: ['3', '8', '7'] },
    { userId: '2', raceId: '3', riders: ['4', '11', '3'] },
    { userId: '1', raceId: '4', riders: ['1', '5', '9'] },
    { userId: '2', raceId: '4', riders: ['1', '15', '18'] },
];

const initialResults: RaceResult[] = [
    { raceId: '1', results: [
        { riderId: '8', rank: 1 }, { riderId: '3', rank: 2 }, { riderId: '1', rank: 3 },
        { riderId: '4', rank: 4 }, { riderId: '10', rank: 5 }, { riderId: '6', rank: 6 },
        { riderId: '7', rank: 7 }, { riderId: '2', rank: 8 }, { riderId: '9', rank: 9 },
        { riderId: '5', rank: 10 }, { riderId: '11', rank: 11 }, { riderId: '12', rank: 12 },
        { riderId: '13', rank: 13 }, { riderId: '14', rank: 14 }, { riderId: '15', rank: 15 },
        { riderId: '16', rank: 16 }, { riderId: '17', rank: 17 }, { riderId: '18', rank: 18 },
        { riderId: '19', rank: 19 }, { riderId: '20', rank: 20 },
    ]},
    { raceId: '2', results: [
        { riderId: '3', rank: 1 }, { riderId: '2', rank: 2 }, { riderId: '7', rank: 3 },
        { riderId: '4', rank: 4 }, { riderId: '1', rank: 5 }, { riderId: '5', rank: 6 },
        { riderId: '6', rank: 7 }, { riderId: '8', rank: 8 }, { riderId: '9', rank: 9 },
        { riderId: '10', rank: 10 }, { riderId: '11', rank: 11 }, { riderId: '12', rank: 12 },
        { riderId: '13', rank: 13 }, { riderId: '14', rank: 14 }, { riderId: '15', rank: 15 },
        { riderId: '16', rank: 16 }, { riderId: '17', rank: 17 }, { riderId: '18', rank: 18 },
        { riderId: '19', rank: 19 }, { riderId: '20', rank: 20 },
    ]},
    { raceId: '3', results: [
        { riderId: '3', rank: 1 }, { riderId: '8', rank: 2 }, { riderId: '7', rank: 3 },
        { riderId: '4', rank: 4 }, { riderId: '11', rank: 5 }, { riderId: '10', rank: 6 },
        { riderId: '6', rank: 7 }, { riderId: '5', rank: 8 }, { riderId: '9', rank: 9 },
        { riderId: '12', rank: 10 }, { riderId: '1', rank: 11 }, { riderId: '2', rank: 12 },
        { riderId: '13', rank: 13 }, { riderId: '14', rank: 14 }, { riderId: '15', rank: 15 },
        { riderId: '16', rank: 16 }, { riderId: '17', rank: 17 }, { riderId: '18', rank: 18 },
        { riderId: '19', rank: 19 }, { riderId: '20', rank: 20 },
    ]},
    { raceId: '4', results: [
        { riderId: '1', rank: 1 }, { riderId: '9', rank: 2 }, { riderId: '15', rank: 3 },
        { riderId: '5', rank: 4 }, { riderId: '18', rank: 5 }, { riderId: '21', rank: 6 },
        { riderId: '17', rank: 7 }, { riderId: '6', rank: 8 }, { riderId: '19', rank: 9 },
        { riderId: '22', rank: 10 }, { riderId: '2', rank: 11 }, { riderId: '3', rank: 12 },
        { riderId: '4', rank: 13 }, { riderId: '7', rank: 14 }, { riderId: '8', rank: 15 },
        { riderId: '10', rank: 16 }, { riderId: '11', rank: 17 }, { riderId: '12', rank: 18 },
        { riderId: '13', rank: 19 }, { riderId: '14', rank: 20 },
    ]}
];

// --- CONTEXT ---
interface DataContextType {
    riders: Rider[];
    races: Race[];
    users: User[];
    predictions: Prediction[];
    results: RaceResult[];
    scores: Score[];
    rankings: Ranking[];
    currentUser: User | null;
    addRace: (race: Omit<Race, 'id' | 'status'>) => void;
    addRiders: (newRiders: Rider[]) => void;
    addResult: (result: RaceResult) => void;
    addPrediction: (prediction: Prediction) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [riders, setRiders] = useState<Rider[]>(initialRiders);
    const [races, setRaces] = useState<Race[]>(initialRaces);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions);
    const [results, setResults] = useState<RaceResult[]>(initialResults);
    const [scores, setScores] = useState<Score[]>([]);
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [currentUser] = useState<User | null>(users[0]); // Mock current user

    const recalculateAll = useCallback((newResults: RaceResult[], currentPredictions: Prediction[]) => {
        const allScores: Score[] = [];
        newResults.forEach(result => {
            const racePredictions = currentPredictions.filter(p => p.raceId === result.raceId);
            const raceScores = calculateScoresForRace(racePredictions, result);
            allScores.push(...raceScores);
        });
        setScores(allScores);
        
        const userScores: { [userId: string]: number } = {};
        allScores.forEach(score => {
            if (!userScores[score.userId]) {
                userScores[score.userId] = 0;
            }
            userScores[score.userId] += score.totalPoints;
        });

        const newRankings = Object.entries(userScores)
            .map(([userId, totalScore]) => ({ userId, totalScore }))
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((item, index) => ({ ...item, rank: index + 1 }));
        setRankings(newRankings);
    }, []);

    useState(() => {
        recalculateAll(initialResults, initialPredictions);
    });

    const addRace = (race: Omit<Race, 'id' | 'status'>) => {
        const newRace: Race = {
            id: String(races.length + 1),
            ...race,
            status: 'upcoming'
        };
        setRaces(prev => [...prev, newRace]);
    };

    const addRiders = (newRiders: Rider[]) => {
        setRiders(prevRiders => {
            const riderMap = new Map(prevRiders.map(r => [r.id, r]));
            newRiders.forEach(newRider => {
                riderMap.set(newRider.id, newRider); // Adds new or updates existing
            });
            return Array.from(riderMap.values());
        });
    };

    const addResult = (result: RaceResult) => {
        setResults(prevResults => {
            const updatedResults = [...prevResults.filter(r => r.raceId !== result.raceId), result];
            recalculateAll(updatedResults, predictions);
            return updatedResults;
        });
        setRaces(prevRaces => prevRaces.map(r => r.id === result.raceId ? { ...r, status: 'finished' } : r));
    };
    
    const addPrediction = (prediction: Prediction) => {
        setPredictions(prev => {
            const otherPredictions = prev.filter(p => !(p.userId === prediction.userId && p.raceId === prediction.raceId));
            return [...otherPredictions, prediction];
        });
    };

    return (
        <DataContext.Provider value={{ riders, races, users, predictions, results, scores, rankings, currentUser, addRace, addRiders, addResult, addPrediction }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
