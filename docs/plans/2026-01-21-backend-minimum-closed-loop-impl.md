# Backend Minimum Closed Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 `backend/` 实现最小闭环后端接口（合同录入/确认、付款匹配查询、财务录入转账、未匹配对账）。

**Architecture:** 按 `controller → service → acl → mapper` 分层，ACL 负责事务边界与数据库交互，MyBatis-Plus 做 CRUD 与少量自定义 SQL。

**Tech Stack:** Java 17, Spring Boot 3, MyBatis-Plus, PostgreSQL JDBC (Supabase)

---

### Task 1: 初始化后端 Maven 工程与基础配置

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/musegate/BackendApplication.java`
- Create: `backend/src/main/java/com/musegate/config/MybatisPlusConfig.java`
- Create: `backend/src/main/resources/application.yml`
- Create: `backend/src/test/java/com/musegate/BackendApplicationTests.java`

**Step 1: Write the failing test**

```java
package com.musegate;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
class BackendApplicationTests {
  @Test
  void contextLoads() {
  }
}
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: FAIL because `backend/pom.xml` and application class do not exist yet.

**Step 3: Write minimal implementation**

Create `backend/pom.xml`:

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.musegate</groupId>
  <artifactId>backend</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <properties>
    <java.version>17</java.version>
    <spring-boot.version>3.3.1</spring-boot.version>
    <mybatis-plus.version>3.5.7</mybatis-plus.version>
  </properties>
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>${spring-boot.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <repositories>
    <repository>
      <id>aliyun-central</id>
      <name>Aliyun Maven Central</name>
      <url>https://maven.aliyun.com/repository/central</url>
      <releases><enabled>true</enabled></releases>
      <snapshots><enabled>false</enabled></snapshots>
    </repository>
    <repository>
      <id>aliyun-public</id>
      <name>Aliyun Maven Public</name>
      <url>https://maven.aliyun.com/repository/public</url>
      <releases><enabled>true</enabled></releases>
      <snapshots><enabled>true</enabled></snapshots>
    </repository>
  </repositories>
  <pluginRepositories>
    <pluginRepository>
      <id>aliyun-plugins</id>
      <name>Aliyun Maven Plugins</name>
      <url>https://maven.aliyun.com/repository/public</url>
      <releases><enabled>true</enabled></releases>
      <snapshots><enabled>true</enabled></snapshots>
    </pluginRepository>
  </pluginRepositories>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-boot-starter</artifactId>
      <version>${mybatis-plus.version}</version>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
      <groupId>me.paulschwarz</groupId>
      <artifactId>spring-dotenv</artifactId>
      <version>4.0.0</version>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.32</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

Create `backend/src/main/java/com/musegate/BackendApplication.java`:

```java
package com.musegate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }
}
```

Create `backend/src/main/java/com/musegate/config/MybatisPlusConfig.java`:

```java
package com.musegate.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.musegate.mapper")
public class MybatisPlusConfig {
}
```

Create `backend/src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: muse-gate-backend
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
```

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/pom.xml \
  backend/src/main/java/com/musegate/BackendApplication.java \
  backend/src/main/java/com/musegate/config/MybatisPlusConfig.java \
  backend/src/main/resources/application.yml \
  backend/src/test/java/com/musegate/BackendApplicationTests.java

git commit -m "feat: add backend skeleton"
```

---

### Task 2: 定义领域实体与 Mapper

**Files:**
- Create: `backend/src/main/java/com/musegate/domain/*.java`
- Create: `backend/src/main/java/com/musegate/mapper/*.java`
- Test: `backend/src/test/java/com/musegate/MapperWiringTests.java`

**Step 1: Write the failing test**

```java
package com.musegate;

import com.musegate.mapper.SubjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
class MapperWiringTests {
  @Autowired(required = false)
  private SubjectMapper subjectMapper;

  @Test
  void mapperIsWired() {
    assertThat(subjectMapper).isNotNull();
  }
}
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: FAIL because `SubjectMapper` does not exist.

**Step 3: Write minimal implementation**

Create entities under `backend/src/main/java/com/musegate/domain/`:

`Profile.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@TableName("profiles")
public class Profile {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String role;
  private String displayName;
  private String phone;
  private OffsetDateTime createdAt;
}
```

`Subject.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@TableName("subjects")
public class Subject {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String name;
  private String taxId;
  private String address;
  private String source;
  private String createdBy;
  private OffsetDateTime createdAt;
}
```

`Contract.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("contracts")
public class Contract {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String subjectId;
  private BigDecimal amount;
  private String address;
  private String mainAccountName;
  private String mainAccountPhone;
  private String items;
  private String bonusItems;
  private String status;
  private String createdBy;
  private String approvedBy;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
```

`BankTransfer.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@TableName("bank_transfers")
public class BankTransfer {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String senderName;
  private String senderAccount;
  private BigDecimal amount;
  private LocalDate receivedAt;
  private String mgAccount;
  private String createdBy;
  private OffsetDateTime createdAt;
}
```

`QrPayment.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("qr_payments")
public class QrPayment {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String provider;
  private String externalId;
  private BigDecimal amount;
  private OffsetDateTime paidAt;
  private String mgAccount;
  private OffsetDateTime createdAt;
}
```

`ContractPayment.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("contract_payments")
public class ContractPayment {
  @TableId
  private String contractId;
  private String paymentId;
  private String paymentType;
  private BigDecimal amount;
  private OffsetDateTime createdAt;
}
```

`MusePointsLedger.java`
```java
package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("muse_points_ledger")
public class MusePointsLedger {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String mgAccount;
  private BigDecimal amount;
  private String sourceType;
  private String sourceId;
  private OffsetDateTime createdAt;
}
```

Create mappers under `backend/src/main/java/com/musegate/mapper/`:

`SubjectMapper.java`
```java
package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.Subject;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SubjectMapper extends BaseMapper<Subject> {
}
```

`ContractMapper.java`
```java
package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.Contract;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ContractMapper extends BaseMapper<Contract> {
}
```

`BankTransferMapper.java`
```java
package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.BankTransfer;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BankTransferMapper extends BaseMapper<BankTransfer> {
}
```

`QrPaymentMapper.java`
```java
package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.QrPayment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QrPaymentMapper extends BaseMapper<QrPayment> {
}
```

`ContractPaymentMapper.java`
```java
package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.ContractPayment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ContractPaymentMapper extends BaseMapper<ContractPayment> {
}
```

`MusePointsLedgerMapper.java`
```java
package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.MusePointsLedger;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MusePointsLedgerMapper extends BaseMapper<MusePointsLedger> {
}
```

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/main/java/com/musegate/domain \
  backend/src/main/java/com/musegate/mapper \
  backend/src/test/java/com/musegate/MapperWiringTests.java

git commit -m "feat: add domain entities and mappers"
```

---

### Task 3: DTO 与 ACL（数据库原子操作）

**Files:**
- Create: `backend/src/main/java/com/musegate/dto/*.java`
- Create: `backend/src/main/java/com/musegate/acl/*.java`
- Test: `backend/src/test/java/com/musegate/AclWiringTests.java`

**Step 1: Write the failing test**

```java
package com.musegate;

import com.musegate.acl.ContractAcl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
class AclWiringTests {
  @Autowired(required = false)
  private ContractAcl contractAcl;

  @Test
  void aclIsWired() {
    assertThat(contractAcl).isNotNull();
  }
}
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: FAIL because `ContractAcl` does not exist.

**Step 3: Write minimal implementation**

DTOs (`backend/src/main/java/com/musegate/dto/`):

`CreateContractRequest.java`
```java
package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateContractRequest {
  private String subjectId;
  private SubjectInput subject;
  private BigDecimal amount;
  private String address;
  private String mainAccountName;
  private String mainAccountPhone;
  private String items;
  private String bonusItems;
  private String createdBy;
  private List<PaymentMatchInput> payments;
}
```

`SubjectInput.java`
```java
package com.musegate.dto;

import lombok.Data;

@Data
public class SubjectInput {
  private String name;
  private String taxId;
  private String address;
  private String source;
  private String createdBy;
}
```

`PaymentMatchInput.java`
```java
package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentMatchInput {
  private String paymentId;
  private String paymentType;
  private BigDecimal amount;
}
```

`ContractResponse.java`
```java
package com.musegate.dto;

import lombok.Data;

@Data
public class ContractResponse {
  private String contractId;
  private String subjectId;
  private String status;
}
```

`PaymentMatchDto.java`
```java
package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentMatchDto {
  private String paymentId;
  private String paymentType;
  private BigDecimal amount;
  private String mgAccount;
  private String occurredAt;
}
```

`ConfirmContractResponse.java`
```java
package com.musegate.dto;

import lombok.Data;

@Data
public class ConfirmContractResponse {
  private String contractId;
  private String status;
}
```

`CreateBankTransferRequest.java`
```java
package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBankTransferRequest {
  private String senderName;
  private String senderAccount;
  private BigDecimal amount;
  private String receivedAt;
  private String mgAccount;
  private String createdBy;
}
```

`UnmatchedPaymentDto.java`
```java
package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UnmatchedPaymentDto {
  private String paymentId;
  private String paymentType;
  private BigDecimal amount;
  private String mgAccount;
  private String occurredAt;
}
```

ACL (`backend/src/main/java/com/musegate/acl/`):

`ContractAcl.java`
```java
package com.musegate.acl;

import com.musegate.domain.Contract;
import com.musegate.domain.ContractPayment;
import com.musegate.domain.MusePointsLedger;
import com.musegate.domain.Subject;
import com.musegate.dto.PaymentMatchInput;
import com.musegate.mapper.ContractMapper;
import com.musegate.mapper.ContractPaymentMapper;
import com.musegate.mapper.MusePointsLedgerMapper;
import com.musegate.mapper.SubjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ContractAcl {
  private final SubjectMapper subjectMapper;
  private final ContractMapper contractMapper;
  private final ContractPaymentMapper contractPaymentMapper;
  private final MusePointsLedgerMapper musePointsLedgerMapper;
  private final PaymentAcl paymentAcl;

  @Transactional
  public String createContract(Subject subject, Contract contract, List<PaymentMatchInput> payments) {
    if (subject != null) {
      subjectMapper.insert(subject);
      contract.setSubjectId(subject.getId());
    }
    contractMapper.insert(contract);

    if (payments != null) {
      for (PaymentMatchInput input : payments) {
        ContractPayment cp = new ContractPayment();
        cp.setContractId(contract.getId());
        cp.setPaymentId(input.getPaymentId());
        cp.setPaymentType(input.getPaymentType());
        cp.setAmount(input.getAmount());
        cp.setCreatedAt(OffsetDateTime.now());
        contractPaymentMapper.insert(cp);
      }
    }

    return contract.getId();
  }

  @Transactional
  public String confirmContract(String contractId) {
    List<ContractPayment> payments = paymentAcl.findContractPayments(contractId);
    for (ContractPayment payment : payments) {
      MusePointsLedger ledger = new MusePointsLedger();
      ledger.setMgAccount(paymentAcl.findMgAccount(payment.getPaymentType(), payment.getPaymentId()));
      ledger.setAmount(payment.getAmount() == null ? BigDecimal.ZERO : payment.getAmount());
      ledger.setSourceType(payment.getPaymentType());
      ledger.setSourceId(payment.getPaymentId());
      ledger.setCreatedAt(OffsetDateTime.now());
      musePointsLedgerMapper.insert(ledger);
    }
    Contract contract = contractMapper.selectById(contractId);
    if (contract != null) {
      contract.setStatus("approved");
      contract.setUpdatedAt(OffsetDateTime.now());
      contractMapper.updateById(contract);
    }
    return contractId;
  }
}
```

`PaymentAcl.java`
```java
package com.musegate.acl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.musegate.domain.BankTransfer;
import com.musegate.domain.ContractPayment;
import com.musegate.domain.QrPayment;
import com.musegate.dto.PaymentMatchDto;
import com.musegate.dto.UnmatchedPaymentDto;
import com.musegate.mapper.BankTransferMapper;
import com.musegate.mapper.ContractPaymentMapper;
import com.musegate.mapper.QrPaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentAcl {
  private final BankTransferMapper bankTransferMapper;
  private final QrPaymentMapper qrPaymentMapper;
  private final ContractPaymentMapper contractPaymentMapper;

  public List<PaymentMatchDto> findMatchingPayments(String mgAccount) {
    List<PaymentMatchDto> results = new ArrayList<>();
    if (mgAccount == null || mgAccount.isBlank()) {
      return results;
    }
    List<BankTransfer> transfers = bankTransferMapper.selectList(
        new QueryWrapper<BankTransfer>().eq("mg_account", mgAccount));
    for (BankTransfer transfer : transfers) {
      PaymentMatchDto dto = new PaymentMatchDto();
      dto.setPaymentId(transfer.getId());
      dto.setPaymentType("bank_transfer");
      dto.setAmount(transfer.getAmount());
      dto.setMgAccount(transfer.getMgAccount());
      dto.setOccurredAt(transfer.getReceivedAt() == null ? null : transfer.getReceivedAt().toString());
      results.add(dto);
    }
    List<QrPayment> qrPayments = qrPaymentMapper.selectList(
        new QueryWrapper<QrPayment>().eq("mg_account", mgAccount));
    for (QrPayment payment : qrPayments) {
      PaymentMatchDto dto = new PaymentMatchDto();
      dto.setPaymentId(payment.getId());
      dto.setPaymentType("qr");
      dto.setAmount(payment.getAmount());
      dto.setMgAccount(payment.getMgAccount());
      dto.setOccurredAt(payment.getPaidAt() == null ? null : payment.getPaidAt().toString());
      results.add(dto);
    }
    return results;
  }

  public List<UnmatchedPaymentDto> findUnmatchedPayments() {
    List<UnmatchedPaymentDto> results = new ArrayList<>();
    List<BankTransfer> transfers = bankTransferMapper.selectList(new QueryWrapper<>());
    for (BankTransfer transfer : transfers) {
      boolean matched = contractPaymentMapper.selectCount(
          new QueryWrapper<ContractPayment>()
              .eq("payment_type", "bank_transfer")
              .eq("payment_id", transfer.getId())) > 0;
      if (!matched) {
        UnmatchedPaymentDto dto = new UnmatchedPaymentDto();
        dto.setPaymentId(transfer.getId());
        dto.setPaymentType("bank_transfer");
        dto.setAmount(transfer.getAmount());
        dto.setMgAccount(transfer.getMgAccount());
        dto.setOccurredAt(transfer.getReceivedAt() == null ? null : transfer.getReceivedAt().toString());
        results.add(dto);
      }
    }
    List<QrPayment> qrPayments = qrPaymentMapper.selectList(new QueryWrapper<>());
    for (QrPayment payment : qrPayments) {
      boolean matched = contractPaymentMapper.selectCount(
          new QueryWrapper<ContractPayment>()
              .eq("payment_type", "qr")
              .eq("payment_id", payment.getId())) > 0;
      if (!matched) {
        UnmatchedPaymentDto dto = new UnmatchedPaymentDto();
        dto.setPaymentId(payment.getId());
        dto.setPaymentType("qr");
        dto.setAmount(payment.getAmount());
        dto.setMgAccount(payment.getMgAccount());
        dto.setOccurredAt(payment.getPaidAt() == null ? null : payment.getPaidAt().toString());
        results.add(dto);
      }
    }
    return results;
  }

  public List<ContractPayment> findContractPayments(String contractId) {
    return contractPaymentMapper.selectList(
        new QueryWrapper<ContractPayment>().eq("contract_id", contractId));
  }

  public String findMgAccount(String paymentType, String paymentId) {
    if ("bank_transfer".equals(paymentType)) {
      BankTransfer transfer = bankTransferMapper.selectById(paymentId);
      return transfer == null ? null : transfer.getMgAccount();
    }
    QrPayment payment = qrPaymentMapper.selectById(paymentId);
    return payment == null ? null : payment.getMgAccount();
  }
}
```

`FinanceAcl.java`
```java
package com.musegate.acl;

import com.musegate.domain.BankTransfer;
import com.musegate.mapper.BankTransferMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FinanceAcl {
  private final BankTransferMapper bankTransferMapper;

  public String createBankTransfer(BankTransfer transfer) {
    bankTransferMapper.insert(transfer);
    return transfer.getId();
  }
}
```

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/main/java/com/musegate/dto \
  backend/src/main/java/com/musegate/acl \
  backend/src/test/java/com/musegate/AclWiringTests.java

git commit -m "feat: add dto and acl layer"
```

---

### Task 4: Service 层实现

**Files:**
- Create: `backend/src/main/java/com/musegate/service/*.java`
- Test: `backend/src/test/java/com/musegate/ServiceWiringTests.java`

**Step 1: Write the failing test**

```java
package com.musegate;

import com.musegate.service.ContractService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
class ServiceWiringTests {
  @Autowired(required = false)
  private ContractService contractService;

  @Test
  void serviceIsWired() {
    assertThat(contractService).isNotNull();
  }
}
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: FAIL because `ContractService` does not exist.

**Step 3: Write minimal implementation**

`ContractService.java`
```java
package com.musegate.service;

import com.musegate.acl.ContractAcl;
import com.musegate.domain.Contract;
import com.musegate.domain.Subject;
import com.musegate.dto.ContractResponse;
import com.musegate.dto.CreateContractRequest;
import com.musegate.dto.SubjectInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class ContractService {
  private final ContractAcl contractAcl;

  public ContractResponse createContract(CreateContractRequest request) {
    Subject subject = buildSubject(request.getSubject(), request.getSubjectId());
    Contract contract = new Contract();
    contract.setSubjectId(request.getSubjectId());
    contract.setAmount(request.getAmount());
    contract.setAddress(request.getAddress());
    contract.setMainAccountName(request.getMainAccountName());
    contract.setMainAccountPhone(request.getMainAccountPhone());
    contract.setItems(request.getItems());
    contract.setBonusItems(request.getBonusItems());
    contract.setStatus("draft");
    contract.setCreatedBy(request.getCreatedBy());
    contract.setCreatedAt(OffsetDateTime.now());
    contract.setUpdatedAt(OffsetDateTime.now());

    String contractId = contractAcl.createContract(subject, contract, request.getPayments());

    ContractResponse response = new ContractResponse();
    response.setContractId(contractId);
    response.setSubjectId(contract.getSubjectId());
    response.setStatus(contract.getStatus());
    return response;
  }

  private Subject buildSubject(SubjectInput input, String subjectId) {
    if (subjectId != null && !subjectId.isBlank()) {
      return null;
    }
    if (input == null) {
      return null;
    }
    Subject subject = new Subject();
    subject.setName(input.getName());
    subject.setTaxId(input.getTaxId());
    subject.setAddress(input.getAddress());
    subject.setSource(input.getSource());
    subject.setCreatedBy(input.getCreatedBy());
    subject.setCreatedAt(OffsetDateTime.now());
    return subject;
  }
}
```

`PaymentService.java`
```java
package com.musegate.service;

import com.musegate.acl.PaymentAcl;
import com.musegate.dto.PaymentMatchDto;
import com.musegate.dto.UnmatchedPaymentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
  private final PaymentAcl paymentAcl;

  public List<PaymentMatchDto> findMatches(String mgAccount) {
    return paymentAcl.findMatchingPayments(mgAccount);
  }

  public List<UnmatchedPaymentDto> findUnmatched() {
    return paymentAcl.findUnmatchedPayments();
  }
}
```

`FinanceService.java`
```java
package com.musegate.service;

import com.musegate.acl.FinanceAcl;
import com.musegate.domain.BankTransfer;
import com.musegate.dto.CreateBankTransferRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class FinanceService {
  private final FinanceAcl financeAcl;

  public String createBankTransfer(CreateBankTransferRequest request) {
    BankTransfer transfer = new BankTransfer();
    transfer.setSenderName(request.getSenderName());
    transfer.setSenderAccount(request.getSenderAccount());
    transfer.setAmount(request.getAmount());
    transfer.setReceivedAt(request.getReceivedAt() == null ? null : LocalDate.parse(request.getReceivedAt()));
    transfer.setMgAccount(request.getMgAccount());
    transfer.setCreatedBy(request.getCreatedBy());
    transfer.setCreatedAt(OffsetDateTime.now());
    return financeAcl.createBankTransfer(transfer);
  }
}
```

`ConfirmService.java`
```java
package com.musegate.service;

import com.musegate.acl.ContractAcl;
import com.musegate.dto.ConfirmContractResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfirmService {
  private final ContractAcl contractAcl;

  public ConfirmContractResponse confirm(String contractId) {
    String id = contractAcl.confirmContract(contractId);
    ConfirmContractResponse response = new ConfirmContractResponse();
    response.setContractId(id);
    response.setStatus("approved");
    return response;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/main/java/com/musegate/service \
  backend/src/test/java/com/musegate/ServiceWiringTests.java

git commit -m "feat: add service layer"
```

---

### Task 5: Controller 层与路由

**Files:**
- Create: `backend/src/main/java/com/musegate/controller/*.java`
- Test: `backend/src/test/java/com/musegate/ControllerWiringTests.java`

**Step 1: Write the failing test**

```java
package com.musegate;

import com.musegate.controller.ContractController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
class ControllerWiringTests {
  @Autowired(required = false)
  private ContractController contractController;

  @Test
  void controllerIsWired() {
    assertThat(contractController).isNotNull();
  }
}
```

**Step 2: Run test to verify it fails**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: FAIL because `ContractController` does not exist.

**Step 3: Write minimal implementation**

`ContractController.java`
```java
package com.musegate.controller;

import com.musegate.dto.ConfirmContractResponse;
import com.musegate.dto.ContractResponse;
import com.musegate.dto.CreateContractRequest;
import com.musegate.service.ConfirmService;
import com.musegate.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {
  private final ContractService contractService;
  private final ConfirmService confirmService;

  @PostMapping
  public ContractResponse create(@RequestBody CreateContractRequest request) {
    return contractService.createContract(request);
  }

  @PostMapping("/{contractId}/confirm")
  public ConfirmContractResponse confirm(@PathVariable String contractId) {
    return confirmService.confirm(contractId);
  }
}
```

`PaymentController.java`
```java
package com.musegate.controller;

import com.musegate.dto.PaymentMatchDto;
import com.musegate.dto.UnmatchedPaymentDto;
import com.musegate.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
  private final PaymentService paymentService;

  @GetMapping("/matches")
  public List<PaymentMatchDto> matches(@RequestParam String mgAccount) {
    return paymentService.findMatches(mgAccount);
  }

  @GetMapping("/unmatched")
  public List<UnmatchedPaymentDto> unmatched() {
    return paymentService.findUnmatched();
  }
}
```

`FinanceController.java`
```java
package com.musegate.controller;

import com.musegate.dto.CreateBankTransferRequest;
import com.musegate.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {
  private final FinanceService financeService;

  @PostMapping("/bank-transfers")
  public String createBankTransfer(@RequestBody CreateBankTransferRequest request) {
    return financeService.createBankTransfer(request);
  }
}
```

`ReconciliationController.java`
```java
package com.musegate.controller;

import com.musegate.dto.UnmatchedPaymentDto;
import com.musegate.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reconciliation")
@RequiredArgsConstructor
public class ReconciliationController {
  private final PaymentService paymentService;

  @GetMapping("/unmatched")
  public List<UnmatchedPaymentDto> unmatched() {
    return paymentService.findUnmatched();
  }
}
```

**Step 4: Run test to verify it passes**

Run: `~/dev/apache-maven-3.9.12/bin/mvn -q -f backend/pom.xml test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/main/java/com/musegate/controller \
  backend/src/test/java/com/musegate/ControllerWiringTests.java

git commit -m "feat: add controller endpoints"
```
