import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {NgIf} from "@angular/common";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";

@Component({
	selector: 'absence-detail-page',
	templateUrl: './absence-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		DeleteButtonComponent,
		EditButtonComponent,
		ActiveStyleDirective,
		NgIf,
		NoDataPipe
	],
	standalone: true
})
export class AbsenceDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	@Input()
	public item!: IAbsenceDto;

	public readonly store = inject(Store);

	public async delete(absence: IAbsenceDto) {

		const {active} = absence;

		if (active) {

			return alert('You can\'t delete active absence');

		}

		await firstValueFrom(this.store.dispatch(new AbsenceActions.DeleteItem(absence._id)));

	}

	public openForm() {
		if (!this.item) {
			return
		}
		this.store.dispatch(new AbsenceActions.OpenFormToEditById(this.item?._id));
	}

}
