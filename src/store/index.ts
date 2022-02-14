import {writable} from 'svelte/store';
import { MODES } from '$utils/constants';

export const visMode = writable<MODES>(MODES.RADIAL) 

export const selectedThreshold = writable<[number, number] | null>(null);

export const minHours = writable<number | null>(null)