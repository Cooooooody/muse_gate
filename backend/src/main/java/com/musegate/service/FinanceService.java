package com.musegate.service;

import com.musegate.acl.FinanceAcl;
import com.musegate.domain.BankTransfer;
import com.musegate.dto.CreateBankTransferRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinanceService {
  private final FinanceAcl financeAcl;

  public String createBankTransfer(CreateBankTransferRequest request) {
    BankTransfer transfer = new BankTransfer();
    transfer.setId(UUID.randomUUID());
    transfer.setSenderName(request.getSenderName());
    transfer.setSenderAccount(request.getSenderAccount());
    transfer.setAmount(request.getAmount());
    transfer.setReceivedAt(request.getReceivedAt() == null ? null : LocalDate.parse(request.getReceivedAt()));
    transfer.setMgAccount(request.getMgAccount());
    transfer.setCreatedBy(safeUuid(request.getCreatedBy()));
    transfer.setCreatedAt(OffsetDateTime.now());
    return financeAcl.createBankTransfer(transfer);
  }

  private UUID safeUuid(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    try {
      return UUID.fromString(value);
    } catch (IllegalArgumentException ex) {
      return null;
    }
  }
}
