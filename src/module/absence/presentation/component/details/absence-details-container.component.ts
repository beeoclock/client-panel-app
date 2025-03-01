import {Component, inject, Input, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {DatePipe} from "@angular/common";
import {RowActionButtonComponent} from "@absence/presentation/component/row-action-button/row-action-button.component";
import {AbsenceProgressStatusEnum} from "@absence/presentation/pipe/absence-progress-status.pipe";
import {StateStatusComponent} from "@absence/presentation/component/state-status/state-status.component";

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
export class AbsenceDetailsContainerComponent implements OnChanges {

	// TODO add base index of details with store and delete method

	@Input()
	public item!: IAbsence.DTO;

	public readonly store = inject(Store);
	public readonly translateService = inject(TranslateService);

	public progress = 0;
	public leftInDays = 0;
	public isStarted = false;

	public ngOnChanges(changes: SimpleChanges & { items: SimpleChange }) {

		console.log('AbsenceDetailsContainerComponent:ngOnChanges', {changes});

		if (changes.item) {
			this.buildProgressBar();
		}

	}


	public openForm() {
		if (!this.item) {
			return
		}
		this.store.dispatch(new AbsenceActions.OpenFormToEditById(this.item?._id));
	}

	private buildProgressBar() {
		const {start, end} = this.item;

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

	protected readonly absenceProgressStatusEnum = AbsenceProgressStatusEnum;
}
