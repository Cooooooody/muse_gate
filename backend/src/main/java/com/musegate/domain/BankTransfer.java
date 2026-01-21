package com.musegate.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@TableName("bank_transfers")
public class BankTransfer {
  @TableId(type = IdType.ASSIGN_UUID)
  private String id;
  private String senderName;
  private String senderAccount;
  private BigDecimal amount;
  private LocalDate receivedAt;
  private String mgAccount;
  private String createdBy;
  private OffsetDateTime createdAt;
}
