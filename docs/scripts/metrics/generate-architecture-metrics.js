#!/usr/bin/env node

/* eslint-disable no-console */

const { execSync } = require('node:child_process');
const { readdirSync, readFileSync, statSync, writeFileSync } = require('node:fs');
const { extname, join, relative } = require('node:path');

const ROOT_DIR = process.cwd();
const SRC_DIR = join(ROOT_DIR, 'src');
const ARCH_DOC_PATH = join(ROOT_DIR, 'docs', 'ARCHITECTURE.md');

const isTestFile = (path) => path.includes('.spec.ts') || path.includes('testing/');
const isAngularSpecific = (path) =>
    path.includes('app/shell') ||
    path.includes('/presentation/') ||
    path.includes('app-providers/') ||
    path.includes('main.') ||
    path.includes('app.config.') ||
    path.includes('app.routes.') ||
    path.endsWith('server.ts'); // catch simple server.ts

const isFrameworkAgnostic = (path) => !isTestFile(path) && !isAngularSpecific(path);

const FILE_CATEGORIES = {
    tests: isTestFile,
    angularSpecific: isAngularSpecific,
    frameworkAgnostic: isFrameworkAgnostic
};

const getAllFiles = (dir, extensions = ['.ts'], exclude = []) => {
    const walk = (directory) => {
        const entries = readdirSync(directory);
        return entries.flatMap((entry) => {
            const fullPath = join(directory, entry);
            const stat = statSync(fullPath);
            if (stat.isDirectory()) {
                const relativePath = relative(SRC_DIR, fullPath);
                return exclude.some((pattern) => relativePath.includes(pattern)) ? [] : walk(fullPath);
            }
            return stat.isFile() && extensions.includes(extname(entry)) ? [fullPath] : [];
        });
    };
    return walk(dir);
};

const categorizeFiles = (files) =>
    files.reduce((categories, file) => {
        const relativePath = relative(SRC_DIR, file);
        const [category] = Object.entries(FILE_CATEGORIES).find(([, predicate]) => predicate(relativePath)) || [];
        if (category) {
            categories[category].push(file);
        }
        return categories;
    }, { frameworkAgnostic: [], angularSpecific: [], tests: [] });

const parseCircularDepsOutput = (output) => {
    const matches = output.match(/(\d+)\s+circular/i);
    return matches ? Number(matches[1]) : 'Error';
};

const checkCircularDependencies = () => {
    try {
        execSync('npm run analyze:deps --silent', { encoding: 'utf8', stdio: 'pipe' });
        return 0;
    } catch (error) {
        return parseCircularDepsOutput(error.stdout || error.stderr || '');
    }
};

const calculatePercentage = (part, total) => (
    total > 0 ? ((part / total) * 100).toFixed(0) : 0
);

const generateMetrics = () => {
    const allFiles = getAllFiles(SRC_DIR, ['.ts'], ['node_modules', 'dist']);
    const categories = categorizeFiles(allFiles);
    const totalProductionFiles = categories.frameworkAgnostic.length + categories.angularSpecific.length;
    return {
        totalFiles: allFiles.length,
        productionFiles: totalProductionFiles,
        testFiles: categories.tests.length,
        frameworkAgnostic: {
            count: categories.frameworkAgnostic.length,
            percentage: calculatePercentage(categories.frameworkAgnostic.length, totalProductionFiles)
        },
        angularSpecific: {
            count: categories.angularSpecific.length,
            percentage: calculatePercentage(categories.angularSpecific.length, totalProductionFiles)
        },
        circularDependencies: checkCircularDependencies(),
        lastGenerated: new Date().toISOString().split('T')[0]
    };
};

const getCircularDepsStatus = (count) => (count === 0 ? '✅' : '❌');

const parseExistingMetrics = (content) => {
    if (!content) {
        return null;
    }
    const extractIds = (regex) => (content.match(regex) || []).slice(1);
    const [totalFiles] = extractIds(/- \*\*Total TypeScript Files\*\*: (\d+)/);
    const [productionFiles] = extractIds(/- \*\*Production Files\*\*: (\d+)/);
    const [testFiles] = extractIds(/- \*\*Test Files\*\*: (\d+)/);
    const [fwCount, fwPercent] = extractIds(/- \*\*Framework-Agnostic Files\*\*: (\d+) \((\d+)%\)/);
    const [ngCount, ngPercent] = extractIds(/- \*\*Angular-Specific Files\*\*: (\d+) \((\d+)%\)/);
    const [circularDeps] = extractIds(/- \*\*Circular Dependencies\*\*: (\d+)/);
    if (!totalFiles || !productionFiles || !testFiles || !fwCount || !ngCount || !circularDeps) {
        return null;
    }
    return {
        totalFiles: Number(totalFiles),
        productionFiles: Number(productionFiles),
        testFiles: Number(testFiles),
        frameworkAgnostic: { count: Number(fwCount), percentage: fwPercent },
        angularSpecific: { count: Number(ngCount), percentage: ngPercent },
        circularDependencies: Number(circularDeps)
    };
};

