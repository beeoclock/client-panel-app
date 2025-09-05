import {ChangeDetectionStrategy, Component, inject, input, output, ViewEncapsulation} from "@angular/core";
import {
	InfiniteScrollCustomEvent,
	IonAvatar,
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonItem,
	IonLabel,
	IonList,
	IonNote,
	IonPopover
} from "@ionic/angular/standalone";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {
	ProductChipPagination
} from "@shared/presentation/ui/component/smart/order/form/product/list/item/chip/product/product.chip.pagination";
import {IProduct} from "@tenant/product/product/domain";

@Component({
	selector: 'product-popover-chip',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
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
		IonNote,
		IonAvatar,
	],
	providers: [
		ProductChipPagination
	],
	template: `
		<!-- Control to select specialist -->
		<ion-popover #selectSpecialistPopover [trigger]="trigger()" style="--width: 360px;">
			<ng-template>
				<ion-content class="popover-content">
					<ion-list>
						@for (product of (items$ | async); track product._id) {
							<ion-item [button]="true" lines="full" [detail]="false"
									  (click)="result.emit(product);selectSpecialistPopover.dismiss()">
								@let firstImage = product.images[0];
								@if (firstImage?.url?.length) {
									<ion-avatar slot="start" style="--border-radius: 8px;">
										<img [alt]="product.languageVersions[0].title" class="h-full object-cover" [src]="firstImage.url" />
									</ion-avatar>
								}
								<ion-label class="flex flex-col justify-start items-start">
									<div>{{ product.languageVersions[0].title }}</div>
									<ion-note>{{ product.languageVersions[0].description }}</ion-note>
								</ion-label>
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
