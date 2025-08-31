// 🇺🇦 Типи ОС та середовища виконання
export type OS =
	| 'android' | 'ios' | 'mac' | 'windows' | 'ubuntu' | 'linux' | 'unknown';

export type Runtime = 'web' | 'pwa' | 'capacitor' | 'electron' | 'unknown';

export interface PlatformInfo { os: OS; runtime: Runtime; }
