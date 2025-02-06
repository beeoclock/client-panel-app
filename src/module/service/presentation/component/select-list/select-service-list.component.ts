import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {IServiceDto} from "@order/domain/interface/i.service.dto";
import {Store} from "@ngxs/store";
import {ListServiceApiAdapter} from "@service/infrastructure/api/list.service.api.adapter";
import {
	SelectServiceMultipleComponent
} from "@service/presentation/component/select-list/select-service-multiple.component";
import {ServiceIndexedDBFacade} from "@service/infrastructure/facade/indexedDB/service.indexedDB.facade";
import {IService} from "@service/domain/interface/i.service";

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

	private readonly store = inject(Store);
	private readonly serviceIndexedDBFacade = inject(ServiceIndexedDBFacade);
	private readonly listServiceApiAdapter = inject(ListServiceApiAdapter);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly emitSelectedServiceList = output<IServiceDto[]>();

	public serviceList: IService.DTO[] = [];
	public readonly selectedServices: IServiceDto[] = [];

	public ngOnInit() {
		this.initServiceList().then();
	}

	public async initServiceList() {
		this.serviceList = this.serviceIndexedDBFacade.source.find().fetch();
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
