package fr.vote.proj.configuration;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.Contact;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

   private ApiKey apiKey() {
      return new ApiKey("bearer", "Authorization", "header");
   }

   private ApiInfo apiInfo() {
      return new ApiInfo("Api vote website CFDT", "Api for the voting website of the cfdt",
            "1", "termsOfService",
            new Contact("charly", "www.charlyR.com", "charlyreux@gmail.com"),
            "license of API",
            "license url",
            Collections.emptyList());
   }

   @Bean
   public Docket api() {
      return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(apiInfo())
            .securityContexts(Arrays.asList(securityContext()))
            .securitySchemes(Arrays.asList(apiKey()))
            .select()
            .apis(RequestHandlerSelectors.any())
            .paths(PathSelectors.any())
            .build();
   }


   private SecurityContext securityContext(){
      return SecurityContext.builder().securityReferences(defaultAuth()).build();
  }

  private List<SecurityReference> defaultAuth(){
      AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
      AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
      authorizationScopes[0] = authorizationScope;
      return Arrays.asList(new SecurityReference("bearer", authorizationScopes));
  }

}