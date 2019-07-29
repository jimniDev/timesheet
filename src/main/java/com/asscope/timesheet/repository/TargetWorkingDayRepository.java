package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.TargetWorkingDay;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TargetWorkingDay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TargetWorkingDayRepository extends JpaRepository<TargetWorkingDay, Long>, JpaSpecificationExecutor<TargetWorkingDay> {

}
