package com.musegate.controller;

import com.musegate.dto.CreateBankTransferRequest;
import com.musegate.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {
  private final FinanceService financeService;

  @PostMapping("/bank-transfers")
  public String createBankTransfer(@RequestBody CreateBankTransferRequest request) {
    return financeService.createBankTransfer(request);
  }
}
