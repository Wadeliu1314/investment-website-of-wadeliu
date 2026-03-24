#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
直接用GitHub API上传文件，无需本地git仓库
"""
import os
import sys
import io
import json
import base64
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SOURCE = r"C:\Users\User\.qclaw\workspace\investment-website"
OWNER = "wadeliu1314"
REPO = "investment-website-of-wadeliu"

# 需要GitHub Personal Access Token
# 请在 https://github.com/settings/tokens 创建一个token
# 权限需要: repo (Full control of private repositories)
TOKEN = os.environ.get("GITHUB_TOKEN", "")

if not TOKEN:
    print("需要GitHub Personal Access Token!")
    print("请按以下步骤获取:")
    print("1. 打开 https://github.com/settings/tokens")
    print("2. 点击 'Generate new token (classic)'")
    print("3. 勾选 'repo' 权限")
    print("4. 生成并复制token")
    print("5. 设置环境变量: GITHUB_TOKEN=你的token")
    print("   或直接修改此脚本第17行的TOKEN变量")
    sys.exit(1)

def upload_file(file_path, repo_path, token):
    """上传单个文件到GitHub"""
    with open(file_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode('utf-8')
    
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{repo_path}"
    data = json.dumps({
        "message": f"add {repo_path}",
        "content": content
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, method='PUT')
    req.add_header('Authorization', f'token {token}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return True, resp.status
    except urllib.error.HTTPError as e:
        return False, e.read().decode('utf-8')

# 收集所有文件
files_to_upload = []
for root, dirs, files in os.walk(SOURCE):
    # 跳过不需要的目录
    dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.next']]
    for file in files:
        if file.endswith(('.py', '.bat', '.pyc')):
            continue
        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, SOURCE).replace('\\', '/')
        files_to_upload.append((full_path, rel_path))

print(f"共 {len(files_to_upload)} 个文件需要上传")
print("开始上传...")

success = 0
failed = 0
for full_path, rel_path in files_to_upload:
    ok, result = upload_file(full_path, rel_path, TOKEN)
    if ok:
        print(f"  ✓ {rel_path}")
        success += 1
    else:
        print(f"  ✗ {rel_path}: {str(result)[:100]}")
        failed += 1

print(f"\n完成! 成功: {success}, 失败: {failed}")
