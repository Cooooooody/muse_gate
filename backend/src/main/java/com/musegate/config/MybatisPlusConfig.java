package com.musegate.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.musegate.mapper")
public class MybatisPlusConfig {
}
