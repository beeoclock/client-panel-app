import {Component, inject, Input, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {DatePipe} from "@angular/common";
import {
	AbsenceProgressStatusEnum,
	AbsenceProgressStatusPipe
} from "@absence/presentation/pipe/absence-progress-status.pipe";

@Component({
	selector: 'absence-detail-page',
	templateUrl: './absence-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		DeleteButtonComponent,
		EditButtonComponent,
		NoDataPipe,
		DatePipe,
		AbsenceProgressStatusPipe
	],
	standalone: true
})
export class AbsenceDetailsContainerComponent implements OnChanges {

	// TODO add base index of details with store and delete method

	@Input()
	public item!: IAbsenceDto;

	public readonly store = inject(Store);
	public readonly translateService = inject(TranslateService);

	public progress = 0;
	public leftInDays = 0;
	public isStarted = false;

	public ngOnChanges(changes: SimpleChanges & { items: SimpleChange }) {

		if (changes.item) {
			this.buildProgressBar();
		}

	}

	public async delete(absence: IAbsenceDto) {

		const question = this.translateService.instant('absence.action.delete.question');

		if (!confirm(question)) {
			return;
		}

		await firstValueFrom(this.store.dispatch(new AbsenceActions.DeleteItem(absence._id)));

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
