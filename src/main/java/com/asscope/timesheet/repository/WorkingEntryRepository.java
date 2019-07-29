package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.WorkingEntry;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkingEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkingEntryRepository extends JpaRepository<WorkingEntry, Long>, JpaSpecificationExecutor<WorkingEntry> {
	
	@Query("SELECT w FROM WorkingEntry w WHERE w.deleteFlag = false")
	List<WorkingEntry> findAllActiveWorkingEntries();
}
