import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";
import {
	SpecialistsBlockComponent
} from "@service/presentation/component/form/v2/specialists/specialists-block.component";
import {ServiceForm} from "@service/presentation/form/service.form";
import {filter, firstValueFrom, Observable} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {IService} from "@service/domain";
import {Select, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {ActivatedRoute, Router} from "@angular/router";
import {SwitchActiveBlockComponent} from "@utility/presentation/component/switch-active/switch-active-block.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ImageBlockComponent} from "@service/presentation/component/form/v2/image/image-block/image-block.component";

@Component({
	selector: 'service-form-v2-page-component',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		BackLinkComponent,
		NgIf,
		ImageBlockComponent,
		ReactiveFormsModule,
		TranslateModule,
		DetailsBlockComponent,
		PricesBlockComponent,
		SpecialistsBlockComponent,
		SwitchActiveBlockComponent,
		PrimaryButtonDirective,
		AsyncPipe,
	]
})
export default class Index implements OnInit {

	@ViewChild(ImageBlockComponent)
	public readonly imageBlock!: ImageBlockComponent;

	public readonly form = new ServiceForm();

	public readonly store = inject(Store);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly router = inject(Router);

	@Select(ServiceState.itemData)
	public itemData$!: Observable<IService | undefined>;

	private isEditMode = false;
	public mediaId = '';

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
			firstValueFrom(this.itemData$).then((result) => {
				if (result) {
					this.isEditMode = true;
					this.mediaId = result?.presentation?.banners?.[0] ?? '';

					const {durationVersions, ...rest} = result;
					this.form.patchValue(rest);

					// Prevents from removing all controls from durationVersions
					this.form.controls.durationVersions.clear();
					// Add new controls to durationVersions
					durationVersions.forEach((durationVersion) => {
						this.form.controls.durationVersions.pushNewOne(durationVersion);
					});

					this.form.updateValueAndValidity();
					this.changeDetectorRef.detectChanges();
				}
			});
		});
	}

	public async save(): Promise<void> {

		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const redirectUri = ['../'];
			const value = this.form.getRawValue() as IService;
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateItem(value)));
				await this.imageBlock.save(value._id);
			} else {
				await firstValueFrom(this.store.dispatch(new ServiceActions.CreateItem(value)));
				const item = await firstValueFrom(this.itemData$);
				if (item && item._id) {
					await this.imageBlock.save(item._id);
					redirectUri.push(item._id);
				}
			}
			await this.router.navigate(redirectUri, {
				relativeTo: this.activatedRoute
			});
			this.form.enable();
			this.form.updateValueAndValidity();
		}
	}

}
