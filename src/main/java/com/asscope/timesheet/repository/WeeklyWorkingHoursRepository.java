package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.WeeklyWorkingHours;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WeeklyWorkingHours entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeeklyWorkingHoursRepository extends JpaRepository<WeeklyWorkingHours, Long>, JpaSpecificationExecutor<WeeklyWorkingHours> {

}
