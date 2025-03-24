import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {
	AbsenceProgressStatusEnum,
	AbsenceProgressStatusPipe
} from "@absence/presentation/pipe/absence-progress-status.pipe";
import {TranslatePipe} from "@ngx-translate/core";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'state-status-component',
	imports: [
		AbsenceProgressStatusPipe,
		TranslatePipe
	],
	template: `

		@if (item().state === stateEnum.active) {

			@switch (item().start | absenceProgressStatus: item().end) {

				@case (absenceProgressStatusEnum.FINISHED) {
					<span
						class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
							{{ 'absence.progress.status.finished' | translate }}
					</span>
				}
				@case (absenceProgressStatusEnum.IN_PROGRESS) {

					<span
						class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
						{{ 'absence.progress.status.inProgress' | translate }}
					</span>

				}
				@case (absenceProgressStatusEnum.NOT_STARTED) {

					<span
						class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
						{{ 'absence.progress.status.notStarted' | translate }}
					</span>

				}

			}

		} @else {

			<span
				class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
				{{ 'absence.progress.status.cancel' | translate }}
			</span>

		}
	`
})
export class StateStatusComponent {

	public readonly item = input.required<IAbsence.DTO>();

	protected readonly absenceProgressStatusEnum = AbsenceProgressStatusEnum;
	protected readonly stateEnum = StateEnum;

}
