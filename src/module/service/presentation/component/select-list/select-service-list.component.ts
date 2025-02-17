import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {
	SelectServiceMultipleComponent
} from "@service/presentation/component/select-list/select-service-multiple.component";
import {IService} from "@src/core/business-logic/service/interface/i.service";
import {ServiceService} from "@core/business-logic/service/service/service.service";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";

@Component({
	selector: 'app-select-service-list-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	template: `
		@for (service of serviceList; track service._id) {
			<select-service-multiple [service]="service" (emitSelect)="select($event)"
									 (emitDeselect)="deselect($event)"/>
		}
	`,
	imports: [
		SelectServiceMultipleComponent
	],
	host: {
		class: 'border border-gray-200 divide-y h-full overflow-auto rounded-2xl'
	}
})
export class SelectServiceListComponent implements OnInit {

	private readonly serviceService = inject(ServiceService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly emitSelectedServiceList = output<IServiceDto[]>();

	public serviceList: IService.DTO[] = [];
	public readonly selectedServices: IServiceDto[] = [];

	public ngOnInit() {
		this.initServiceList().then();
	}

	public async initServiceList() {
		const result = await this.serviceService.repository.findAsync({
			pageSize: 500,
			page: 1,
			orderBy: OrderByEnum.UPDATED_AT,
			orderDir: OrderDirEnum.DESC,
		});
		this.serviceList = result.items;
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Select a service
	 * @param service
	 */
	public select(service: IServiceDto): void {
		this.selectedServices.push(service);
		this.emitSelectedServiceList.emit(this.selectedServices);
	}

	/**
	 * Deselect a service
	 * @param service
	 */
	public deselect(service: IServiceDto): void {
		const index = this.selectedServices.indexOf(service);
		if (index >= 0) {
			this.selectedServices.splice(index, 1);
		}
		this.emitSelectedServiceList.emit(this.selectedServices);
	}

}
