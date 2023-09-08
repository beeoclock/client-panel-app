import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {IBaseEntity} from "@utility/domain";

export interface IMedia extends IBaseEntity {
  mediaType?: MediaTypeEnum;
  object?: 'Media';
  media?: string;
}

export type RIMedia = Required<IMedia>;
export type IListMedia = RIMedia[];
