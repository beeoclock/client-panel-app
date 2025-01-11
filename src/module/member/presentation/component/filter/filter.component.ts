import {Component, input} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@member/presentation/form/filter.form";
import {MemberActions} from "@member/state/member/member.actions";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {MemberState} from "@member/state/member/member.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {NgIf} from "@angular/common";

@Component({
	selector: 'member-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		TranslateModule,
		PrimaryButtonDirective,
		RouterLink,
		DefaultPanelComponent,
		IonSelectActiveComponent,
		NgIf
	],
	template: `

		<utility-default-panel-component>
<!--			<ion-select-active class="px-4 py-2 border border-beeColor-300 rounded-2xl" [control]="form.controls.active"/>-->
			<div class="flex-1">
				<form class="flex items-center">
					<label for="simple-search" class="sr-only">Search</label>
					<div class="relative w-full">
<!--						<utility-search-input-component [control]="form.controls.phrase"/>-->
					</div>
				</form>
			</div>
			@if (showButtonGoToForm()) {
				<div
					class="md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
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
	public override readonly actions = MemberActions;
	public override readonly state = MemberState;

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new MemberActions.OpenForm());
	}

}
