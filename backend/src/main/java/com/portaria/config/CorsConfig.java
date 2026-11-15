package com.portaria.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Libera o front-end Angular (ng serve -> porta 4200) a chamar a API
 * e liga a conferência do login (token) em todas as rotas da API, menos login e logout.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Autowired
    private AutenticacaoInterceptor autenticacao;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(autenticacao)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/login", "/api/logout");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .exposedHeaders("Location");
    }
}
