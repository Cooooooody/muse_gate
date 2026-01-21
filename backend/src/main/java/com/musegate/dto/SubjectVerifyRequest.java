package com.musegate.dto;

import lombok.Data;

@Data
public class SubjectVerifyRequest {
  private String name;
  private String taxId;
  private String address;
}
