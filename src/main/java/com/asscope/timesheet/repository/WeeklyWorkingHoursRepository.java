package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WeeklyWorkingHours;

import java.util.Set;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WeeklyWorkingHours entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeeklyWorkingHoursRepository extends JpaRepository<WeeklyWorkingHours, Long>, JpaSpecificationExecutor<WeeklyWorkingHours> {
	Set<WeeklyWorkingHours> findAllByEmployee(Employee employee);
}
