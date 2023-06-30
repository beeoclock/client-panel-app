import {AfterViewInit, Component, ElementRef, inject, OnInit, QueryList, ViewChildren} from "@angular/core";
import {ServiceForm} from "@service/form/service.form";
import {ServiceRepository} from "@service/repository/service.repository";
import {ActivatedRoute, Router} from "@angular/router";
import {StepWrapperComponent} from "@service/presentation/component/form/step-wrapper.component";
import {NgForOf} from "@angular/common";
import {Select, Store} from "@ngxs/store";
import {filter, firstValueFrom, Observable} from "rxjs";
import {IService} from "@service/domain";
import {ServiceState} from "@service/state/service/service.state";
import {ServiceActions} from "@service/state/service/service.actions";

@Component({
  selector: 'service-form-component',
  standalone: true,
  imports: [
    StepWrapperComponent,
    NgForOf
  ],
  template: `
    <h2 class="mt-4 mb-0 text-3xl">Steps</h2>
    <ol class="items-center w-full flex overflow-x-auto mt-4">
      <li
        *ngFor="let step of stepWrapperComponents; let index = index;"
        (click)="activeSection(index)"
        [id]="idStepPrefix + index"
        [class.text-blue-600.dark:text-blue-500]="step.isActive"
        [class.hover:bg-beeColor-50]="!step.isActive"
        class="
            cursor-pointer
            flex
            flex-shrink-0
            items-center
            bg-white
            border
            me-4
            px-4
            py-2
            rounded-lg
            space-x-2.5">
        <span
          [class.border-blue-600.dark:border-blue-500]="step.isActive"
          [class.border.border-beeColor-500.dark:border-beeDarkColor-400]="!step.isActive"
          class="
            flex
            items-center
            justify-center
            w-8
            h-8
            border
            rounded-full
            shrink-0">
            {{ index + 1 }}
        </span>
        <span>
          <h3 class="font-medium leading-tight">
            {{ step.information.title }}
          </h3>
          <p class="text-sm">
            {{ step.information.description }}
          </p>
        </span>
      </li>
    </ol>

    <service-form-step-wrapper-component [form]="form" section="services">
    </service-form-step-wrapper-component>
    <service-form-step-wrapper-component [form]="form" section="durations">
    </service-form-step-wrapper-component>
    <service-form-step-wrapper-component [form]="form" section="schedules">
    </service-form-step-wrapper-component>
    <service-form-step-wrapper-component [form]="form" section="members">
    </service-form-step-wrapper-component>
  `
})
export class FormComponent implements AfterViewInit, OnInit {


  // TODO move functions to store effects/actions

  public readonly baseUrl = '/service';
  public readonly cancelUrl = [this.baseUrl];
  private readonly store = inject(Store);

  public readonly idStepPrefix = 'service-form-steps-bar-section-';

  public readonly router = inject(Router);
  public readonly repository = inject(ServiceRepository);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public readonly form = new ServiceForm();

  @ViewChildren(StepWrapperComponent)
  public stepWrapperComponents!: QueryList<StepWrapperComponent>;

  public activeSectionRef: undefined | StepWrapperComponent;
  public activeSectionIndex = 0;

  @Select(ServiceState.itemData)
  public itemData$!: Observable<IService | undefined>;

  public ngOnInit(): void {
    this.detectItem();
  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result) {
          this.cancelUrl.push('details', result._id);
          this.form.patchValue(result);
          this.form.updateValueAndValidity();
        }
      });
    });
  }

  public ngAfterViewInit(): void {

    this.detectActiveSection();

  }

  public detectActiveSection(): void {

    this.stepWrapperComponents.forEach((section) => {
      section.isActive = false;
    });

    this.activeSectionRef = this.stepWrapperComponents.toArray()[this.activeSectionIndex];

    if (this.activeSectionRef) {

      // Set found section in active status
      this.activeSectionRef.isActive = true;

      // Try to find DOM element of step which need to show (scroll to the element)
      const foundHTMLElement = this.elementRef.nativeElement.querySelector(`#${this.idStepPrefix}${this.activeSectionIndex}`);

      if (foundHTMLElement) {

        foundHTMLElement.scrollIntoView({behavior: "smooth", block: "start"});

      }

    }

  }

  public get activeSectionIsLast(): boolean {

    return (this.stepWrapperComponents.length - 1) === this.activeSectionIndex;

  }

  public get activeSectionIsNotLast(): boolean {

    return !this.activeSectionIsLast;

  }

  public get activeSectionIsFirst(): boolean {

    return 0 === this.activeSectionIndex;

  }

  public get activeSectionIsNotFirst(): boolean {

    return !this.activeSectionIsFirst;

  }

  public activeNextSection(): void {

    if (this.activeSectionIsNotLast) {

      this.activeSectionIndex++;
      this.detectActiveSection();

    }

  }

  public activePrevSection(): void {

    if (this.activeSectionIsNotFirst) {

      this.activeSectionIndex--;
      this.detectActiveSection();

    }

  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      await firstValueFrom(this.store.dispatch(new ServiceActions.SaveItem(this.form.value as IService)));
      const item = await firstValueFrom(this.itemData$);
      if (item) {
        await this.router.navigate([this.baseUrl, 'details', item?._id], {
          relativeTo: this.activatedRoute
        });
      }
      this.form.enable();
      this.form.updateValueAndValidity();
    }
  }

  public activeSection(index: number): void {
    this.activeSectionIndex = index;
    this.detectActiveSection();
  }
}
