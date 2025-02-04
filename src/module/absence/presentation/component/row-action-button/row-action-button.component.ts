import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'app-absence-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			(deactivate)="deactivate()"
			(activate)="activate()"
			[hide]="hide()"
			[id]="id()"
			[active]="item().active"/>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
	]
})
export class RowActionButtonComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly id = input.required<string>();

	public readonly item = input.required<IAbsenceDto>();

	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	public readonly returnUrl = this.router.url;


	@Dispatch()
	public delete() {

		const question = this.translateService.instant('absence.action.delete.question');

		if (!confirm(question)) {
			throw new Error('User canceled the action');
		}

		return new AbsenceActions.DeleteItem(this.item()._id);
	}

	@Dispatch()
	public activate() {
		return new AbsenceActions.UnarchiveItem(this.item()._id);
	}

	@Dispatch()
	public deactivate() {
		return new AbsenceActions.ArchiveItem(this.item()._id);
	}

	@Dispatch()
	public open() {
		return new AbsenceActions.OpenDetails(this.item());
	}

	@Dispatch()
	public edit() {
		return new AbsenceActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: this.item()
			}
		});
	}

}
