import {inject, Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {IMember} from '@member/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {memberEndpointEnum} from "@member/endpoint/member.endpoint";
import {firstValueFrom} from "rxjs";
import {TableState_BackendFormat} from "@utility/domain/table.state";

@Injectable({
  providedIn: 'root'
})
export class MemberApiAdapter extends ApiRepository<Member.IMember> {

  private readonly httpClient = inject(HttpClient);

  /**
   * GET PAGED LIST BY FILTERS AND PARAMS
   * @param params
   */
  public override list(params: TableState_BackendFormat): Promise<{
    data: {
      items: Member.IMember[];
      total: number;
    }
  }> {
    return firstValueFrom(this.httpClient.post<{
      items: Member.IMember[];
      totalSize: number;
    }>(memberEndpointEnum.paged, params)).then(({totalSize, items}) => {
      return {
        data: {
          items,
          total: totalSize
        }
      };
    });
  }

  /**
   * GET ITEM BY ID
   * @param id
   */
  public override item(id: string): Promise<{
    data: Member.IMember
  }> {
    return firstValueFrom(this.httpClient.post<Member.IMember>(memberEndpointEnum.item, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    })).then((data) => {
      return {
        data
      };
    });
  }

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  public override save(value: Member.IMember): Promise<IMember> {
    if (value?._id?.length) {
      return firstValueFrom(this.httpClient.put<IMember>(memberEndpointEnum.update, value, {
        headers: {
          replace: JSON.stringify({
            id: value._id
          })
        }
      }));
    } else {
      return firstValueFrom(this.httpClient.post<IMember>(memberEndpointEnum.create, value));
    }
  }

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  public async archive(id: string): Promise<void> {
    await firstValueFrom(this.httpClient.patch(memberEndpointEnum.archive, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    }))
  }

  /**
   * DELETE ITEM BY ID
   * @param id
   */
  public override async remove(id: string): Promise<{
    deletedCount: number
  }> {
    return await firstValueFrom(this.httpClient.delete<{
      deletedCount: number
    }>(memberEndpointEnum.delete, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    }))
  }

}
