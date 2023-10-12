import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@event/presentation/form/filter.form";
import {EventActions} from "@event/state/event/event.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {
	IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {EventState} from "@event/state/event/event.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";

@Component({
	selector: 'event-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		RouterLink,
		TranslateModule,
		IonSelectEventStatusComponent,
		IonSelectActiveComponent,
		DefaultPanelComponent
	],
	template: `
		<utility-default-panel-component>
			<ion-select-event-status class="px-4 py-2 border border-beeColor-200 rounded-2xl" [control]="form.controls.status"/>
			<div class="flex-1">
				<form class="flex items-center">
					<label for="simple-search" class="sr-only">Search</label>
					<div class="relative w-full">
						<utility-search-input-component [control]="form.controls.phrase"/>
					</div>
				</form>
			</div>
			<div
				class="md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					<span class="hidden md:block">
						{{ 'keyword.capitalize.add-event' | translate }}
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
		super.initHandlers(EventState, EventActions, this.form);
	}
}
