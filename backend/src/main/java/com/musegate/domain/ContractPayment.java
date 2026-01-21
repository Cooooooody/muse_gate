package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("contract_payments")
public class ContractPayment {
  private String contractId;
  private String paymentId;
  private String paymentType;
  private BigDecimal amount;
  private OffsetDateTime createdAt;
}
