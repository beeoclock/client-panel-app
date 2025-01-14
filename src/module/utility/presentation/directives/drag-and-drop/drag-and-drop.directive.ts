import {Directive, HostBinding, HostListener, output} from '@angular/core';

@Directive({
  selector: '[dragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {

  @HostBinding('class.fileover')
  public fileOver: boolean | undefined;

  public readonly fileDropped = output<any>();

  // Dragover listener
  @HostListener('dragover', ['$event'])
  public onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any; }; }) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
