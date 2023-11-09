export function generateDayList(startDate: Date = new Date(), pageNumber: number = 1, pageSize: number = 7): Date[] {
	const startIndex = (pageNumber - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const dayList = [];

	for (let i = startIndex; i < endIndex; i++) {
		const currentDate = new Date(startDate);
		currentDate.setDate(startDate.getDate() + i);
		dayList.push(currentDate);
	}

	return dayList;
}
