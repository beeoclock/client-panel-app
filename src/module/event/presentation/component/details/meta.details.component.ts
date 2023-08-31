import {Component, Input} from "@angular/core";
import {IEvent} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'event-meta-details',
  standalone: true,
  imports: [
    DynamicDatePipe,
    TranslateModule
  ],
  template: `

    <div class="flex flex-col gap-4">

      <div class="flex flex-col">

        <div>
          {{ 'keyword.capitalize.service' | translate }}:
        </div>
        <div>
          {{ event._id }}
        </div>

      </div>

      <div class="flex flex-col">

        <div>
          {{ 'keyword.capitalize.createdAt' | translate }}:
        </div>
        <div>
          {{ event.createdAt | dynamicDate }}
        </div>

      </div>

      <div class="flex flex-col">

        <div>
          {{ 'keyword.capitalize.updatedAt' | translate }}:
        </div>
        <div>
          {{ event.updatedAt | dynamicDate }}
        </div>

      </div>

    </div>
  `
})
export class MetaDetailsComponent {
  @Input()
  public event!: IEvent;
}
