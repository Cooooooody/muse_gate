package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.musegate.mapper.typehandler.PostgresEnumTypeHandler;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@TableName("contract_payments")
public class ContractPayment {
  private UUID contractId;
  private UUID paymentId;
  @TableField(typeHandler = PostgresEnumTypeHandler.class)
  private String paymentType;
  private BigDecimal amount;
  private OffsetDateTime createdAt;
}
