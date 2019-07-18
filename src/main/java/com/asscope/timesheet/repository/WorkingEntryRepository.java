package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.WorkingEntry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkingEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkingEntryRepository extends JpaRepository<WorkingEntry, Long> {

}
