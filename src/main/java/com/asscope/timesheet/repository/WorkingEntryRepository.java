package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.domain.WorkingEntry;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkingEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkingEntryRepository extends JpaRepository<WorkingEntry, Long>, JpaSpecificationExecutor<WorkingEntry> {
	
	@Query("SELECT w FROM WorkingEntry w WHERE w.deleted = false")
	List<WorkingEntry> findAllActiveWorkingEntries();
	
	@Query("SELECT w FROM WorkingEntry w WHERE w.deleted = false AND w.employee = :employee")
	List<WorkingEntry> findAllActiveWorkingEntriesByEmployee(@Param("employee") Employee employee);
	
	@Query("SELECT w FROM WorkingEntry w WHERE w.deleted = false AND w.employee = :employee AND w.workDay.date = :date AND w.end IS NULL")
	Optional<WorkingEntry> findStartedWorkingEntryByEmployeeAndDate(@Param("employee") Employee employee, @Param("date") LocalDate date);
}
