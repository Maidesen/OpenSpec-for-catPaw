#!/usr/bin/env node

/**
 * Postinstall script for auto-installing shell completions and global link
 *
 * This script runs automatically after npm install and:
 * 1. Auto-links the package globally (when installed via -g)
 * 2. Installs shell completions unless:
 *    - CI=true environment variable is set
 *    - OPENSPEC_NO_COMPLETIONS=1 environment variable is set
 *    - dist/ directory doesn't exist (dev setup scenario)
 *
 * The script never fails npm install - all errors are caught and handled gracefully.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Check if running with -g (global install)
 */
function isGlobalInstall() {
  // When installed with -g, npm sets PREFIX environment variable
  // and the package path is inside node_modules of the global npm directory
  const npmPrefix = process.env.npm_config_prefix || process.env.PREFIX;
  const packagePath = path.dirname(__dirname);
  
  if (npmPrefix && packagePath.includes(npmPrefix)) {
    return true;
  }
  
  // Alternative check: if npm_config_global is set
  return process.env.npm_config_global === 'true';
}

/**
 * Auto-link package globally
 */
function autoLink() {
  try {
    if (!isGlobalInstall()) {
      return { success: false, reason: 'Not a global install' };
    }

    // npm link should run in the package directory
    // When postinstall runs, we don't need to specify cwd
    execSync('npm link', { stdio: 'pipe' });
    return { success: true };
  } catch (error) {
    // Fail gracefully
    return { success: false, error: error.message };
  }
}

/**
 * Check if we should skip completion installation
 */
function shouldSkipCompletion() {
  // Skip in CI environments
  if (process.env.CI === 'true' || process.env.CI === '1') {
    return { skip: true, reason: 'CI environment detected' };
  }

  // Skip if user opted out
  if (process.env.OPENSPEC_NO_COMPLETIONS === '1') {
    return { skip: true, reason: 'OPENSPEC_NO_COMPLETIONS=1 set' };
  }

  return { skip: false };
}

/**
 * Check if dist/ directory exists
 */
async function distExists() {
  const distPath = path.join(__dirname, '..', 'dist');
  try {
    const stat = await fs.stat(distPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Detect the user's shell
 */
async function detectShell() {
  try {
    const { detectShell } = await import('../dist/utils/shell-detection.js');
    const result = detectShell();
    return result.shell;
  } catch (error) {
    // Fail silently if detection module doesn't exist
    return undefined;
  }
}

/**
 * Install completions for the detected shell
 */
async function installCompletions(shell) {
  try {
    const { CompletionFactory } = await import('../dist/core/completions/factory.js');
    const { COMMAND_REGISTRY } = await import('../dist/core/completions/command-registry.js');

    // Check if shell is supported
    if (!CompletionFactory.isSupported(shell)) {
      console.log(`\nTip: Run 'openspec completion install' for shell completions`);
      return;
    }

    // Generate completion script
    const generator = CompletionFactory.createGenerator(shell);
    const script = generator.generate(COMMAND_REGISTRY);

    // Install completion script
    const installer = CompletionFactory.createInstaller(shell);
    const result = await installer.install(script);

    if (result.success) {
      // Show success message based on installation type
      if (result.isOhMyZsh) {
        console.log(`✓ Shell completions installed`);
        console.log(`  Restart shell: exec zsh`);
      } else if (result.zshrcConfigured) {
        console.log(`✓ Shell completions installed and configured`);
        console.log(`  Restart shell: exec zsh`);
      } else {
        console.log(`✓ Shell completions installed to ~/.zsh/completions/`);
        console.log(`  Add to ~/.zshrc: fpath=(~/.zsh/completions $fpath)`);
        console.log(`  Then: exec zsh`);
      }
    } else {
      // Installation failed, show tip for manual install
      console.log(`\nTip: Run 'openspec completion install' for shell completions`);
    }
  } catch (error) {
    // Fail gracefully - show tip for manual install
    console.log(`\nTip: Run 'openspec completion install' for shell completions`);
  }
}

/**
 * Build the project (TypeScript compilation)
 */
function buildProject() {
  try {
    const packageRoot = path.join(__dirname, '..');
    // Check if dist already exists (skip build if it does)
    const distPath = path.join(packageRoot, 'dist');
    try {
      const stat = require('fs').statSync(distPath);
      if (stat.isDirectory()) {
        // dist already exists, skip build
        return { success: true, skipped: true };
      }
    } catch (e) {
      // dist doesn't exist, proceed with build
    }
    
    // Don't specify cwd - use current directory (package root when postinstall runs)
    execSync('npm run build', { stdio: 'pipe' });
    return { success: true };
  } catch (error) {
    // Fail gracefully but let npm install continue
    console.warn(`⚠️  Build warning: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // 0. Build project first (compile TypeScript)
    buildProject();

    // 1. Auto-link if global install
    const linkResult = autoLink();
    if (linkResult.success) {
      // Silent success - npm link is transparent
    }

    // 2. Install completions
    const skipCheck = shouldSkipCompletion();
    if (skipCheck.skip) {
      // Silent skip - no output
      return;
    }

    // Check if dist/ exists (skip silently if not - expected during dev setup)
    if (!(await distExists())) {
      return;
    }

    // Detect shell
    const shell = await detectShell();
    if (!shell) {
      console.log(`\nTip: Run 'openspec completion install' for shell completions`);
      return;
    }

    // Install completions
    await installCompletions(shell);
  } catch (error) {
    // Fail gracefully - never break npm install
    // Show tip for manual install
    console.log(`\nTip: Run 'openspec completion install' for shell completions`);
  }
}

// Run main and handle any unhandled errors
main().catch(() => {
  // Silent failure - never break npm install
  process.exit(0);
});
