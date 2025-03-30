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
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {ServiceExternalListComponent} from "@tenant/service/presentation/ui/component/external/list/list.component";
import {Reactive} from "@utility/cdk/reactive";
import {IService} from "@core/business-logic/service/interface/i.service";
import EService from "@core/business-logic/service/entity/e.service";
import {DatePipe} from "@angular/common";
import {
	SelectServiceTableNgxDatatableResource
} from "@tenant/service/presentation/push-box/select-service.table-ngx-datatable.resource";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'utility-modal-select-service-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		ServiceExternalListComponent
	],
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: SelectServiceTableNgxDatatableResource,
		},
	],
	template: `
		<service-external-list-component [mobileMode]="true"/>
	`
})
export class SelectServiceWhacAMoleComponent extends Reactive implements OnInit, AfterViewInit {

	public readonly selectedServiceList = input<EService[]>([]);

	@Input()
	public newSelectedServiceList: EService[] = [];

	@Output()
	public readonly selectedServicesListener = new EventEmitter<void>();

	readonly serviceExternalListComponent = viewChild.required(ServiceExternalListComponent);

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly logger = inject(NGXLogger);

	public readonly multiple = input(true);

	public ngOnInit(): void {

		this.newSelectedServiceList = [...(this.selectedServiceList() ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = this.serviceExternalListComponent().mobileLayoutListComponents();
		if (mobileLayoutListComponents) {

			const {0: cardListComponent} = mobileLayoutListComponents.cardListComponents();
			cardListComponent.selectedIds = this.newSelectedServiceList.map(({_id}) => _id);
			cardListComponent.showAction.doFalse();
			cardListComponent.showSelectedStatus.doTrue();
			cardListComponent.goToDetailsOnSingleClick = false;
			cardListComponent.singleClickEmitter.pipe(this.takeUntil()).subscribe((item) => {
				if (this.isSelected(item)) {
					this.deselect(item);
				} else {
					this.select(item);
				}
				cardListComponent.selectedIds = this.newSelectedServiceList.map(({_id}) => _id);
				cardListComponent.changeDetectorRef.detectChanges();
			});

		}
	}

	public async submit(): Promise<IService.DTO[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedServiceList);
		});
	}

	public async select(service: EService) {
		if (!this.multiple()) {
			if (this.newSelectedServiceList.length) {
				this.newSelectedServiceList.splice(0, 1);
			}
		}
		this.newSelectedServiceList.push(service);
		this.selectedServicesListener.emit();
		this.changeDetectorRef.detectChanges();

	}

	public deselect(service: IService.DTO): void {
		this.newSelectedServiceList = this.newSelectedServiceList.filter(({_id}) => _id !== service._id);
		this.selectedServicesListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: IService.DTO): boolean {
		return this.newSelectedServiceList.some(({_id}) => _id === service._id);
	}

	public isNotSelected(service: IService.DTO): boolean {
		return !this.isSelected(service);
	}
}
