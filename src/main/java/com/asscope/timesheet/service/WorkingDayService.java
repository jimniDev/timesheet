package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.WorkingDay;
import com.asscope.timesheet.repository.WorkingDayRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link WorkingDay}.
 */
@Service
@Transactional
public class WorkingDayService {

    private final Logger log = LoggerFactory.getLogger(WorkingDayService.class);

    private final WorkingDayRepository workingDayRepository;

    public WorkingDayService(WorkingDayRepository workingDayRepository) {
        this.workingDayRepository = workingDayRepository;
    }

    /**
     * Save a workingDay.
     *
     * @param workingDay the entity to save.
     * @return the persisted entity.
     */
    public WorkingDay save(WorkingDay workingDay) {
        log.debug("Request to save WorkingDay : {}", workingDay);
        return workingDayRepository.save(workingDay);
    }

    /**
     * Get all the workingDays.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WorkingDay> findAll() {
        log.debug("Request to get all WorkingDays");
        return workingDayRepository.findAll();
    }


    /**
     * Get one workingDay by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WorkingDay> findOne(Long id) {
        log.debug("Request to get WorkingDay : {}", id);
        return workingDayRepository.findById(id);
    }

    /**
     * Delete the workingDay by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete WorkingDay : {}", id);
        workingDayRepository.deleteById(id);
    }
}
