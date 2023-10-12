import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@service/presentation/form/filter.form";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {ServiceState} from "@service/state/service/service.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {
	IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";

@Component({
	selector: 'service-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		TranslateModule,
		RouterLink,
		PrimaryButtonDirective,
		IonSelectActiveComponent,
		IonSelectEventStatusComponent,
		DefaultPanelComponent
	],
	template: `
		<utility-default-panel-component>
			<div class="flex overflow-x-auto gap-4">
				<utility-search-input-component [control]="form.controls.phrase"/>
				<ion-select-active class="px-4 py-2 border border-beeColor-200 rounded-2xl" [control]="form.controls.active"/>
			</div>
			<div class="">
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					<span class="hidden md:block">
						{{ 'keyword.capitalize.add-service' | translate }}
					</span>
				</button>
			</div>
		</utility-default-panel-component>
	`
})
export class FilterComponent extends BaseFilterComponent {
	public readonly form = new FilterForm();

	constructor() {
		super();
		super.initHandlers(ServiceState, ServiceActions, this.form);
	}
}
