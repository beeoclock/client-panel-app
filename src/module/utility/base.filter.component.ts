import {Reactive} from "@utility/cdk/reactive";
import {Component, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {debounceTime, firstValueFrom, map} from "rxjs";
import {MS_HALF_SECOND} from "@utility/domain/const/c.time";
import {clearObjectClone} from "@utility/domain/clear.object";
import {FormGroup} from "@angular/forms";
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

	initHandlers(state: any, actions: any, form: FormGroup) {

		this.store.select(state.tableState)
			.pipe(
				this.takeUntil(),
			)
			.subscribe(({filters}: any) => {
				Object.keys(filters).forEach((key) => {
					form.controls[key].patchValue(filters[key], {
						emitEvent: false,
						onlySelf: true,
					});
				})
			});
		form.valueChanges.pipe(
			debounceTime(MS_HALF_SECOND),
			map(clearObjectClone)
		).subscribe(async (value) => {
			form.disable({
				emitEvent: false,
				onlySelf: true
			});
			await firstValueFrom(this.store.dispatch(new actions.UpdateFilters(value as any)));
			await firstValueFrom(this.store.dispatch(new actions.GetList()));
			form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});

	}
}
