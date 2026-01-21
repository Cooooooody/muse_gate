# 后端最小闭环设计

**目标**：实现最小可用后端闭环（合同录入、合同确认、付款匹配查询、财务录入转账、未匹配对账清单），基于 Spring Boot + MyBatis-Plus + Supabase JDBC。  
**范围**：本次不实现异常处理体系与测试策略细节，仅落地核心接口与基础分层骨架。

## 分层与职责
- `controller`：HTTP 接口层，做参数解析与基础校验。
- `service`：业务编排与规则落地。
- `acl`：防腐层，提供原子级数据库操作与事务边界。
- `mapper`：MyBatis-Plus CRUD 与必要 SQL，仅供 `acl` 调用。

## 核心接口（最小闭环）
- A. 合同录入：创建/选择主体，写入合同与付款关联。
- B. 合同确认：基于匹配付款写入 `muse_points_ledger` 并更新合同状态。
- C. 查询可匹配付款：按 subject/mg_account 查询 `bank_transfers`/`qr_payments`。
- D. 财务录入转账：写入 `bank_transfers`。
- E. 对账未匹配清单：查询未匹配到合同的转账/扫码记录。

## 数据流简述
1) 合同录入 → service 计算匹配规则 → acl 原子写入 `subjects`/`contracts`/`contract_payments`。  
2) 合同确认 → acl 读取已匹配付款 → 写入 `muse_points_ledger` → 更新 `contracts.status`。  
3) 付款匹配查询 → acl 合并查询转账/扫码记录。  
4) 财务录入 → acl 写 `bank_transfers`。  
5) 对账清单 → acl 查询未匹配付款列表。

## 实现约束
- 仅实现必要字段与流程，不引入额外扩展点。
- 事务边界全部位于 `acl`。
- Supabase 连接仅通过 JDBC（不走 REST）。
