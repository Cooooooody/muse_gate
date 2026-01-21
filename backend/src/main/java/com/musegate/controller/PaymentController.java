package com.musegate.controller;

import com.musegate.dto.PaymentMatchDto;
import com.musegate.dto.UnmatchedPaymentDto;
import com.musegate.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
  private final PaymentService paymentService;

  @GetMapping("/matches")
  public List<PaymentMatchDto> matches(@RequestParam String mgAccount) {
    return paymentService.findMatches(mgAccount);
  }

  @GetMapping("/unmatched")
  public List<UnmatchedPaymentDto> unmatched() {
    return paymentService.findUnmatched();
  }
}
