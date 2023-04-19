import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import * as Utility from '@utility/domain';
import * as Service from '@service/domain';
import {ServiceFirebaseAdapter} from '@service/adapter/service.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class ServiceFormRepository extends Utility.Repository.Repository {
  private readonly storageAdapter: ServiceFirebaseAdapter = inject(ServiceFirebaseAdapter);

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.storageAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Service.IService>> {
    return this.storageAdapter.item(id);
  }

  public override list(): Promise<QuerySnapshot<Service.IService>> {
    return this.storageAdapter.list();
  }
}
