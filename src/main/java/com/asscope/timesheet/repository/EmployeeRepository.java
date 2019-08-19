package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.User;

import java.util.List;
import java.util.Optional;

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

}
