import fs from 'node:fs';
import type { DownloadState } from '../types.ts';

export function saveState(state: DownloadState) {
    const statePath = `${state.filename}.ufd`;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

export function loadState(filename: string): DownloadState | null {
    const statePath = `${filename}.ufd`;
    if (fs.existsSync(statePath)) {
        try {
            const data = fs.readFileSync(statePath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
    return null;
}

export function deleteState(filename: string) {
    const statePath = `${filename}.ufd`;
    if (fs.existsSync(statePath)) {
        fs.unlinkSync(statePath);
    }
}
