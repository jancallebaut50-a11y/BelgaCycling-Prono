
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Race, Rider, User, Prediction, RaceResult, Score, Ranking } from '../types';
import { calculateScoresForRace } from '../services/scoringService';
import { supabase } from '../services/supabase';

interface DataContextType {
    riders: Rider[];
    races: Race[];
    users: User[];
    predictions: Prediction[];
    results: RaceResult[];
    scores: Score[];
    rankings: Ranking[];
    currentUser: User | null;
    loading: boolean;
    addRace: (race: Omit<Race, 'id' | 'status'>) => Promise<void>;
    addRiders: (newRiders: Rider[]) => Promise<void>;
    addResult: (result: RaceResult) => Promise<void>;
    addPrediction: (prediction: Prediction) => Promise<void>;
    logout: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [riders, setRiders] = useState<Rider[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [results, setResults] = useState<RaceResult[]>([]);
    const [scores, setScores] = useState<Score[]>([]);
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (data) {
            setCurrentUser({
                id: data.id,
                username: data.username,
                name: data.full_name,
                email: '', 
                isAdmin: data.is_admin || false
            });
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const [
                { data: ridersData },
                { data: racesData },
                { data: resultsData },
                { data: scoresData },
                { data: predictionsData },
                { data: profilesData }
            ] = await Promise.all([
                supabase.from('riders').select('*'),
                supabase.from('races').select('*').order('date', { ascending: true }),
                supabase.from('results').select('*'),
                supabase.from('scores').select('*'),
                supabase.from('predictions').select('*'),
                supabase.from('profiles').select('id, username')
            ]);

            if (ridersData) setRiders(ridersData);
            if (racesData) setRaces(racesData);
            if (profilesData) {
                setUsers(profilesData.map(p => ({ id: p.id, username: p.username, name: p.username, email: '' })));
            }
            if (predictionsData) {
                const mappedPredictions: Prediction[] = predictionsData.map(p => ({
                    userId: p.user_id,
                    raceId: p.race_id,
                    riders: p.rider_ids as [string, string, string]
                }));
                setPredictions(mappedPredictions);
            }
            if (resultsData) {
                const mappedResults: RaceResult[] = resultsData.map(r => ({
                    raceId: r.race_id,
                    results: r.results_json
                }));
                setResults(mappedResults);
            }
            if (scoresData) {
                const mappedScores: Score[] = scoresData.map(s => ({
                    userId: s.user_id,
                    raceId: s.race_id,
                    basePoints: s.base_points,
                    bonusPoints: s.bonus_points,
                    totalPoints: s.total_points,
                    bonusType: s.bonus_type
                }));
                setScores(mappedScores);
                
                const userTotals: Record<string, number> = {};
                mappedScores.forEach(s => {
                    userTotals[s.userId] = (userTotals[s.userId] || 0) + s.totalPoints;
                });
                const newRankings: Ranking[] = Object.entries(userTotals)
                    .map(([userId, totalScore]) => ({ userId, totalScore, rank: 0 }))
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .map((r, idx) => ({ ...r, rank: idx + 1 }));
                setRankings(newRankings);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setCurrentUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchData]);

    const addRace = async (race: Omit<Race, 'id' | 'status'>) => {
        const { error } = await supabase.from('races').insert([
            { name: race.name, date: race.date, deadline: race.deadline, status: 'upcoming' }
        ]);
        if (error) throw error;
        fetchData();
    };

    const addRiders = async (newRiders: Rider[]) => {
        const { error } = await supabase.from('riders').upsert(newRiders);
        if (error) throw error;
        fetchData();
    };

    const addResult = async (result: RaceResult) => {
        const { error: resError } = await supabase.from('results').upsert({
            race_id: result.raceId,
            results_json: result.results
        });
        if (resError) throw resError;

        await supabase.from('races').update({ status: 'finished' }).eq('id', result.raceId);

        const { data: racePredictions } = await supabase.from('predictions').select('*').eq('race_id', result.raceId);
        if (racePredictions) {
            const mappedPredictions: Prediction[] = racePredictions.map(p => ({
                userId: p.user_id,
                raceId: p.race_id,
                riders: p.rider_ids as [string, string, string]
            }));
            const calculatedScores = calculateScoresForRace(mappedPredictions, result);
            const dbScores = calculatedScores.map(s => ({
                user_id: s.userId,
                race_id: s.raceId,
                // Fix: Access camelCase property names defined in the Score interface
                base_points: s.basePoints,
                bonus_points: s.bonusPoints,
                total_points: s.totalPoints,
                bonus_type: s.bonusType
            }));
            await supabase.from('scores').upsert(dbScores);
        }
        fetchData();
    };
    
    const addPrediction = async (prediction: Prediction) => {
        // Strict deadline check before saving
        const { data: race } = await supabase.from('races').select('deadline').eq('id', prediction.raceId).single();
        if (race && new Date(race.deadline) <= new Date()) {
            throw new Error("Prediction deadline has passed for this race.");
        }

        const { error } = await supabase.from('predictions').upsert({
            user_id: prediction.userId,
            race_id: prediction.raceId,
            rider_ids: prediction.riders
        });
        if (error) throw error;
        fetchData();
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <DataContext.Provider value={{ 
            riders, races, users, predictions, results, scores, rankings, currentUser, loading,
            addRace, addRiders, addResult, addPrediction, logout
        }}>
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
