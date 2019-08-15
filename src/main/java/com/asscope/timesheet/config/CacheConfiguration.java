package com.asscope.timesheet.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.asscope.timesheet.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.asscope.timesheet.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.asscope.timesheet.domain.User.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Authority.class.getName());
            createCache(cm, com.asscope.timesheet.domain.User.class.getName() + ".authorities");
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName() + ".workingEntries");
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName() + ".workingDays");
            createCache(cm, com.asscope.timesheet.domain.WorkingEntry.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Activity.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Activity.class.getName() + ".workingEntries");
            createCache(cm, com.asscope.timesheet.domain.Location.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Location.class.getName() + ".workingEntries");
            createCache(cm, com.asscope.timesheet.domain.Country.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Country.class.getName() + ".locations");
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName() + ".targetWorkingDays");
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName() + ".weeklyWorkingHours");
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName() + ".workDays");
            createCache(cm, com.asscope.timesheet.domain.Employee.class.getName() + ".workBreaks");
            createCache(cm, com.asscope.timesheet.domain.TargetWorkingDay.class.getName());
            createCache(cm, com.asscope.timesheet.domain.DayOfWeek.class.getName());
            createCache(cm, com.asscope.timesheet.domain.DayOfWeek.class.getName() + ".targetWorkingDays");
            createCache(cm, com.asscope.timesheet.domain.WeeklyWorkingHours.class.getName());
            createCache(cm, com.asscope.timesheet.domain.WorkDay.class.getName());
            createCache(cm, com.asscope.timesheet.domain.WorkDay.class.getName() + ".workingEntries");
            createCache(cm, com.asscope.timesheet.domain.WorkDay.class.getName() + ".workBreaks");
            createCache(cm, com.asscope.timesheet.domain.WorkBreak.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Role.class.getName());
            createCache(cm, com.asscope.timesheet.domain.Role.class.getName() + ".activities");
            createCache(cm, com.asscope.timesheet.domain.Activity.class.getName() + ".roles");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, jcacheConfiguration);
    }
}
