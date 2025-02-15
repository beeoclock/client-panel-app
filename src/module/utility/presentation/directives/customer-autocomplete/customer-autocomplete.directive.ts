import {
	Directive,
	DoCheck,
	ElementRef,
	EventEmitter,
	Inject,
	inject,
	Input,
	Optional,
	Output,
	SkipSelf
} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';
import {DOCUMENT} from "@angular/common";
import {debounce} from "typescript-debounce-decorator";
import {MS_ONE_SECOND} from "@utility/domain/const/c.time";
import {UtilityListCustomerRepository} from "@customer/infrastructure/repository/utility.list.customer.repository";
import {ICustomer} from "@src/core/business-logic/customer";
import {ActiveEnum} from "@utility/domain/enum";

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

	@Output()
	public readonly customerSelected = new EventEmitter<ICustomer.Entity>();

	private readonly document = inject(DOCUMENT);
	private readonly utilityListCustomerAdapter = inject(UtilityListCustomerRepository);
	private readonly ngControl: NgControl | null = inject(NgControl);
	private readonly elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);

	private previousControlValue = '';

	private HTMLUlList: HTMLUListElement | null = null;
	private HTMLHeaderDivElement: HTMLDivElement | null = null;
	private HTMLDivElement: HTMLDivElement | null = null;
	private HTMLLoader: HTMLDivElement | null = null;

	private shouldShowDropdown = false;

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

			if (this.shouldShowDropdown) {
				this.showDropdown();
				this.showLoader();
				this.hideHTMLUlList();
			}
			this.updateCustomerList();
		} else {
			if (this.document.activeElement?.tagName === 'INPUT') {
				this.hideDropdown();
			}
		}
	}

	@debounce(MS_ONE_SECOND)
	public updateCustomerList(): void {

		this.clearHTMLUlList();

		// Update filter
		this.utilityListCustomerAdapter.tableState.filters = {
			...this.utilityListCustomerAdapter.tableState.filters,
			phrase: this.controlValue,
			active: ActiveEnum.YES
		};

		// Do request to server and update list
		this.utilityListCustomerAdapter.getPageAsync().then(() => {
			if (this.shouldShowDropdown) {
				this.hideLoader();
				this.showHTMLUlList();
			}
			if (this.utilityListCustomerAdapter.tableState.total) {
				if (!this.shouldShowDropdown) {
					this.shouldShowDropdown = true;
					this.showDropdown();
					this.hideLoader();
					this.showHTMLUlList();
				}
				this.utilityListCustomerAdapter.tableState.items.forEach((customer) => {
					this.addCustomerToHTMLUlList(customer);
				});
			} else {
				this.hideDropdown();
			}
		});
	}

	private addCustomerToHTMLUlList(customer: ICustomer): void {

		const hasInitials = customer?.firstName?.length && customer?.lastName?.length;

		const li = this.document.createElement('li');
		li.classList.add('my-2', 'px-3', 'py-2', 'cursor-pointer', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'transition');
		li.innerHTML = `
      <div class="flex gap-2">
        <div class="rounded-full flex justify-center items-center h-11 w-11 text-white bg-beeColor-400 font-bold">
           ${hasInitials ? customer?.firstName?.[0]?.toUpperCase() + ' ' + customer?.lastName?.[0]?.toUpperCase() : ''}
           ${hasInitials ? '' : '<i class="bi bi-person"></i>'}
        </div>
        <div class="flex flex-col">
          <div>${customer?.firstName ?? ''} ${customer?.lastName ?? ''}</div>
          <div class="text-beeColor-500 text-sm">${customer?.email ?? ''}</div>
        </div>
      </div>
    `;
		li.addEventListener('click', () => {
			this.hideDropdown();
			this.customerSelected.emit(customer);
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
		this.HTMLDivElement.classList.add('hidden', 'flex', 'flex-col', 'absolute', 'bg-white', 'block', 'dark:bg-gray-700', 'rounded-lg', 'shadow-xl', 'z-40', 'max-h-72', 'w-full');
		this.elementRef.nativeElement.appendChild(this.HTMLDivElement);

		// Header
		this.HTMLHeaderDivElement = this.document.createElement('div');
		this.HTMLHeaderDivElement.classList.add('border-b', 'flex', 'justify-between', 'bg-beeColor-100', 'rounded-t-xl', 'px-3', 'py-2', 'w-full');
		this.HTMLHeaderDivElement.appendChild(this.document.createElement('div'));
		const buttonToHideDropdown = this.document.createElement('button');
		buttonToHideDropdown.innerHTML = `<i class="bi bi-x-lg"></i>`;
		buttonToHideDropdown.addEventListener('click', () => {
			this.hideDropdown();
		});
		this.HTMLHeaderDivElement.appendChild(buttonToHideDropdown);
		this.HTMLDivElement.appendChild(this.HTMLHeaderDivElement);

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
