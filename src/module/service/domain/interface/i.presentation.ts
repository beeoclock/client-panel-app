import {RIBaseEntity} from "@src/module/utility/domain";
import {RIMedia} from "@module/media/domain/interface/i.media";

export interface IPresentation extends RIBaseEntity<'Service.Presentation'> {
	banners?: RIMedia[];
	color?: string | null;
}
