package com.musegate.acl;

import com.musegate.domain.BankTransfer;
import com.musegate.mapper.BankTransferMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FinanceAcl {
  private final BankTransferMapper bankTransferMapper;

  public String createBankTransfer(BankTransfer transfer) {
    bankTransferMapper.insert(transfer);
    return transfer.getId() == null ? null : transfer.getId().toString();
  }
}
