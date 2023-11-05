export function generateTimeOptions(range: { from: string; to: string }, step: string): { label: string; value: number }[] {
	const options: { label: string; value: number }[] = [];

	const fromTimeParts = range.from.split(':').map(Number);
	const toTimeParts = range.to.split(':').map(Number);
	const stepParts = step.split(':').map(Number);

	if (fromTimeParts.length !== 2 || toTimeParts.length !== 2 || stepParts.length !== 2) {
		throw new Error("Invalid time format. Use 'HH:mm' format.");
	}

	const fromMinutes = fromTimeParts[0] * 60 + fromTimeParts[1];
	const toMinutes = toTimeParts[0] * 60 + toTimeParts[1];
	const stepMinutes = stepParts[0] * 60 + stepParts[1];

	if (fromMinutes >= toMinutes) {
		throw new Error("Invalid time range. 'from' should be before 'to'.");
	}

	for (let minutes = fromMinutes; minutes <= toMinutes; minutes += stepMinutes) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		const label = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
		options.push({label, value: minutes * 60});
	}

	return options;
}

// Example usage:
// const timeRange = {from: '12:00', to: '12:10'};
// const timeStep = '00:05';
// const timeOptions = generateTimeOptions(timeRange, timeStep);
