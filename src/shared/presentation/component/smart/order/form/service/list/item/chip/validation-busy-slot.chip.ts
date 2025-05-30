import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal, ViewEncapsulation} from "@angular/core";
import {ServiceOrderForm} from "@tenant/order/order/presentation/form/service.order.form";
import {TranslatePipe} from "@ngx-translate/core";
import {explicitEffect} from "ngxtension/explicit-effect";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";
import {StateEnum} from "@core/shared/enum/state.enum";

@Component({
	selector: 'validation-busy-slot-chip',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'px-3 py-2 rounded-xl border border-yellow-200 justify-center items-start flex flex-col w-full bg-yellow-50 text-yellow-700 text-sm',
		'[class.hidden]': 'hideMe()',
	},
	template: `
		<div class="flex items-center gap-2 w-full">
			<i class="bi bi-exclamation-triangle-fill text-yellow-500 text-lg"></i>
			{{ 'keyword.capitalize.warning' | translate }}
		</div>
		{{ 'keyword.capitalize.theSlotAlreadyTaken' | translate }}
	`,
	imports: [
		TranslatePipe
	],
})
export class ValidationBusySlotChip {

	public readonly control  = input.required<ServiceOrderForm>();
	public readonly hideMe = signal<boolean>(true);

	private readonly sharedUow = inject(SharedUow);
	private readonly destroyRef = inject(DestroyRef);

	public constructor() {
		explicitEffect([this.control], () => {
			const control = this.control();
			control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
				this.detectIfSlotIsBusy(control.getRawValue());
			});
			this.detectIfSlotIsBusy(control.getRawValue());
		});
	}

	public detectIfSlotIsBusy(value: IOrderServiceDto) {
		this.hideMe.set(true);
		const {orderAppointmentDetails} = value;
		if (!orderAppointmentDetails) {
			return;
		}
		const {specialists, start, end} = orderAppointmentDetails;
		if (specialists.length === 0 || !start || !end) {
			return;
		}
		const specialistIds = specialists.map(({member: {_id}}) => _id);
		this.findBySpecialistIdsAndDateTimeRange(specialistIds, start, end).then((busySlots) => {
			const filtered = busySlots.filter((slot) => {
				return slot._id !== value.orderId;
			});
			this.hideMe.set(!filtered.length);
		});
	}

	private findBySpecialistIdsAndDateTimeRange(specialistIds: string[], start: string, end: string) {
		return this.sharedUow.order.findBySpecialistIdsAndDateTimeRange(specialistIds, start, end, [StateEnum.active]);
	}

}
