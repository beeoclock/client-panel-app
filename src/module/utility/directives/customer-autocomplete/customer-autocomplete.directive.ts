import {Directive, DoCheck, ElementRef, Inject, inject, Input, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';
import {DOCUMENT} from "@angular/common";
import {debounce} from "typescript-debounce-decorator";
import {ONE_SECOND} from "@utility/domain/const/c.time";
import {UtilityListCustomerAdapter} from "@customer/adapter/external/module/utility.list.customer.adapter";
import {ICustomer} from "@customer/domain";

@Directive({
  selector: '[customerAutocomplete]',
  standalone: true,
  providers: [
    {
      provide: NgControl,
      useFactory: (ngControl: NgControl) => ngControl,
      deps: [
        [new Optional(), new SkipSelf(), new Inject(NgControl)],
      ]
    }
  ]
})
export class CustomerAutocompleteDirective implements DoCheck {

  @Input()
  public control: AbstractControl | undefined | null;

  private readonly document = inject(DOCUMENT);
  private readonly utilityListCustomerAdapter = inject(UtilityListCustomerAdapter);
  private readonly ngControl: NgControl | null = inject(NgControl);
  private readonly elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);

  private previousControlValue = '';

  private HTMLUlList: HTMLUListElement | null = null;
  private HTMLDivElement: HTMLDivElement | null = null;
  private HTMLLoader: HTMLDivElement | null = null;

  public ngDoCheck(): void {

    // Check if value is empty
    if (!this.controlValue.length) {
      this.hideDropdown();
      return;
    }

    if (
      this.elementRef.nativeElement.contains(this.document.activeElement) ||
      this.elementRef.nativeElement.isEqualNode(this.document.activeElement)
    ) {

      if (this.previousControlValue === this.controlValue) {
        return;
      }
      this.previousControlValue = this.controlValue;

      this.showDropdown();
      this.showLoader();
      this.hideHTMLUlList();
      this.updateCustomerList();
    } else {
      if (this.document.activeElement?.tagName === 'INPUT') {
        this.hideDropdown();
      }
    }
  }

  @debounce(ONE_SECOND)
  public updateCustomerList(): void {

    this.clearHTMLUlList();

    // Update filter
    this.utilityListCustomerAdapter.tableState.filters = {
      ...this.utilityListCustomerAdapter.tableState.filters,
      search: this.controlValue
    };

    // Do request to server and update list
    this.utilityListCustomerAdapter.getPageAsync().then(() => {
      this.hideLoader();
      this.showHTMLUlList();
      if (this.utilityListCustomerAdapter.tableState.total) {
        this.utilityListCustomerAdapter.tableState.items.forEach((customer) => {
          this.addCustomerToHTMLUlList(customer);
        });
      }
    });
  }

  private addCustomerToHTMLUlList(customer: ICustomer): void {

    const li = this.document.createElement('li');
    li.classList.add('my-2', 'px-3', 'py-2', 'cursor-pointer', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'transition');
    li.innerHTML = `
      <div class="flex gap-2">
        <div class="rounded-full flex justify-center items-center h-11 w-11 text-white bg-beeColor-400 font-bold">
           ${customer?.firstName?.[0]?.toUpperCase() ?? ''}${customer?.lastName?.[0]?.toUpperCase() ?? ''}
        </div>
        <div class="flex flex-col">
          <div>${customer?.firstName ?? ''} ${customer?.lastName ?? ''}</div>
          <div class="text-beeColor-500 text-sm">${customer?.email ?? ''}</div>
        </div>
      </div>
    `;
    li.addEventListener('click', () => {
      this.hideDropdown();
      this.formControl?.parent?.patchValue(customer as any);
      this.formControl?.parent?.disable();
    });
    this.HTMLUlList?.appendChild(li);

  }

  private get formControl(): AbstractControl | undefined | null {
    return this.control || this.ngControl?.control;
  }

  private get controlValue(): string {
    return this.formControl?.value || '';
  }

  private showDropdown(): void {

    // Clear list
    this.clearHTMLUlList();

    if (!this.HTMLDivElement) {
      this.initList();
    }
    this.HTMLDivElement?.classList?.remove('hidden');
  }

  private hideDropdown(): void {
    this.HTMLDivElement?.classList?.add('hidden');
  }

  private initList(): void {
    if (!this.elementRef.nativeElement.classList.contains('relative')) {
      this.elementRef.nativeElement.classList.add('relative')
    }

    // Container
    this.HTMLDivElement = this.document.createElement('div');
    this.HTMLDivElement.classList.add('hidden', 'absolute', 'bg-white', 'block', 'dark:bg-gray-700', 'rounded-lg', 'shadow-lg', 'z-10');
    this.elementRef.nativeElement.appendChild(this.HTMLDivElement);

    // LIST
    this.HTMLUlList = this.document.createElement('ul');
    this.HTMLUlList.classList.add('overflow-y-auto', 'text-gray-700', 'dark:text-gray-200');
    this.HTMLDivElement.appendChild(this.HTMLUlList);

    this.initLoader();
  }

  private initLoader(): void {
    // LOADER
    this.HTMLLoader = this.document.createElement('div');
    this.HTMLLoader.classList.add('hidden', 'my-2', 'px-3');
    this.HTMLLoader.innerText = 'Loading...';
    this.HTMLDivElement?.appendChild(this.HTMLLoader);
  }

  private clearHTMLUlList(): void {
    if (!this.HTMLUlList) {
      return;
    }
    this.HTMLUlList.innerHTML = '';
  }

  private hideHTMLUlList(): void {
    if (!this.HTMLUlList || this.HTMLUlList.classList.contains('hidden')) {
      return;
    }
    this.HTMLUlList.classList.add('hidden');
  }

  private showHTMLUlList(): void {
    if (!this.HTMLUlList || !this.HTMLUlList.classList.contains('hidden')) {
      return;
    }
    this.HTMLUlList.classList.remove('hidden');
  }

  private hideLoader(): void {
    this.HTMLLoader?.classList?.add('hidden');
  }

  private showLoader(): void {
    this.HTMLLoader?.classList?.remove('hidden');
  }

}
