import {afterNextRender, ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {distinctUntilChanged, map} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {Actions, ofActionSuccessful} from "@ngxs/store";

@Component({
	selector: 'app-business-note-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslatePipe,
		AsyncPipe
	],
	template: `
		<textarea
			[placeholder]="'keyword.capitalize.noData' | translate"
			[formControl]="businessNoteControl"
			class="border rounded-2xl w-full" rows="4">
		</textarea>
		@if (isBusinessNoteHasChanges | async) {
			<div class="flex gap-2 justify-between">
				<button (click)="cancel()" class="rounded-2xl bg-neutral-500 text-white px-4 py-2 hover:bg-neutral-600 transition-all">
					{{ 'keyword.capitalize.cancel' | translate }}
				</button>
				<button (click)="save()" class="rounded-2xl bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all">
					{{ 'keyword.capitalize.save' | translate }}
				</button>
			</div>
		}
	`
})
export class BusinessNoteComponent {

	public readonly order = input.required<IOrder.DTO>();

	private readonly actions$ = inject(Actions);
	private initialBusinessNote: string = '';

	private readonly orderUpdateCase = this.actions$.pipe(
		ofActionSuccessful(
			OrderActions.UpdateItem,
		),
	).subscribe((action) => {
		console.log({action})
		this.initialBusinessNote = action.payload.businessNote;
		this.businessNoteControl.reset();
		this.businessNoteControl.setValue(this.initialBusinessNote);
	})

	public readonly businessNoteControl = new FormControl<string>('', {
		nonNullable: true,
	});

	public readonly isBusinessNoteHasChanges = this.businessNoteControl.valueChanges.pipe(
		distinctUntilChanged(),
		map((value) => {
			const currentBusinessNote = this.initialBusinessNote;
			return value !== currentBusinessNote;
		})
	)

	public constructor() {
		afterNextRender(() => {
			this.initialBusinessNote = this.getCurrentBusinessNote();
			this.businessNoteControl.setValue(this.getCurrentBusinessNote());
		});
	}

	public cancel(): void {
		this.businessNoteControl.setValue(this.initialBusinessNote);
	}

	public save(): void {
		this.dispatchOrderChanges({
			...this.order(),
			businessNote: this.businessNoteControl.value,
		});
	}

	@Dispatch()
	protected dispatchOrderChanges(item: IOrder.DTO): OrderActions.UpdateItem {
		return new OrderActions.UpdateItem(item);
	}

	public getCurrentBusinessNote(): string {
		return this.order()?.businessNote;
	}

}
