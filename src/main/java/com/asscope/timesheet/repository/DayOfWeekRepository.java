package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.DayOfWeek;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the DayOfWeek entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DayOfWeekRepository extends JpaRepository<DayOfWeek, Long>, JpaSpecificationExecutor<DayOfWeek> {

}
