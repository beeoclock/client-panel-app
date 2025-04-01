import {SlotBuildingStrategyEnum} from "@tenant/business-profile/domain/enum/slot-building-strategy.enum";

export interface ISlotSettings {
	object: 'SlotSettings';
	slotIntervalInSeconds: number;
	slotBuildingStrategy: SlotBuildingStrategyEnum;
}
