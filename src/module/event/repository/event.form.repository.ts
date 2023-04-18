import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import * as Utility from '@utility/domain';
import * as Event from '@event/domain';
import {EventFirebaseAdapter} from '@event/adapter/event.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class EventFormRepository extends Utility.Repository.Repository {
  private readonly customerAdapter: EventFirebaseAdapter = inject(EventFirebaseAdapter);

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.customerAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Event.Interface.IEvent>> {
    return this.customerAdapter.item(id);
  }

  public override list(): Promise<QuerySnapshot<Event.Interface.IEvent>> {
    return this.customerAdapter.list();
  }
}
