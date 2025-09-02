import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@shared/presentation/ui/component/table/column/action.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {StateEnum} from "@core/shared/enum/state.enum";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";

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
		return new AbsenceDataActions.SetState(entity, state);
	}

	@Dispatch()
	public open() {
		const entity = EAbsence.fromDTO(this.item());
		return new AbsencePresentationActions.OpenDetails(entity);
	}

	@Dispatch()
	public edit() {
		const entity = EAbsence.fromDTO(this.item());
		return new AbsencePresentationActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: entity,
			}
		});
	}

}
