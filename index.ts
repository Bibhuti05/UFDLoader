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