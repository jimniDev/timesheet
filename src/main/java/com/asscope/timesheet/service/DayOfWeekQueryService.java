package com.asscope.timesheet.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.asscope.timesheet.domain.DayOfWeek;
import com.asscope.timesheet.domain.*; // for static metamodels
import com.asscope.timesheet.repository.DayOfWeekRepository;
import com.asscope.timesheet.service.dto.DayOfWeekCriteria;

/**
 * Service for executing complex queries for {@link DayOfWeek} entities in the database.
 * The main input is a {@link DayOfWeekCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link DayOfWeek} or a {@link Page} of {@link DayOfWeek} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class DayOfWeekQueryService extends QueryService<DayOfWeek> {

    private final Logger log = LoggerFactory.getLogger(DayOfWeekQueryService.class);

    private final DayOfWeekRepository dayOfWeekRepository;

    public DayOfWeekQueryService(DayOfWeekRepository dayOfWeekRepository) {
        this.dayOfWeekRepository = dayOfWeekRepository;
    }

    /**
     * Return a {@link List} of {@link DayOfWeek} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<DayOfWeek> findByCriteria(DayOfWeekCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<DayOfWeek> specification = createSpecification(criteria);
        return dayOfWeekRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link DayOfWeek} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<DayOfWeek> findByCriteria(DayOfWeekCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<DayOfWeek> specification = createSpecification(criteria);
        return dayOfWeekRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(DayOfWeekCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<DayOfWeek> specification = createSpecification(criteria);
        return dayOfWeekRepository.count(specification);
    }

    /**
     * Function to convert ConsumerCriteria to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */    
    private Specification<DayOfWeek> createSpecification(DayOfWeekCriteria criteria) {
        Specification<DayOfWeek> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), DayOfWeek_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), DayOfWeek_.name));
            }
            if (criteria.getTargetWorkingDayId() != null) {
                specification = specification.and(buildSpecification(criteria.getTargetWorkingDayId(),
                    root -> root.join(DayOfWeek_.targetWorkingDays, JoinType.LEFT).get(TargetWorkingDay_.id)));
            }
        }
        return specification;
    }
}
