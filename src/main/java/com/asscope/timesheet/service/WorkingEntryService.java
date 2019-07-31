package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.repository.WorkingEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link WorkingEntry}.
 */
@Service
@Transactional
public class WorkingEntryService {

    private final Logger log = LoggerFactory.getLogger(WorkingEntryService.class);

    private final WorkingEntryRepository workingEntryRepository;

    public WorkingEntryService(WorkingEntryRepository workingEntryRepository) {
        this.workingEntryRepository = workingEntryRepository;
    }

    /**
     * Save a workingEntry.
     *
     * @param workingEntry the entity to save.
     * @return the persisted entity.
     */
    public WorkingEntry save(WorkingEntry workingEntry) {
        log.debug("Request to save WorkingEntry : {}", workingEntry);
        return workingEntryRepository.save(workingEntry);
    }

    /**
     * Get all the workingEntries.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WorkingEntry> findAll() {
        log.debug("Request to get all WorkingEntries");
        return workingEntryRepository.findAllActiveWorkingEntries();
    }
    
    @Transactional(readOnly = true)
    public List<WorkingEntry> findAllByEmployee(Employee employee) {
        log.debug("Request to get all WorkingEntries");
        return workingEntryRepository.findAllActiveWorkingEntriesByEmployee(employee);
    }


    /**
     * Get one workingEntry by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WorkingEntry> findOne(Long id) {
        log.debug("Request to get WorkingEntry : {}", id);
        return workingEntryRepository.findById(id);
    }

    /**
     * Delete the workingEntry by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete WorkingEntry : {}", id);
        //workingEntryRepository.deleteById(id);
        workingEntryRepository.findById(id).ifPresent((we) -> {
        	we.setDeleteFlag(true);
        });
    }
}
