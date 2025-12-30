#!/usr/bin/env node

const readline = require('node:readline');

const LAYER_COLORS = {
    PRESENTATION: { fillcolor: '#81D4FA', color: '#03A9F4', clusterFillcolor: '#e3f2fd' },
    INFRASTRUCTURE: { fillcolor: '#B39DDB', color: '#673AB7', clusterFillcolor: '#ede7f6' },
    DOMAIN: { fillcolor: '#FFCC80', color: '#FF9800', clusterFillcolor: '#fff3e0' },
    CORE: { fillcolor: '#FFF59D', color: '#FFEB3B', clusterFillcolor: '#fffde7' }
};

const LAYER_PATHS = [
    { pattern: /\/shell[/"]/, layer: LAYER_COLORS.PRESENTATION },
    { pattern: /\/lib\/presentation[/"]/, layer: LAYER_COLORS.PRESENTATION },
    { pattern: /\/lib\/infrastructure[/"]/, layer: LAYER_COLORS.INFRASTRUCTURE },
    { pattern: /\/lib\/domain[/"]/, layer: LAYER_COLORS.DOMAIN },
    { pattern: /\/lib\/core[/"]/, layer: LAYER_COLORS.CORE },
    { pattern: /\/features\/[^/]+\/presentation[/"]/, layer: LAYER_COLORS.PRESENTATION },
    { pattern: /\/features\/[^/]+\/infrastructure[/"]/, layer: LAYER_COLORS.INFRASTRUCTURE },
    { pattern: /\/features\/[^/]+\/domain[/"]/, layer: LAYER_COLORS.DOMAIN },
    { pattern: /\/features\/[^/]+\/core[/"]/, layer: LAYER_COLORS.CORE }
];

const CLUSTER_PATTERNS = [
    { path: 'cluster_src/app/shell', layer: LAYER_COLORS.PRESENTATION },
    { path: 'cluster_src/app/lib/core', layer: LAYER_COLORS.CORE },
    { path: 'cluster_src/app/lib/infrastructure', layer: LAYER_COLORS.INFRASTRUCTURE },
    { path: 'cluster_src/app/lib/domain', layer: LAYER_COLORS.DOMAIN },
    { path: 'cluster_src/app/lib/presentation', layer: LAYER_COLORS.PRESENTATION },
    { path: 'cluster_src/app/features/([^/]+)/core', layer: LAYER_COLORS.CORE },
    { path: 'cluster_src/app/features/([^/]+)/infrastructure', layer: LAYER_COLORS.INFRASTRUCTURE },
    { path: 'cluster_src/app/features/([^/]+)/domain', layer: LAYER_COLORS.DOMAIN },
    { path: 'cluster_src/app/features/([^/]+)/presentation', layer: LAYER_COLORS.PRESENTATION }
];

function createClusterStyle(layer) {
    return (
        'style="rounded,filled" ' +
        `fillcolor="${layer.clusterFillcolor}" ` +
        `color="${layer.color}" ` +
        'penwidth=3 label='
    );
}

function createNodeStyle(layer) {
    return (
        `fillcolor="${layer.fillcolor}" ` +
        `color="${layer.color}" ` +
        'penwidth=2 label='
    );
}

const colorizeCluster = (line) =>
    CLUSTER_PATTERNS.reduce((result, { path, layer }) => {
        const pattern = new RegExp(String.raw`${path}"\s*\{label=`);
        if (!pattern.test(result)) {
            return result;
        }
        const style = createClusterStyle(layer);
        const replacement = `${path}" {${style}`;
        return result.replace(pattern, replacement);
    }, line);

const colorizeNode = (line) => {
    const layer = LAYER_PATHS.find(({ pattern }) => pattern.test(line))?.layer;
    return layer
        ? line
            .split(/(\[[^\]]+\])/)
            .map((part) =>
                part.startsWith('[') && part.endsWith(']')
                    ? part
                        .replaceAll(/\s+(fillcolor|color|penwidth)="[^"]*"/g, '')
                        .replace('[label=', `[${createNodeStyle(layer)}`)
                    : part
            )
            .join('')
        : line;
};

const processLine = (line) => colorizeNode(colorizeCluster(line));

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
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
