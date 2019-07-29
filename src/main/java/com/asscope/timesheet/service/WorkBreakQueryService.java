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

import com.asscope.timesheet.domain.WorkBreak;
import com.asscope.timesheet.domain.*; // for static metamodels
import com.asscope.timesheet.repository.WorkBreakRepository;
import com.asscope.timesheet.service.dto.WorkBreakCriteria;

/**
 * Service for executing complex queries for {@link WorkBreak} entities in the database.
 * The main input is a {@link WorkBreakCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link WorkBreak} or a {@link Page} of {@link WorkBreak} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class WorkBreakQueryService extends QueryService<WorkBreak> {

    private final Logger log = LoggerFactory.getLogger(WorkBreakQueryService.class);

    private final WorkBreakRepository workBreakRepository;

    public WorkBreakQueryService(WorkBreakRepository workBreakRepository) {
        this.workBreakRepository = workBreakRepository;
    }

    /**
     * Return a {@link List} of {@link WorkBreak} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<WorkBreak> findByCriteria(WorkBreakCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<WorkBreak> specification = createSpecification(criteria);
        return workBreakRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link WorkBreak} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<WorkBreak> findByCriteria(WorkBreakCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<WorkBreak> specification = createSpecification(criteria);
        return workBreakRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(WorkBreakCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<WorkBreak> specification = createSpecification(criteria);
        return workBreakRepository.count(specification);
    }

    /**
     * Function to convert ConsumerCriteria to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */    
    private Specification<WorkBreak> createSpecification(WorkBreakCriteria criteria) {
        Specification<WorkBreak> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), WorkBreak_.id));
            }
            if (criteria.getMinutes() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getMinutes(), WorkBreak_.minutes));
            }
            if (criteria.getEmployeeId() != null) {
                specification = specification.and(buildSpecification(criteria.getEmployeeId(),
                    root -> root.join(WorkBreak_.employee, JoinType.LEFT).get(Employee_.id)));
            }
            if (criteria.getWorkDayId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkDayId(),
                    root -> root.join(WorkBreak_.workDay, JoinType.LEFT).get(WorkDay_.id)));
            }
        }
        return specification;
    }
}
