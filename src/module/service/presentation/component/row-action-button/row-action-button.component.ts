import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IService} from "@src/core/business-logic/service/interface/i.service";
import {StateEnum} from "@core/shared/enum/state.enum";


@Component({
	selector: 'service-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(activate)="activate()"
			(deactivate)="deactivate()"
			(archive)="archive()"
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			[hide]="hide()"
			[id]="id()"
			[state]="item().state">
			<!--			<li>-->
			<!--				<a-->
			<!--					[routerLink]="['../../', 'event', 'form']"-->
			<!--					[queryParams]="{serviceId: item._id, returnUrl}"-->
			<!--					class="flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
			<!--					<i class="bi bi-calendar2-week"></i>-->
			<!--					{{ 'keyword.capitalize.add-event' | translate }}-->
			<!--				</a>-->
			<!--			</li>-->
		</utility-table-column-action>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
	]
})
export class RowActionButtonComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly id = input.required<string>();

	public readonly item = input.required<IService.DTO>();

	private readonly translateService = inject(TranslateService);
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public open(): void {
		this.store.dispatch(new ServiceActions.OpenDetails(this.item()));
	}

	public edit(): void {
		this.store.dispatch(new ServiceActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: this.item()
			},
			pushBoxInputs: {
				title: this.translateService.instant('service.form.title.edit')
			}
		}));
	}

	public delete() {
		const question = this.translateService.instant('service.action.delete.question');

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
		return new ServiceActions.SetState(this.item(), state);
	}
}
