# OpenSpec 美团 CatPaw 定制版

**🌟 OpenSpec 在美团 CatPaw IDE 中的定制版本**

支持 11 个完整工作流命令（`/opsx:*` 格式）直接在 CatPaw 中使用。

---

## 快速开始

### 安装

```bash
npm install -g ssh://git@git.sankuai.com/~wangxinchun05/openspec-for-catpaw.git
```

### 初始化项目

```bash
cd 你的项目
openspec init
```

### 使用命令

```bash
# 快速提案
/opsx:propose "你的功能名"

# 实施任务
/opsx:apply

# 归档变更
/opsx:archive
```

---

## 核心功能

### 11 个工作流命令

| 命令 | 说明 |
|------|------|
| `/opsx:propose` | 快速提案，一步生成所有规范 |
| `/opsx:explore` | 思考讨论，不生成文件 |
| `/opsx:new` | 创建变更 scaffold |
| `/opsx:continue` | 逐步创建下一个 artifact |
| `/opsx:apply` | 实施变更中的任务 |
| `/opsx:ff` | 快速生成所有规范 |
| `/opsx:sync` | 同步规范（不归档） |
| `/opsx:archive` | 归档变更，合并规范 |
| `/opsx:bulk-archive` | 批量归档 |
| `/opsx:verify` | 验证实现 |
| `/opsx:onboard` | 交互式教程 |

### 主要特性

- ✅ **11 个完整工作流命令**：支持从提案到归档的完整工作流
- ✅ **CatPaw IDE 集成**：命令自动生成为 `.catpaw/commands/` 和 `.catpaw/skills/`
- ✅ **命令前缀统一**：所有命令使用 `/opsx:` 前缀格式
- ✅ **多语言支持**：移除硬编码中文，支持多语言适配

---

## 工作流示例

### 快速路径（30 分钟）

```
/opsx:propose "add-dark-mode"  →  /opsx:apply  →  /opsx:archive
```

### 详细路径（2 小时）

```
/opsx:new  →  /opsx:continue (多次)  →  /opsx:apply  →  /opsx:verify  →  /opsx:archive
```

### 混合路径（1 小时）

```
/opsx:new  →  /opsx:ff  →  /opsx:apply  →  /opsx:archive
```

---

## 文档

- 完整指南：本地文档或项目 `docs/` 目录
- 官方项目：https://github.com/Fission-AI/OpenSpec

---

## 更新

升级：

```bash
npm install -g ssh://git@git.sankuai.com/~wangxinchun05/openspec-for-catpaw.git
```

更新命令：

```bash
openspec update
```

---

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm run build

# 测试
pnpm test

# 本地开发
pnpm run dev
```

---

## 许可证

MIT - 继承自官方 OpenSpec 项目

详见 [LICENSE](LICENSE) 文件
