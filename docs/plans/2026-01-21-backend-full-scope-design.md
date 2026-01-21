# README 需求补齐设计（Mock 外围交互）

**目标**：补齐 README 1–5 功能，外围交互（支付、企查查校验）由后端 mock 提供；前端只走真实 API。

## 范围
- 主体录入逻辑补齐（银行历史主体、客户主体、企查查 mock 校验）。
- 金额匹配规则补齐（扫码锁定、银行多笔匹配）。
- 合同状态流转：draft → pending_approval → approved/executed（不做权限与审批记录）。
- 提醒机制：后端提供未匹配提醒与最近提醒记录（mock）。
- 对账异常：未匹配 / 金额不一致两类（mock）。

## 接口设计
- `GET /api/subjects/bank-history?query=`：公对公转账历史主体（mock）
- `GET /api/subjects/client`：客户主体列表（mock）
- `POST /api/subjects/verify`：企查查校验（mock 补全信息）
- `GET /api/payments/matches?mgAccount=`：可匹配付款（多笔支持）
- `POST /api/contracts`：合同录入（补齐匹配校验）
- `POST /api/contracts/{id}/submit`：提交审核（draft → pending_approval）
- `POST /api/contracts/{id}/confirm`：确认执行（approved/executed + 入账）
- `GET /api/reminders/unmatched`：提醒数据（mock）
- `GET /api/reconciliation/unmatched`：未匹配列表
- `GET /api/reconciliation/mismatch`：金额不一致列表（mock）

## 前端改造点
- Sales：主体选择/锁定、付款多选与金额锁定、提交审核。
- Finance：显示两类异常（未匹配/金额不一致）。
- App：提醒弹窗从后端取数据。

## Mock 方案
- 后端使用常量 mock 数据，便于替换真实数据源。
