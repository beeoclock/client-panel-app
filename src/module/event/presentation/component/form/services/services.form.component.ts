import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {InputErrorComponent} from "@utility/presentation/component/input-error/input-error.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ServiceRepository} from "@service/repository/service.repository";
import {IService} from "@service/domain";

@Component({
  selector: 'event-services-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgSelectModule,
    InputErrorComponent,
    ReactiveFormsModule,
    NgIf
  ],
  providers: [
    ServiceRepository
  ],
  template: `
    <div class="col-12 position-relative" *ngIf="control">
      <label for="event-form-services">Services</label>
      <ng-select
        id="event-form-services"
        placeholder="Select service or list of services"
        (scrollToEnd)="scrollToEnd($event)"
        [loading]="control.pending"
        [disabled]="control.pending"
        [multiple]="multiple"
        [formControl]="control">
        <ng-option *ngFor="let item of items" [value]="item">
          {{item.languageVersions[0].title}}
        </ng-option>
      </ng-select>
      <utility-input-error-component [control]="control"></utility-input-error-component>
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
        this.items = result.data.items;
        this.control.updateValueAndValidity();
      });

  }

  scrollToEnd($event: any) {
    console.log($event);

  }
}
