import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ServiceRepository} from "@service/repository/service.repository";
import {IService} from "@service/domain";

@Component({
  selector: 'event-services-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgSelectModule,

    ReactiveFormsModule,
    NgIf,
    JsonPipe
  ],
  template: `
    <div class="col-12 position-relative" *ngIf="control">
      <label for="event-form-services">Services</label>
      <ng-select
        id="event-form-services"
        placeholder="Select service or list of services"
        bindLabel="_id"
        (scrollToEnd)="scrollToEnd($event)"
        [loading]="control.pending"
        [disabled]="control.pending"
        [multiple]="multiple"
        [formControl]="control">
        <ng-template ng-label-tmp let-item="item" let-clear="clear">
          <span>{{item.languageVersions[0].title}}</span>
          <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
        </ng-template>
        <ng-option *ngFor="let item of items" [value]="item">
          <p *ngFor="let languageVersion of item.languageVersions; let index = index" [class.fw-bold]="index === 0" class="m-0 p-0">
            {{languageVersion.title}}
          </p>
        </ng-option>
      </ng-select>
    </div>
  `
})
export class ServicesFormComponent implements AfterViewInit {

  @Input()
  public control!: FormControl;

  @Input()
  public multiple = false;

  public readonly serviceRepository = inject(ServiceRepository);

  public items: IService[] = [];

  public ngAfterViewInit(): void {
    this.control.markAsPending();
    this.serviceRepository
      .list(10, 1, 'createdAt', 'asc', {})
      .then((result) => {
        if (this.control.value) {
          this.control.setValue(result.data.items.find((({_id}) => _id === this.control.value._id)), {
            emitEvent: false,
            onlySelf: true
          });
        }
        this.items = result.data.items;
        this.control.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false
        });
      });

  }

  scrollToEnd($event: any) {
    console.log($event);

  }
}
