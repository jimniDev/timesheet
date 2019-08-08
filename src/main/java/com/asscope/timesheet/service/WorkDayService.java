package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.repository.WorkDayRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link WorkDay}.
 */
@Service
@Transactional
public class WorkDayService {

    private final Logger log = LoggerFactory.getLogger(WorkDayService.class);

    private final WorkDayRepository workDayRepository;

    public WorkDayService(WorkDayRepository workDayRepository) {
        this.workDayRepository = workDayRepository;
    }
    
    /**
     * Save a workDay.
     *
     * @param workDay the entity to save.
     * @return the persisted entity.
     */
    public WorkDay save(WorkDay workDay) {
        log.debug("Request to save WorkDay : {}", workDay);
        return workDayRepository.save(workDay);
    }

    /**
     * Get all the workDays.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WorkDay> findAll() {
        log.debug("Request to get all WorkDays");
        return workDayRepository.findAll();
    }


    /**
     * Get one workDay by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WorkDay> findOne(Long id) {
        log.debug("Request to get WorkDay : {}", id);
        return workDayRepository.findById(id);
    }

    /**
     * Delete the workDay by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete WorkDay : {}", id);
        workDayRepository.deleteById(id);
    }
    
    /**
     * Get the current WorkDay from an employee. If there is no current WorkDay, one will be created.
     * @param employee
     * @return the current WorkDay
     */
    public WorkDay currentWorkDay(Employee employee) {
    	WorkDay workDay;
    	Optional<WorkDay> oWorkDay = workDayRepository.findByEmployeeAndDate(employee, LocalDate.now());
    	if (oWorkDay.isEmpty()) {
    		workDay = new WorkDay();
    		workDay.setDate(LocalDate.now());
    		workDay.setEmployee(employee);
    		workDay = workDayRepository.save(workDay);
    	} else {
    		workDay = oWorkDay.get();
    	}
    	return workDay;
    }
}
