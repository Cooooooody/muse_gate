package com.musegate.service;

import com.musegate.acl.ContractAcl;
import com.musegate.domain.Contract;
import com.musegate.domain.Subject;
import com.musegate.dto.ContractResponse;
import com.musegate.dto.CreateContractRequest;
import com.musegate.dto.SubjectInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class ContractService {
  private final ContractAcl contractAcl;

  public ContractResponse createContract(CreateContractRequest request) {
    Subject subject = buildSubject(request.getSubject(), request.getSubjectId());
    Contract contract = new Contract();
    contract.setSubjectId(request.getSubjectId());
    contract.setAmount(request.getAmount());
    contract.setAddress(request.getAddress());
    contract.setMainAccountName(request.getMainAccountName());
    contract.setMainAccountPhone(request.getMainAccountPhone());
    contract.setItems(request.getItems());
    contract.setBonusItems(request.getBonusItems());
    contract.setStatus("draft");
    contract.setCreatedBy(request.getCreatedBy());
    contract.setCreatedAt(OffsetDateTime.now());
    contract.setUpdatedAt(OffsetDateTime.now());

    String contractId = contractAcl.createContract(subject, contract, request.getPayments());

    ContractResponse response = new ContractResponse();
    response.setContractId(contractId);
    response.setSubjectId(contract.getSubjectId());
    response.setStatus(contract.getStatus());
    return response;
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
    subject.setCreatedBy(input.getCreatedBy());
    subject.setCreatedAt(OffsetDateTime.now());
    return subject;
  }
}
