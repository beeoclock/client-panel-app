import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {StateEnum} from "@core/shared/enum/state.enum";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

@Component({
	selector: 'app-absence-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(open)="open()"
			(edit)="edit()"
			(deactivate)="deactivate()"
			(activate)="activate()"
			(archive)="archive()"
			(delete)="delete()"
			[hide]="hide()"
			[id]="id()"
			[state]="item().state"/>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
	]
})
export class RowActionButtonComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly id = input.required<string>();

	public readonly item = input.required<IAbsence.DTO>();

	private readonly translateService = inject(TranslateService);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete() {

		const question = this.translateService.instant('absence.action.delete.question');

		if (!confirm(question)) {
			throw new Error('User canceled the action');
		}

		this.setState(StateEnum.deleted);
	}

	public deactivate() {
		this.setState(StateEnum.inactive);
	}

	public archive() {
		this.setState(StateEnum.archived);
	}

	public activate() {
		this.setState(StateEnum.active);
	}

	@Dispatch()
	public setState(state: StateEnum) {
		const entity = EAbsence.fromDTO(this.item());
		return new AbsenceActions.SetState(entity, state);
	}

	@Dispatch()
	public open() {
		const entity = EAbsence.fromDTO(this.item());
		return new AbsenceActions.OpenDetails(entity);
	}

	@Dispatch()
	public edit() {
		const entity = EAbsence.fromDTO(this.item());
		return new AbsenceActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: entity,
			}
		});
	}

}
