import {IBaseEntity} from "@utility/domain";
import IBaseItem from "@src/core/interface/i.base-item";
import {Tools} from "@utility/tools";


export namespace IMemberContext {

	export interface DTO extends IBaseEntity<'MemberContextDto'> {
		account: {
			_id: string;
		};
		client: {
			_id: string;
			name: string;
		}
	}

	export interface Entity extends IBaseItem<'MemberContextDto', DTO>, DTO {

	}

}

export const isMemberContext = Tools.createIs<IMemberContext.DTO>();
export const validMemberContext = Tools.createValidate<IMemberContext.DTO>();
export const randomMemberContext = Tools.createRandom<IMemberContext.DTO>();
