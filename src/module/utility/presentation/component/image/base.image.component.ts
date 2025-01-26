import {AfterViewInit, Component, ElementRef, inject, input, OnChanges, viewChild} from "@angular/core";
import {extractFile} from "@utility/domain/extract-file";
import {file2base64} from "@utility/domain/file2base64";
import {NGXLogger} from "ngx-logger";
import {RIMedia} from "@module/media/domain/interface/i.media";

export enum MediaStateEnum {
	NOT_CHANGED = 'NOT_CHANGED',
	CHANGED = 'CHANGED',
	DELETED = 'DELETED',
}

@Component({
	selector: 'utility-base-image-component',
	template: ``,
	standalone: true
})
export class BaseImageComponent implements OnChanges, AfterViewInit {

	readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

	readonly previewImage = viewChild.required<ElementRef<HTMLImageElement>>('previewImage');

	public readonly banner = input<RIMedia | null | undefined | {
    url: string;
    _id: string;
}>(null);

	public readonly index = input(0);

	public readonly showHit = input(true);

	public selectedFile: File | undefined;

	public mediaState: MediaStateEnum = MediaStateEnum.NOT_CHANGED;

	protected readonly logger = inject(NGXLogger);

	public ngAfterViewInit(): void {
		const banner = this.banner();
  if (banner) {
			this.updateSrc(banner.url);
		}
	}

	public ngOnChanges(): void {
		// TODO check if is after view init
		const banner = this.banner();
  if (banner) {
			this.updateSrc(banner.url);
		}
	}

	public updateSrc(base64: string | undefined): void {
		const previewImage = this.previewImage();
  if (!base64?.length || !previewImage) {
			return;
		}
		previewImage.nativeElement.src = base64;
		previewImage.nativeElement.classList.remove('hidden');
	}

	/**
	 *
	 * @param event
	 */
	public async onFileSelected(event: Event): Promise<void> {

		try {

			const fileInput = event.target as HTMLInputElement;
			const file = extractFile(fileInput);
			await this.workWithFiles([file])

		} catch (e) {
			this.logger.error(e);
		}

	}

	/**
	 *
	 * @param files
	 */
	public async onFilesDropped(files: File[]): Promise<void> {
		await this.workWithFiles(files);
	}

	public clear(): void {
		this.mediaState = MediaStateEnum.DELETED;
		const previewImage = this.previewImage();
  previewImage.nativeElement.src = '';
		previewImage.nativeElement.classList.add('hidden');
		this.selectedFile = undefined;
	}

	/**
	 *
	 * @param files - files to work with
	 * @private
	 */
	protected async workWithFiles([file]: File[]): Promise<void> {

		try {

			this.selectedFile = file;
			const base64 = await file2base64(file);
			this.mediaState = MediaStateEnum.CHANGED;
			this.updateSrc(base64);

		} catch (e) {
			this.logger.error(e);
		}

	}

}
