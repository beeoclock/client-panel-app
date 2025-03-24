import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {Store} from "@ngxs/store";
import {MemberDataActions} from "@member/presentation/state/data/member.data.actions";

@Component({
	selector: 'member-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="member-auto-refresh" (emitter)="forceRefresh()"/>
	`,
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	public readonly resetPage = input(false);

	public readonly resetParams = input(false);

	private readonly store = inject(Store);

	public forceRefresh() {
		this.store.dispatch(new MemberDataActions.GetList({
			resetPage: this.resetPage(),
			resetParams: this.resetParams(),
		}))
	}

}
