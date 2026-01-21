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
