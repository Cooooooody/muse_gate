package com.musegate.controller;

import com.musegate.dto.SubjectInfoDto;
import com.musegate.dto.SubjectVerifyRequest;
import com.musegate.dto.SubjectVerifyResponse;
import com.musegate.mock.MockDataProvider;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
  @GetMapping("/bank-history")
  public List<SubjectInfoDto> bankHistory(@RequestParam(required = false) String query) {
    return MockDataProvider.bankHistory(query);
  }

  @GetMapping("/client")
  public List<SubjectInfoDto> clientSubjects() {
    return MockDataProvider.clientSubjects();
  }

  @PostMapping("/verify")
  public SubjectVerifyResponse verify(@RequestBody SubjectVerifyRequest request) {
    return MockDataProvider.verify(request);
  }
}
