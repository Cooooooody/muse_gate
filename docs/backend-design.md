# 后端设计（Spring Boot + MyBatis-Plus + Supabase JDBC）

## 目标与范围
- 新增 `backend/` Maven 项目，前端移动到 `web/`（不在本设计内执行迁移）。
- 后端分层：`controller` → `service` → `acl`（anti‑corruption layer）→ `mapper`。
- 数据库：Supabase Postgres，通过 JDBC 直连；后端只通过 `acl` 访问数据。
- 配置统一走 `.env`（运行时注入为环境变量）。

## 分层职责
- `controller`: HTTP 协议层，参数校验、鉴权（如 JWT）与响应封装，不写业务规则。
- `service`: 业务编排与规则，调用 `acl` 实现“合同录入、付款匹配、主体校验、财务对账”。
- `acl`: 防腐层，屏蔽数据库/供应商细节，封装事务边界，输出领域对象。
- `mapper`: MyBatis‑Plus CRUD + 必要 SQL；只被 `acl` 访问。
- `domain`: 核心实体与领域枚举。
- `dto`: API 输入/输出模型。

## 模块与包结构建议
```
backend/
  src/main/java/com/musegate/
    controller/
    service/
    acl/
    mapper/
    domain/
    dto/
    config/
    common/
  src/main/resources/
    application.yml
```

## 关键业务数据流
1) 销售录合同
- controller 接收录入请求，校验基础字段。
- service 执行规则：付款匹配、主体选取优先级、金额不可编辑等。
- acl 组合查询（转账/扫码/主体）并封装为领域对象。
- mapper 仅负责数据读取与写入。

2) 财务录入与对账
- 财务录入公对公转账 → service 落库到 `bank_transfers`。
- 对账：service 查询未匹配合同的款项，输出异常清单。

3) muse 点自动充值
- service 在合同确认时触发：若匹配到转账/扫码付款，向 `muse_points_ledger` 写入。

## 事务与一致性
- 事务边界在 `acl`，保证多表操作的原子性（如合同 + 支付关联 + 账本）。
- 业务层只感知“成功/失败/业务错误”。

## 错误处理与返回规范
- 统一异常：参数错误、业务冲突、外部依赖异常、系统异常。
- controller 统一包装响应（code/message/data）。

## 配置与环境变量
- `.env` 例：
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/postgres`
  - `SPRING_DATASOURCE_USERNAME=...`
  - `SPRING_DATASOURCE_PASSWORD=...`
- `application.yml` 仅引用环境变量，不写死密钥。

## 安全与权限
- Supabase RLS 由数据库侧配置（后端仅使用服务角色密钥访问）。
- 业务权限在 service 层校验（如角色、所属销售、主管可见性）。

## 测试策略
- service 层单测：规则逻辑与边界条件（金额匹配、主体优先级）。
- acl 层集成测试：与测试库交互，验证 SQL 与事务。
- controller 层接口测试：参数校验与错误码。

## 里程碑
1. 生成 `backend/` Maven 骨架与基础依赖（Spring Boot + MyBatis‑Plus）。
2. 接入 Supabase JDBC 与 .env 配置加载。
3. 建立基础实体、mapper、acl、service、controller 骨架。
4. 逐步实现核心业务流（合同、付款、财务对账）。
