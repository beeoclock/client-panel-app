import {RIMedia} from "@module/media/domain/interface/i.media";

export interface IPresentation {
	banners: RIMedia[];
	color?: string | null;
}
