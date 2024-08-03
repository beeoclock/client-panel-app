import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {Store} from "@ngxs/store";
import {AbsenceActions} from "@absence/state/absence/absence.actions";

@Component({
	selector: 'app-absence-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="absence-auto-refresh" (emitter)="forceRefresh()"/>
	`,
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	@Input()
	public resetPage = false;

	@Input()
	public resetParams = false;

	private readonly store = inject(Store);

	public forceRefresh() {
		this.store.dispatch(new AbsenceActions.GetList({
			resetPage: this.resetPage,
			resetParams: this.resetParams,
		}))
	}

}