const areMetricsIdentical = (newMetrics, existingMetrics) => {
    if (!existingMetrics) {
        return false;
    }
    return newMetrics.totalFiles === existingMetrics.totalFiles &&
        newMetrics.productionFiles === existingMetrics.productionFiles &&
        newMetrics.testFiles === existingMetrics.testFiles &&
        newMetrics.frameworkAgnostic.count === existingMetrics.frameworkAgnostic.count &&
        newMetrics.frameworkAgnostic.percentage === existingMetrics.frameworkAgnostic.percentage &&
        newMetrics.angularSpecific.count === existingMetrics.angularSpecific.count &&
        newMetrics.angularSpecific.percentage === existingMetrics.angularSpecific.percentage &&
        newMetrics.circularDependencies === existingMetrics.circularDependencies;
};

const formatMetricsMarkdown = (metrics) => `## Project Statistics

- **Total TypeScript Files**: ${metrics.totalFiles}
- **Production Files**: ${metrics.productionFiles}
- **Test Files**: ${metrics.testFiles}
- **Framework-Agnostic Files**: ${metrics.frameworkAgnostic.count} (${metrics.frameworkAgnostic.percentage}%)
- **Angular-Specific Files**: ${metrics.angularSpecific.count} (${metrics.angularSpecific.percentage}%)
- **Circular Dependencies**: ${metrics.circularDependencies} ${getCircularDepsStatus(metrics.circularDependencies)}

*Last generated: ${metrics.lastGenerated}*`;

const replaceMetricsSection = (content, metricsMarkdown, startIndex) => {
    const nextSectionMarker = '\n## ';
    const afterStart = content.indexOf(nextSectionMarker, startIndex + 1);
    const hasNextSection = afterStart >= 0;
    return hasNextSection
        ? content.substring(0, startIndex) + metricsMarkdown + '\n\n---\n' + content.substring(afterStart)
        : content.substring(0, startIndex) + metricsMarkdown + '\n\n---\n';
};

const insertMetricsSection = (content, metricsMarkdown) => {
    const projectStructureMarker = '---\n\n## Project Structure';
    const overviewEnd = content.indexOf(projectStructureMarker);
    const hasProjectStructure = overviewEnd >= 0;
    if (!hasProjectStructure) {
        return content;
    }
    const before = content.substring(0, overviewEnd);
    const after = content.substring(overviewEnd + projectStructureMarker.length);
    return `${before}---\n\n${metricsMarkdown}\n\n---\n\n## Project Structure${after}`;
};

const buildUpdatedContent = (content, metricsMarkdown) => {
    const metricsStartMarker = '## Project Statistics';
    const startIndex = content.indexOf(metricsStartMarker);
    const hasMetricsSection = startIndex >= 0;
    return hasMetricsSection
        ? replaceMetricsSection(content, metricsMarkdown, startIndex)
        : insertMetricsSection(content, metricsMarkdown);
};

const updateBadges = (content, metrics) => {
    const frameworkAgnosticBadge = `![Framework Agnostic](https://img.shields.io/badge/framework%20agnostic-${metrics.frameworkAgnostic.percentage}%25-purple)`;
    const angularSpecificBadge = `![Angular Specific](https://img.shields.io/badge/angular%20specific-${metrics.angularSpecific.percentage}%25-blue)`;
    return content
        .replace(
            /!\[Framework Agnostic\]\(https:\/\/img\.shields\.io\/badge\/framework%20agnostic-\d+%25-purple\)/,
            frameworkAgnosticBadge
        )
        .replace(
            /!\[Angular Specific\]\(https:\/\/img\.shields\.io\/badge\/angular%20specific-\d+%25-blue\)/,
            angularSpecificBadge
        );
};

const updateArchitectureDoc = (metrics) => {
    const content = readFileSync(ARCH_DOC_PATH, 'utf8');
    const existingMetrics = parseExistingMetrics(content);
    if (areMetricsIdentical(metrics, existingMetrics)) {
        console.log('✅ Metrics verify: No changes in statistics detected. Skipping update.');
        return;
    }
    const metricsMarkdown = formatMetricsMarkdown(metrics);
    let updatedContent = buildUpdatedContent(content, metricsMarkdown);
    updatedContent = updateBadges(updatedContent, metrics);
    writeFileSync(ARCH_DOC_PATH, updatedContent, 'utf8');
    console.log('✅ Metrics updated in ARCHITECTURE.md');
};

const logMetrics = (metricsMarkdown) => {
    console.log('\nMetrics:');
    console.log(metricsMarkdown);
    console.log('\n');
};

const outputJson = (metrics) => {
    console.log(JSON.stringify(metrics, null, 2));
};

const main = () => {
    try {
        console.log('📊 Generating architecture metrics...');
        const metrics = generateMetrics();
        const metricsMarkdown = formatMetricsMarkdown(metrics);
        logMetrics(metricsMarkdown);
        updateArchitectureDoc(metrics);
        if (process.argv.includes('--json')) {
            outputJson(metrics);
        }
    } catch (error) {
        console.error('❌ Error generating metrics:', error.message);
        process.exit(1);
    }
};

main();
