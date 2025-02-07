import {IBusinessProfile} from "@client/domain/interface/i.business-profile";

export namespace ClientActions {

  export class InitClient {
    public static readonly type = '[Client API] Get Item';
  }

  export class UpdateClient {
    public static readonly type = '[Client API] Update Item';
	public constructor(public item: IBusinessProfile.DTO) {

	}
  }

}
