package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ContractPendingDto {
  private String contractId;
  private String subjectName;
  private BigDecimal amount;
  private String status;
  private String createdAt;
  private String documentContent;
}
