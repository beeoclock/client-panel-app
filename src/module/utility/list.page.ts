import {ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {BooleanState} from "@utility/domain";

@Component({
	selector: 'utility-list-page',
	template: ``
})
export abstract class ListPage implements OnInit {

	public readonly store = inject(Store);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly actions!: {
		GetList: any;
	};
	public readonly someDataExist = new BooleanState(false);

	public initialized = new BooleanState(false);

	public ngOnInit(): void {
		firstValueFrom(this.store.dispatch(new this.actions.GetList())).then(() => {
			this.initialized.switchOn();
			this.changeDetectorRef.detectChanges();
		});
	}
}
