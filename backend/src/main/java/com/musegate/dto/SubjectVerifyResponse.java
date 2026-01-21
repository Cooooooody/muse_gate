package com.musegate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectVerifyResponse {
  private String name;
  private String taxId;
  private String address;
  private boolean verified;
}
