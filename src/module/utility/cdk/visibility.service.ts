import {Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VisibilityService {
    public readonly visibilityChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor() {
        fromEvent(document, 'visibilitychange').subscribe(() => {
            this.visibilityChange.next(!document.hidden);
        });
    }
}
