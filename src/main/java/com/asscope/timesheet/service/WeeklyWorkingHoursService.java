package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.repository.WeeklyWorkingHoursRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link WeeklyWorkingHours}.
 */
@Service
@Transactional
public class WeeklyWorkingHoursService {

    private final Logger log = LoggerFactory.getLogger(WeeklyWorkingHoursService.class);

    private final WeeklyWorkingHoursRepository weeklyWorkingHoursRepository;

    public WeeklyWorkingHoursService(WeeklyWorkingHoursRepository weeklyWorkingHoursRepository) {
        this.weeklyWorkingHoursRepository = weeklyWorkingHoursRepository;
    }

    /**
     * Save a weeklyWorkingHours.
     *
     * @param weeklyWorkingHours the entity to save.
     * @return the persisted entity.
     */
    public WeeklyWorkingHours save(WeeklyWorkingHours weeklyWorkingHours) {
        log.debug("Request to save WeeklyWorkingHours : {}", weeklyWorkingHours);
        return weeklyWorkingHoursRepository.save(weeklyWorkingHours);
    }

    /**
     * Get all the weeklyWorkingHours.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WeeklyWorkingHours> findAll() {
        log.debug("Request to get all WeeklyWorkingHours");
        return weeklyWorkingHoursRepository.findAll();
    }


    /**
     * Get one weeklyWorkingHours by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WeeklyWorkingHours> findOne(Long id) {
        log.debug("Request to get WeeklyWorkingHours : {}", id);
        return weeklyWorkingHoursRepository.findById(id);
    }

    /**
     * Delete the weeklyWorkingHours by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete WeeklyWorkingHours : {}", id);
        weeklyWorkingHoursRepository.deleteById(id);
    }
}
