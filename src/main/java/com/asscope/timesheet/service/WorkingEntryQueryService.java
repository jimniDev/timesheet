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

import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.domain.*; // for static metamodels
import com.asscope.timesheet.repository.WorkingEntryRepository;
import com.asscope.timesheet.service.dto.WorkingEntryCriteria;

/**
 * Service for executing complex queries for {@link WorkingEntry} entities in the database.
 * The main input is a {@link WorkingEntryCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link WorkingEntry} or a {@link Page} of {@link WorkingEntry} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class WorkingEntryQueryService extends QueryService<WorkingEntry> {

    private final Logger log = LoggerFactory.getLogger(WorkingEntryQueryService.class);

    private final WorkingEntryRepository workingEntryRepository;

    public WorkingEntryQueryService(WorkingEntryRepository workingEntryRepository) {
        this.workingEntryRepository = workingEntryRepository;
    }

    /**
     * Return a {@link List} of {@link WorkingEntry} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<WorkingEntry> findByCriteria(WorkingEntryCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<WorkingEntry> specification = createSpecification(criteria);
        return workingEntryRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link WorkingEntry} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<WorkingEntry> findByCriteria(WorkingEntryCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<WorkingEntry> specification = createSpecification(criteria);
        return workingEntryRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(WorkingEntryCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<WorkingEntry> specification = createSpecification(criteria);
        return workingEntryRepository.count(specification);
    }

    /**
     * Function to convert ConsumerCriteria to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */    
    private Specification<WorkingEntry> createSpecification(WorkingEntryCriteria criteria) {
        Specification<WorkingEntry> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), WorkingEntry_.id));
            }
            if (criteria.getStart() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getStart(), WorkingEntry_.start));
            }
            if (criteria.getEnd() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getEnd(), WorkingEntry_.end));
            }
            if (criteria.getDeleteFlag() != null) {
                specification = specification.and(buildSpecification(criteria.getDeleteFlag(), WorkingEntry_.deleteFlag));
            }
            if (criteria.getLockedFlag() != null) {
                specification = specification.and(buildSpecification(criteria.getLockedFlag(), WorkingEntry_.lockedFlag));
            }
//            if (criteria.getCreatedAt() != null) {
//                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), WorkingEntry_.createdAt));
//            }
            if (criteria.getEmployeeId() != null) {
                specification = specification.and(buildSpecification(criteria.getEmployeeId(),
                    root -> root.join(WorkingEntry_.employee, JoinType.LEFT).get(Employee_.id)));
            }
            if (criteria.getActivityId() != null) {
                specification = specification.and(buildSpecification(criteria.getActivityId(),
                    root -> root.join(WorkingEntry_.activity, JoinType.LEFT).get(Activity_.id)));
            }
            if (criteria.getWorkDayId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkDayId(),
                    root -> root.join(WorkingEntry_.workDay, JoinType.LEFT).get(WorkDay_.id)));
            }
            if (criteria.getLocationId() != null) {
                specification = specification.and(buildSpecification(criteria.getLocationId(),
                    root -> root.join(WorkingEntry_.location, JoinType.LEFT).get(Location_.id)));
            }
        }
        return specification;
    }
}
