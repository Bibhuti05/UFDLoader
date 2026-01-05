import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import fs from 'node:fs';
import path from 'node:path';

interface Item {
    label: string;
    value: string;
    isDirectory: boolean;
    key?: string;
}

interface Props {
    onSelect: (folder: string) => void;
}

export const FolderPicker: React.FC<Props> = ({ onSelect }) => {
    const [currentPath, setCurrentPath] = useState(process.cwd());
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        try {
            const files = fs.readdirSync(currentPath, { withFileTypes: true });
            const list: Item[] = [
                { label: '󰉖  .. (Go Up)', value: '..', isDirectory: true, key: '..' },
                { label: '󰄬  SELECT CURRENT FOLDER', value: '.', isDirectory: false, key: '.' },
                ...files
                    .filter(f => f.isDirectory() || !f.name.startsWith('.'))
                    .sort((a, b) => {
                        if (a.isDirectory() && !b.isDirectory()) return -1;
                        if (!a.isDirectory() && b.isDirectory()) return 1;
                        return a.name.localeCompare(b.name);
                    })
                    .map(f => ({
                        label: f.isDirectory() ? `  ${f.name}` : `󰈔  ${f.name}`,
                        value: f.name,
                        isDirectory: f.isDirectory(),
                        key: f.name
                    }))
            ];
            setItems(list);
        } catch (error) {
            // Handle permission errors or deleted dirs
            setCurrentPath(path.dirname(currentPath));
        }
    }, [currentPath]);

    const handleSelect = (item: any) => {
        if (item.value === '..') {
            setCurrentPath(path.dirname(currentPath));
        } else if (item.value === '.') {
            onSelect(currentPath);
        } else if (item.isDirectory) {
            setCurrentPath(path.join(currentPath, item.value));
        }
    };

    return (
        <Box flexDirection="column" borderStyle="double" borderColor="blue" padding={1} width={60}>
            <Box marginBottom={1}>
                <Text bold color="yellow">Select Download Folder</Text>
            </Box>
            <Box marginBottom={1}>
                <Text color="gray">Path: </Text>
                <Text color="white" bold>{currentPath}</Text>
            </Box>
            <Box height={15} flexDirection="column">
                <SelectInput items={items} onSelect={handleSelect} />
            </Box>
            <Box marginTop={1}>
                <Text color="cyan">Use arrow keys to navigate, Enter to select/confirm.</Text>
            </Box>
        </Box>
    );
};
