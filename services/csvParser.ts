
export const parseRidersCsv = (csvContent: string): { id: string; name: string; team: string; nationality: string }[] => {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const riderData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const rider: { [key: string]: string } = {};
        headers.forEach((header, index) => {
            rider[header] = values[index];
        });
        return {
            id: rider.id,
            name: rider.name,
            team: rider.team,
            nationality: rider.nationality,
        };
    });
    return riderData;
};

export const parseResultsCsv = (csvContent: string): { riderId: string; rank: number }[] => {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const resultData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const result: { [key: string]: string } = {};
        headers.forEach((header, index) => {
            result[header] = values[index];
        });
        return {
            riderId: result.riderId,
            rank: parseInt(result.rank, 10),
        };
    });
    return resultData;
};
