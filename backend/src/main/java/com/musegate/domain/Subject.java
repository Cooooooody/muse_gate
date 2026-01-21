package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@TableName("subjects")
public class Subject {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String name;
  private String taxId;
  private String address;
  private String source;
  private String createdBy;
  private OffsetDateTime createdAt;
}
