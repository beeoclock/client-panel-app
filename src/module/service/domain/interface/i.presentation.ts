import {IBaseEntity} from "@src/module/utility/domain";
import {RIMedia} from "@module/media/domain/interface/i.media";

export interface IPresentation extends IBaseEntity<'Service.Presentation'> {
	banners?: RIMedia[];
	color?: string | null;
}
