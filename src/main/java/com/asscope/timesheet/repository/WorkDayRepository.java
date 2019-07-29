package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.WorkDay;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkDay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkDayRepository extends JpaRepository<WorkDay, Long>, JpaSpecificationExecutor<WorkDay> {

}
