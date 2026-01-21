package com.musegate.acl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
import java.util.UUID;

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
        new LambdaQueryWrapper<BankTransfer>().eq(BankTransfer::getMgAccount, mgAccount));
    for (BankTransfer transfer : transfers) {
      PaymentMatchDto dto = new PaymentMatchDto();
      dto.setPaymentId(transfer.getId() == null ? null : transfer.getId().toString());
      dto.setPaymentType("bank_transfer");
      dto.setAmount(transfer.getAmount());
      dto.setMgAccount(transfer.getMgAccount());
      dto.setOccurredAt(transfer.getReceivedAt() == null ? null : transfer.getReceivedAt().toString());
      results.add(dto);
    }
    List<QrPayment> qrPayments = qrPaymentMapper.selectList(
        new LambdaQueryWrapper<QrPayment>().eq(QrPayment::getMgAccount, mgAccount));
    for (QrPayment payment : qrPayments) {
      PaymentMatchDto dto = new PaymentMatchDto();
      dto.setPaymentId(payment.getId() == null ? null : payment.getId().toString());
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
    List<BankTransfer> transfers = bankTransferMapper.selectList(
        new LambdaQueryWrapper<BankTransfer>().orderByDesc(BankTransfer::getCreatedAt));
    for (BankTransfer transfer : transfers) {
      boolean matched = contractPaymentMapper.selectCount(
          new LambdaQueryWrapper<ContractPayment>()
              .eq(ContractPayment::getPaymentType, "bank_transfer")
              .eq(ContractPayment::getPaymentId, transfer.getId())) > 0;
      if (!matched) {
        UnmatchedPaymentDto dto = new UnmatchedPaymentDto();
        dto.setPaymentId(transfer.getId() == null ? null : transfer.getId().toString());
        dto.setPaymentType("bank_transfer");
        dto.setAmount(transfer.getAmount());
        dto.setMgAccount(transfer.getMgAccount());
        dto.setOccurredAt(transfer.getReceivedAt() == null ? null : transfer.getReceivedAt().toString());
        results.add(dto);
      }
    }
    List<QrPayment> qrPayments = qrPaymentMapper.selectList(
        new LambdaQueryWrapper<QrPayment>().orderByDesc(QrPayment::getCreatedAt));
    for (QrPayment payment : qrPayments) {
      boolean matched = contractPaymentMapper.selectCount(
          new LambdaQueryWrapper<ContractPayment>()
              .eq(ContractPayment::getPaymentType, "qr")
              .eq(ContractPayment::getPaymentId, payment.getId())) > 0;
      if (!matched) {
        UnmatchedPaymentDto dto = new UnmatchedPaymentDto();
        dto.setPaymentId(payment.getId() == null ? null : payment.getId().toString());
        dto.setPaymentType("qr");
        dto.setAmount(payment.getAmount());
        dto.setMgAccount(payment.getMgAccount());
        dto.setOccurredAt(payment.getPaidAt() == null ? null : payment.getPaidAt().toString());
        results.add(dto);
      }
    }
    return results;
  }

  public List<ContractPayment> findContractPayments(UUID contractId) {
    return contractPaymentMapper.selectList(
        new LambdaQueryWrapper<ContractPayment>().eq(ContractPayment::getContractId, contractId));
  }

  public String findMgAccount(String paymentType, UUID paymentId) {
    if ("bank_transfer".equals(paymentType)) {
      BankTransfer transfer = paymentId == null ? null : bankTransferMapper.selectById(paymentId);
      return transfer == null ? null : transfer.getMgAccount();
    }
    QrPayment payment = paymentId == null ? null : qrPaymentMapper.selectById(paymentId);
    return payment == null ? null : payment.getMgAccount();
  }
}
