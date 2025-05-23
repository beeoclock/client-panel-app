import {Component, input} from '@angular/core';
import {FilterForm} from "@tenant/balance/presentation/form/filter.form";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BalanceOrganizm} from "@tenant/balance/presentation/ui/organism/balance.organizm";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'balance-filter-component',
	standalone: true,
	imports: [
		PrimaryButtonDirective,
		TranslateModule,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		ReactiveFormsModule,
		BalanceOrganizm
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<div></div>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>
				</div>

			} @else {

				<div class="flex overflow-x-auto gap-2 p-2">
				</div>
				<div class="p-2">
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
			</div>
		}


		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {
				<button type="button" primary class="!py-3 !px-4 !text-base flex-1"
						(click)="openForm()">
					<i class="bi bi-plus-lg"></i>
					<!--				<span class="hidden xl:block">-->
					<!--					{{ 'balance.button.create' | translate }}-->
					<!--				</span>-->
				</button>
			}
		</ng-template>

		<balance-organizm/>

	`
})
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();

	constructor() {
		super();
		super.initHandlers();
	}

	@Dispatch()
	public openForm() {
		return new BalancePresentationActions.OpenForm()
	}
}
