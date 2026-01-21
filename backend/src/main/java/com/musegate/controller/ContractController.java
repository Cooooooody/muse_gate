package com.musegate.controller;

import com.musegate.dto.ConfirmContractResponse;
import com.musegate.dto.ContractPendingDto;
import com.musegate.dto.ContractResponse;
import com.musegate.dto.CreateContractRequest;
import com.musegate.service.ConfirmService;
import com.musegate.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {
  private final ContractService contractService;
  private final ConfirmService confirmService;

  @PostMapping
  public ContractResponse create(@RequestBody CreateContractRequest request) {
    return contractService.createContract(request);
  }

  @GetMapping("/pending")
  public List<ContractPendingDto> pending() {
    return contractService.listPendingContracts();
  }

  @PostMapping("/{contractId}/submit")
  public void submit(@PathVariable("contractId") String contractId) {
    contractService.submitContract(contractId);
  }

  @PostMapping("/{contractId}/confirm")
  public ConfirmContractResponse confirm(@PathVariable("contractId") String contractId) {
    return confirmService.confirm(contractId);
  }
}
