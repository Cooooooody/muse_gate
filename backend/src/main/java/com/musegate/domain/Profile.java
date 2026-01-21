package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@TableName("profiles")
public class Profile {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String role;
  private String displayName;
  private String phone;
  private OffsetDateTime createdAt;
}
