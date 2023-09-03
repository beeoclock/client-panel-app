import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {IBaseEntity} from "@utility/domain";

export interface IMediaBanner extends IBaseEntity {
  mediaType?: MediaTypeEnum.serviceBanner;
  object?: 'Media';
  media?: string;
}

export type IPatchMediaBanner = Pick<IMediaBanner, 'media' | '_id'>;
export type RIMediaBanner = Required<IMediaBanner>;
export type IListMediaBanner = RIMediaBanner[];
