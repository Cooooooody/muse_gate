package com.musegate.controller;

import com.musegate.dto.MusePointsLedgerDto;
import com.musegate.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
public class LedgerController {
  private final LedgerService ledgerService;

  @GetMapping
  public List<MusePointsLedgerDto> list() {
    return ledgerService.listLatest();
  }
}
