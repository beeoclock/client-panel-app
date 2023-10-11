import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@member/presentation/form/filter.form";
import {MemberActions} from "@member/state/member/member.actions";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {MemberState} from "@member/state/member/member.state";
import {BaseFilterComponent} from "@utility/base.filter.component";

@Component({
	selector: 'member-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		TranslateModule,
		PrimaryButtonDirective,
		RouterLink
	],
	template: `
		<utility-filter-panel-component>
			<utility-search-input-component start [control]="form.controls.search"/>
			<ng-container end>
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					{{ 'member.button.create' | translate }}
				</button>
			</ng-container>
		</utility-filter-panel-component>
	`
})
export class FilterComponent extends BaseFilterComponent {
	public readonly form = new FilterForm();

	constructor() {
		super();
		super.initHandlers(MemberState, MemberActions, this.form);
	}
}
