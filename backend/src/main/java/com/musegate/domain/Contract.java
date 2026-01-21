package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("contracts")
public class Contract {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String subjectId;
  private BigDecimal amount;
  private String address;
  private String mainAccountName;
  private String mainAccountPhone;
  private String items;
  private String bonusItems;
  private String status;
  private String createdBy;
  private String approvedBy;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
