package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkDay;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkDay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkDayRepository extends JpaRepository<WorkDay, Long>, JpaSpecificationExecutor<WorkDay> {
	
	Optional<WorkDay> findByEmployeeAndDate(Employee employee, LocalDate date);
	
	Set<WorkDay> findAllByEmployee(Employee employee);
}
