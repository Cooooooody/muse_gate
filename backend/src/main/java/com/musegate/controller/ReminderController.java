package com.musegate.controller;

import com.musegate.dto.ReminderDto;
import com.musegate.mock.MockDataProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
  @GetMapping("/unmatched")
  public List<ReminderDto> unmatched() {
    return MockDataProvider.reminders();
  }
}
