package com.musegate.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.musegate.domain.Subject;
import com.musegate.dto.SubjectInfoDto;
import com.musegate.mapper.SubjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {
  private final SubjectMapper subjectMapper;

  public List<SubjectInfoDto> bankHistory(String query) {
    LambdaQueryWrapper<Subject> wrapper = Wrappers.lambdaQuery();
    wrapper.apply("source = 'bank'::subject_source");
    if (query != null && !query.trim().isEmpty()) {
      wrapper.like(Subject::getName, query.trim());
    }
    return toSubjectInfo(subjectMapper.selectList(wrapper));
  }

  public List<SubjectInfoDto> clientSubjects() {
    LambdaQueryWrapper<Subject> wrapper = Wrappers.lambdaQuery();
    wrapper.apply("source = 'client_entry'::subject_source");
    return toSubjectInfo(subjectMapper.selectList(wrapper));
  }

  private List<SubjectInfoDto> toSubjectInfo(List<Subject> subjects) {
    if (subjects == null || subjects.isEmpty()) {
      return Collections.emptyList();
    }
    return subjects.stream()
        .map(subject -> new SubjectInfoDto(
            subject.getId() == null ? null : subject.getId().toString(),
            subject.getName(),
            subject.getTaxId(),
            subject.getAddress(),
            subject.getSource()
        ))
        .toList();
  }
}
