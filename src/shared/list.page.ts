import {afterNextRender, ChangeDetectorRef, Directive, inject, input, signal} from "@angular/core";
import {Actions, Store} from "@ngxs/store";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Directive()
export class ListPage {

	public readonly mobileMode = input<boolean>(false);

	protected readonly analyticsService = inject(AnalyticsService);
	protected readonly store = inject(Store);
	protected readonly actions = inject(Actions);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource, {optional: true});

	public readonly initialized = signal(false);

	public constructor() {
		afterNextRender(() => {
			this.initialized.set(true);
		});
	}

}
