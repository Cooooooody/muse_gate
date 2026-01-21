package com.musegate.dto;

import lombok.Data;

@Data
public class SubjectInput {
  private String name;
  private String taxId;
  private String address;
  private String source;
  private String createdBy;
}
