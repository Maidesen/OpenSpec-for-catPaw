#!/bin/bash

# OpenSpec 美团定制版 - 一键安装脚本
# 使用方式：curl -fsSL https://git.sankuai.com/~wangxinchun05/openspec-for-catpaw/raw/master/install.sh | bash

set -e

echo "🚀 开始安装 OpenSpec 美团定制版..."
echo ""

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo "请先安装 Node.js (>= 20.19.0)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ 错误：Node.js 版本过低 (需要 >= 20.19.0，当前: $(node -v))"
    exit 1
fi

# 创建临时目录
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "📦 正在克隆仓库..."
git clone ssh://git@git.sankuai.com/~wangxinchun05/openspec-for-catpaw.git "$TEMP_DIR/openspec-for-catpaw" 2>/dev/null || {
    echo "❌ 克隆失败，尝试使用 HTTPS..."
    git clone https://github.com/Maidesen/OpenSpec-for-catPaw.git "$TEMP_DIR/openspec-for-catpaw"
}

cd "$TEMP_DIR/openspec-for-catpaw"

echo "📥 安装依赖..."
npm install --silent

echo "🔗 全局链接..."
npm link --silent

echo ""
echo "✅ 安装完成！"
echo ""
echo "使用方式："
echo "  openspec init              初始化项目"
echo "  /opsx:propose \"功能\"      创建提案"
echo "  /opsx:apply               实施任务"
echo "  /opsx:archive             归档变更"
echo ""
echo "🎉 现在可以在 CatPaw 中使用所有 11 个命令了！"
