import {SlotBuildingStrategyEnum} from "@core/business-logic/business-profile/enum/slot-building-strategy.enum";

export interface ISlotSettings {
	object: 'SlotSettings';
	slotIntervalInSeconds: number;
	slotBuildingStrategy: SlotBuildingStrategyEnum;
}
