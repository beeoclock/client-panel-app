import {RIBaseEntity} from "@src/module/utility/domain";

export type BannerType = {
	_id: string;
	url: string;
	mediaType: "serviceBanner";
};

export interface IPresentation extends RIBaseEntity<'Service.Presentation'> {
	banners?: BannerType[];
}
