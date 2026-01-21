package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentMatchInput {
  private String paymentId;
  private String paymentType;
  private BigDecimal amount;
}
