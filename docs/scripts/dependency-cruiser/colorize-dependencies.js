#!/usr/bin/env node

const readline = require('node:readline');

const LAYER_COLORS = {
    PRESENTATION: { fillcolor: '#81D4FA', color: '#03A9F4', clusterFillcolor: '#e3f2fd' },
    INFRASTRUCTURE: { fillcolor: '#B39DDB', color: '#673AB7', clusterFillcolor: '#ede7f6' },
    APPLICATION: { fillcolor: '#81C784', color: '#388E3C', clusterFillcolor: '#e8f5e9' },
    DOMAIN: { fillcolor: '#FFCC80', color: '#FF9800', clusterFillcolor: '#fff3e0' },
    APP_PROVIDERS: { fillcolor: '#E0E0E0', color: '#9E9E9E', clusterFillcolor: '#F5F5F5' },
    LIB: { fillcolor: '#80CBC4', color: '#00897B', clusterFillcolor: '#E0F2F1' },
    FEATURES: { fillcolor: '#F8BBD0', color: '#C2185B', clusterFillcolor: '#FCE4EC' }
};

const LAYER_PATHS = [
    { pattern: /\/shell[/"]/, layer: LAYER_COLORS.PRESENTATION },
    { pattern: /\/app-providers[/"]/, layer: LAYER_COLORS.APP_PROVIDERS },
    { pattern: /\/app\/features\/[^/]+\/presentation[/"]/, layer: LAYER_COLORS.PRESENTATION },
    { pattern: /\/app\/features\/[^/]+\/infrastructure[/"]/, layer: LAYER_COLORS.INFRASTRUCTURE },
    { pattern: /\/app\/features\/[^/]+\/application[/"]/, layer: LAYER_COLORS.APPLICATION },
    { pattern: /\/app\/features\/[^/]+\/domain[/"]/, layer: LAYER_COLORS.DOMAIN },
    { pattern: /\/app\/lib\/[^/]+\/[^/]+\/presentation[/"]/, layer: LAYER_COLORS.PRESENTATION },
    { pattern: /\/app\/lib\/[^/]+\/[^/]+\/infrastructure[/"]/, layer: LAYER_COLORS.INFRASTRUCTURE },
    { pattern: /\/app\/lib\/[^/]+\/[^/]+\/application[/"]/, layer: LAYER_COLORS.APPLICATION },
    { pattern: /\/app\/lib\/[^/]+\/[^/]+\/domain[/"]/, layer: LAYER_COLORS.DOMAIN }
];

const CLUSTER_PATTERNS = [
    { path: /cluster_src\/app\/shell/, layer: LAYER_COLORS.PRESENTATION },
    { path: /cluster_src\/app-providers/, layer: LAYER_COLORS.APP_PROVIDERS },
    { path: /cluster_src\/app\/features\/[^/]+$/, layer: LAYER_COLORS.FEATURES },
    { path: /cluster_src\/app\/features\/[^/]+\/presentation/, layer: LAYER_COLORS.PRESENTATION },
    { path: /cluster_src\/app\/features\/[^/]+\/infrastructure/, layer: LAYER_COLORS.INFRASTRUCTURE },
    { path: /cluster_src\/app\/features\/[^/]+\/application/, layer: LAYER_COLORS.APPLICATION },
    { path: /cluster_src\/app\/features\/[^/]+\/domain/, layer: LAYER_COLORS.DOMAIN },
    { path: /cluster_src\/app\/lib\/(?:core|generic|supporting)\/[^/]+$/, layer: LAYER_COLORS.LIB },
    { path: /cluster_src\/app\/lib\/[^/]+\/[^/]+\/presentation/, layer: LAYER_COLORS.PRESENTATION },
    { path: /cluster_src\/app\/lib\/[^/]+\/[^/]+\/infrastructure/, layer: LAYER_COLORS.INFRASTRUCTURE },
    { path: /cluster_src\/app\/lib\/[^/]+\/[^/]+\/application/, layer: LAYER_COLORS.APPLICATION },
    { path: /cluster_src\/app\/lib\/[^/]+\/[^/]+\/domain/, layer: LAYER_COLORS.DOMAIN }
];

function createClusterStyle(layer) {
    return (
        'style="rounded,filled" ' +
        `fillcolor="${layer.clusterFillcolor}" ` +
        `color="${layer.color}" ` +
        'penwidth=2 label='
    );
}

function createNodeStyle(layer) {
    return (
        `fillcolor="${layer.fillcolor}" ` +
        `color="${layer.color}" ` +
        'penwidth=1 label='
    );
}

const colorizeCluster = (line) =>
    CLUSTER_PATTERNS.reduce((result, { path, layer }) => (
        result.replaceAll(/subgraph "([^"]+)"\s*\{label=/g, (match, clusterName) => (
            path.test(clusterName)
                ? `subgraph "${clusterName}" {${createClusterStyle(layer)}`
                : match
        ))
    ), line);

const colorizeNode = (line) => {
    const layer = LAYER_PATHS.find(({ pattern }) => pattern.test(line))?.layer;
    return layer
        ? line
            .split(/(\[[^\]]+\])/)
            .map((part) => (
                part.startsWith('[') && part.endsWith(']')
                    ? part
                        .replaceAll(/\s+(fillcolor|color|penwidth)="[^"]*"/g, '')
                        .replace('[label=', `[${createNodeStyle(layer)}`)
                    : part
            ))
            .join('')
        : line;
};

const processLine = (line) => colorizeNode(colorizeCluster(line));

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    const lines = [];
    rl.on('line', (line) => {
        lines.push(processLine(line));
    });
    rl.on('close', () => {
        process.stdout.write(lines.join('\n') + '\n');
    });
};

main();
