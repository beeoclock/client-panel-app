import {inject, Injectable} from '@angular/core';
import * as Client from '@client/domain';
import {ISettings} from '@client/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {clientEndpointEnum} from "@client/endpoint/client.endpoint";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsApiAdapter extends ApiRepository<Client.ISettings> {

  private readonly httpClient = inject(HttpClient);


  /**
   * GET ITEM BY ID
   */
  public override item(): Promise<{
    data: Client.ISettings
  }> {
    return firstValueFrom(this.httpClient.post<Client.ISettings>(clientEndpointEnum.item, null)).then((data) => {
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
    return firstValueFrom(this.httpClient.put<ISettings>(clientEndpointEnum.update, value));
  }

  /**
   * ARCHIVE ITEM BY ID
   */
  public async archive(): Promise<void> {
    await firstValueFrom(this.httpClient.patch(clientEndpointEnum.archive, null))
  }

  /**
   * DELETE ITEM BY ID
   */
  public override async remove(): Promise<{
    deletedCount: number
  }> {
    return await firstValueFrom(this.httpClient.delete<{
      deletedCount: number
    }>(clientEndpointEnum.delete))
  }

}
