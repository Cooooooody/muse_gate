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
