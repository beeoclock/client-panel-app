import {ChangeDetectorRef, Component, inject, Input, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom, of} from "rxjs";
import {BooleanState} from "@utility/domain";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {BaseActions} from "@utility/state/base/base.actions";
import {Reactive} from "@utility/cdk/reactive";
import {TableService} from "@utility/table.service";
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
	selector: 'utility-list-page',
	template: ``
})
export abstract class ListPage<ITEM> extends Reactive implements OnInit {

	@Input()
	public mobileMode = false;


	protected readonly analyticsService = inject(AnalyticsService);
	protected readonly store = inject(Store);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly windowWidthSizeService = inject(WindowWidthSizeService);
	protected readonly tableService: TableService<ITEM> = inject(TableService);

	protected readonly getListParams?: Record<string, unknown>;

	public initialized = new BooleanState(false);

	public get isMobile$() {
		if (this.mobileMode) {
			return of(true);
		}
		return this.windowWidthSizeService.isMobile$;
	}

	public get isNotMobile$() {
		if (this.mobileMode) {
			return of(false);
		}
		return this.windowWidthSizeService.isNotMobile$;
	}

	public ngOnInit(): void {
		let action = new this.tableService.actions.GetList();
		if (this.getListParams) {
			action = new this.tableService.actions.GetList({
				queryParams: this.getListParams,
				...BaseActions.GetList.defaultPayload
			});
		}
		firstValueFrom(this.store.dispatch(action)).then(() => {
			this.initialized.switchOn();
			this.changeDetectorRef.detectChanges();
		});
	}
}
