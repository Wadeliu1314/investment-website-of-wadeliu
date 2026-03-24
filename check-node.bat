@echo off
echo 检查Node.js安装状态...

where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js 已安装
    node --version
) else (
    echo ❌ Node.js 未安装
    echo.
    echo 请先安装 Node.js:
    echo 1. 访问 https://nodejs.org
    echo 2. 下载 LTS 版本（18.x或更高）
    echo 3. 运行安装程序
    echo 4. 重启命令行
    echo.
    pause
)
