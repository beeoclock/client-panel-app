import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	input,
	OnInit,
	Output,
	QueryList,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {CustomerExternalListComponent} from "@customer/presentation/component/external/list/list.component";
import {ICustomer} from "../../../../../core/business-logic/customer";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'customer-select-customer-whac-a-mole-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CustomerExternalListComponent
	],
	template: `
		<customer-external-list-component [mobileMode]="true"/>
	`
})
export class SelectCustomerPushBoxComponent extends Reactive implements OnInit, AfterViewInit {

	readonly customerExternalListComponent = viewChild.required(CustomerExternalListComponent);

	public readonly selectedCustomerList = input<ICustomer.DTO[]>([]);

	@Input()
	public newSelectedCustomerList: ICustomer.DTO[] = [];

	public readonly multiple = input(true);

	@Output()
	public readonly selectedCustomerListener = new EventEmitter<ICustomer.DTO[]>();

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly router = inject(Router);
	public readonly logger = inject(NGXLogger);

	public ngOnInit(): void {

		this.newSelectedCustomerList = [...(this.selectedCustomerList() ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.customerExternalListComponent().mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {0: cardListComponent} = mobileLayoutListComponent.cardListComponents();
		cardListComponent.selectedIds = this.newSelectedCustomerList.map((customer) => customer._id);
		cardListComponent.showAction.doFalse();
		cardListComponent.showSelectedStatus.doTrue();
		cardListComponent.goToDetailsOnSingleClick;
		cardListComponent.singleClickEmitter.pipe(this.takeUntil()).subscribe((item) => {
			if (this.isSelected(item)) {
				this.deselect(item);
			} else {
				this.select(item);
			}
			cardListComponent.selectedIds = this.newSelectedCustomerList.map(({_id}) => _id);
			cardListComponent.changeDetectorRef.detectChanges();
		});
	}

	public async submit(): Promise<ICustomer.DTO[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedCustomerList);
		});
	}

	public select(service: ICustomer.DTO): void {
		if (!this.multiple()) {
			if (this.newSelectedCustomerList.length) {
				this.newSelectedCustomerList.splice(0, 1);
			}
		}
		this.newSelectedCustomerList.push({...service});

		this.selectedCustomerListener.emit(this.newSelectedCustomerList);
		this.changeDetectorRef.detectChanges();
	}

	public deselect(service: ICustomer.DTO): void {
		this.newSelectedCustomerList = this.newSelectedCustomerList.filter((selectedMember: ICustomer.DTO) => selectedMember._id !== service._id);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: ICustomer.DTO): boolean {
		return this.newSelectedCustomerList.some((selectedMember: ICustomer.DTO) => selectedMember._id === service._id);
	}

	public isNotSelected(service: ICustomer.DTO): boolean {
		return !this.isSelected(service);
	}
}
