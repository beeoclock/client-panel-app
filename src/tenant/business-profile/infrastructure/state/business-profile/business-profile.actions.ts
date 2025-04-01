import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";

export namespace BusinessProfileActions {

	export class Init {
		public static readonly type = '[Business Profile API] Get Item';
	}

	export class Update {
		public static readonly type = '[Business Profile API] Update Item';

		public constructor(
			public readonly item: IBusinessProfile.DTO
		) {
		}
	}

}
