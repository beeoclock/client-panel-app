import {RIMedia} from "@module/media/domain/interface/i.media";

export interface IPresentation {
	object: "PresentationDto";
	banners: RIMedia[];
	color: string;
}
