/**
 * CatPaw IDE Command Adapter
 *
 * Formats commands for CatPaw IDE following its command format specification.
 */

import path from 'path';
import type { CommandContent, ToolCommandAdapter } from '../types.js';

/**
 * CatPaw IDE adapter for command generation.
 * File path: .catpaw/commands/<id>.md
 * Uses YAML frontmatter format similar to spec-kit for better IDE integration
 */
export const catpawAdapter: ToolCommandAdapter = {
  toolId: 'catpaw',

  getFilePath(commandId: string): string {
    return path.join('.catpaw', 'commands', `opsx:${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    return `---
description: ${content.description}
---

# ${content.name}

## 描述
${content.description}

## 用法
/opsx:${content.id}

## 示例
/opsx:${content.id} "示例参数"

${content.body}
`;
  },
};
