//package com.asscope.timesheet.service;
//
//import java.util.List;
//
//import javax.persistence.criteria.JoinType;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import io.github.jhipster.service.QueryService;
//
//import com.asscope.timesheet.domain.WeeklyWorkingHours;
//import com.asscope.timesheet.domain.*; // for static metamodels
//import com.asscope.timesheet.repository.WeeklyWorkingHoursRepository;
//import com.asscope.timesheet.service.dto.WeeklyWorkingHoursCriteria;
//
///**
// * Service for executing complex queries for {@link WeeklyWorkingHours} entities in the database.
// * The main input is a {@link WeeklyWorkingHoursCriteria} which gets converted to {@link Specification},
// * in a way that all the filters must apply.
// * It returns a {@link List} of {@link WeeklyWorkingHours} or a {@link Page} of {@link WeeklyWorkingHours} which fulfills the criteria.
// */
//@Service
//@Transactional(readOnly = true)
//public class WeeklyWorkingHoursQueryService extends QueryService<WeeklyWorkingHours> {
//
//    private final Logger log = LoggerFactory.getLogger(WeeklyWorkingHoursQueryService.class);
//
//    private final WeeklyWorkingHoursRepository weeklyWorkingHoursRepository;
//
//    public WeeklyWorkingHoursQueryService(WeeklyWorkingHoursRepository weeklyWorkingHoursRepository) {
//        this.weeklyWorkingHoursRepository = weeklyWorkingHoursRepository;
//    }
//
//    /**
//     * Return a {@link List} of {@link WeeklyWorkingHours} which matches the criteria from the database.
//     * @param criteria The object which holds all the filters, which the entities should match.
//     * @return the matching entities.
//     */
//    @Transactional(readOnly = true)
//    public List<WeeklyWorkingHours> findByCriteria(WeeklyWorkingHoursCriteria criteria) {
//        log.debug("find by criteria : {}", criteria);
//        final Specification<WeeklyWorkingHours> specification = createSpecification(criteria);
//        return weeklyWorkingHoursRepository.findAll(specification);
//    }
//
//    /**
//     * Return a {@link Page} of {@link WeeklyWorkingHours} which matches the criteria from the database.
//     * @param criteria The object which holds all the filters, which the entities should match.
//     * @param page The page, which should be returned.
//     * @return the matching entities.
//     */
//    @Transactional(readOnly = true)
//    public Page<WeeklyWorkingHours> findByCriteria(WeeklyWorkingHoursCriteria criteria, Pageable page) {
//        log.debug("find by criteria : {}, page: {}", criteria, page);
//        final Specification<WeeklyWorkingHours> specification = createSpecification(criteria);
//        return weeklyWorkingHoursRepository.findAll(specification, page);
//    }
//
//    /**
//     * Return the number of matching entities in the database.
//     * @param criteria The object which holds all the filters, which the entities should match.
//     * @return the number of matching entities.
//     */
//    @Transactional(readOnly = true)
//    public long countByCriteria(WeeklyWorkingHoursCriteria criteria) {
//        log.debug("count by criteria : {}", criteria);
//        final Specification<WeeklyWorkingHours> specification = createSpecification(criteria);
//        return weeklyWorkingHoursRepository.count(specification);
//    }
//
//    /**
//     * Function to convert ConsumerCriteria to a {@link Specification}
//     * @param criteria The object which holds all the filters, which the entities should match.
//     * @return the matching {@link Specification} of the entity.
//     */    
//    private Specification<WeeklyWorkingHours> createSpecification(WeeklyWorkingHoursCriteria criteria) {
//        Specification<WeeklyWorkingHours> specification = Specification.where(null);
//        if (criteria != null) {
//            if (criteria.getId() != null) {
//                specification = specification.and(buildSpecification(criteria.getId(), WeeklyWorkingHours_.id));
//            }
//            if (criteria.getHours() != null) {
//                specification = specification.and(buildRangeSpecification(criteria.getHours(), WeeklyWorkingHours_.hours));
//            }
//            if (criteria.getStartDate() != null) {
//                specification = specification.and(buildRangeSpecification(criteria.getStartDate(), WeeklyWorkingHours_.startDate));
//            }
//            if (criteria.getEndDate() != null) {
//                specification = specification.and(buildRangeSpecification(criteria.getEndDate(), WeeklyWorkingHours_.endDate));
//            }
//            if (criteria.getEmployeeId() != null) {
//                specification = specification.and(buildSpecification(criteria.getEmployeeId(),
//                    root -> root.join(WeeklyWorkingHours_.employee, JoinType.LEFT).get(Employee_.id)));
//            }
//        }
//        return specification;
//    }
//}
