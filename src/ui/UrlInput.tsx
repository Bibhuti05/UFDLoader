import React from 'react';
import { Box, Text, Newline } from 'ink';
import { TextInput } from '@inkjs/ui';

interface Props {
    onSubmit: (url: string) => void;
}

export const UrlInput: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Box flexDirection="column" borderStyle="double" borderColor="blue" padding={1} width={60}>
            <Box marginBottom={1}>
                <Text bold color="yellow">UFDLoader - Download Accelerator</Text>
            </Box>
            <Box marginBottom={1}>
                <Text color="gray">Enter the URL to download:</Text>
            </Box>
            <Box marginBottom={1}>
                <TextInput
                    placeholder="https://example.com/file.zip"
                    onSubmit={onSubmit}
                />
            </Box>
            <Box marginTop={1}>
                <Text color="cyan">Press Enter to continue, Ctrl+C to exit.</Text>
            </Box>
        </Box>
    );
};