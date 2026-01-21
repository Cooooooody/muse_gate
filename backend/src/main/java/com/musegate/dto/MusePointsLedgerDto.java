package com.musegate.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MusePointsLedgerDto {
  private String id;
  private String mgAccount;
  private BigDecimal amount;
  private String sourceType;
  private String sourceId;
  private String createdAt;
}
