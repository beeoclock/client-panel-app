import {ChangeDetectionStrategy, Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {ImageInput} from "@shared/presentation/ui/component/image/image-input/image-input";
import {TranslatePipe} from "@ngx-translate/core";
import {BooleanState} from "@shared/domain";
import {IMedia} from "@tenant/media/domain/interface/i.media";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'image-input-template',
	standalone: true,
	imports: [
		CardComponent,
		ImageInput,
		TranslatePipe
	],
	template: `
		<bee-card>

			<div class="flex justify-between">
				<span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.image' | translate }}</span>
				<div class="flex gap-2">
					<button type="button"
							class="text-beeColor-500 dark:text-beeColor-400 hover:text-beeColor-600 dark:hover:text-beeColor-500 w-[40px] h-[40px]"
							(click)="toggleInfo.toggle()">
						<i class="bi" [class.bi-eye]="toggleInfo.isOff" [class.bi-eye-slash]="toggleInfo.isOn"></i>
					</button>
					<button type="button"
							class="text-beeColor-500 dark:text-beeColor-400 hover:text-beeColor-600 dark:hover:text-beeColor-500 w-[40px] h-[40px]"
							(click)="clear()">
						<i class="bi bi-trash"></i>
					</button>
				</div>
			</div>
			@for (image of imageList(); track $index) {

				<image-input
					[index]="$index"
					[showHit]="toggleInfo.isOn"
					[image]="image"/>

			}
			<p class="text-beeColor-500">
				{{ 'service.form.v2.section.presentation.motivate' | translate }}
			</p>
		</bee-card>

	`
})
export class ImageInputTemplate {

	public readonly imageList = input.required<IMedia[]>();
	public readonly imageInput = viewChildren(ImageInput);

	public readonly toggleInfo = new BooleanState(true);

	public clear(): void {

		this.imageInput().forEach(component => component.clear());

	}

}
