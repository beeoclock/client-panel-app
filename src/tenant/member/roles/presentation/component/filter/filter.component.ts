import {Component, inject, input} from '@angular/core';
import {FilterForm} from "@tenant/member/roles/presentation/form/filter.form";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {SPECIALIST_LIMIT} from "@tenant/tenant.token";
import {is} from "@core/shared/checker";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ToastController} from "@ionic/angular/standalone";
import {RoleDataState} from "@tenant/member/roles/infrastructure/state/data/role.data.state";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";

@Component({
	selector: 'role-filter-component',
	standalone: true,
	imports: [
		TranslateModule,
		PrimaryButtonDirective,
		DefaultPanelComponent,
	],
	template: `

		<utility-default-panel-component>
			<!--			<ion-select-active class="px-4 py-2 border border-beeColor-300 rounded-2xl" [control]="form.controls.active"/>-->
			<div class="flex-1 p-2">
				<form class="flex items-center">
					<label for="simple-search" class="sr-only">Search</label>
					<div class="relative w-full">
						<!--						<utility-search-input-component [control]="form.controls.phrase"/>-->
					</div>
				</form>
			</div>
			@if (showButtonGoToForm()) {
				<div
					class="p-2 md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
					<button type="button" primary class="!py-3 !px-4 !text-base" (click)="openForm()">
						<i class="bi bi-plus-lg"></i>
						<!--					<span class="hidden md:block">-->
						<!--					{{ 'member.button.create' | translate }}-->
						<!--					</span>-->
					</button>
				</div>
			}
		</utility-default-panel-component>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();
	public override readonly state = RoleDataState;

	private readonly specialistLimit$ = inject(SPECIALIST_LIMIT);
	private readonly sharedUow = inject(SharedUow);
	private readonly toastController = inject(ToastController);
	private readonly translateService = inject(TranslateService);

	public constructor() {
		super();
		super.initHandlers();
	}

	public async openForm() {

		const specialistLimit = this.specialistLimit$.value;
		const actualRolesCount = await this.sharedUow.role.count();

		if (is.number(specialistLimit) && specialistLimit <= actualRolesCount) {
			const toast = await this.toastController.create({
				message: this.translateService.instant('role.toast.limit'),
				color: 'warning',
				duration: 5_000,
				position: 'top',
			});
			await toast.present();
			return;
		}

		this.store.dispatch(new RolePresentationActions.OpenForm());
	}

}
