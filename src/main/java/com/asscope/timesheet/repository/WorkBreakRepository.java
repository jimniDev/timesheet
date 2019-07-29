package com.asscope.timesheet.repository;

import com.asscope.timesheet.domain.WorkBreak;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkBreak entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkBreakRepository extends JpaRepository<WorkBreak, Long>, JpaSpecificationExecutor<WorkBreak> {

}
