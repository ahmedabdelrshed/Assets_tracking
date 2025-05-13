package com.project.demo.Aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
public class AuditAspect {
    private final Logger logger = LoggerFactory.getLogger("AuditLog");

    @AfterReturning("execution(* com.project.demo.controllers.AssetController.*(..))")
    public void auditMethod(JoinPoint joinPoint) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : "anonymous";
        
        logger.info("User: {}, Action: {}, Time: {}, Method: {}.{}",
            username,
            joinPoint.getSignature().getName(),
            LocalDateTime.now(),
            joinPoint.getTarget().getClass().getSimpleName(),
            joinPoint.getSignature().getName());
    }
}