import {Pipe, PipeTransform} from "@angular/core";

export enum AbsenceProgressStatusEnum {
	NOT_STARTED = 'notStarted',
	IN_PROGRESS = 'inProgress',
	FINISHED = 'finished'
}

@Pipe({
	name: 'absenceProgressStatus',
	standalone: true
})
export class AbsenceProgressStatusPipe implements PipeTransform {

	// private readonly translateService = inject(TranslateService);

	/**
	 *
	 * @param startISO
	 * @param endISO
	 */
	public transform(startISO: string, endISO: string): string {

		const start = new Date(startISO);
		const end = new Date(endISO);
		const now = new Date();

		if (start > now) {
			return AbsenceProgressStatusEnum.NOT_STARTED;
			// return this.translateService.instant('absence.progress.status.notStarted');
		} else if (end < now) {
			return AbsenceProgressStatusEnum.FINISHED;
			// return this.translateService.instant('absence.progress.status.finished');
		} else {
			return AbsenceProgressStatusEnum.IN_PROGRESS;
			// return this.translateService.instant('absence.progress.status.inProgress');
		}

	}

}
