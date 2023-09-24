import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom} from 'rxjs';
import {Store} from "@ngxs/store";
import {FilterForm} from "@member/presentation/form/filter.form";
import {MemberActions} from "@member/state/member/member.actions";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {MS_HALF_SECOND} from "@utility/domain/const/c.time";

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
export class FilterComponent {
  public readonly store = inject(Store);
  public readonly form = new FilterForm();

  constructor() {
    this.form.valueChanges.pipe(
      debounceTime(MS_HALF_SECOND),
    ).subscribe(async (value) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
      await firstValueFrom(this.store.dispatch(new MemberActions.UpdateFilters(value as any)));
      await firstValueFrom(this.store.dispatch(new MemberActions.GetList()));
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
    });
  }
}
