package com.musegate;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import static org.assertj.core.api.Assertions.assertThat;

class ConfigFilesTests {
  @Test
  void applicationYamlExists() {
    assertThat(new ClassPathResource("application.yml").exists()).isTrue();
  }
}
