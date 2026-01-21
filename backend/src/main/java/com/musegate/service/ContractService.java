package com.musegate.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.musegate.acl.ContractAcl;
import com.musegate.domain.Contract;
import com.musegate.domain.Subject;
import com.musegate.dto.ContractPendingDto;
import com.musegate.dto.ContractResponse;
import com.musegate.dto.CreateContractRequest;
import com.musegate.dto.SubjectInput;
import com.musegate.mapper.ContractMapper;
import com.musegate.mapper.SubjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {
  private final ContractAcl contractAcl;
  private final ContractMapper contractMapper;
  private final SubjectMapper subjectMapper;

  public ContractResponse createContract(CreateContractRequest request) {
    validatePayments(request);
    Subject subject = buildSubject(request.getSubject(), request.getSubjectId());
    Contract contract = new Contract();
    contract.setSubjectId(safeUuid(request.getSubjectId()));
    contract.setAmount(request.getAmount());
    contract.setAddress(request.getAddress());
    contract.setMainAccountName(request.getMainAccountName());
    contract.setMainAccountPhone(request.getMainAccountPhone());
    contract.setItems(request.getItems());
    contract.setBonusItems(request.getBonusItems());
    contract.setDocumentContent(request.getDocumentContent());
    contract.setStatus("draft");
    contract.setCreatedBy(safeUuid(request.getCreatedBy()));
    contract.setCreatedAt(OffsetDateTime.now());
    contract.setUpdatedAt(OffsetDateTime.now());

    String contractId = contractAcl.createContract(subject, contract, request.getPayments());

    ContractResponse response = new ContractResponse();
    response.setContractId(contractId);
    response.setSubjectId(contract.getSubjectId() == null ? null : contract.getSubjectId().toString());
    response.setStatus(contract.getStatus());
    return response;
  }

  private void validatePayments(CreateContractRequest request) {
    if (request.getPayments() == null || request.getPayments().isEmpty()) {
      return;
    }
    for (int i = 0; i < request.getPayments().size(); i++) {
      String paymentId = request.getPayments().get(i).getPaymentId();
      if (paymentId == null || paymentId.isBlank()) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "payments[" + i + "].paymentId 不能为空"
        );
      }
      if (safeUuid(paymentId) == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "payments[" + i + "].paymentId 不是有效UUID"
        );
      }
    }
  }

  public void submitContract(String contractId) {
    contractAcl.submitContract(contractId);
  }

  public List<ContractPendingDto> listPendingContracts() {
    LambdaQueryWrapper<Contract> wrapper = Wrappers.lambdaQuery();
    wrapper.apply("status = 'pending_approval'::contract_status")
        .orderByDesc(Contract::getCreatedAt);
    List<Contract> contracts = contractMapper.selectList(wrapper);
    if (contracts == null || contracts.isEmpty()) {
      return Collections.emptyList();
    }
    List<UUID> subjectIds = contracts.stream()
        .map(Contract::getSubjectId)
        .filter(id -> id != null)
        .toList();
    Map<UUID, String> subjectNameMap = subjectIds.isEmpty()
        ? Collections.emptyMap()
        : subjectMapper.selectBatchIds(subjectIds).stream()
            .collect(Collectors.toMap(Subject::getId, Subject::getName, (a, b) -> a));

    return contracts.stream().map(contract -> {
      ContractPendingDto dto = new ContractPendingDto();
      dto.setContractId(contract.getId() == null ? null : contract.getId().toString());
      dto.setSubjectName(subjectNameMap.get(contract.getSubjectId()));
      dto.setAmount(contract.getAmount());
      dto.setStatus(contract.getStatus());
      dto.setCreatedAt(contract.getCreatedAt() == null ? null : contract.getCreatedAt().toString());
      dto.setDocumentContent(contract.getDocumentContent());
      return dto;
    }).toList();
  }

  private Subject buildSubject(SubjectInput input, String subjectId) {
    if (subjectId != null && !subjectId.isBlank()) {
      return null;
    }
    if (input == null) {
      return null;
    }
    Subject subject = new Subject();
    subject.setName(input.getName());
    subject.setTaxId(input.getTaxId());
    subject.setAddress(input.getAddress());
    subject.setSource(input.getSource());
    subject.setCreatedBy(safeUuid(input.getCreatedBy()));
    subject.setCreatedAt(OffsetDateTime.now());
    return subject;
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
