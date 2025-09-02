import {ChangeDetectorRef, Directive, inject, input} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {Store} from "@ngxs/store";

@Directive()
export default class LayoutListComponent {

	public readonly isPage = input(true);

	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly ngxLogger = inject(NGXLogger);
	protected readonly store = inject(Store);

}

