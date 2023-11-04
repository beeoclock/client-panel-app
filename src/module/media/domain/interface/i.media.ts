import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {IBaseEntity} from "@utility/domain";

export interface IMedia extends IBaseEntity<'Media'> {
  mediaType?: MediaTypeEnum;
  media?: string;
}

export type RIMedia = Required<IMedia>;
export type IListMedia = RIMedia[];
