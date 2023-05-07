import {inject, Injectable} from '@angular/core';
import {collection, CollectionReference, Firestore} from '@angular/fire/firestore';
import {Functions, httpsCallable, HttpsCallableResult} from "@angular/fire/functions";
import {Notification} from "@utility/domain/notification";
import {NotImplementedYetError} from "@utility/domain/error";

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionFirebaseAdapter<ITEM> {

  private readonly firestore: Firestore = inject(Firestore);
  private readonly functions = inject(Functions);

  public itemsCollection!: CollectionReference<ITEM>;
  #cloudFunction: {
    write: ReturnType<typeof httpsCallable>,
    read: ReturnType<typeof httpsCallable<string, ITEM>>,
    pagination: ReturnType<typeof httpsCallable<{
      pageSize: number;
      page: number;
      orderBy: string;
      orderDir: string;
      filters: {};
    }, {
      items: ITEM[];
      total: number;
    }>>,
    delete: ReturnType<typeof httpsCallable>
  } | undefined;
  private path: string | undefined;

  public initCollectionReference(path: string): void {
    if (this.path) {
      return;
    }
    this.path = path;
    this.itemsCollection = collection(this.firestore, this.path) as CollectionReference<ITEM>;

    this.#cloudFunction = {
      write: httpsCallable(this.functions, `${this.path}Write`),
      read: httpsCallable(this.functions, `${this.path}Read`),
      pagination: httpsCallable(this.functions, `${this.path}Pagination`),
      delete: httpsCallable(this.functions, `${this.path}Delete`)
    };
  }

  public save(value: ITEM): Promise<any> {
    if (!this.#cloudFunction?.write) {
      throw new NotImplementedYetError();
    }
    return this.#cloudFunction.write(value).then((result) => {
      Notification.push({
        message: 'success'
      });
      return result;
    });
  }

  public item(id: string): Promise<HttpsCallableResult<ITEM>> {
    if (!this.#cloudFunction?.read) {
      throw new NotImplementedYetError();
    }
    return this.#cloudFunction.read(id);
  }

  public remove(id: string): Promise<HttpsCallableResult<any> | null> {
    if (!this.#cloudFunction?.delete) {
      throw new NotImplementedYetError();
    }
    if (confirm('Are you shore?')) {
      return this.#cloudFunction.delete(id);
    }
    return new Promise((resolve) => resolve(null));
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
    if (!this.#cloudFunction?.pagination) {
      throw new NotImplementedYetError();
    }
    return this.#cloudFunction.pagination({
      pageSize,
      page,
      orderBy,
      orderDir,
      filters
    });
  }

}
