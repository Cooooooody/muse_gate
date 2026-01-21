package com.musegate.acl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.musegate.domain.BankTransfer;
import com.musegate.domain.ContractPayment;
import com.musegate.domain.QrPayment;
import com.musegate.dto.PaymentMatchDto;
import com.musegate.dto.UnmatchedPaymentDto;
import com.musegate.mapper.BankTransferMapper;
import com.musegate.mapper.ContractPaymentMapper;
import com.musegate.mapper.QrPaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentAcl {
  private final BankTransferMapper bankTransferMapper;
  private final QrPaymentMapper qrPaymentMapper;
  private final ContractPaymentMapper contractPaymentMapper;

  public List<PaymentMatchDto> findMatchingPayments(String mgAccount) {
    List<PaymentMatchDto> results = new ArrayList<>();
    if (mgAccount == null || mgAccount.isBlank()) {
      return results;
    }
    List<BankTransfer> transfers = bankTransferMapper.selectList(
        new QueryWrapper<BankTransfer>().eq("mg_account", mgAccount));
    for (BankTransfer transfer : transfers) {
      PaymentMatchDto dto = new PaymentMatchDto();
      dto.setPaymentId(transfer.getId());
      dto.setPaymentType("bank_transfer");
      dto.setAmount(transfer.getAmount());
      dto.setMgAccount(transfer.getMgAccount());
      dto.setOccurredAt(transfer.getReceivedAt() == null ? null : transfer.getReceivedAt().toString());
      results.add(dto);
    }
    List<QrPayment> qrPayments = qrPaymentMapper.selectList(
        new QueryWrapper<QrPayment>().eq("mg_account", mgAccount));
    for (QrPayment payment : qrPayments) {
      PaymentMatchDto dto = new PaymentMatchDto();
      dto.setPaymentId(payment.getId());
      dto.setPaymentType("qr");
      dto.setAmount(payment.getAmount());
      dto.setMgAccount(payment.getMgAccount());
      dto.setOccurredAt(payment.getPaidAt() == null ? null : payment.getPaidAt().toString());
      results.add(dto);
    }
    return results;
  }

  public List<UnmatchedPaymentDto> findUnmatchedPayments() {
    List<UnmatchedPaymentDto> results = new ArrayList<>();
    List<BankTransfer> transfers = bankTransferMapper.selectList(new QueryWrapper<>());
    for (BankTransfer transfer : transfers) {
      boolean matched = contractPaymentMapper.selectCount(
          new QueryWrapper<ContractPayment>()
              .eq("payment_type", "bank_transfer")
              .eq("payment_id", transfer.getId())) > 0;
      if (!matched) {
        UnmatchedPaymentDto dto = new UnmatchedPaymentDto();
        dto.setPaymentId(transfer.getId());
        dto.setPaymentType("bank_transfer");
        dto.setAmount(transfer.getAmount());
        dto.setMgAccount(transfer.getMgAccount());
        dto.setOccurredAt(transfer.getReceivedAt() == null ? null : transfer.getReceivedAt().toString());
        results.add(dto);
      }
    }
    List<QrPayment> qrPayments = qrPaymentMapper.selectList(new QueryWrapper<>());
    for (QrPayment payment : qrPayments) {
      boolean matched = contractPaymentMapper.selectCount(
          new QueryWrapper<ContractPayment>()
              .eq("payment_type", "qr")
              .eq("payment_id", payment.getId())) > 0;
      if (!matched) {
        UnmatchedPaymentDto dto = new UnmatchedPaymentDto();
        dto.setPaymentId(payment.getId());
        dto.setPaymentType("qr");
        dto.setAmount(payment.getAmount());
        dto.setMgAccount(payment.getMgAccount());
        dto.setOccurredAt(payment.getPaidAt() == null ? null : payment.getPaidAt().toString());
        results.add(dto);
      }
    }
    return results;
  }

  public List<ContractPayment> findContractPayments(String contractId) {
    return contractPaymentMapper.selectList(
        new QueryWrapper<ContractPayment>().eq("contract_id", contractId));
  }

  public String findMgAccount(String paymentType, String paymentId) {
    if ("bank_transfer".equals(paymentType)) {
      BankTransfer transfer = bankTransferMapper.selectById(paymentId);
      return transfer == null ? null : transfer.getMgAccount();
    }
    QrPayment payment = qrPaymentMapper.selectById(paymentId);
    return payment == null ? null : payment.getMgAccount();
  }
}
