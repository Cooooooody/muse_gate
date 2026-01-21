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
@TableName("muse_points_ledger")
public class MusePointsLedger {
  @TableId(type = IdType.INPUT)
  private UUID id;
  private String mgAccount;
  private BigDecimal amount;
  @TableField(typeHandler = PostgresEnumTypeHandler.class)
  private String sourceType;
  private UUID sourceId;
  private OffsetDateTime createdAt;
}
