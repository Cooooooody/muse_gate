package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@TableName("qr_payments")
public class QrPayment {
  @TableId(type = IdType.INPUT)
  private UUID id;
  private String provider;
  private String externalId;
  private BigDecimal amount;
  private OffsetDateTime paidAt;
  private String mgAccount;
  private OffsetDateTime createdAt;
}
