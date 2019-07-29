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

import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.domain.*; // for static metamodels
import com.asscope.timesheet.repository.WorkDayRepository;
import com.asscope.timesheet.service.dto.WorkDayCriteria;

/**
 * Service for executing complex queries for {@link WorkDay} entities in the database.
 * The main input is a {@link WorkDayCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link WorkDay} or a {@link Page} of {@link WorkDay} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class WorkDayQueryService extends QueryService<WorkDay> {

    private final Logger log = LoggerFactory.getLogger(WorkDayQueryService.class);

    private final WorkDayRepository workDayRepository;

    public WorkDayQueryService(WorkDayRepository workDayRepository) {
        this.workDayRepository = workDayRepository;
    }

    /**
     * Return a {@link List} of {@link WorkDay} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<WorkDay> findByCriteria(WorkDayCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<WorkDay> specification = createSpecification(criteria);
        return workDayRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link WorkDay} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<WorkDay> findByCriteria(WorkDayCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<WorkDay> specification = createSpecification(criteria);
        return workDayRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(WorkDayCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<WorkDay> specification = createSpecification(criteria);
        return workDayRepository.count(specification);
    }

    /**
     * Function to convert ConsumerCriteria to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */    
    private Specification<WorkDay> createSpecification(WorkDayCriteria criteria) {
        Specification<WorkDay> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), WorkDay_.id));
            }
            if (criteria.getDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDate(), WorkDay_.date));
            }
            if (criteria.getWorkingEntryId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkingEntryId(),
                    root -> root.join(WorkDay_.workingEntries, JoinType.LEFT).get(WorkingEntry_.id)));
            }
            if (criteria.getWorkBreakId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkBreakId(),
                    root -> root.join(WorkDay_.workBreaks, JoinType.LEFT).get(WorkBreak_.id)));
            }
            if (criteria.getEmployeeId() != null) {
                specification = specification.and(buildSpecification(criteria.getEmployeeId(),
                    root -> root.join(WorkDay_.employee, JoinType.LEFT).get(Employee_.id)));
            }
        }
        return specification;
    }
}
