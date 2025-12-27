import axios from 'axios';
import fs from 'node:fs';
import type { DownloadSegment } from '../types.ts';

export class DownloadWorker {
    private segment: DownloadSegment;
    private url: string;
    private filePath: string;
    private onProgress: (bytes: number) => void;
    private abortController: AbortController;

    constructor(
        segment: DownloadSegment,
        url: string,
        filePath: string,
        onProgress: (bytes: number) => void
    ) {
        this.segment = segment;
        this.url = url;
        this.filePath = filePath;
        this.onProgress = onProgress;
        this.abortController = new AbortController();
    }

    async start(): Promise<void> {
        const { start, current, end } = this.segment;
        const rangeStart = start + current;

        if (rangeStart >= end) {
            return;
        }

        try {
            const response = await axios({
                method: 'get',
                url: this.url,
                headers: {
                    Range: `bytes=${rangeStart}-${end}`,
                },
                responseType: 'stream',
                signal: this.abortController.signal,
            });

            const writeStream = fs.createWriteStream(this.filePath, {
                flags: 'r+',
                start: rangeStart,
            });

            return new Promise((resolve, reject) => {
                response.data.on('data', (chunk: Buffer) => {
                    this.onProgress(chunk.length);
                });

                response.data.pipe(writeStream);

                writeStream.on('finish', () => {
                    resolve();
                });

                writeStream.on('error', (err: Error) => {
                    reject(err);
                });

                response.data.on('error', (err: Error) => {
                    reject(err);
                });
            });
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Download canceled');
            } else {
                throw error;
            }
        }
    }

    stop() {
        this.abortController.abort();
    }
}
