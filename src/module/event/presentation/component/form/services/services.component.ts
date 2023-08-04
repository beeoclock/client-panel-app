import {Component, inject, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {
  ModalSelectServiceService
} from "@utility/presentation/component/modal-select-service/modal-select-service.service";
import {IService} from "@service/domain";
import {ModalSelectServiceListAdapter} from "@service/adapter/external/component/modal-select-service.list.adapter";
import {IMember} from "@member/domain";

@Component({
  selector: 'event-service-component',
  standalone: true,
  template: `

    <div class="flex flex-col gap-4">
      <strong class="text-2xl">{{ 'general.services' | translate }}</strong>

      <div>
        <ng-container *ngFor="let service of serviceListControl.value; let index = index">

          <div class="flex flex-col gap-3">

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-2 pt-1">
                <ng-container *ngIf="service?.presentation?.main?.length; else DefaultServiceImageTemplate">
                  <img [src]="service.presentation.main" class="w-[70px] h-[70px] rounded-2xl object-cover"
                       alt="Image of service">
                </ng-container>
                <ng-template #DefaultServiceImageTemplate>
                  <div class="w-[70px] h-[70px] bg-gray-300 rounded-2xl"></div>
                </ng-template>
              </div>
              <div class="col-span-8 flex flex-col gap-2">
                <div class="flex flex-col gap-2">
              <span class="font-bold">
                {{ service.languageVersions[0].title }}
              </span>
                  <span class="text-sm text-gray-500">
                {{ service.languageVersions[0].description }}
              </span>
                </div>
              </div>
              <div class="col-span-2 flex items-start justify-end">

                <button
                  (click)="editServiceFromSelectedList(service)"
                  class="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-2xl">
                  <i class="bi bi-pencil"></i>
                </button>

              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-2 pt-1">
                <div class="w-[70px] flex justify-end">
                  <div class="w-[44px] h-[44px] bg-gray-300 rounded-2xl"></div>
                </div>
              </div>
              <div class="col-span-5 flex flex-col">
            <span class="font-bold">
              Specialist
            </span>
                <span class="text-sm text-gray-500">
              {{ getPermanentMembers(service.permanentMembers) }}
            </span>
              </div>
              <div class="col-span-3 flex flex-col gap-1">
            <span class="text-end text-sm">
              {{ service.durationVersions[0].prices[0].price | currency: service.durationVersions[0].prices[0].currency: 'symbol-narrow' }}
            </span>
                <span class="text-end text-sm">
              {{ formatDuration(service.durationVersions[0].duration) }}
            </span>
              </div>
              <div class="col-span-2 flex flex-col">
              </div>
            </div>

          </div>

        </ng-container>

        <button (click)="openModalToSelectService()"
                *ngIf="serviceListControl.value.length === 0"
                class="w-full text-blue-600 rounded px-4 py-2 hover:bg-blue-100 flex items-center justify-center gap-3">
          <i class="bi bi-list-check"></i>
          {{ 'event.form.section.service.button.select' | translate }}
        </button>
      </div>

    </div>

  `,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgForOf,
    CurrencyPipe,
  ]
})
export class ServicesComponent implements OnInit {

  public readonly modalSelectServiceService = inject(ModalSelectServiceService);
  public readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);
  private readonly translateService = inject(TranslateService);

  @Input()
  public serviceListControl: FormControl<IService[]> = new FormControl([] as any);

  public ngOnInit(): void {

    // this.serviceListControl.valueChanges.subscribe((value) => {
    //
    //   this.modalSelectServiceService.selectedServiceList = value;
    //
    // });

    this.initServices().then(() => {

      // this.modalSelectServiceService.selectedServiceList = this.serviceListControl.value;

    });

  }


  private async initServices() {

    if (!this.serviceListControl.value.length) {

      this.modalSelectServiceListAdapter.resetTableState();
      await this.modalSelectServiceListAdapter.getPageAsync();

      if (this.modalSelectServiceListAdapter.tableState.total === 1) {

        this.serviceListControl.patchValue([this.modalSelectServiceListAdapter.tableState.items[0]]);

      }

    }

  }

  public openModalToSelectService(): void {

    this.modalSelectServiceService.openServiceModal({
      multiSelect: false
    }).then((newSelectedSpecialistList) => {

      this.serviceListControl.patchValue(newSelectedSpecialistList);

    });

  }

  public removeServiceFromSelectedList(service: IService): void {

    const newSelectedSpecialistList = this.serviceListControl.value.filter((value) => value._id !== service._id);

    this.serviceListControl.patchValue(newSelectedSpecialistList);

  }

  public editServiceFromSelectedList(service: IService): void {

    this.modalSelectServiceService.openServiceModal({
      multiSelect: false,
      selectedServiceList: [service]
    }).then((newSelectedSpecialistList) => {

      this.serviceListControl.patchValue(newSelectedSpecialistList);

    });

  }

  public formatDuration(duration: string): string {
    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});
  }

  public getPermanentMembers(permanentMembers: IMember[]): string {
    const firstMember = permanentMembers[0];
    if (firstMember) {
      if (firstMember.firstName && firstMember.lastName) {
        return `${firstMember.firstName} ${firstMember.lastName}`;
      }
      return firstMember.email;
    }
    return '';
  }

}
