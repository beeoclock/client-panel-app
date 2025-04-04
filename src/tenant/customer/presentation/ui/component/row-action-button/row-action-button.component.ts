import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@shared/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {ICustomer} from "@tenant/customer/domain";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {StateEnum} from "@core/shared/enum/state.enum";
import {CustomerDataActions} from "@tenant/customer/infrastructure/state/data/customer.data.actions";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

@Component({
	selector: 'customer-row-action-button-component',
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
			<!--					[queryParams]="{customerId: item._id, returnUrl}"-->
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

	public readonly id = input.required<string>();

	public readonly item = input.required<ICustomer.EntityRaw>();

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	public readonly returnUrl = this.router.url;

	public delete() {

		const question = this.translateService.instant('customer.action.delete.question');

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
		return new CustomerDataActions.SetState(this.item(), state);
	}

	public open(): void {
		this.store.dispatch(new CustomerPresentationActions.OpenDetails(this.item()));
	}

	public edit(): void {
		this.store.dispatch(new CustomerPresentationActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: this.item()
			}
		}));
	}

}
