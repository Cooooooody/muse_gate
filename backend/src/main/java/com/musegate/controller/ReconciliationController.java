package com.musegate.controller;

import com.musegate.dto.UnmatchedPaymentDto;
import com.musegate.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reconciliation")
@RequiredArgsConstructor
public class ReconciliationController {
  private final PaymentService paymentService;

  @GetMapping("/unmatched")
  public List<UnmatchedPaymentDto> unmatched() {
    return paymentService.findUnmatched();
  }
}
