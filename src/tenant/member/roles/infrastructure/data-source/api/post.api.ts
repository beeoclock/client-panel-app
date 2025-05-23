import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {IRole} from "@tenant/member/roles/domain";
import {roleEndpointEnum} from "@tenant/member/roles/infrastructure/endpoint/role.endpoint";

@Injectable()
export class PostApi extends BaseApiAdapter<IRole.DTO, [IRole.DTO]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: IRole.DTO) {
    return this.httpClient.post<IRole.DTO>(roleEndpointEnum.create, value);
  }

}
