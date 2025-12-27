import { Command } from 'commander';
import React from 'react';
import { render } from 'ink';
import { UfdLoader } from './src/engine/downloader.ts';
import { App } from './src/ui/App.tsx';

const program = new Command();

program
    .name('ufdloader')
    .description('A terminal-based download accelerator')
    .version('0.1.0')
    .argument('[url]', 'URL to download (optional)')
    .option('-n, --connections <number>', 'number of connections', '8')
    .option('-o, --output <path>', 'output destination')
    .action(async (url, options) => {
        try {
            // If URL is missing, ask the user interactively
            if (!url) {
                const readline = require('node:readline');
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                url = await new Promise((resolve) => {
                    rl.question('Enter the URL to download: ', (answer: string) => {
                        rl.close();
                        resolve(answer.trim());
                    });
                });
            }
            const connections = parseInt(options.connections, 10);
            const { waitUntilExit } = render(React.createElement(App, {
                url,
                connections,
                initialDestination: options.output
            }));

            await waitUntilExit();
        } catch (error: any) {
            // Errors are now emitted via the loader and displayed in the UI.
            // process.exit(1); // optional: keep if you want to terminate on fatal error
        }
    });

program.parse();