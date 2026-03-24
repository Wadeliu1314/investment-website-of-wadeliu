#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 测试investment-website目录内部是否可写
project = r"C:\Users\User\.qclaw\workspace\investment-website"

test_path = os.path.join(project, "write_test.txt")
try:
    with open(test_path, 'w') as f:
        f.write("test")
    os.remove(test_path)
    print(f"investment-website目录可写!")
except Exception as e:
    print(f"investment-website目录不可写: {e}")

# 测试src子目录
src = os.path.join(project, "src")
test_path2 = os.path.join(src, "write_test.txt")
try:
    with open(test_path2, 'w') as f:
        f.write("test")
    os.remove(test_path2)
    print(f"src目录可写!")
except Exception as e:
    print(f"src目录不可写: {e}")

# 测试在investment-website内创建子目录
sub = os.path.join(project, "test_git_dir")
try:
    os.makedirs(sub, exist_ok=True)
    print(f"可以在investment-website内创建子目录!")
    os.rmdir(sub)
except Exception as e:
    print(f"不能在investment-website内创建子目录: {e}")
