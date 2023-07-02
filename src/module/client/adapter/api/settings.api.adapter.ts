import {inject, Injectable} from '@angular/core';
import * as Client from '@client/domain';
import {ISettings} from '@client/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {clientEndpointEnum} from "@client/endpoint/client.endpoint";
import {firstValueFrom} from "rxjs";
import {TableState_BackendFormat} from "@utility/domain/table.state";

@Injectable({
  providedIn: 'root'
})
export class SettingsApiAdapter extends ApiRepository<Client.ISettings> {

  private readonly httpClient = inject(HttpClient);

  /**
   * GET PAGED LIST BY FILTERS AND PARAMS
   * @param params
   */
  public override list(params: TableState_BackendFormat): Promise<{
    data: {
      items: Client.ISettings[];
      total: number;
    }
  }> {
    return firstValueFrom(this.httpClient.post<{
      items: Client.ISettings[];
      totalSize: number;
    }>(clientEndpointEnum.paged, params)).then(({totalSize, items}) => {
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
    data: Client.ISettings
  }> {
    return firstValueFrom(this.httpClient.post<Client.ISettings>(clientEndpointEnum.item, null, {
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
  public override save(value: Client.ISettings): Promise<ISettings> {
    if (value?._id?.length) {
      return firstValueFrom(this.httpClient.put<ISettings>(clientEndpointEnum.update, value, {
        headers: {
          replace: JSON.stringify({
            id: value._id
          })
        }
      }));
    } else {
      return firstValueFrom(this.httpClient.post<ISettings>(clientEndpointEnum.create, value));
    }
  }

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  public async archive(id: string): Promise<void> {
    await firstValueFrom(this.httpClient.patch(clientEndpointEnum.archive, null, {
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
    }>(clientEndpointEnum.delete, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    }))
  }

}
