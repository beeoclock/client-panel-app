import {Reactive} from "@utility/cdk/reactive";
import {Component, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {debounceTime, firstValueFrom, map} from "rxjs";
import {MS_HALF_SECOND} from "@utility/domain/const/c.time";
import {clearObjectClone} from "@utility/domain/clear.object";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";

@Component({
	selector: 'utility-base-filter-component',
	template: ``,
	standalone: true,
})
export abstract class BaseFilterComponent extends Reactive {

	private readonly windowWidthSizeService = inject(WindowWidthSizeService);

	public get isMobile$() {
		return this.windowWidthSizeService.isMobile$;
	}

	public get isNotMobile$() {
		return this.windowWidthSizeService.isNotMobile$;
	}

	protected readonly store = inject(Store);
	protected readonly form: any;
	protected readonly actions: any;
	protected readonly state: any;

	initHandlers() {

		this.store.select(this.state.tableState)
			.pipe(
				this.takeUntil(),
			)
			.subscribe(({filters}: any) => {
				Object.keys(filters).forEach((key) => {
					this.form.controls[key].patchValue(filters[key], {
						emitEvent: false,
						onlySelf: true,
					});
				})
			});
		this.form.valueChanges.pipe(
			debounceTime(MS_HALF_SECOND),
			map(clearObjectClone)
		).subscribe(async (value: any) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			await firstValueFrom(this.store.dispatch(new this.actions.UpdateFilters(value)));
			await firstValueFrom(this.store.dispatch(new this.actions.GetList()));
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});

	}

	public forceRefresh() {
		this.store.dispatch(new this.actions.GetList({force: true}))
	}
}
