import {inject, Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {firstValueFrom} from "rxjs";
import {TableState_BackendFormat} from "@utility/domain/table.state";

@Injectable({
  providedIn: 'root'
})
export class EventApiAdapter extends ApiRepository<Event.IEvent> {

  private readonly httpClient = inject(HttpClient);

  /**
   * GET PAGED LIST BY FILTERS AND PARAMS
   * @param params
   */
  public override list(params: TableState_BackendFormat): Promise<{
    data: {
      items: Event.IEvent[];
      total: number;
    }
  }> {
    return firstValueFrom(this.httpClient.post<{
      items: Event.IEvent[];
      totalSize: number;
    }>(eventEndpointEnum.paged, params)).then(({totalSize, items}) => {
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
    data: Event.IEvent
  }> {
    return firstValueFrom(this.httpClient.post<Event.IEvent>(eventEndpointEnum.item, null, {
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
  public override save(value: Event.IEvent): Promise<Event.IEvent> {
    if (value?._id?.length) {
      return firstValueFrom(this.httpClient.put<Event.IEvent>(eventEndpointEnum.update, value, {
        headers: {
          replace: JSON.stringify({
            id: value._id
          })
        }
      }));
    } else {
      return firstValueFrom(this.httpClient.post<Event.IEvent>(eventEndpointEnum.create, value));
    }
  }

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  public async archive(id: string): Promise<void> {
    await firstValueFrom(this.httpClient.patch(eventEndpointEnum.archive, null, {
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
    }>(eventEndpointEnum.delete, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    }))
  }

}
