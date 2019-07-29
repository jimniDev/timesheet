package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.WorkBreak;
import com.asscope.timesheet.repository.WorkBreakRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link WorkBreak}.
 */
@Service
@Transactional
public class WorkBreakService {

    private final Logger log = LoggerFactory.getLogger(WorkBreakService.class);

    private final WorkBreakRepository workBreakRepository;

    public WorkBreakService(WorkBreakRepository workBreakRepository) {
        this.workBreakRepository = workBreakRepository;
    }

    /**
     * Save a workBreak.
     *
     * @param workBreak the entity to save.
     * @return the persisted entity.
     */
    public WorkBreak save(WorkBreak workBreak) {
        log.debug("Request to save WorkBreak : {}", workBreak);
        return workBreakRepository.save(workBreak);
    }

    /**
     * Get all the workBreaks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WorkBreak> findAll() {
        log.debug("Request to get all WorkBreaks");
        return workBreakRepository.findAll();
    }


    /**
     * Get one workBreak by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WorkBreak> findOne(Long id) {
        log.debug("Request to get WorkBreak : {}", id);
        return workBreakRepository.findById(id);
    }

    /**
     * Delete the workBreak by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete WorkBreak : {}", id);
        workBreakRepository.deleteById(id);
    }
}
