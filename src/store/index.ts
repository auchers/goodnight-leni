import {writable} from 'svelte/store';
import { MODES } from '$utils/constants';

export const visMode = writable<MODES>(MODES.BAR_ABSOLUTE) 