import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ModalSelectServiceListAdapter} from "@service/adapter/external/component/modal-select-service.list.adapter";
import {IService} from "@service/domain";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";

@Component({
  selector: 'utility-modal-select-service-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    LoaderComponent,
    NgIf,
    TranslateModule,
    CurrencyPipe
  ],
  template: `
    <div class="flex flex-col gap-4">

      <ng-container *ngFor="let item of modalSelectServiceListAdapter.tableState.items; let index = index">

        <hr class="my-2" *ngIf="index > 0">

        <div class="flex flex-col gap-3">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-2 pt-1">
              <ng-container *ngIf="item?.presentation?.main?.length; else DefaultServiceImageTemplate">
                <img [src]="item.presentation.main" class="w-[90px] h-[90px] rounded-2xl object-cover"
                     alt="Image of service">
              </ng-container>
              <ng-template #DefaultServiceImageTemplate>
                <div class="w-[90px] h-[90px] bg-beeColor-300 rounded-2xl"></div>
              </ng-template>
            </div>
            <div class="col-span-8 flex flex-col gap-2">
              <div class="flex flex-col gap-2">
              <span class="font-bold">
                {{ item.languageVersions[0].title }}
              </span>
                <span class="text-sm text-beeColor-500">
                {{ item.languageVersions[0].description }}
              </span>
              </div>
            </div>
            <div class="col-span-2 flex flex-col gap-3">

              <button
                *ngIf="isSelected(item)"
                (click)="deselect(item)"
                class="w-full border border-green-200 bg-green-50 text-green-600 px-2 py-1 rounded-2xl">
                {{ 'keyword.capitalize.selected' | translate }}
              </button>
              <button
                *ngIf="isNotSelected(item)"
                (click)="select(item)"
                class="w-full border border-blue-200 bg-blue-50 text-blue-600 px-2 py-1 rounded-2xl">
                {{ 'keyword.capitalize.select' | translate }}
              </button>


              <div class="flex flex-col items-center">
                <span class="text-end text-sm">
                {{ item.durationVersions[0].prices[0].price | currency: item.durationVersions[0].prices[0].currency: 'symbol-narrow' }}
              </span>
                <span class="text-end text-sm">
                {{ formatDuration(item.durationVersions[0].duration) }}
              </span>
              </div>
            </div>
          </div>

        </div>

      </ng-container>

    </div>
    <utility-loader *ngIf="modalSelectServiceListAdapter.loading$.isOn"></utility-loader>
  `
})
export class ModalSelectServiceComponent implements OnInit {

  public readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);
  public readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly translateService = inject(TranslateService);

  public selectedServiceList: IService[] = [];
  public newSelectedServiceList: IService[] = [];

  public multiple = true;

  public ngOnInit(): void {

    this.newSelectedServiceList = [...(this.selectedServiceList ?? [])];
    this.initTableState();

  }

  public async submit(): Promise<IService[]> {
    return new Promise((resolve) => {
      resolve(this.newSelectedServiceList);
    });
  }

  public select(member: IService): void {
    if (!this.multiple) {
      if (this.newSelectedServiceList.length) {
        this.newSelectedServiceList.splice(0, 1);
      }
    }
    this.newSelectedServiceList.push(member);
    this.changeDetectorRef.detectChanges();
  }

  public deselect(member: IService): void {
    this.newSelectedServiceList = this.newSelectedServiceList.filter((selectedMember: IService) => selectedMember._id !== member._id);
    this.changeDetectorRef.detectChanges();
  }

  public isSelected(member: IService): boolean {
    return this.newSelectedServiceList.some((selectedMember: IService) => selectedMember._id === member._id);
  }

  public isNotSelected(member: IService): boolean {
    return !this.isSelected(member);
  }

  private async initTableState() {
    if (this.modalSelectServiceListAdapter.tableState.items.length) {
      return;
    }
    this.modalSelectServiceListAdapter.resetTableState();
    await this.modalSelectServiceListAdapter.getPageAsync();
    this.changeDetectorRef.detectChanges();
  }

  public formatDuration(duration: string): string {
    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});
  }

}
