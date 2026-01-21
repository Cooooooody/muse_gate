# 登录与鉴权设计（Supabase Auth）

**目标**：使用 Supabase Auth（email/password）接入登录页与角色鉴权，支持 admin/sales/finance/client 四类账号。

## 方案概述
- 前端新增登录页，未登录时仅显示登录。
- 登录成功后读取 `profiles` 表获取角色。
- 若 `profiles` 不存在，按邮箱映射自动创建（首次登录自动补资料）。
- 前端仅访问 `profiles` 表（RLS 已开启、仅允许本人读写）。

## 账号规则
- admin@musegate.local / admin
- sales@musegate.local / sales
- finance@musegate.local / finance
- client@musegate.local / client

## 页面行为
- 登录页包含邮箱、密码、登录按钮与错误提示。
- 登录成功进入主布局，菜单按角色展示。
- 页面内显示“测试账号列表”。

## 依赖
- 前端使用 `@supabase/supabase-js`。
- 环境变量：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`。
