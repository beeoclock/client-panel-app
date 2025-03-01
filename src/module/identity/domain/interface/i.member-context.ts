import {IBaseDTO, IBaseEntityRaw} from "@utility/domain";
import {Tools} from "@src/core/shared/tools";


export namespace IMemberContext {

	export interface DTO extends IBaseDTO<'MemberContextDto'> {
		account: {
			_id: string;
		};
		client: {
			_id: string;
			name: string;
		}
	}

	export interface EntityRaw extends IBaseEntityRaw<'MemberContextDto'>, DTO {

	}

}

export const isMemberContext = Tools.createIs<IMemberContext.DTO>();
export const validMemberContext = Tools.createValidate<IMemberContext.DTO>();
export const randomMemberContext = Tools.createRandom<IMemberContext.DTO>();
