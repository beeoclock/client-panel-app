import {RIMedia} from "@tenant/media/domain/interface/i.media";

export interface IPresentation {
	object: "PresentationDto";
	banners: RIMedia[];
	color: string;
}
