import {Component, effect, inject, input, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IAbsence} from "@tenant/absence/domain/interface/i.absence";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {DatePipe} from "@angular/common";
import {
	RowActionButtonComponent
} from "@tenant/absence/presentation/ui/component/row-action-button/row-action-button.component";
import {StateStatusComponent} from "@tenant/absence/presentation/ui/component/state-status/state-status.component";
import {
	AbsencePresentationActions
} from "@tenant/absence/infrastructure/state/presentation/absence.presentation.actions";

@Component({
	selector: 'absence-detail-page',
	templateUrl: './absence-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		NoDataPipe,
		DatePipe,
		RowActionButtonComponent,
		StateStatusComponent
	],
	standalone: true
})
export class AbsenceDetailsContainerComponent  {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<IAbsence.DTO>();

	public readonly store = inject(Store);
	public readonly translateService = inject(TranslateService);

	public progress = 0;
	public leftInDays = 0;
	public isStarted = false;

	public constructor() {
		effect(() => {
			this.buildProgressBar();
		});
	}


	public openForm() {
		if (!this.item()) {
			return
		}
		const {_id} = this.item();
		const action = new AbsencePresentationActions.OpenFormToEditById(_id);
		this.store.dispatch(action);
	}

	private buildProgressBar() {
		const {start, end} = this.item();

		const now = new Date();

		const startDate = new Date(start);

		this.isStarted = now.getTime() > startDate.getTime();

		const endDate = new Date(end);

		const duration = endDate.getTime() - startDate.getTime();

		const progress = now.getTime() - startDate.getTime();

		this.progress = progress / duration * 100;

		this.progress = Math.round(this.progress);

		if (this.progress > 100) {
			this.progress = 100;
		}

		if (this.progress < 0) {
			this.progress = 0;
		}

		if (!this.isStarted) {
			this.progress = 0;
		}

		let leftInDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

		if (now < startDate) {
			leftInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
		}

		this.leftInDays = leftInDays;

		if (this.leftInDays < 0) {
			this.leftInDays = 0;
		}
	}

}

export default AbsenceDetailsContainerComponent;
