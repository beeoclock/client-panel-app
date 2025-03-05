import {inject, Injectable} from "@angular/core";
import {MemberContextApiAdapter} from "@src/identity/module/identity/infrastructure/api/member-context.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class DeleteBusinessClientClientAdapter {

  private readonly memberContextApiAdapter = inject(MemberContextApiAdapter);

  /**
   *
   * @param id
   */
  public deleteBusinessClient(id: string) {
    return this.memberContextApiAdapter.deleteBusinessClient(id);
  }

}
