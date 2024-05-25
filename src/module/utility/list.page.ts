import {ChangeDetectorRef, Component, inject, Input, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom, of} from "rxjs";
import {BooleanState} from "@utility/domain";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {BaseActions} from "@utility/state/base/base.actions";

@Component({
	selector: 'utility-list-page',
	template: ``
})
export abstract class ListPage implements OnInit {

	@Input()
	public mobileMode = false;

	protected readonly store = inject(Store);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly windowWidthSizeService = inject(WindowWidthSizeService);
	public readonly actions!: {
		GetList: any;
	};

	protected readonly getListParams: unknown | null = null;

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
		let action = new this.actions.GetList();
		if (this.getListParams) {
			action = new this.actions.GetList({
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
