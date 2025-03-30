import {MediaTypeEnum} from "@core/shared/enum/media.type.enum";
import {IBaseDTO} from "@shared/domain";

export interface IMediaBanner extends IBaseDTO<'Media'> {
	mediaType?: MediaTypeEnum.serviceBanner;
	media?: string;
}

export type IPatchMediaBanner = Pick<IMediaBanner, 'media' | '_id'>;
export type RIMediaBanner = Required<IMediaBanner>;
export type IListMediaBanner = RIMediaBanner[];
