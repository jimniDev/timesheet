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

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.*; // for static metamodels
import com.asscope.timesheet.repository.EmployeeRepository;
import com.asscope.timesheet.service.dto.EmployeeCriteria;

/**
 * Service for executing complex queries for {@link Employee} entities in the database.
 * The main input is a {@link EmployeeCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Employee} or a {@link Page} of {@link Employee} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class EmployeeQueryService extends QueryService<Employee> {

    private final Logger log = LoggerFactory.getLogger(EmployeeQueryService.class);

    private final EmployeeRepository employeeRepository;

    public EmployeeQueryService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Return a {@link List} of {@link Employee} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Employee> findByCriteria(EmployeeCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Employee> specification = createSpecification(criteria);
        return employeeRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Employee} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Employee> findByCriteria(EmployeeCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Employee> specification = createSpecification(criteria);
        return employeeRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(EmployeeCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Employee> specification = createSpecification(criteria);
        return employeeRepository.count(specification);
    }

    /**
     * Function to convert ConsumerCriteria to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */    
    private Specification<Employee> createSpecification(EmployeeCriteria criteria) {
        Specification<Employee> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), Employee_.id));
            }
            if (criteria.getIsEmployed() != null) {
                specification = specification.and(buildSpecification(criteria.getIsEmployed(), Employee_.isEmployed));
            }
            if (criteria.getWorkingEntryId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkingEntryId(),
                    root -> root.join(Employee_.workingEntries, JoinType.LEFT).get(WorkingEntry_.id)));
            }
            if (criteria.getTargetWorkingDayId() != null) {
                specification = specification.and(buildSpecification(criteria.getTargetWorkingDayId(),
                    root -> root.join(Employee_.targetWorkingDays, JoinType.LEFT).get(TargetWorkingDay_.id)));
            }
            if (criteria.getWeeklyWorkingHoursId() != null) {
                specification = specification.and(buildSpecification(criteria.getWeeklyWorkingHoursId(),
                    root -> root.join(Employee_.weeklyWorkingHours, JoinType.LEFT).get(WeeklyWorkingHours_.id)));
            }
            if (criteria.getWorkDayId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkDayId(),
                    root -> root.join(Employee_.workDays, JoinType.LEFT).get(WorkDay_.id)));
            }
            if (criteria.getWorkBreakId() != null) {
                specification = specification.and(buildSpecification(criteria.getWorkBreakId(),
                    root -> root.join(Employee_.workBreaks, JoinType.LEFT).get(WorkBreak_.id)));
            }
        }
        return specification;
    }
}
