package com.alexandria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AlexandriaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlexandriaApplication.class, args);
    }

}
