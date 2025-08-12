import {IMedia} from "@tenant/media/domain/interface/i.media";

export interface IPresentation {
	object: "PresentationDto";
	banners: IMedia[];
	color: string;
}
