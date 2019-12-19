package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

	Optional<Employee> findOneByUser(User user);
	
	@EntityGraph(value = "Employee.weeklyWorkingHours")
	@Query("Select e from Employee e")
	List<Employee> findAllWithWeeklyWorkingHours();

	@Query(value = "SELECT" + 
			"	SUM(DATEDIFF_BIG(n, we.start, we.jhi_end) - wd.additional_break_minutes) AS workMinutes" + 
			" FROM [dbo].[work_day] AS wd" + 
			"	LEFT JOIN  [dbo].working_entry AS we ON wd.id = we.work_day_id" + 
			" WHERE" + 
			"	wd.employee_id =  ?1" +
			"   AND YEAR(wd.date) = ?2" + 
			"	AND MONTH(wd.date) = ?3" + 
			"	AND deleted_flag = 0" +
			" GROUP BY YEAR(wd.date), MONTH(wd.date)", nativeQuery = true)
	Optional<Integer> monthlyWorkMinutesOfEmployee(Long employeeID, int year, int month);
	
	@Query(value = "SELECT" + 
			"	SUM(DATEDIFF_BIG(n, we.start, we.jhi_end) - wd.additional_break_minutes) AS workMinutes" + 
			" FROM [dbo].[work_day] AS wd" + 
			"	LEFT JOIN  [dbo].working_entry AS we ON wd.id = we.work_day_id" + 
			" WHERE" + 
			"	wd.employee_id =  ?1" +
			"   AND YEAR(wd.date) = ?2" + 
			"	AND DATEPART(ISO_WEEK, wd.date) = ?3" + 
			"	AND deleted_flag = 0" +
			" GROUP BY YEAR(wd.date), DATEPART(ISO_WEEK, wd.date)", nativeQuery = true)
	Optional<Integer> weeklyWorkMinutesOfEmployee(Long employeeID, int year, int week);
}
