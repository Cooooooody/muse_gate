package com.musegate.mock;

import com.musegate.dto.MismatchPaymentDto;
import com.musegate.dto.ReminderDto;
import com.musegate.dto.SubjectInfoDto;
import com.musegate.dto.SubjectVerifyRequest;
import com.musegate.dto.SubjectVerifyResponse;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

public final class MockDataProvider {
  private static final List<SubjectInfoDto> BANK_HISTORY = List.of(
      new SubjectInfoDto(UUID.randomUUID().toString(), "上海世纪出版集团", "9131000012345678X",
          "上海市静安区XX路1号", "bank"),
      new SubjectInfoDto(UUID.randomUUID().toString(), "阿里巴巴(中国)网络技术有限公司", "9133010071256055X",
          "杭州市余杭区XX路88号", "bank"),
      new SubjectInfoDto(UUID.randomUUID().toString(), "腾讯科技(深圳)有限公司", "91440300708461136T",
          "深圳市南山区XX大道66号", "bank")
  );

  private static final List<SubjectInfoDto> CLIENT_SUBJECTS = List.of(
      new SubjectInfoDto(UUID.randomUUID().toString(), "个人主体A", null, null, "client_entry"),
      new SubjectInfoDto(UUID.randomUUID().toString(), "上海未来创意设计有限公司", "91310115MA1H7XU48M",
          "上海市浦东新区XX路18号", "client_entry")
  );

  private static final List<ReminderDto> REMINDERS = List.of(
      new ReminderDto("MG-9527", "bank_transfer", new BigDecimal("10000.00"),
          "2026-01-20 09:00"),
      new ReminderDto("MG-2026", "bank_transfer", new BigDecimal("3000.00"),
          "2026-01-20 10:30")
  );

  private static final List<MismatchPaymentDto> MISMATCH_LIST = List.of(
      new MismatchPaymentDto("PAY-1001", "bank_transfer", new BigDecimal("9500.00"),
          new BigDecimal("10000.00"), "MG-9527", "2026-01-18"),
      new MismatchPaymentDto("PAY-1002", "qr", new BigDecimal("3000.00"),
          new BigDecimal("5000.00"), "MG-2026", "2026-01-19")
  );

  private MockDataProvider() {
  }

  public static List<SubjectInfoDto> bankHistory(String query) {
    if (query == null || query.trim().isEmpty()) {
      return BANK_HISTORY;
    }
    String q = query.toLowerCase(Locale.ROOT);
    List<SubjectInfoDto> results = new ArrayList<>();
    for (SubjectInfoDto item : BANK_HISTORY) {
      if (item.getName() != null && item.getName().toLowerCase(Locale.ROOT).contains(q)) {
        results.add(item);
      }
    }
    return results;
  }

  public static List<SubjectInfoDto> clientSubjects() {
    return CLIENT_SUBJECTS;
  }

  public static SubjectVerifyResponse verify(SubjectVerifyRequest request) {
    String name = request.getName() == null ? "未命名主体" : request.getName();
    String taxId = request.getTaxId() == null ? "91310000MOCK00000X" : request.getTaxId();
    String address = request.getAddress() == null ? "上海市徐汇区XX路99号" : request.getAddress();
    return new SubjectVerifyResponse(name, taxId, address, true);
  }

  public static List<ReminderDto> reminders() {
    return REMINDERS;
  }

  public static List<MismatchPaymentDto> mismatchPayments() {
    return MISMATCH_LIST;
  }
}
