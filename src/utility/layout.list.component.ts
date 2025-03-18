import {ChangeDetectorRef, Component, inject, input, output} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {FiltersType} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'utility-layout-list-component',
	template: ``
})
export default abstract class LayoutListComponent extends Reactive {

	public readonly isPage = input(true);

	public readonly filters = output<FiltersType>();

	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly ngxLogger = inject(NGXLogger);

}

