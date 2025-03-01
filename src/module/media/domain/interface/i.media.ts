import {MediaTypeEnum} from "@core/shared/enum/media.type.enum";
import {IBaseDTO} from "@utility/domain";

export interface IMedia extends IBaseDTO<'MediaDto'> {
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
