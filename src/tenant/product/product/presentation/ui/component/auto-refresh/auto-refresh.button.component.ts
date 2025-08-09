import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {Store} from "@ngxs/store";

@Component({
	selector: 'product-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component
			id="product-auto-refresh"
			(emitter)="forceRefresh()"
		/>
	`,
	imports: [AutoRefreshComponent],
})
export class AutoRefreshButtonComponent {
	public readonly resetPage = input(false);

	public readonly resetParams = input(false);

	private readonly store = inject(Store);

	public forceRefresh() {
		// this.store.dispatch(
		// 	new ProductActions.GetList({
		// 		resetPage: this.resetPage(),
		// 		resetParams: this.resetParams(),
		// 	})
		// );
	}
}
