package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WeeklyWorkingHours;

import java.time.LocalDate;
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
	
	@Query("Select wwh from WeeklyWorkingHours wwh where wwh.employee = ?1 and (wwh.startDate between ?2 and ?3 OR wwh.endDate between ?2 and ?3 or (wwh.startDate <= ?2 AND (wwh.endDate is null or wwh.endDate >= ?3)))")
	Set<WeeklyWorkingHours> findByEmployeeBetweenDates(Employee employee, LocalDate start, LocalDate end);

}
