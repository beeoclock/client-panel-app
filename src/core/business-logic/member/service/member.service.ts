import {IMember} from "@core/business-logic/member/interface/i.member";
import {BaseService} from "@core/shared/service/base.service";
import {StateEnum} from "@core/shared/enum/state.enum";

type ENTITY_RAW = IMember.EntityRaw;

export class MemberService extends BaseService<ENTITY_RAW> {

	public async findOneByEmailPhone(either: {
		email?: string | null;
		phone?: string | null;
	}) {
		if (either?.email && either.email.length > 0) {
			// Find by email
			const item = await this.db.where('email').equals(either.email).first();
			if (item) return item;
		}

		if (either?.phone && either.phone.length > 0) {
			// Find by phone
			const item = await this.db.where('phone').equals(either.phone).first();
			if (item) return item;
		}

		return null;
	}

	public count() {
		return this.db.where('state').equals(StateEnum.active).count();
	}

}
