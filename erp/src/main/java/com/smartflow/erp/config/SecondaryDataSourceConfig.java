package com.smartflow.erp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class SecondaryDataSourceConfig {

    @Value("${spring.secondary.datasource.url}")
    private String secondaryUrl;

    @Value("${spring.secondary.datasource.driver-class-name}")
    private String secondaryDriver;

    @Value("${spring.secondary.datasource.token}")
    private String authToken;

    @Bean(name = "secondaryDataSource", autowireCandidate = false)
    public DataSource secondaryDataSource() {
        org.springframework.jdbc.datasource.DriverManagerDataSource dataSource = new org.springframework.jdbc.datasource.DriverManagerDataSource();
        dataSource.setDriverClassName("com.dbeaver.jdbc.driver.libsql.LibSqlDriver");
        dataSource.setUrl(secondaryUrl);
        return dataSource;
    }

    @Bean(name = "secondaryJdbcTemplate")
    public JdbcTemplate secondaryJdbcTemplate() {
        return new JdbcTemplate(secondaryDataSource());
    }
}
