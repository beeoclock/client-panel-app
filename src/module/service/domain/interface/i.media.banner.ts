import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {IBaseEntity} from "@utility/domain";

export interface IMediaBanner extends IBaseEntity<'Media'> {
  mediaType?: MediaTypeEnum.serviceBanner;
  media?: string;
}

export type IPatchMediaBanner = Pick<IMediaBanner, 'media' | '_id'>;
export type RIMediaBanner = Required<IMediaBanner>;
export type IListMediaBanner = RIMediaBanner[];
