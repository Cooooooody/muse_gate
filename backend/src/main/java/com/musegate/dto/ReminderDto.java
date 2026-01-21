package com.musegate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDto {
  private String mgAccount;
  private String paymentType;
  private BigDecimal amount;
  private String occurredAt;
}
