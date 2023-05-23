import {LanguageVersionsForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ServiceFormComponent} from '@service/presentation/component/form/service/service.form.component';
import {LANGUAGES} from '@utility/domain/enum';
import {ScheduleFormComponent} from "@service/presentation/component/form/schedule/schedule.form.component";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";

@Component({
  selector: 'service-services-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent,
    ServiceFormComponent,
    NgIf,
    BodyCardComponent,
    HeaderCardComponent,
    CardComponent,
    FooterCardComponent
  ],
  template: `
    <utility-card-component class="mt-3">
      <utility-header-card-component class="border-bottom">
        When are you available for the service
      </utility-header-card-component>
      <utility-body-card-component>

        <ul class="list-group mt-3"
            *ngFor="let languageVersionForm of form.controls; let index = index">
          <li class="list-group-item list-group-item-secondary border d-flex justify-content-between">
            <strong>Language version #{{ index + 1 }}</strong>
            <button class="btn btn-link text-danger py-0" (click)="form.remove(index)" *ngIf="index > 0">
              <i class="bi bi-trash"></i>
            </button>
          </li>
          <li class="list-group-item pb-3">
            <service-service-form-component
              [form]="languageVersionForm">
            </service-service-form-component>
          </li>
        </ul>

      </utility-body-card-component>
      <utility-footer-card-component class="border-top">
        <button class="btn btn-primary" *ngIf="showAddMore" (click)="pushNewLanguageVersionForm($event)">Add new
          language version
        </button>
      </utility-footer-card-component>
    </utility-card-component>
  `
})
export class ServicesFormComponent {

  @Input()
  public form = new LanguageVersionsForm();

  @Output()
  public readonly handlePushNewLanguageVersionForm: EventEmitter<Event> = new EventEmitter();

  public pushNewLanguageVersionForm($event: Event): void {
    this.handlePushNewLanguageVersionForm.emit($event);
  }

  public get showAddMore(): boolean {
    return this.form.length !== LANGUAGES.length;
  }

}
