import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {TranslateModule} from "@ngx-translate/core";
import {Router, RouterLink} from "@angular/router";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {AbsenceActions} from "@absence/state/absence/absence.actions";

@Component({
	selector: 'app-absence-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!--
					(activate)="activate()"
					(deactivate)="deactivate()"-->
		<utility-table-column-action
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			[id]="id"
			[active]="item.active">
		</utility-table-column-action>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
		RouterLink
	]
})
export class RowActionButtonComponent {

	@Input()
	public id!: string;

	@Input({required: true})
	public item!: IAbsenceDto;

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete(): void {
		const {active} = this.item;

		if (active) {

			return alert('You can\'t delete active absence');

		}
		this.store.dispatch(new AbsenceActions.DeleteItem(this.item._id));
	}

	// public activate(): void {
	// 	this.store.dispatch(new AbsenceActions.UnarchiveItem(this.item._id));
	// }
	//
	// public deactivate(): void {
	// 	this.store.dispatch(new AbsenceActions.ArchiveItem(this.item._id));
	// }
	//
	// public async archive(id: string): Promise<void> {
	// 	await firstValueFrom(this.store.dispatch(
	// 		new AbsenceActions.ArchiveItem(id)));
	// }

	public open(): void {
		this.store.dispatch(new AbsenceActions.OpenDetailsById(this.item._id));
	}

	public edit(): void {
		this.store.dispatch(new AbsenceActions.OpenFormToEditById(this.item._id));
	}

}
