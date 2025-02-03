import {Injectable} from "@angular/core";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {RESPONSE_IMemberMedia} from "@member/domain/interface/i.member-media";
import {MemberMediaEndpointEnum} from "@member/endpoint/member-media.endpoint";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
	providedIn: 'root'
})
export class PatchMemberMediaApiAdapter extends BaseApiAdapter<RESPONSE_IMemberMedia, [string, FormData]> {

	public override execute$(memberId: string, body: FormData) {
		return this.httpClient.patch<RESPONSE_IMemberMedia>(MemberMediaEndpointEnum.PATCH_MEMBER_MEDIA, body, {
        context: new HttpContext().set(TokensHttpContext.REPLACE, {
            memberId
        })
		});
	}

}
