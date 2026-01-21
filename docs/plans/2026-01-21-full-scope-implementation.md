# Full Scope Mock Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 补齐 README 1–5 业务功能，外围交互由后端 mock 提供，前端接入真实 API。

**Architecture:** 后端新增 mock provider 与接口，前端新增 API 调用与交互逻辑；保持 controller → service → acl → mapper 分层。

**Tech Stack:** Java 17, Spring Boot 3, MyBatis-Plus, React, Vite.

---

### Task 1: 后端 Mock 数据与主体接口

**Files:**
- Create: `backend/src/main/java/com/musegate/mock/MockDataProvider.java`
- Create: `backend/src/main/java/com/musegate/controller/SubjectController.java`
- Create: `backend/src/main/java/com/musegate/dto/SubjectVerifyRequest.java`
- Create: `backend/src/main/java/com/musegate/dto/SubjectVerifyResponse.java`

**Step 1: Write the failing test**

```java
// TODO: add minimal test later
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS/ignored for now (no new tests in this phase).

**Step 3: Write minimal implementation**

Create `MockDataProvider` with bank history / client subjects / verify response as static lists. Implement SubjectController:
- `GET /api/subjects/bank-history?query=`
- `GET /api/subjects/client`
- `POST /api/subjects/verify`

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/main/java/com/musegate/mock/MockDataProvider.java \
  backend/src/main/java/com/musegate/controller/SubjectController.java \
  backend/src/main/java/com/musegate/dto/SubjectVerifyRequest.java \
  backend/src/main/java/com/musegate/dto/SubjectVerifyResponse.java

git commit -m "feat: add subject mock apis"
```

---

### Task 2: 合同流转接口与提醒/对账 mock

**Files:**
- Modify: `backend/src/main/java/com/musegate/controller/ContractController.java`
- Modify: `backend/src/main/java/com/musegate/service/ConfirmService.java`
- Create: `backend/src/main/java/com/musegate/controller/ReminderController.java`
- Create: `backend/src/main/java/com/musegate/controller/ReconciliationController.java`
- Create: `backend/src/main/java/com/musegate/dto/ReminderDto.java`
- Create: `backend/src/main/java/com/musegate/dto/MismatchPaymentDto.java`

**Step 1: Write the failing test**

```java
// TODO: add minimal test later
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS/ignored.

**Step 3: Write minimal implementation**

- 添加 `POST /api/contracts/{id}/submit`，更新状态为 pending_approval。
- `ConfirmService` 将 status 更新为 approved。
- `ReminderController` 返回 mock 未匹配提醒列表。
- `ReconciliationController` 新增 `GET /api/reconciliation/mismatch` 返回金额不一致 mock 列表。

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/main/java/com/musegate/controller/ContractController.java \
  backend/src/main/java/com/musegate/service/ConfirmService.java \
  backend/src/main/java/com/musegate/controller/ReminderController.java \
  backend/src/main/java/com/musegate/controller/ReconciliationController.java \
  backend/src/main/java/com/musegate/dto/ReminderDto.java \
  backend/src/main/java/com/musegate/dto/MismatchPaymentDto.java

git commit -m "feat: add contract submit and mock reminders"
```

---

### Task 3: 前端 Sales 接入主体与匹配逻辑

**Files:**
- Modify: `web/components/Sales/SalesContractEntry.tsx`
- Create: `web/services/subjectApi.ts`
- Modify: `web/services/contractApi.ts`

**Step 1: Write the failing test**

```ts
// TODO: add minimal test later
```

**Step 2: Run test to verify it fails**

Run: `npm run build` (in `web/`)
Expected: PASS/ignored.

**Step 3: Write minimal implementation**

- 通过 `subjectApi` 拉银行/客户主体。
- 公对公时禁止自由输入，匹配不到给提示。
- 调用 `/api/subjects/verify` 完成 mock 校验并回填。
- 金额匹配规则：扫码锁定金额；银行多选匹配（前端实现多选）。
- 提交审核改为 `/api/contracts/{id}/submit`。

**Step 4: Run test to verify it passes**

Run: `npm run build` (in `web/`)
Expected: PASS.

**Step 5: Commit**

```bash
git add web/components/Sales/SalesContractEntry.tsx \
  web/services/subjectApi.ts \
  web/services/contractApi.ts

git commit -m "feat: wire sales subject and matching"
```

---

### Task 4: 前端提醒与对账 UI

**Files:**
- Modify: `web/App.tsx`
- Modify: `web/components/Finance/FinancePanel.tsx`
- Create: `web/services/reminderApi.ts`
- Modify: `web/services/paymentApi.ts`

**Step 1: Write the failing test**

```ts
// TODO: add minimal test later
```

**Step 2: Run test to verify it fails**

Run: `npm run build` (in `web/`)
Expected: PASS/ignored.

**Step 3: Write minimal implementation**

- App 提醒调用 `/api/reminders/unmatched`。
- Finance 增加“金额不一致”列表展示。

**Step 4: Run test to verify it passes**

Run: `npm run build` (in `web/`)
Expected: PASS.

**Step 5: Commit**

```bash
git add web/App.tsx \
  web/components/Finance/FinancePanel.tsx \
  web/services/reminderApi.ts \
  web/services/paymentApi.ts

git commit -m "feat: add reminders and mismatch list"
```
