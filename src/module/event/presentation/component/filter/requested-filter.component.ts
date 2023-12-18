import {Component} from '@angular/core';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@event/presentation/form/filter.form";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";
import {EventRequestedActions} from "@event/state/event-requested/event-requested.actions";

@Component({
	selector: 'event-requested-filter-component',
	standalone: true,
	imports: [
		DefaultPanelComponent,
		SearchInputComponent,
		AutoRefreshComponent
	],
	template: `
		<utility-default-panel-component [roundedBottom]="false">
			<div class="flex overflow-x-auto gap-4">
				<utility-search-input-component [control]="form.controls.phrase"/>
				<utility-auto-refresh-component (emitter)="forceRefresh()"/>
			</div>
		</utility-default-panel-component>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public override readonly form = new FilterForm();
	public override readonly actions = EventRequestedActions;
	public override readonly state = EventRequestedState;

	constructor() {
		super();
		super.initHandlers();
	}
}
