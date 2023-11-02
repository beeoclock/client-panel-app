import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	QueryList,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {IService} from "@service/domain";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {Router, RouterLink} from "@angular/router";
import {ModalButtonRoleEnum, ModalComponent} from "@utility/presentation/component/modal/modal.component";
import {NGXLogger} from "ngx-logger";
import {ServiceItemComponent} from "@service/presentation/component/list/item/item.componen";
import {ServiceExternalListComponent} from "@service/presentation/component/external/list/list.component";
import {firstValueFrom} from "rxjs";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";

@Component({
	selector: 'utility-modal-select-service-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		LoaderComponent,
		NgIf,
		TranslateModule,
		CurrencyPipe,
		BocMediaDirective,
		HumanizeDurationPipe,
		PrimaryButtonDirective,
		RouterLink,
		ServiceItemComponent,
		ServiceExternalListComponent
	],
	template: `
		<service-external-list-component [mobileMode]="true"/>
	`
})
export class ModalSelectServiceComponent implements OnInit, AfterViewInit {

	@ViewChild(ServiceExternalListComponent)
	public serviceExternalListComponent!: ServiceExternalListComponent;

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly router = inject(Router);
	public readonly logger = inject(NGXLogger);

	public selectedServiceList: IService[] = [];
	public newSelectedServiceList: IService[] = [];

	public multiple = true;
	public modalInstance: ModalComponent | null = null;

	public ngOnInit(): void {

		this.newSelectedServiceList = [...(this.selectedServiceList ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.serviceExternalListComponent.mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {first: cardListComponent} = mobileLayoutListComponent.cardListComponents;
		cardListComponent.selectedIds = this.newSelectedServiceList.map((service) => service._id);
		cardListComponent.showAction.switchOff();
		cardListComponent.showSelectedStatus.switchOn();
		cardListComponent.goToDetailsOnSingleClick = false;
		cardListComponent.singleClickEmitter.subscribe((item) => {
			if (this.isSelected(item)) {
				this.deselect(item);
			} else {
				this.select(item);
			}
		});
	}

	public async submit(): Promise<IService[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedServiceList);
		});
	}

	public select(service: IService): void {
		if (!this.multiple) {
			if (this.newSelectedServiceList.length) {
				this.newSelectedServiceList.splice(0, 1);
			}
		}
		this.newSelectedServiceList.push(service);

		if (!this.modalInstance) {
			this.logger.error('modalInstance is not defined');
			return;
		}
		this.modalInstance.executeCallback(ModalButtonRoleEnum.accept);
		this.changeDetectorRef.detectChanges();
	}

	public deselect(service: IService): void {
		this.newSelectedServiceList = this.newSelectedServiceList.filter((selectedMember: IService) => selectedMember._id !== service._id);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: IService): boolean {
		return this.newSelectedServiceList.some((selectedMember: IService) => selectedMember._id === service._id);
	}

	public isNotSelected(service: IService): boolean {
		return !this.isSelected(service);
	}

	public goToServiceFormPage() {
		if (!this.modalInstance) {
			this.logger.error('modalInstance is not defined');
			return;
		}
		this.modalInstance.closeModal();
		this.router.navigate(['/', 'service', 'form']).then();
	}
}
