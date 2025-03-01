import {Injectable} from "@angular/core";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {MemberMediaEndpointEnum} from "@member/infrastructure/endpoint/member-media.endpoint";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
    providedIn: 'root'
})
export class DeleteMemberMediaApiAdapter extends BaseApiAdapter<void, [string]> {

    public override execute$(memberId: string) {
        return this.httpClient.delete<void>(MemberMediaEndpointEnum.PATCH_MEMBER_MEDIA, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
                memberId
            })
        });
    }

}
