import {Component} from '@angular/core';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@tenant/event/presentation/form/filter.form";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {EventRequestedState} from "@tenant/event/presentation/state/event-requested/event-requested.state";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'event-requested-filter-component',
	standalone: true,
	imports: [
		DefaultPanelComponent,
		SearchInputComponent,
		AutoRefreshComponent,
		ReactiveFormsModule
	],
	template: `
		<utility-default-panel-component>
			<div class="flex overflow-x-auto gap-2">
				<utility-search-input-component [formControl]="form.controls.phrase"/>
				<utility-auto-refresh-component (emitter)="forceRefresh()"/>
			</div>
		</utility-default-panel-component>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public override readonly form = new FilterForm();
	public override readonly state = EventRequestedState;

	constructor() {
		super();
		super.initHandlers();
	}
}
