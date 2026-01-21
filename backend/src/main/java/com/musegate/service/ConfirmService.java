package com.musegate.service;

import com.musegate.acl.ContractAcl;
import com.musegate.dto.ConfirmContractResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfirmService {
  private final ContractAcl contractAcl;

  public ConfirmContractResponse confirm(String contractId) {
    String id = contractAcl.confirmContract(contractId);
    ConfirmContractResponse response = new ConfirmContractResponse();
    response.setContractId(id);
    response.setStatus("approved");
    return response;
  }
}
