import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
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
import {Functions, httpsCallableData} from '@angular/fire/functions';

@Injectable()
export class ServiceFormRepository extends Repository {

  private readonly translateService = inject(TranslateService);
  private readonly storageAdapter = inject(ServiceFirebaseAdapter);
  private readonly functions = inject(Functions);

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

    const {orderDir, orderBy, pageSize, page} = this.#state$.value;

    const {search} = this.filterForm.value;
    const filters = {};

    if (search) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters['$or'] = [
        {
          languageVersions: {
            $elemMatch: {
              "title": {
                $regex: search ?? '',
                $options: "i"
              },
            }
          }
        },
        {
          languageVersions: {
            $elemMatch: {
              "description": {
                $regex: search ?? '',
                $options: "i"
              },
            }
          }
        },
      ];
    }

    const serviceListGet = httpsCallableData(this.functions, 'serviceListGet');
    serviceListGet({
      pageSize,
      page,
      orderBy,
      orderDir,

      // Filters
      // active: 1,
      // 'durationVersions.break': {$gte: 10},
      ...filters
    }).subscribe({
      next: (data: any) => {
        const {total, items} = data;

        const newPagination = new PaginationModel<IService>();
        newPagination.totalSize = total;
        newPagination.items = items;
        this.#state$.next(
          this.#state$.value.updateFromObject(
            newPagination.toObject()
          )
        );
      },
      complete: () => {
        this.loading.switchOff();
      }
    });

  }

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.storageAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Service.IService>> {
    return this.storageAdapter.item(id);
  }


}
