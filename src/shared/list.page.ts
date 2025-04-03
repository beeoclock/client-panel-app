import {ChangeDetectorRef, Component, inject, input, OnInit} from "@angular/core";
import {Actions, Store} from "@ngxs/store";
import {of} from "rxjs";
import {BooleanState} from "@shared/domain";
import {WindowWidthSizeService} from "@core/cdk/window-width-size.service";
import {Reactive} from "@core/cdk/reactive";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'utility-list-page',
	template: ``
})
export abstract class ListPage extends Reactive implements OnInit {

	public readonly mobileMode = input<boolean>(false);

	protected readonly analyticsService = inject(AnalyticsService);
	protected readonly store = inject(Store);
	protected readonly actions = inject(Actions);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly windowWidthSizeService = inject(WindowWidthSizeService);
	protected readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);

	public initialized = new BooleanState(false);

	public get isMobile$() {
		if (this.mobileMode()) {
			return of(true);
		}
		return this.windowWidthSizeService.isMobile$;
	}

	public get isNotMobile$() {
		if (this.mobileMode()) {
			return of(false);
		}
		return this.windowWidthSizeService.isNotMobile$;
	}

	public ngOnInit(): void {
		this.initialized.switchOn();
	}
}
