import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";
import {ServicesFormComponent} from "@event/presentation/component/form/services/services.form.component";
import {IDurationVersion, ILanguageVersion, IPrice, IService} from "@service/domain";
import {FormControl} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "@utility/presentation/component/button/button.component";
import {IEmployee} from "@employee/domain";

@Component({
  selector: 'event-form-service-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ServicesFormComponent,
    NgIf,
    NgForOf,
    NgClass,
    ButtonComponent
  ],
  template: `
    <event-services-form-component [control]="control"></event-services-form-component>
    <ng-container *ngIf="control.value">
      <p class="mt-3"><strong>Select language version of service</strong></p>
      <div *ngFor="let languageVersion of control.value.languageVersions" class="list-group mb-2">
        <a
          (click)="selectLanguage(languageVersion)"
          [ngClass]="selectedLanguageVersion && languageVersion.language === selectedLanguageVersion.language ? classOfSelectedItem : []"
          class="list-group-item list-group-item-action cursor-pointer"
          aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <small>{{ languageVersion.language }}</small>
          </div>
          <p class="mb-1">{{ languageVersion.title }}</p>
        </a>
      </div>
      <p class="mt-3"><strong>Select employee</strong></p>
      <div *ngFor="let permanentEmployee of control.value.permanentEmployees" class="list-group mb-2">
        <a
          (click)="selectPermanentEmployee(permanentEmployee)"
          [ngClass]="selectedPermanentEmployee && permanentEmployee.employee._id === selectedPermanentEmployee.employee._id ? classOfSelectedItem : []"
          class="list-group-item list-group-item-action cursor-pointer d-flex flex-column"
          aria-current="true">
          <p class="mb-1">
            <i class="bi bi-person"></i>
            {{ permanentEmployee.employee.firstName }} {{ permanentEmployee.employee.lastName }}
          </p>
          <small>
            {{ permanentEmployee.employee.email }}
          </small>
          <small>
            {{ permanentEmployee.employee.phone }}
          </small>
        </a>
      </div>
      <p class="mt-3"><strong>Select duration</strong></p>
      <div *ngFor="let durationVersion of control.value.durationVersions" class="list-group mb-2">
        <a
          (click)="selectDuration(durationVersion)"
          [ngClass]="selectedDurationVersion && durationVersion.duration === selectedDurationVersion.duration ? classOfSelectedItem : []"
          class="list-group-item list-group-item-action cursor-pointer"
          aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <small>minutes</small>
          </div>
          <p class="mb-1">{{ durationVersion.duration }}</p>
        </a>
      </div>
      <ng-container *ngIf="selectedDurationVersion">
        <p class="mt-3"><strong>Select price</strong></p>
        <div *ngFor="let price of selectedDurationVersion.prices" class="list-group mb-2">
          <a
            (click)="selectPrice(price)"
            [ngClass]="selectedPrice && price.price === selectedPrice.price && price.currency === selectedPrice.currency ? classOfSelectedItem : []"
            class="list-group-item list-group-item-action cursor-pointer"
            aria-current="true">
            <div class="d-flex w-100 justify-content-between">
              <small>{{ price.currency }}</small>
            </div>
            <p class="mb-1">{{ price.price }}</p>
          </a>
        </div>
      </ng-container>
    </ng-container>
    <div class="d-grid mt-3">
      <button beeoclock [disabled]="isInvalid" (click)="select()">Select</button>
    </div>
  `
})
export class ServiceComponent {

  public selectedPrice: undefined | IPrice;
  public selectedLanguageVersion: undefined | ILanguageVersion;
  public selectedDurationVersion: undefined | IDurationVersion;
  public selectedPermanentEmployee: undefined | {employee: IEmployee};
  public readonly control: FormControl<IService> = new FormControl();
  public selectedService: undefined | IService;
  public readonly emitter = new EventEmitter();

  public readonly classOfSelectedItem = ['border-primary', 'text-primary', 'bg-primary-subtle'];

  public constructor() {
    // TODO takeUntil
    this.control.valueChanges.subscribe((service) => {
      this.resetSelectedItems();
    });
  }

  public selectLanguage(languageVersion: ILanguageVersion): void {
    this.selectedLanguageVersion = languageVersion;
  }

  public selectDuration(durationVersion: IDurationVersion): void {
    this.selectedDurationVersion = durationVersion;
  }

  public selectPermanentEmployee(permanentEmployee: {employee: IEmployee}): void {
    this.selectedPermanentEmployee = permanentEmployee;
  }

  public selectPrice(price: IPrice): void {
    this.selectedPrice = price;
  }

  public get isValid(): boolean {
    return !this.isInvalid;
  }

  public get isInvalid(): boolean {
    return !this.selectedLanguageVersion || !this.selectedDurationVersion || !this.selectedPrice;
  }

  public setSelectedService(service: IService): void {
    this.control.setValue(service, {
      emitEvent: false,
      onlySelf: true
    });
    this.selectedDurationVersion = service.durationVersions[0];
    this.selectedPrice = service.durationVersions[0].prices[0];
    this.selectedLanguageVersion = service.languageVersions[0];
    this.selectedPermanentEmployee = service.permanentEmployees[0];
  }

  public select(): void {
    this.selectedService = structuredClone(this.control.value);
    this.selectedService.durationVersions = this.selectedService.durationVersions.filter((durationVersion) => {
      return this.selectedDurationVersion && durationVersion.duration === this.selectedDurationVersion.duration;
    });
    this.selectedService.durationVersions[0].prices = this.selectedService.durationVersions[0].prices.filter((price) => {
      return this.selectedPrice && price.price === this.selectedPrice.price && price.currency === this.selectedPrice.currency;
    });
    this.selectedService.languageVersions = this.selectedService.languageVersions.filter((languageVersion) => {
      return this.selectedLanguageVersion && languageVersion.language === this.selectedLanguageVersion.language;
    });
    this.selectedService.permanentEmployees = this.selectedService?.permanentEmployees.filter((permanentEmployee) => {
      return this.selectedPermanentEmployee && permanentEmployee.employee._id === this.selectedPermanentEmployee.employee._id;
    });
    this.emitter.emit(this.selectedService);
  }

  public resetSelectedItems(): void {
    this.selectedPrice = undefined;
    this.selectedLanguageVersion = undefined;
    this.selectedDurationVersion = undefined;
  }

}
