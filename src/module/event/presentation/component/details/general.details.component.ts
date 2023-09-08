import {Component, inject, Input} from "@angular/core";
import {IEvent} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date.pipe";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";

@Component({
  selector: 'event-general-details',
  standalone: true,
  imports: [
    DynamicDatePipe,
    TranslateModule,
    CurrencyPipe,
    NgForOf,
    NgIf,
    EventStatusStyleDirective
  ],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex justify-between items-center">

        <div class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.details' | translate }}</div>
        <div *ngIf="isNotPreview" event-status-style [status]="event.status"></div>
        <div *ngIf="isPreview"
             class="px-2 py-1 flex items-center justify-center h-6 text-xs rounded-full border text-white uppercase bg-blue-500 border-blue-500 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800">
          {{ 'keyword.capitalize.preview' | translate }}
        </div>

      </div>

      <div>

        <div class="font-bold text-beeColor-400 mb-2">{{ 'keyword.capitalize.service' | translate }}:</div>

        <div class="grid grid-cols-12 gap-4">

          <div class="col-span-12 md:col-span-3">
            <div
              class="md:min-w-[128px] md:max-w-[128px] md:min-h-[128px] md:max-h-[128px] rounded-2xl bg-beeColor-400">
<!--              <img *ngIf="event.services?.[0]?.presentation?.main" [src]="event.services?.[0]?.presentation?.main"-->
<!--                   class="object-cover rounded-2xl md:min-w-[128px] md:max-w-[128px] md:min-h-[128px] md:max-h-[128px]"-->
<!--                   alt="Uploaded Image"/>-->
            </div>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex flex-col gap-2">
              <div
                class="text-xl font-bold text-beeColor-600">{{ event.services?.[0]?.languageVersions?.[0]?.title }}</div>
              <div class="grid grid-cols-12 gap-4">

                <div class="col-span-12 md:col-span-9">

                  <div class="text-beeColor-500">{{ event.services?.[0]?.languageVersions?.[0]?.description }}</div>

                </div>

                <div class="col-span-12 md:col-span-3">

                  <div class="flex flex-col gap-1">

                    <div class="text-end font-bold">
                      {{ event.services?.[0]?.durationVersions?.[0]?.prices?.[0]?.price | currency: event.services?.[0]?.durationVersions?.[0]?.prices?.[0]?.currency: 'symbol-narrow' }}
                    </div>
                    <div class="text-end">
                      {{ formatDuration(event.services?.[0]?.durationVersions?.[0]?.duration ?? '') }}
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="flex flex-col gap-3">

        <div class="font-bold text-beeColor-400">{{ 'keyword.capitalize.clients' | translate }}:</div>

        <div class="grid grid-cols-12 gap-4" *ngFor="let attendant of event.attendees; let index = index;">
          <div class="col-span-1 text-beeColor-400">
            #{{ index + 1 }}
          </div>
          <div class="col-span-3">
            {{ attendant.customer.firstName }} {{ attendant.customer.lastName }}
          </div>
          <div class="col-span-5">
            {{ attendant.customer.email }}
          </div>
          <div class="col-span-3">
            {{ attendant.customer.phone }}
          </div>
        </div>

      </div>

      <div class="flex flex-col gap-3">

        <div class="font-bold text-beeColor-400">{{ 'keyword.capitalize.dateAndTime' | translate }}:</div>

        <div>
          {{ event.start ?? '' | dynamicDate: 'medium' }}
        </div>

      </div>

      <div class="flex flex-col gap-3">

        <div class="font-bold text-beeColor-400">{{ 'keyword.capitalize.note' | translate }}:</div>

        <div>
          {{ event.description }}
        </div>

      </div>
    </div>
  `
})
export class GeneralDetailsComponent {

  @Input()
  public event!: IEvent;

  @Input()
  public isPreview = false;

  public get isNotPreview(): boolean {
    return !this.isPreview;
  }

  public readonly translateService = inject(TranslateService);

  public formatDuration(duration: string): string {
    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});
  }
}
