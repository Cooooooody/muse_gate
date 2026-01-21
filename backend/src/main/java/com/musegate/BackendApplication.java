package com.musegate;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@SpringBootApplication
public class BackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }

  @Bean
  public ApplicationRunner dbConnectivityCheck(DataSource dataSource) {
    return args -> {
      try (Connection conn = dataSource.getConnection();
           Statement st = conn.createStatement();
           ResultSet rs = st.executeQuery("select 1")) {
        if (rs.next()) {
          System.out.println("DB connectivity check: select 1 => " + rs.getInt(1));
        }
      }
    };
  }
}
