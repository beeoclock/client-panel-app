// 🇺🇦 Типи пристрою та орієнтації
export type DeviceKind = 'phone' | 'tablet' | 'computer' | 'tv';
export type Orientation = 'portrait' | 'landscape';

// 🇺🇦 Конфіг брейкпоінтів
export interface BreakpointConfig {
	phoneMax: number;    // 0..phoneMax
	tabletMax: number;   // phoneMax+1..tabletMax
	computerMax: number; // tabletMax+1..computerMax
}
