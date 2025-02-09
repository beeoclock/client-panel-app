import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {IBaseEntity} from "@utility/domain";

export interface IMedia extends IBaseEntity<'MediaDto'> {
	mediaType?: MediaTypeEnum;
	url: string;
	metadata: {
		object: "MediaMetadataDto";
		height: number;
		size: number;
		width: number;
	};
}

export type RIMedia = Required<IMedia>;
export type IListMedia = RIMedia[];
