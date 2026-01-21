package com.musegate.service;

import com.musegate.acl.PaymentAcl;
import com.musegate.dto.PaymentMatchDto;
import com.musegate.dto.UnmatchedPaymentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
  private final PaymentAcl paymentAcl;

  public List<PaymentMatchDto> findMatches(String mgAccount) {
    return paymentAcl.findMatchingPayments(mgAccount);
  }

  public List<UnmatchedPaymentDto> findUnmatched() {
    return paymentAcl.findUnmatchedPayments();
  }
}
