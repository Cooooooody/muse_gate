package com.musegate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MismatchPaymentDto {
  private String paymentId;
  private String paymentType;
  private BigDecimal paidAmount;
  private BigDecimal contractAmount;
  private String mgAccount;
  private String occurredAt;
}
