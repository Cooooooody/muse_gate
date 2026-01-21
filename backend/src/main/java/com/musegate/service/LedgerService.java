package com.musegate.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.musegate.domain.MusePointsLedger;
import com.musegate.dto.MusePointsLedgerDto;
import com.musegate.mapper.MusePointsLedgerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerService {
  private final MusePointsLedgerMapper ledgerMapper;

  public List<MusePointsLedgerDto> listLatest() {
    List<MusePointsLedger> entries = ledgerMapper.selectList(
        new LambdaQueryWrapper<MusePointsLedger>()
            .orderByDesc(MusePointsLedger::getCreatedAt)
    );
    if (entries == null || entries.isEmpty()) {
      return Collections.emptyList();
    }
    return entries.stream().map(entry -> {
      MusePointsLedgerDto dto = new MusePointsLedgerDto();
      dto.setId(entry.getId() == null ? null : entry.getId().toString());
      dto.setMgAccount(entry.getMgAccount());
      dto.setAmount(entry.getAmount());
      dto.setSourceType(entry.getSourceType());
      dto.setSourceId(entry.getSourceId() == null ? null : entry.getSourceId().toString());
      dto.setCreatedAt(entry.getCreatedAt() == null ? null : entry.getCreatedAt().toString());
      return dto;
    }).toList();
  }
}
