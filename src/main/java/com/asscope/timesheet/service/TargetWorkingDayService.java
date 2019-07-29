package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.TargetWorkingDay;
import com.asscope.timesheet.repository.TargetWorkingDayRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link TargetWorkingDay}.
 */
@Service
@Transactional
public class TargetWorkingDayService {

    private final Logger log = LoggerFactory.getLogger(TargetWorkingDayService.class);

    private final TargetWorkingDayRepository targetWorkingDayRepository;

    public TargetWorkingDayService(TargetWorkingDayRepository targetWorkingDayRepository) {
        this.targetWorkingDayRepository = targetWorkingDayRepository;
    }

    /**
     * Save a targetWorkingDay.
     *
     * @param targetWorkingDay the entity to save.
     * @return the persisted entity.
     */
    public TargetWorkingDay save(TargetWorkingDay targetWorkingDay) {
        log.debug("Request to save TargetWorkingDay : {}", targetWorkingDay);
        return targetWorkingDayRepository.save(targetWorkingDay);
    }

    /**
     * Get all the targetWorkingDays.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TargetWorkingDay> findAll() {
        log.debug("Request to get all TargetWorkingDays");
        return targetWorkingDayRepository.findAll();
    }


    /**
     * Get one targetWorkingDay by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TargetWorkingDay> findOne(Long id) {
        log.debug("Request to get TargetWorkingDay : {}", id);
        return targetWorkingDayRepository.findById(id);
    }

    /**
     * Delete the targetWorkingDay by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TargetWorkingDay : {}", id);
        targetWorkingDayRepository.deleteById(id);
    }
}
