import {ChangeDetectionStrategy, Component, input, output, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";
import ObjectID from "bson-objectid";
import {TranslateModule} from "@ngx-translate/core";
import {IService} from "@tenant/service/domain/interface/i.service";
import {
	ServiceChipPagination
} from "@shared/presentation/ui/component/smart/order/form/service/list/item/chip/service/service.chip.pagination";
import {
	ServicePopoverChipComponent
} from "@shared/presentation/ui/component/smart/order/form/service/list/item/chip/service/service-popover.chip.component";
import {explicitEffect} from "ngxtension/explicit-effect";

@Component({
	selector: 'app-service-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		ServicePopoverChipComponent,
	],
	providers: [
		ServiceChipPagination
	],
	template: `

		<button
			[id]="'select-service-' + id()"
			class="ps-0 pe-2 border border-gray-200 justify-center items-center flex gap-1 bg-white rounded-lg hover:bg-neutral-300 hover:border-neutral-400">

			@if (serviceFormControl.value; as service) {

				<div class="block min-h-[32px]">
					<div
						class="h-full rounded-xl w-3 flex items-center min-h-[32px]"
						[style.background-color]="service.presentation.color">
						{{ service.presentation.color ? '' : '❓' }}
					</div>
				</div>
				<div class="justify-start items-center flex py-2">
					<div class="text-black text-sm font-bold text-left break-all">
						{{ service.languageVersions[0]?.title }}
					</div>
				</div>

			} @else {
				<!-- Error: No assigned specialist -->
				<div class="text-red-500 text-sm font-normal px-2 py-1">
					{{ 'order.form.chip.service.noAssigned' | translate }}
				</div>
			}
			<i class="bi bi-chevron-expand"></i>
		</button>

		<app-service-popover-chip-component [trigger]="'select-service-' + id()" (result)="setService($event)"/>
	`
})
export class ServiceChipComponent {

	public readonly initialValue = input<IService.DTO | null>(null);

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly serviceChanges = output<IService.DTO>();

	public readonly serviceFormControl = new FormControl<IService.DTO | null>(null);

	public constructor() {
		explicitEffect([this.initialValue], () => {
			this.initService();
		})
	}

	public initService() {
		const initialValue = this.initialValue();
		this.serviceFormControl.setValue(initialValue);
	}

	public setService(service: IService.DTO | null) {
		if (!service) {
			return;
		}
		if (service._id !== this.serviceFormControl.getRawValue()?._id) {
			this.serviceFormControl.setValue(service);
			this.serviceChanges.emit(service);
		}
	}


}
