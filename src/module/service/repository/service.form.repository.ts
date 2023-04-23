import {inject, Injectable} from '@angular/core';
import {
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where
} from '@angular/fire/firestore';
import * as Service from '@service/domain';
import {IService} from '@service/domain';
import {ServiceFirebaseAdapter} from '@service/adapter/service.firebase.adapter';
import {Repository} from '@utility/repository/repository';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '@utility/domain/model';
import BooleanStateModel from '@utility/boolean.state.model';
import {is} from 'thiis';
import {FilterForm} from '@service/form/filter.form';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ServiceFormRepository extends Repository {

  #lastDocumentRef: QueryDocumentSnapshot<IService> | undefined;

  private readonly translateService = inject(TranslateService);
  private readonly storageAdapter = inject(ServiceFirebaseAdapter);

  readonly #state$ = new BehaviorSubject<PaginationModel<Service.IService>>(new PaginationModel());
  public readonly loading = new BooleanStateModel(false);

  public get state$(): Observable<PaginationModel<Service.IService>> {
    return this.#state$.asObservable();
  }

  public readonly filterForm = new FilterForm();

  public init(): void {
    this.updateState();
  }

  public updateState(newState: any = {}): void {
    if (this.loading.isOff) {
      this.loading.switchOn();

      if (is.object.not.empty(newState)) {

        this.loading.switchOff();
        this.#state$.next(newState);

      } else {

        this.makeRequest();

      }
    }

  }

  private makeRequest(): void {

    const {orderDir: directionStr, pageSize} = this.#state$.value;
    let {orderBy: fieldPath} = this.#state$.value;

    const additionalRequestParams: any = [];

    if (this.#lastDocumentRef) {
      additionalRequestParams.push(startAfter(this.#lastDocumentRef))
    }

    const {search} = this.filterForm.value;

    if (search) {
      const currentLanguage = this.translateService.getDefaultLang();
      fieldPath = `languageVersions.${currentLanguage}.title`;
      additionalRequestParams.push(where(fieldPath, '>=', search));
      additionalRequestParams.push(where(fieldPath, '<=', `${search}\\ut8ff`));
    }

    const request = query(
      this.storageAdapter.itemsCollection,
      orderBy(fieldPath, directionStr),
      limit(pageSize),
      ...additionalRequestParams
    );
    getDocs(request)
      .then((response) => {
        this.#lastDocumentRef = response.docs.at(-1);
        const items = response.docs.map((documentRef) => ({
          id: documentRef.id,
          ...documentRef.data()
        }));
        const newPagination = new PaginationModel<IService>();
        newPagination.items = items;
        this.#state$.next(this.#state$.value.updateFromObject(newPagination.toObject()));
      })
      .finally(() => {
        this.loading.switchOff();
      });

  }

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.storageAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Service.IService>> {
    return this.storageAdapter.item(id);
  }


}
