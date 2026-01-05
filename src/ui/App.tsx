import React, { useEffect, useState, useMemo } from 'react';
import { Box, Text, Newline } from 'ink';
import type { DownloadState } from '../types.ts';
import { formatBytes } from '../utils.ts';
import { FolderPicker } from './FolderPicker.tsx';
import { UrlInput } from './UrlInput.tsx';
import { UfdLoader } from '../engine/downloader.ts';
import path from 'node:path';

interface AppProps {
    url?: string;
    connections: number;
    initialDestination?: string;
}

export const App: React.FC<AppProps> = ({ url, connections, initialDestination }) => {
    const [step, setStep] = useState<'url-input' | 'picking' | 'downloading'>(url ? (initialDestination ? 'downloading' : 'picking') : 'url-input');
    const [currentUrl, setCurrentUrl] = useState<string | undefined>(url);
    const [destination, setDestination] = useState<string | undefined>(initialDestination);
    const [loader, setLoader] = useState<UfdLoader | null>(null);
    // Holds a friendly error message when the loader fails
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleUrlSubmit = (url: string) => {
        setCurrentUrl(url);
        setStep(initialDestination ? 'downloading' : 'picking');
    };

    const handleFolderSelect = (folder?: string) => {
        if (!currentUrl) return;
        const defaultFilename = path.basename(new URL(currentUrl).pathname) || 'download';
        // If the user cancels or provides an empty string, fall back to the current directory '.'
        const chosenFolder = folder && folder.trim() !== '' ? folder : '.';
        const finalPath = path.join(chosenFolder, defaultFilename);
        setDestination(finalPath);
        setStep('downloading');
    };

    useEffect(() => {
        if (step === 'downloading' && destination && !loader && currentUrl) {
            const newLoader = new UfdLoader(currentUrl, connections, destination);
            setLoader(newLoader);

            // Initialize and start the loader
            (async () => {
                try {
                    await newLoader.init();
                    await newLoader.start();
                } catch (err) {
                    // Capture the error and display it in the UI
                    setErrorMsg(err instanceof Error ? err.message : String(err));
                }
            })();
        }
    }, [step, destination, currentUrl, connections, loader]);

    if (errorMsg) {
        return (
            <Box padding={1}>
                <Text color="red" bold>Error:</Text>
                <Text color="red"> {errorMsg}</Text>
            </Box>
        );
    }

    if (step === 'url-input') {
        return <UrlInput onSubmit={handleUrlSubmit} />;
    }

    if (step === 'picking') {
        return <FolderPicker onSelect={handleFolderSelect} />;
    }

    if (loader && destination) {
        return <DownloadManager loader={loader} />;
    }

    return (
        <Box padding={1}>
            <Text color="yellow">Initializing downloader...</Text>
        </Box>
    );
};

interface DownloadManagerProps {
    loader: UfdLoader;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ loader }) => {
    const [state, setState] = useState<DownloadState>(loader.getState());
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const handleProgress = (newState: DownloadState) => {
            setState({ ...newState });
        };

        loader.on('progress', handleProgress);
        loader.on('initialized', handleProgress);

        return () => {
            loader.off('progress', handleProgress);
            loader.off('initialized', handleProgress);
        };
    }, [loader]);

    const totalDownloaded = state.segments.reduce((acc: number, s) => acc + s.current, 0);
    const isCompleted = totalDownloaded >= state.totalSize && state.totalSize > 0;
    const percentage = state.totalSize ? Math.floor((totalDownloaded / state.totalSize) * 100) : 0;

    const elapsedTime = (Date.now() - startTime) / 1000;
    const speed = elapsedTime > 0 ? totalDownloaded / elapsedTime : 0;

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor={isCompleted ? "green" : "cyan"} width={60}>
            <Box justifyContent="space-between">
                <Text bold color="yellow">UFDLoader - Download Accelerator</Text>
                {isCompleted && <Text color="green" bold> [COMPLETED]</Text>}
            </Box>
            <Newline />
            <Box>
                <Text color="gray">File: </Text>
                <Text color="white" bold>{state.filename}</Text>
            </Box>
            <Box>
                <Text color="gray">Size: </Text>
                <Text color="white">{formatBytes(state.totalSize)}</Text>
            </Box>
            <Newline />

            {/* Overall Progress */}
            <Box flexDirection="column">
                <Box justifyContent="space-between">
                    <Text bold color="cyan">Total Progress: [{percentage}%]</Text>
                    <Text color="white">{formatBytes(totalDownloaded)} / {formatBytes(state.totalSize)}</Text>
                </Box>
                <ProgressBar percentage={percentage} color={isCompleted ? "green" : "cyan"} />
            </Box>

            <Newline />

            {/* Individual Segments */}
            <Box flexDirection="column">
                <Text bold color="blue" underline>Connections ({state.segments.length})</Text>
                {state.segments.map((segment: any) => {
                    const segPercent = segment.total > 0 ? Math.floor((segment.current / segment.total) * 100) : 0;
                    const isSegDone = segment.status === 'completed';
                    return (
                        <Box key={segment.id} flexDirection="row">
                            <Text color="gray">#{segment.id.toString().padStart(2, '0')}: </Text>
                            <Text color={isSegDone ? 'green' : 'blue'}>
                                [{'█'.repeat(Math.floor(segPercent / 5)).padEnd(20, '░')}]
                            </Text>
                            <Text color={isSegDone ? 'green' : 'white'}> {segPercent}%</Text>
                        </Box>
                    );
                })}
            </Box>

            <Newline />
            <Box justifyContent="space-between">
                <Text color="magenta" bold>Speed: {formatBytes(speed)}/s</Text>
                <Text color="gray">Connections: {state.connections}</Text>
            </Box>
        </Box>
    );
};

const ProgressBar: React.FC<{ percentage: number; color?: string }> = ({ percentage, color = "cyan" }) => {
    const width = 46;
    const completedWidth = Math.floor((percentage / 100) * width);
    const remainingWidth = width - completedWidth;

    return (
        <Text color={color}>
            {'█'.repeat(completedWidth)}
            {'░'.repeat(remainingWidth)}
        </Text>
    );
};
