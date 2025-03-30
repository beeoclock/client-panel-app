import {FormControl, FormGroup} from "@angular/forms";
import {SlotBuildingStrategyEnum} from "@tenant/business-profile/domain/enum/slot-building-strategy.enum";
import {SlotRetrievingStrategyEnum} from "@core/shared/enum/slot-retrieving-strategy.enum";

export interface ISlotSettingsForm {

	object: FormControl<'SlotSettings'>;
	slotIntervalInSeconds: FormControl<number>;
	slotBuildingStrategy: FormControl<SlotBuildingStrategyEnum>;
	slotRetrievingStrategy: FormControl<SlotRetrievingStrategyEnum>;

}

export class SlotSettingsForm extends FormGroup<ISlotSettingsForm> {

	constructor() {
		super({
			object: new FormControl('SlotSettings', {
				nonNullable: true,
			}),
			slotIntervalInSeconds: new FormControl(0, {
				nonNullable: true,
			}),
			slotBuildingStrategy: new FormControl(SlotBuildingStrategyEnum.ByService, {
				nonNullable: true,
			}),
			slotRetrievingStrategy: new FormControl(SlotRetrievingStrategyEnum.IncludeRequested, {
				nonNullable: true,
			}),
		});

	}

}
