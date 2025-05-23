import {ChangeDetectorRef, Component, inject, input} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@core/cdk/reactive";
import {Store} from "@ngxs/store";

@Component({
	selector: 'utility-layout-list-component',
	template: ``
})
export default abstract class LayoutListComponent extends Reactive {

	public readonly isPage = input(true);

	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly ngxLogger = inject(NGXLogger);
	protected readonly store = inject(Store);

}

