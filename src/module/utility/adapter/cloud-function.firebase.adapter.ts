import {inject, Injectable} from '@angular/core';
import {collection, CollectionReference, Firestore} from '@angular/fire/firestore';
import {Functions, httpsCallable, HttpsCallableResult} from "@angular/fire/functions";
import {Notification} from "@utility/notification";
import {NotImplementedYetError} from "@utility/domain/error";

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionFirebaseAdapter<ITEM> {

  private readonly firestore: Firestore = inject(Firestore);
  private readonly functions = inject(Functions);

  public itemsCollection!: CollectionReference<ITEM>;
  private path: string | undefined;
  private write: ReturnType<typeof httpsCallable> | undefined;
  private read: ReturnType<typeof httpsCallable<string, ITEM>> | undefined;
  private pagination: ReturnType<typeof httpsCallable<{
    pageSize: number;
    page: number;
    orderBy: string;
    orderDir: string;
    filters: {};
  }, {
    items: ITEM[];
    total: number;
  }>> | undefined;
  private delete: ReturnType<typeof httpsCallable> | undefined;

  public initCollectionReference(path: string): void {
    if (this.path) {
      return;
    }
    this.path = path;
    this.itemsCollection = collection(this.firestore, this.path) as CollectionReference<ITEM>;

    this.write = httpsCallable(this.functions, `${this.path}Write`);
    this.read = httpsCallable(this.functions, `${this.path}Read`);
    this.pagination = httpsCallable(this.functions, `${this.path}Pagination`);
    this.delete = httpsCallable(this.functions, `${this.path}Delete`);
  }

  public save(value: ITEM): Promise<any> {
    if (!this.write) {
      throw new NotImplementedYetError();
    }
    return this.write(value).then((result) => {
      Notification.push({
        message: 'success'
      });
      return result;
    });
  }

  public item(id: string): Promise<HttpsCallableResult<ITEM>> {
    if (!this.read) {
      throw new NotImplementedYetError();
    }
    return this.read(id);
  }

  public remove(id: string): Promise<HttpsCallableResult<any>> {
    if (!this.delete) {
      throw new NotImplementedYetError();
    }
    return this.delete(id);
  }

  public list(
    pageSize: number,
    page: number,
    orderBy: string,
    orderDir: string,
    filters: {}
  ): Promise<HttpsCallableResult<{
    items: ITEM[];
    total: number;
  }>> {
    if (!this.pagination) {
      throw new NotImplementedYetError();
    }
    return this.pagination({
      pageSize,
      page,
      orderBy,
      orderDir,
      filters
    });
  }

}
