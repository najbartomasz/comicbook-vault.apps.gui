#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Layer color definitions
const LAYERS = {
    PRESENTATION: { fillcolor: '#FFEB3B', color: '#03A9F4', clusterFillcolor: '#e3f2fd' },
    INFRASTRUCTURE: { fillcolor: '#FFEB3B', color: '#673AB7', clusterFillcolor: '#ede7f6' },
    DOMAIN: { fillcolor: '#FFEB3B', color: '#FF9800', clusterFillcolor: '#fff3e0' },
    CORE: { fillcolor: '#FFEB3B', color: '#9E9E9E', clusterFillcolor: '#f5f5f5' }
};

let output = '';

rl.on('line', (line) => {
    // Color subgraphs/clusters based on architectural layer
    if (line.includes('subgraph "cluster_')) {
        // Presentation layer: shell
        line = line.replace(
            /subgraph "cluster_src\/app\/shell(\/[^"]*)?"\s*\{label=/g,
            (match) => {
                return match.replace('{label=', `{style="rounded,filled" fillcolor="${LAYERS.PRESENTATION.clusterFillcolor}" color="${LAYERS.PRESENTATION.color}" penwidth=3 label=`);
            }
        );

        // Infrastructure layer: lib/infrastructure
        line = line.replace(
            /subgraph "cluster_src\/app\/lib\/infrastructure(\/[^"]*)?"\s*\{label=/g,
            (match) => {
                return match.replace('{label=', `{style="rounded,filled" fillcolor="${LAYERS.INFRASTRUCTURE.clusterFillcolor}" color="${LAYERS.INFRASTRUCTURE.color}" penwidth=3 label=`);
            }
        );
    }
    // Color nodes based on their path
    else if (line.includes('[label=')) {
        let layer;

        // Presentation layer nodes
        if (line.includes('src/app/shell')) {
            layer = LAYERS.PRESENTATION;
        }
        // Infrastructure layer nodes
        else if (line.includes('src/app/lib/infrastructure')) {
            layer = LAYERS.INFRASTRUCTURE;
        }

        if (layer) {
            // Remove any existing color attributes
            line = line.replace(/\s+(fillcolor|color|penwidth)="[^"]*"/g, '');
            // Add layer-specific colors
            line = line.replace(/\[label=/g, `[fillcolor="${layer.fillcolor}" color="${layer.color}" penwidth=2 label=`);
        }
    }

    output += line + '\n';
});

rl.on('close', () => {
    process.stdout.write(output);
});
