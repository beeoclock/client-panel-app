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

  private HTMLUlList: HTMLUListElement | null = null;
  private HTMLDivElement: HTMLDivElement | null = null;
  private HTMLLoader: HTMLLIElement | null = null;

  public ngDoCheck(): void {
    if (
      this.elementRef.nativeElement.contains(this.document.activeElement) ||
      this.elementRef.nativeElement.isEqualNode(this.document.activeElement)
    ) {
      this.showList();
      this.showLoader();
      this.updateCustomerList();
    } else {
      if (this.document.activeElement?.tagName === 'INPUT') {
        this.hideList();
      }
    }
  }

  @debounce(ONE_SECOND)
  public updateCustomerList(): void {

    // Check if value is empty
    if (!this.controlValue.length) {
      return;
    }

    // Update filter
    this.utilityListCustomerAdapter.tableState.filters = {
      ...this.utilityListCustomerAdapter.tableState.filters,
      search: this.controlValue
    };

    // Do request to server and update list
    this.utilityListCustomerAdapter.getPageAsync().then(() => {
      this.hideLoader();
      if (this.utilityListCustomerAdapter.tableState.total) {
        this.clearHTMLUlList();
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
           ${customer.firstName[0].toUpperCase()}${customer.lastName[0].toUpperCase()}
        </div>
        <div class="flex flex-col">
          <div>${customer.firstName ?? ''} ${customer.lastName ?? ''}</div>
          <div class="text-beeColor-500 text-sm">${customer.email ?? ''}</div>
        </div>
      </div>
    `;
    li.addEventListener('click', () => {
      this.hideList();
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

  private showList(): void {
    if (!this.HTMLDivElement) {
      this.initList();
    }
    this.HTMLDivElement?.classList?.remove('hidden');
  }

  private hideList(): void {
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
    this.HTMLLoader = this.document.createElement('li');
    this.HTMLLoader.classList.add('hidden', 'my-2', 'px-3');
    this.HTMLLoader.innerText = 'Loading...';
    this.HTMLUlList?.appendChild(this.HTMLLoader);
  }

  private clearHTMLUlList(): void {
    if (!this.HTMLUlList) {
      return;
    }
    this.HTMLUlList.innerHTML = '';
    this.initLoader();
  }

  private hideLoader(): void {
    this.HTMLLoader?.classList?.add('hidden');
  }

  private showLoader(): void {
    this.HTMLLoader?.classList?.remove('hidden');
  }

}
