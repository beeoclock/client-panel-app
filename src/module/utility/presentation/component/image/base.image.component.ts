import {Component, ElementRef, inject, Input, OnInit, ViewChild} from "@angular/core";
import {FormControl} from "@angular/forms";
import {extractFile} from "@utility/domain/extract-file";
import {file2base64} from "@utility/domain/file2base64";
import {BooleanState} from "@utility/domain";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'utility-base-image-component',
	template: ``,
	standalone: true
})
export class BaseImageComponent implements OnInit {

	@ViewChild('fileInput')
	public readonly fileInput!: ElementRef<HTMLInputElement>;

	@ViewChild('previewImage')
	public readonly previewImage!: ElementRef<HTMLImageElement>;

	@Input()
	public control = new FormControl();

	@Input()
	public showHit = true;

	@Input()
	public mediaId = '';

	public mediaIsChanged = new BooleanState(false);

	private readonly logger = inject(NGXLogger);

	public get isEmptyControl(): boolean {
		return !this.control.value;
	}

	public get isNotEmptyControl(): boolean {
		return !this.isEmptyControl;
	}

	public ngOnInit(): void {
		this.control.valueChanges.subscribe((base64: string | undefined) => {
			if (base64?.length) {
				this.previewImage.nativeElement.src = base64;
				this.previewImage.nativeElement.classList.remove('hidden');
			}
		});
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
	private async workWithFiles([file]: File[]): Promise<void> {

		try {

			const base64 = await file2base64(file);
			this.mediaIsChanged.switchOn();
			this.control.patchValue(base64);

		} catch (e) {
			this.logger.error(e);
		}

	}

}
