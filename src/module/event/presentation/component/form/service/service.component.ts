import {Component, EventEmitter, Output, ViewEncapsulation} from "@angular/core";
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

      <div *ngFor="let languageVersion of control.value.languageVersions; let index = index;" class="list-group mb-2">

        <div
          (click)="selectLanguage(languageVersion)"
          class="flex items-center pl-4 border border-beeColor-200 rounded dark:border-beeDarkColor-700 cursor-pointer">

          <input
            id="language-version-#{{ index }}"
            type="radio"
            [checked]="selectedLanguageVersion && languageVersion.language === selectedLanguageVersion.language"
            name="language-version"
            class="w-4 h-4 text-blue-600 bg-beeColor-100 border-beeColor-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-beeDarkColor-800 focus:ring-2 dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 cursor-pointer">

          <label
            for="language-version-#{{ index }}"
            class="w-full py-4 ml-2 text-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300 cursor-pointer">

            <div class="w-full">

              <small>{{ languageVersion.language }}</small>

            </div>

            <p class="mb-1">{{ languageVersion.title }}</p>

          </label>

        </div>

      </div>

      <p class="mt-3"><strong>Select employee</strong></p>

      <div *ngFor="let permanentEmployee of control.value.permanentEmployees; let index = index;"
           class="list-group mb-2">

        <div
          (click)="selectPermanentEmployee(permanentEmployee)"
          class="flex items-center pl-4 border border-beeColor-200 rounded dark:border-beeDarkColor-700 cursor-pointer">

          <input
            id="permanent-employee-#{{ index }}"
            type="radio"
            [checked]="selectedPermanentEmployee && permanentEmployee._id === selectedPermanentEmployee._id"
            name="permanent-employee"
            class="w-4 h-4 text-blue-600 bg-beeColor-100 border-beeColor-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-beeDarkColor-800 focus:ring-2 dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 cursor-pointer">

          <label
            for="permanent-employee-#{{ index }}"
            class="w-full py-4 ml-2 text-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300 cursor-pointer">

            <p class="mb-1">

              <i class="bi bi-person"></i>
              {{ permanentEmployee.firstName }} {{ permanentEmployee.lastName }}

            </p>

            <small>

              {{ permanentEmployee.email }}

            </small>

            <small>

              {{ permanentEmployee.phone }}

            </small>

          </label>

        </div>

      </div>

      <p class="mt-3"><strong>Select duration</strong></p>

      <div *ngFor="let durationVersion of control.value.durationVersions; let index = index;" class="list-group mb-2">

        <div
          (click)="selectDuration(durationVersion)"
          class="flex items-center pl-4 border border-beeColor-200 rounded dark:border-beeDarkColor-700 cursor-pointer">

          <input
            id="duration-version-#{{ index }}"
            type="radio"
            [checked]="selectedDurationVersion && durationVersion.duration === selectedDurationVersion.duration"
            name="duration-version"
            class="w-4 h-4 text-blue-600 bg-beeColor-100 border-beeColor-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-beeDarkColor-800 focus:ring-2 dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 cursor-pointer">

          <label
            for="duration-version-#{{ index }}"
            class="w-full py-4 ml-2 text-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300 cursor-pointer">

            <div class="d-flex w-100 justify-content-between">

              <small>minutes</small>

            </div>

            <p class="mb-1">{{ durationVersion.duration }}</p>

          </label>

        </div>

      </div>

      <ng-container *ngIf="selectedDurationVersion">

        <p class="mt-3"><strong>Select price</strong></p>

        <div *ngFor="let price of selectedDurationVersion.prices; let index = index;" class="list-group mb-2">

          <div
            (click)="selectPrice(price)"
            class="flex items-center pl-4 border border-beeColor-200 rounded dark:border-beeDarkColor-700 cursor-pointer">

            <input
              id="price-#{{ index }}"
              type="radio"
              [checked]="selectedPrice && price.price === selectedPrice.price && price.currency === selectedPrice.currency"
              name="price"
              class="w-4 h-4 text-blue-600 bg-beeColor-100 border-beeColor-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-beeDarkColor-800 focus:ring-2 dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 cursor-pointer">

            <label
              for="price-#{{ index }}"
              class="w-full py-4 ml-2 text-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300 cursor-pointer">

              <div class="d-flex w-100 justify-content-between">

                <small>{{ price.currency }}</small>

              </div>

              <p class="mb-1">{{ price.price }}</p>

            </label>

          </div>

        </div>

      </ng-container>

    </ng-container>
  `
})
export class ServiceComponent {

  public selectedPrice: undefined | IPrice;
  public selectedLanguageVersion: undefined | ILanguageVersion;
  public selectedDurationVersion: undefined | IDurationVersion;
  public selectedPermanentEmployee: undefined | IEmployee;
  public readonly control: FormControl<IService> = new FormControl();

  public selectedService: undefined | IService;

  @Output()
  public readonly emitter = new EventEmitter();

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

  public selectPermanentEmployee(permanentEmployee: IEmployee): void {
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
      return this.selectedPermanentEmployee && permanentEmployee._id === this.selectedPermanentEmployee._id;
    });
    this.emitter.emit(this.selectedService);
  }

  public resetSelectedItems(): void {
    this.selectedPrice = undefined;
    this.selectedLanguageVersion = undefined;
    this.selectedDurationVersion = undefined;
    this.selectedPermanentEmployee = undefined;
  }

}
