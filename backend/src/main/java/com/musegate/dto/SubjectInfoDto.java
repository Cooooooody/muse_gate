package com.musegate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectInfoDto {
  private String id;
  private String name;
  private String taxId;
  private String address;
  private String source;
}
