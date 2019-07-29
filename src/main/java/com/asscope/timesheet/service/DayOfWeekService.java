package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.DayOfWeek;
import com.asscope.timesheet.repository.DayOfWeekRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link DayOfWeek}.
 */
@Service
@Transactional
public class DayOfWeekService {

    private final Logger log = LoggerFactory.getLogger(DayOfWeekService.class);

    private final DayOfWeekRepository dayOfWeekRepository;

    public DayOfWeekService(DayOfWeekRepository dayOfWeekRepository) {
        this.dayOfWeekRepository = dayOfWeekRepository;
    }

    /**
     * Save a dayOfWeek.
     *
     * @param dayOfWeek the entity to save.
     * @return the persisted entity.
     */
    public DayOfWeek save(DayOfWeek dayOfWeek) {
        log.debug("Request to save DayOfWeek : {}", dayOfWeek);
        return dayOfWeekRepository.save(dayOfWeek);
    }

    /**
     * Get all the dayOfWeeks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<DayOfWeek> findAll() {
        log.debug("Request to get all DayOfWeeks");
        return dayOfWeekRepository.findAll();
    }


    /**
     * Get one dayOfWeek by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<DayOfWeek> findOne(Long id) {
        log.debug("Request to get DayOfWeek : {}", id);
        return dayOfWeekRepository.findById(id);
    }

    /**
     * Delete the dayOfWeek by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete DayOfWeek : {}", id);
        dayOfWeekRepository.deleteById(id);
    }
}
