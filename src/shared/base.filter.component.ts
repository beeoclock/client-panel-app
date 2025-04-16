import {Component, DestroyRef, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {map} from "rxjs";
import {clearObjectClone} from "@shared/domain/clear.object";
import {WindowWidthSizeService} from "@core/cdk/window-width-size.service";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {explicitEffect} from "ngxtension/explicit-effect";
import {AbstractControl} from "@angular/forms";

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

	protected readonly abstract form: AbstractControl;

	protected readonly store = inject(Store);
	protected readonly state: any;

	public constructor() {

		if (this.tableNgxDatatableSmartResource) {

			explicitEffect([this.tableNgxDatatableSmartResource.parameters], ([parameters]) => {

				if (parameters) {
					this.form.patchValue(parameters, {
						emitEvent: false,
						onlySelf: true
					});
				}

			});

			explicitEffect([this.tableNgxDatatableSmartResource.isLoading], ([isLoading]) => {

				if (isLoading) {
					this.form.disable({
						emitEvent: false,
						onlySelf: true
					});
				} else {
					this.form.enable({
						emitEvent: false,
						onlySelf: true
					});
				}

			});

		}

	}

	public initHandlers() {

		this.form.valueChanges.pipe(
			takeUntilDestroyed(this.destroyRef),
			map((value) => clearObjectClone(value))
		).subscribe((filters: any) => {
			this.tableNgxDatatableSmartResource?.setFilters(filters);
		});

	}

	public forceRefresh() {
		this.tableNgxDatatableSmartResource?.reload();
	}
}
