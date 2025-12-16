#!/usr/bin/env node

const readline = require('node:readline');

const LAYER_COLORS = {
    PRESENTATION: {
        fillcolor: '#FFEB3B',
        color: '#03A9F4',
        clusterFillcolor: '#e3f2fd',
    },
    INFRASTRUCTURE: {
        fillcolor: '#FFEB3B',
        color: '#673AB7',
        clusterFillcolor: '#ede7f6',
    },
    DOMAIN: {
        fillcolor: '#FFEB3B',
        color: '#FF9800',
        clusterFillcolor: '#fff3e0',
    },
    CORE: {
        fillcolor: '#FFEB3B',
        color: '#9E9E9E',
        clusterFillcolor: '#f5f5f5',
    },
};

const LAYER_PATHS = [
    { pattern: 'src/app/shell', layer: LAYER_COLORS.PRESENTATION },
    { pattern: 'src/app/lib/infrastructure', layer: LAYER_COLORS.INFRASTRUCTURE },
];

const createClusterStyle = (layer) =>
    `{style="rounded,filled" fillcolor="${layer.clusterFillcolor}" color="${layer.color}" penwidth=3 label=`;

const createNodeStyle = (layer) =>
    `[fillcolor="${layer.fillcolor}" color="${layer.color}" penwidth=2 label=`;

const findMatchingLayer = (line) =>
    LAYER_PATHS.find(({ pattern }) => line.includes(pattern))?.layer ?? null;

const colorizeCluster = (line) => {
    const match = LAYER_PATHS.find(({ pattern }) => {
        const escapedPattern = pattern.replaceAll('/', String.raw`\/`);
        const regex = new RegExp(
            String.raw`subgraph "cluster_${escapedPattern}(\/[^"]*)?"` + String.raw`\s*\{label=`,
            'g'
        );
        return regex.test(line);
    });

    if (!match) return line;

    const { pattern, layer } = match;
    const escapedPattern = pattern.replaceAll('/', String.raw`\/`);
    const regex = new RegExp(
        String.raw`subgraph "cluster_${escapedPattern}(\/[^"]*)?"` + String.raw`\s*\{label=`,
        'g'
    );

    return line.replaceAll(regex, (m) => m.replace('{label=', createClusterStyle(layer)));
};

const colorizeNode = (line) => {
    const layer = findMatchingLayer(line);

    if (!layer) return line;

    // Input comes from trusted dependency-cruiser tool, not user input.
    // Regex is safe - negated character class [^"]* cannot cause catastrophic backtracking
    const cleanedLine = line.replaceAll(/\s+(fillcolor|color|penwidth)="[^"]*"/g, ''); // NOSONAR
    return cleanedLine.replaceAll('[label=', createNodeStyle(layer));
};

const processLine = (line) => {
    if (line.includes('subgraph "cluster_')) {
        return colorizeCluster(line);
    }

    if (line.includes('[label=')) {
        return colorizeNode(line);
    }

    return line;
};

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    let output = '';

    rl.on('line', (line) => {
        output += processLine(line) + '\n';
    });

    rl.on('close', () => {
        process.stdout.write(output);
    });
}

main();
