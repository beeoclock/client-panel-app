import {Component, DestroyRef, effect, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {map} from "rxjs";
import {clearObjectClone} from "@shared/domain/clear.object";
import {WindowWidthSizeService} from "@core/cdk/window-width-size.service";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'utility-base-filter-component',
	template: ``,
	standalone: true,
})
export abstract class BaseFilterComponent {

	private readonly destroyRef = inject(DestroyRef);
	private readonly windowWidthSizeService = inject(WindowWidthSizeService);
	private readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource, {optional: true});

	public get isMobile$() {
		return this.windowWidthSizeService.isMobile$;
	}

	public get isNotMobile$() {
		return this.windowWidthSizeService.isNotMobile$;
	}

	protected readonly store = inject(Store);
	protected readonly form: any;
	protected readonly state: any;

	public constructor() {
		effect(() => {

			const filters = this.tableNgxDatatableSmartResource?.filters();
			if (filters) {

				Object.keys(filters).forEach((key) => {
					if (!this.form.controls[key]) {
						return;
					}
					this.form.controls[key].patchValue(filters[key], {
						emitEvent: false,
						onlySelf: true,
					});
				})
			}

		});

	}

	public initHandlers() {

		this.form.valueChanges.pipe(
			takeUntilDestroyed(this.destroyRef),
			map((value) => clearObjectClone(value))
		).subscribe(async (filters: any) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			this.tableNgxDatatableSmartResource?.filters.set(filters);
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});

	}

	public forceRefresh() {
		this.tableNgxDatatableSmartResource?.reload();
	}
}
