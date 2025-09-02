import {Component, effect, inject, input, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {DatePipe} from "@angular/common";
import {
	RowActionButtonComponent
} from "@tenant/member/absence/presentation/ui/component/row-action-button/row-action-button.component";
import {
	StateStatusComponent
} from "@tenant/member/absence/presentation/ui/component/state-status/state-status.component";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";
import {
	StandardDetailsEntityComponent
} from "@shared/presentation/ui/component/entity/standard-details.entity.component";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {IMember} from "@tenant/member/member/domain";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";

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
		StateStatusComponent,
		StandardDetailsEntityComponent
	],
	standalone: true
})
export class AbsenceDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<EAbsence>();

	public readonly sharedUow = inject(SharedUow);
	public readonly store = inject(Store);
	public readonly translateService = inject(TranslateService);

	public readonly membersMap = toSignal(
		this.sharedUow.member.repository.find$().pipe(
			map(({items}) => items.reduce((map, obj) => {
				map.set(obj._id, obj);
				return map;
			}, new Map<string, IMember.EntityRaw>()))
		)
	);

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

	public openMemberDetails($event: MouseEvent, data: IMember.EntityRaw) {
		$event.stopPropagation();
		this.dispatchMemberDetails(data);
	}

	@Dispatch()
	public dispatchMemberDetails(data: IMember.EntityRaw) {
		return new MemberPresentationActions.OpenDetails(data);
	}

}

export default AbsenceDetailsContainerComponent;
