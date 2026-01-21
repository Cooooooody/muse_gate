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
