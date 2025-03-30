import {Reactive} from "@core/cdk/reactive";
import {Component, effect, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {map} from "rxjs";
import {clearObjectClone} from "@shared/domain/clear.object";
import {WindowWidthSizeService} from "@core/cdk/window-width-size.service";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'utility-base-filter-component',
	template: ``,
	standalone: true,
})
export abstract class BaseFilterComponent extends Reactive {

	private readonly windowWidthSizeService = inject(WindowWidthSizeService);
	private readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);

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
		super();
		effect(() => {

			const filters = this.tableNgxDatatableSmartResource.filters();
			Object.keys(filters).forEach((key) => {
				if (!this.form.controls[key]) {
					return;
				}
				this.form.controls[key].patchValue(filters[key], {
					emitEvent: false,
					onlySelf: true,
				});
			})

		});
	}

	public initHandlers() {

		this.form.valueChanges.pipe(
			this.takeUntil(),
			map(clearObjectClone)
		).subscribe(async (filters: any) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			this.tableNgxDatatableSmartResource.filters.set(filters);
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});

	}

	public forceRefresh() {
		this.tableNgxDatatableSmartResource.reset();
		this.tableNgxDatatableSmartResource.parameters.update((parameters) => ({
			...parameters,
			page: 1,
		}));
	}
}
