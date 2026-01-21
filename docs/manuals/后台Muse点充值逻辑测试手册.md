# 后台Muse点充值逻辑测试手册

## 前置
- 启动后端：
  ```bash
  ~/dev/apache-maven-3.9.12/bin/mvn -f backend/pom.xml spring-boot:run
  ```
- 启动前端：
  ```bash
  cd web
  npm run dev -- --host
  ```
- 确认根目录 `.env` 包含：
  - `VITE_API_BASE_URL=http://localhost:8080`
- 确保存在可匹配付款记录（银行转账或扫码付款）。

## 用例 A：扫码支付确认后自动入账
1. 使用 `sales@test.com / 123456` 登录。
2. 进入“合同录入”，填写主体与主账号信息。
3. 选择一条扫码付款记录（paymentType=qr）。
4. 生成预览并提交审核。
5. 使用 `admin@test.com / 123456` 登录，进入“合同审核”。
6. 点击“确认”完成审核。
7. 左侧进入“入账记录”，确认新增记录。

预期结果：
- 合同状态更新为 `approved`。
- `muse_points_ledger` 新增一条入账记录（source_type=qr）。
- 入账记录页面显示对应入账数据。

## 用例 B：公对公匹配确认后入账
1. 使用 `sales@test.com / 123456` 登录。
2. 进入“合同录入”，勾选“是否公对公转账”。
3. 输入主账号 `MG-9527`，选择银行主体并完成企查查校验。
4. 选择一条或多条公对公付款记录。
5. 生成预览并提交审核。
6. 使用 `admin@test.com / 123456` 登录，进入“合同审核”，点击“确认”。
7. 左侧进入“入账记录”，确认新增记录。

预期结果：
- 合同状态更新为 `approved`。
- `muse_points_ledger` 新增入账记录（source_type=bank_transfer），金额与匹配付款一致。
- 入账记录页面显示对应入账数据。

## 用例 C：未匹配付款禁止完成合同
1. 进入“合同录入”。
2. 不选择任何匹配付款记录。
3. 尝试提交审核。

预期结果：
- 系统提示需匹配付款记录（公对公场景）。
- 合同不会进入 `pending_approval`。

## 常见问题排查
- 未生成入账记录：检查 `/api/contracts/{id}/confirm` 是否成功调用。
- 列表无待审核合同：检查 `/api/contracts/pending` 是否有数据。
- 入账金额异常：确认付款记录与匹配金额一致。
