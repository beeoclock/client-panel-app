import {ChangeDetectionStrategy, Component, inject, input, output, ViewEncapsulation} from "@angular/core";
import {
	InfiniteScrollCustomEvent,
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonItem,
	IonLabel,
	IonList,
	IonPopover
} from "@ionic/angular/standalone";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {
	ProductChipPagination
} from "@shared/presentation/component/smart/order/form/product/list/item/chip/product/product.chip.pagination";
import {IProduct} from "@tenant/product/product/domain";

@Component({
	selector: 'product-popover-chip',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonItem,
		IonLabel,
		IonList,
		IonPopover,
		TranslateModule,
		AsyncPipe,
		IonContent,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
	],
	providers: [
		ProductChipPagination
	],
	template: `
		<!-- Control to select specialist -->
		<ion-popover #selectSpecialistPopover [trigger]="trigger()">
			<ng-template>
				<ion-content class="popover-content">
					<ion-list>
						@for (product of (items$ | async); track product._id) {
							<ion-item [button]="true" lines="full" [detail]="false"
									  (click)="result.emit(product);selectSpecialistPopover.dismiss()">
								<ion-label>{{ product.languageVersions[0].title }}</ion-label>
							</ion-item>
						}
					</ion-list>
					<ion-infinite-scroll (ionInfinite)="onIonInfinite($event)">
						<ion-infinite-scroll-content/>
					</ion-infinite-scroll>
				</ion-content>
			</ng-template>
		</ion-popover>
	`
})
export class ProductPopoverChip {

	public readonly trigger = input.required<string>();
	public readonly result = output<IProduct.DTO>();

	private readonly productChipPagination = inject(ProductChipPagination);

	public readonly items$ = this.productChipPagination.items$;

	protected onIonInfinite(event: InfiniteScrollCustomEvent) {
		this.productChipPagination.fetch().then(() => {
			event.target.complete().then();
		});
	}


}
