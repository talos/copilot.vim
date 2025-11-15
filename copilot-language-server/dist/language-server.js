#!/usr/bin/env node

const minNodeVersion = 22;

function nodeVersionError() {
    const version = process.versions.node;
    const [major] = version.split('.').map(v => parseInt(v, 10));
    if (major < minNodeVersion) {
        return `Node.js ${minNodeVersion}.x is required to run GitHub Copilot but found ${version}`;
    }
}

const err = nodeVersionError();
if (err !== undefined) {
    console.error(err);
    // An exit code of X indicates a recommended minimum Node.js version of X.0.
    // Providing a recommended major version via exit code is an affordance for
    // implementations like Copilot.vim, where Neovim buries stderr in a log
    // file the user is unlikely to see.
    process.exit(minNodeVersion);
}

// Check for required environment variables
function checkRequiredEnvVars() {
    const missing = [];

    if (!process.env.OPENROUTER_API_KEY) {
        missing.push('OPENROUTER_API_KEY');
    }
    if (!process.env.COPILOT_BASE_URL) {
        missing.push('COPILOT_BASE_URL');
    }

    if (missing.length > 0) {
        console.error(`ERROR: Missing required environment variable(s): ${missing.join(', ')}`);
        console.error('');
        console.error('Please set the following in your shell:');
        if (missing.includes('OPENROUTER_API_KEY')) {
            console.error('  export OPENROUTER_API_KEY="your-openrouter-api-key"');
        }
        if (missing.includes('COPILOT_BASE_URL')) {
            console.error('  export COPILOT_BASE_URL="https://openrouter.ai/api/v1/chat/completions"');
        }
        console.error('');
        console.error('Then restart nvim.');
        process.exit(1);
    }
}

checkRequiredEnvVars();

require('./main.prettier').main();
