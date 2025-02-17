import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

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
