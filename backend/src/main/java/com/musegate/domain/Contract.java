package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.musegate.mapper.typehandler.PostgresEnumTypeHandler;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@TableName("contracts")
public class Contract {
  @TableId(type = IdType.INPUT)
  private UUID id;
  private UUID subjectId;
  private BigDecimal amount;
  private String address;
  private String mainAccountName;
  private String mainAccountPhone;
  private String items;
  private String bonusItems;
  @TableField(typeHandler = PostgresEnumTypeHandler.class)
  private String status;
  private UUID createdBy;
  private UUID approvedBy;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
