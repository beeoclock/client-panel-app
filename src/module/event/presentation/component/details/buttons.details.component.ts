import {Component, inject, Input} from "@angular/core";
import {IEvent} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {Store} from "@ngxs/store";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {EventStatusEnum} from "@src/module/utility/domain/enum/event-status.enum";

@Component({
  selector: 'event-buttons-details',
  standalone: true,
  imports: [
    DynamicDatePipe,
    TranslateModule,
    RouterLink,
    EditLinkComponent,
    NgIf,
    NgTemplateOutlet
  ],
  template: `
    <div class="flex justify-between flex-col md:flex-row gap-4">

      <ng-container *ngIf="isRequested(event.status)">

        <ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

        <edit-link-component class="w-full" [buttonWidthFull]="true"/>

        <ng-container *ngTemplateOutlet="ButtonToBookEvent"/>

      </ng-container>

      <ng-container *ngIf="isBooked(event.status)">

        <ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

        <edit-link-component class="w-full" [buttonWidthFull]="true"/>

        <ng-container *ngTemplateOutlet="ButtonToDoneEvent"/>

      </ng-container>

      <ng-container *ngIf="isDone(event.status)">

        <ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>

      </ng-container>

      <ng-container *ngIf="isCancelled(event.status)">

        <ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>

      </ng-container>

      <ng-template #ButtonToCancelEvent>
        <button
					type="button"
					(click)="changeStatusOnCancelled(event)"
					class="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-3
              py-2
              text-sm
              font-semibold
              text-red-700
              bg-red-50
              shadow-sm
              ring-1
              ring-inset
              ring-red-300
              hover:bg-red-100">
          <i class="bi bi-x-lg"></i>
          {{ 'keyword.capitalize.cancel' | translate }}
        </button>
      </ng-template>

      <ng-template #ButtonToBookEvent>
        <button
					type="button"
					(click)="changeStatusOnBooked(event)"
					class="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-3
              py-2
              text-sm
              font-semibold
              text-blue-700
              bg-blue-50
              shadow-sm
              ring-1
              ring-inset
              ring-blue-300
              hover:bg-blue-100">
          <i class="bi bi-check-lg"></i>
          {{ 'keyword.capitalize.approve' | translate }}
        </button>
      </ng-template>

      <ng-template #ButtonToDoneEvent>
        <button
					type="button"
					(click)="changeStatusOnDone(event)"
					class="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-3
              py-2
              text-sm
              font-semibold
              text-green-700
              bg-green-50
              shadow-sm
              ring-1
              ring-inset
              ring-green-300
              hover:bg-green-100">
          <i class="bi bi-check-lg"></i>
          {{ 'keyword.capitalize.done' | translate }}
        </button>
      </ng-template>

      <ng-template #ButtonToRepeatEvent>
        <a routerLink="repeat" class="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-3
              py-2
              text-sm
              font-semibold
              text-blue-700
              shadow-sm
              ring-1
              ring-inset
              ring-blue-300
              hover:bg-blue-100">
          <i class="bi bi-arrow-repeat"></i>
          {{ 'event.keyword.capitalize.repeat' | translate }}
        </a>
      </ng-template>

    </div>
  `
})
export class ButtonsDetailsComponent {

  @Input()
  public event!: IEvent;

  public readonly store = inject(Store);

  public async changeStatusOnBooked(event: IEvent): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EventActions.BookedStatus(event)));
    await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
  }

  public async changeStatusOnCancelled(event: IEvent): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EventActions.CancelledStatus(event)));
    await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
  }

  public async changeStatusOnDone(event: IEvent): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EventActions.DoneStatus(event)));
    await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
  }

  public isRequested(status: EventStatusEnum): boolean {
    return status === EventStatusEnum.requested;
  }

  public isBooked(status: EventStatusEnum): boolean {
    return status === EventStatusEnum.booked;
  }

  public isDone(status: EventStatusEnum): boolean {
    return status === EventStatusEnum.done;
  }

  public isCancelled(status: EventStatusEnum): boolean {
    return status === EventStatusEnum.cancelled;
  }
}
