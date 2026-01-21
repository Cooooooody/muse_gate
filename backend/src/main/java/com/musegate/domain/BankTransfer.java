package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@TableName("bank_transfers")
public class BankTransfer {
  @TableId(type = IdType.INPUT)
  private UUID id;
  private String senderName;
  private String senderAccount;
  private BigDecimal amount;
  private LocalDate receivedAt;
  private String mgAccount;
  private UUID createdBy;
  private OffsetDateTime createdAt;
}
