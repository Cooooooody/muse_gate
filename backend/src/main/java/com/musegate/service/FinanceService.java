package com.musegate.service;

import com.musegate.acl.FinanceAcl;
import com.musegate.domain.BankTransfer;
import com.musegate.dto.CreateBankTransferRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class FinanceService {
  private final FinanceAcl financeAcl;

  public String createBankTransfer(CreateBankTransferRequest request) {
    BankTransfer transfer = new BankTransfer();
    transfer.setSenderName(request.getSenderName());
    transfer.setSenderAccount(request.getSenderAccount());
    transfer.setAmount(request.getAmount());
    transfer.setReceivedAt(request.getReceivedAt() == null ? null : LocalDate.parse(request.getReceivedAt()));
    transfer.setMgAccount(request.getMgAccount());
    transfer.setCreatedBy(request.getCreatedBy());
    transfer.setCreatedAt(OffsetDateTime.now());
    return financeAcl.createBankTransfer(transfer);
  }
}
