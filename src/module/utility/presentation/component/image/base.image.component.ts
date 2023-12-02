import {AfterViewInit, Component, ElementRef, inject, Input, OnChanges, ViewChild} from "@angular/core";
import {extractFile} from "@utility/domain/extract-file";
import {file2base64} from "@utility/domain/file2base64";
import {BooleanState} from "@utility/domain";
import {NGXLogger} from "ngx-logger";
import {RIMedia} from "@module/media/domain/interface/i.media";

@Component({
	selector: 'utility-base-image-component',
	template: ``,
	standalone: true
})
export class BaseImageComponent implements OnChanges, AfterViewInit {

	@ViewChild('fileInput')
	public readonly fileInput!: ElementRef<HTMLInputElement>;

	@ViewChild('previewImage')
	public readonly previewImage!: ElementRef<HTMLImageElement>;

	@Input()
	public banner: RIMedia | null | undefined;

	@Input()
	public index = 0;

	@Input()
	public showHit = true;

	public selectedFile: File | undefined;

	public mediaIsChanged = new BooleanState(false);

	protected readonly logger = inject(NGXLogger);

	public ngAfterViewInit(): void {
		if (this.banner) {
			this.updateSrc(this.banner.url);
		}
	}

	public ngOnChanges(): void {
		// TODO check if is after view init
		if (this.banner) {
			this.updateSrc(this.banner.url);
		}
	}

	public updateSrc(base64: string | undefined): void {
		if (!base64?.length) {
			return;
		}
		console.log(this.previewImage);
		this.previewImage.nativeElement.src = base64;
		this.previewImage.nativeElement.classList.remove('hidden');
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

	/**
	 *
	 * @param files - files to work with
	 * @private
	 */
	protected async workWithFiles([file]: File[]): Promise<void> {

		try {

			this.selectedFile = file;
			const base64 = await file2base64(file);
			this.mediaIsChanged.switchOn();
			this.updateSrc(base64);

		} catch (e) {
			this.logger.error(e);
		}

	}

}
