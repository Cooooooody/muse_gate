package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@TableName("muse_points_ledger")
public class MusePointsLedger {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String mgAccount;
  private BigDecimal amount;
  private String sourceType;
  private String sourceId;
  private OffsetDateTime createdAt;
}
