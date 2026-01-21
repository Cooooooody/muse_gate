package com.musegate.controller;

import com.musegate.dto.SubjectInfoDto;
import com.musegate.dto.SubjectVerifyRequest;
import com.musegate.dto.SubjectVerifyResponse;
import com.musegate.mock.MockDataProvider;
import com.musegate.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {
  private final SubjectService subjectService;

  @GetMapping("/bank-history")
  public List<SubjectInfoDto> bankHistory(@RequestParam(value = "query", required = false) String query) {
    return subjectService.bankHistory(query);
  }

  @GetMapping("/client")
  public List<SubjectInfoDto> clientSubjects() {
    return subjectService.clientSubjects();
  }

  @PostMapping("/verify")
  public SubjectVerifyResponse verify(@RequestBody SubjectVerifyRequest request) {
    return MockDataProvider.verify(request);
  }
}
