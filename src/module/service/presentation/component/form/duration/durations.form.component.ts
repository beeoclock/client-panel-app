import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {DurationFormComponent} from '@service/presentation/component/form/duration/duration.form.component';
import {DurationVersionsForm} from '@service/form/service.form';
import {NgForOf, NgIf} from '@angular/common';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";

@Component({
  selector: 'service-durations-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DurationFormComponent,
    NgForOf,
    CardComponent,
    HeaderCardComponent,
    BodyCardComponent,
    FooterCardComponent,
    NgIf
  ],
  template: `
    <utility-card-component class="mt-3">
      <utility-header-card-component class="border-bottom">
        When are you available for the service
      </utility-header-card-component>
      <utility-body-card-component>

        <ul class="list-group mt-3"
            *ngFor="let durationVersionForm of durationVersionsForm.controls; let index = index">
          <li class="list-group-item list-group-item-secondary border d-flex justify-content-between">
            <strong>Duration version #{{ index + 1 }}</strong>
            <button class="btn btn-link text-danger py-0" (click)="durationVersionsForm.remove(index)"
                    *ngIf="index > 0">
              <i class="bi bi-trash"></i>
            </button>
          </li>
          <li class="list-group-item pb-3">

            <service-duration-form-component
              [form]="durationVersionForm">
            </service-duration-form-component>

          </li>
        </ul>

      </utility-body-card-component>
      <utility-footer-card-component class="border-top">
        <button class="btn btn-primary" (click)="pushNewDurationVersionFormForm($event)">Add new duration</button>
      </utility-footer-card-component>
    </utility-card-component>

  `
})
export class DurationsFormComponent {

  @Input()
  public durationVersionsForm = new DurationVersionsForm();

  @Output()
  public readonly handlePushNewDurationVersionFormForm: EventEmitter<Event> = new EventEmitter();

  public pushNewDurationVersionFormForm($event: Event): void {
    this.handlePushNewDurationVersionFormForm.emit($event);
  }

}
