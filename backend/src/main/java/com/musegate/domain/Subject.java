package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.musegate.mapper.typehandler.PostgresEnumTypeHandler;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@TableName("subjects")
public class Subject {
  @TableId(type = IdType.INPUT)
  private UUID id;
  private String name;
  private String taxId;
  private String address;
  @TableField(typeHandler = PostgresEnumTypeHandler.class)
  private String source;
  private UUID createdBy;
  private OffsetDateTime createdAt;
}
