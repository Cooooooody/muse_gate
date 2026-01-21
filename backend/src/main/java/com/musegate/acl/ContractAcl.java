package com.musegate.acl;

import com.musegate.domain.Contract;
import com.musegate.domain.ContractPayment;
import com.musegate.domain.MusePointsLedger;
import com.musegate.domain.Subject;
import com.musegate.dto.PaymentMatchInput;
import com.musegate.mapper.ContractMapper;
import com.musegate.mapper.ContractPaymentMapper;
import com.musegate.mapper.MusePointsLedgerMapper;
import com.musegate.mapper.SubjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ContractAcl {
  private final SubjectMapper subjectMapper;
  private final ContractMapper contractMapper;
  private final ContractPaymentMapper contractPaymentMapper;
  private final MusePointsLedgerMapper musePointsLedgerMapper;
  private final PaymentAcl paymentAcl;

  @Transactional
  public String createContract(Subject subject, Contract contract, List<PaymentMatchInput> payments) {
    if (subject != null) {
      if (subject.getId() == null) {
        subject.setId(UUID.randomUUID());
      }
      subjectMapper.insert(subject);
      contract.setSubjectId(subject.getId());
    }
    if (contract.getId() == null) {
      contract.setId(UUID.randomUUID());
    }
    contractMapper.insert(contract);

    if (payments != null) {
      for (PaymentMatchInput input : payments) {
        ContractPayment cp = new ContractPayment();
        cp.setContractId(contract.getId());
        cp.setPaymentId(safeUuid(input.getPaymentId()));
        cp.setPaymentType(input.getPaymentType());
        cp.setAmount(input.getAmount());
        cp.setCreatedAt(OffsetDateTime.now());
        contractPaymentMapper.insert(cp);
      }
    }

    return contract.getId().toString();
  }

  @Transactional
  public String confirmContract(String contractId) {
    UUID contractUuid = safeUuid(contractId);
    List<ContractPayment> payments = paymentAcl.findContractPayments(contractUuid);
    for (ContractPayment payment : payments) {
      MusePointsLedger ledger = new MusePointsLedger();
      ledger.setMgAccount(paymentAcl.findMgAccount(payment.getPaymentType(), payment.getPaymentId()));
      ledger.setAmount(payment.getAmount() == null ? BigDecimal.ZERO : payment.getAmount());
      ledger.setSourceType(payment.getPaymentType());
      ledger.setSourceId(payment.getPaymentId());
      ledger.setCreatedAt(OffsetDateTime.now());
      if (ledger.getId() == null) {
        ledger.setId(UUID.randomUUID());
      }
      musePointsLedgerMapper.insert(ledger);
    }
    Contract contract = contractUuid == null ? null : contractMapper.selectById(contractUuid);
    if (contract != null) {
      contract.setStatus("approved");
      contract.setUpdatedAt(OffsetDateTime.now());
      contractMapper.updateById(contract);
    }
    return contractId;
  }

  @Transactional
  public void updateStatus(String contractId, String status) {
    UUID contractUuid = safeUuid(contractId);
    Contract contract = contractUuid == null ? null : contractMapper.selectById(contractUuid);
    if (contract != null) {
      contract.setStatus(status);
      contract.setUpdatedAt(OffsetDateTime.now());
      contractMapper.updateById(contract);
    }
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
