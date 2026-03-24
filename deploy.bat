@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo   兔斯基的投资网站 - 一键部署脚本
echo ================================================
echo.

:: 检查是否安装了Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js
    echo.
    echo 请先安装 Node.js：
    echo 1. 访问 https://nodejs.org
    echo 2. 下载并安装 LTS 版本（18.x或更高）
    echo 3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [1/4] 检查环境...
node --version
npm --version
echo.

echo [2/4] 进入项目目录...
cd /d "%~dp0investment-website"
if %errorlevel% neq 0 (
    echo [错误] 找不到项目目录
    echo 请确保脚本放在正确位置
    pause
    exit /b 1
)

echo.
echo [3/4] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [4/4] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 构建失败
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ 构建成功！
echo ================================================
echo.
echo 接下来请手动完成以下步骤：
echo.
echo 1. 打开 https://github.com 创建账户
echo 2. 创建新仓库：investment-website
echo 3. 上传代码到仓库
echo 4. 打开 https://vercel.com 部署
echo.
echo 具体步骤请查看：SIMPLE_DEPLOY.md
echo.
pause
