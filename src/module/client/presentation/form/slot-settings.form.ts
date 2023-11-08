import {FormControl, FormGroup} from "@angular/forms";
import {SlotBuildingStrategyEnum} from "@client/domain/enum/slot-building-strategy.enum";

export interface ISlotSettingsForm {

	object: FormControl<'SlotSettings'>;
	slotIntervalInSeconds: FormControl<number>;
	slotBuildingStrategy: FormControl<SlotBuildingStrategyEnum>;

}

export class SlotSettingsForm extends FormGroup<ISlotSettingsForm> {

	constructor() {
		super({
			object: new FormControl(),
			slotIntervalInSeconds: new FormControl(),
			slotBuildingStrategy: new FormControl(),
		});

		this.initValue();
		this.initValidators();

	}

	private initValue(): void {
		this.controls.object.setValue('SlotSettings');
		this.controls.slotBuildingStrategy.setValue(SlotBuildingStrategyEnum.ByService);
		this.controls.slotIntervalInSeconds.setValue(0);
	}

	private initValidators(): void {
	}

}
