package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.repository.WorkDayRepository;
import com.asscope.timesheet.repository.WorkingEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link WorkingEntry}.
 */
@Service
@Transactional
public class WorkingEntryService {

    private final Logger log = LoggerFactory.getLogger(WorkingEntryService.class);
    
    private final EmployeeService employeeService;
    
    private final WorkDayService workDayService;

    private final WorkingEntryRepository workingEntryRepository;

    public WorkingEntryService(WorkingEntryRepository workingEntryRepository, 
    		EmployeeService employeeService, 
    		WorkDayRepository workDayRepository,
    		WorkDayService workDayService) {
        this.workingEntryRepository = workingEntryRepository;
        this.employeeService = employeeService;
        this.workDayService = workDayService;
    }

    /**
     * Save a workingEntry.
     *
     * @param workingEntry the entity to save.
     * @return the persisted entity.
     */
    public WorkingEntry save(WorkingEntry workingEntry) {
        log.debug("Request to save WorkingEntry : {}", workingEntry);
        if (workingEntry.getWorkDay() == null) {
        	WorkDay workDay = workDayService.currentWorkDay(workingEntry.getEmployee());
        	workingEntry.setWorkDay(workDay);
        }
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
        workingEntryRepository.findById(id).ifPresent((we) -> {
        	we.setDeleteFlag(true);
        });
    }
    
    /**
     * TODO TBD
     * @param username
     * @return
     */
    public WorkingEntry startForEmployee(String username) {
    	Employee employee = employeeService.findOneByUsername(username).get();
    	Instant now = Instant.now();
    	WorkDay workDay;
    	WorkingEntry workingEntry;
    	Optional<WorkingEntry> oWorkingEntry = workingEntryRepository
    			.findStartedWorkingEntryByEmployeeAndDate(employee, LocalDate.now());
    	if (oWorkingEntry.isEmpty()) {
    		workDay = workDayService.currentWorkDay(employee);   		
        	workingEntry = new WorkingEntry();
        	workingEntry.setEmployee(employee);
        	workingEntry.setStart(now);
        	workingEntry.deleteFlag(false);
        	workingEntry.lockedFlag(false);
        	workingEntry.setWorkDay(workDay);
        	return workingEntryRepository.save(workingEntry);
    	} else {
    		workingEntry = oWorkingEntry.get();
    		return workingEntry;
    	}

    }
    
    /**
     * TODO TBD
     * @param username
     * @return
     */
    public Optional<WorkingEntry> stopForEmployee(String username) {
    	Employee employee = employeeService.findOneByUsername(username).get();
    	Instant now = Instant.now();
    	Optional<WorkingEntry> oWorkingEntry = workingEntryRepository
    			.findStartedWorkingEntryByEmployeeAndDate(employee, LocalDate.now());
    	if (!oWorkingEntry.isEmpty()) {
    		oWorkingEntry.get().setEnd(now);
    	}
    	return oWorkingEntry;
    }
    
    /**
     * TODO TBD
     * @param name
     * @return
     */
    @Transactional(readOnly = true)
	public Optional<WorkingEntry> getActiveFromEmployee(String name) {
		Employee employee = employeeService.findOneByUsername(name).get();
		return workingEntryRepository
				.findStartedWorkingEntryByEmployeeAndDate(employee, LocalDate.now());
	}
}
