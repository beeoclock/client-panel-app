import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject, map} from "rxjs";

enum ThemeEnum {
	light = 'light',
	dark = 'dark'
}

type ThemeType = 'dark' | 'light';

@Injectable({
	providedIn: "root"
})
export class ThemeService {

	private readonly document = inject(DOCUMENT);
	readonly #theme$ = new BehaviorSubject((localStorage.getItem('theme') || 'light') as ThemeType);

	public readonly isDark$ = this.#theme$.pipe(
		map((theme: string) => theme === 'dark')
	);

	public readonly isLight$ = this.#theme$.pipe(
		map((theme: string) => theme === 'light')
	);

	public readonly theme$ = this.#theme$.asObservable();

	public get theme(): ThemeType {
		return this.#theme$.getValue();
	}

	public readonly themes = [ThemeEnum.light, ThemeEnum.dark];

	public get isDark(): boolean {
		return this.theme === 'dark';
	}

	public get isLight(): boolean {
		return this.theme === 'light';
	}

	public initialize(): void {
		this.initHandler();
	}

	public toggleTheme(theme: ThemeType): void {
		this.#theme$.next(theme);
	}

	private initHandler(): void {
		this.#theme$.subscribe(this.setTheme.bind(this));
	}

	private setTheme(theme: string): void {
		localStorage.setItem('theme', theme);
		if (theme === ThemeEnum.dark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

}
