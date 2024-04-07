import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {IEvent} from "@event/domain";
import {Store} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";

@Component({
	selector: 'event-delete-button-component',
	standalone: true,
	template: `
		<button
			type="button"
			(click)="submit()"
			class="
				w-full
				flex
				items-center
				justify-center
				gap-2
				rounded-2xl
				px-3
				py-2
				text-sm
				font-semibold
				text-red-700
				bg-red-50
				shadow-sm
				ring-1
				ring-inset
				ring-red-300
				hover:bg-red-100">
			<i class="bi bi-trash"></i>
			{{ 'keyword.capitalize.delete' | translate }}
		</button>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule
	]
})
export class DeleteButtonComponent {

	@Input()
	public event!: IEvent;

	private readonly store = inject(Store);

	public submit() {
		this.store.dispatch(new EventActions.DeleteItem(this.event._id));
	}

}
