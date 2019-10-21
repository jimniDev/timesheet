package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.service.EmployeeService;
import com.asscope.timesheet.service.WorkDayService;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.asscope.timesheet.domain.WorkDay}.
 */
@RestController
@RequestMapping("/api")
public class WorkDayResource {

    private final Logger log = LoggerFactory.getLogger(WorkDayResource.class);

    private static final String ENTITY_NAME = "workDay";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkDayService workDayService;
    private final EmployeeService employeeService;

    public WorkDayResource(WorkDayService workDayService, EmployeeService employeeService) {
		this.employeeService = employeeService;
		this.workDayService = workDayService;
	
    }

    /**
     * {@code POST  /work-days} : Create a new workDay.
     *
     * @param workDay the workDay to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workDay, or with status {@code 400 (Bad Request)} if the workDay has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/work-days")
    public ResponseEntity<WorkDay> createWorkDay(@Valid @RequestBody WorkDay workDay) throws URISyntaxException {
        log.debug("REST request to save WorkDay : {}", workDay);
        if (workDay.getId() != null) {
            throw new BadRequestAlertException("A new workDay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkDay result = workDayService.save(workDay);
        return ResponseEntity.created(new URI("/api/work-days/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /work-days} : Updates an existing workDay.
     *
     * @param workDay the workDay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workDay,
     * or with status {@code 400 (Bad Request)} if the workDay is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workDay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/work-days")
    public ResponseEntity<WorkDay> updateWorkDay(@Valid @RequestBody WorkDay workDay) throws URISyntaxException {
        log.debug("REST request to update WorkDay : {}", workDay);
        if (workDay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WorkDay result = workDayService.save(workDay);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workDay.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /work-days} : get all the workDays.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workDays in body.
     */
    @GetMapping("/work-days")
    public ResponseEntity<List<WorkDay>> getAllWorkDays() {
        log.debug("REST request to get all WorkDays");
        List<WorkDay> entityList = workDayService.findAll();
        return ResponseEntity.ok().body(entityList);
    }

    /**
    * {@code GET  /work-days/count} : count all the workDays.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
//    @GetMapping("/work-days/count")
//    public ResponseEntity<Long> countWorkDays(WorkDayCriteria criteria) {
//        log.debug("REST request to count WorkDays by criteria: {}", criteria);
//        return ResponseEntity.ok().body(workDayQueryService.countByCriteria(criteria));
//    }

    /**
     * {@code GET  /work-days/:id} : get the "id" workDay.
     *
     * @param id the id of the workDay to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workDay, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/work-days/{id}")
    public ResponseEntity<WorkDay> getWorkDay(@PathVariable Long id) {
        log.debug("REST request to get WorkDay : {}", id);
        Optional<WorkDay> workDay = workDayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(workDay);
    }

    /**
     * {@code DELETE  /work-days/:id} : delete the "id" workDay.
     *
     * @param id the id of the workDay to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/work-days/{id}")
    public ResponseEntity<Void> deleteWorkDay(@PathVariable Long id) {
        log.debug("REST request to delete WorkDay : {}", id);
        workDayService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    @GetMapping("/work-days/{id}/break-minutes")
    public ResponseEntity<Integer> getBreakMinutes(@PathVariable Long id, Principal principal) {
    	return ResponseUtil.wrapOrNotFound(workDayService.getBreakMinutes(id));
    }
    
    @GetMapping("/employees/me/work-days/year/{year}/month/{month}/day/{dayOfMonth}")
    public ResponseEntity<Integer> getAdditionalBreakMinutesByDate(Principal principal, @PathVariable("year") int year, @PathVariable("month") int month, @PathVariable("dayOfMonth") int dayOfMonth) {
    	Employee employee = employeeService.findOneByUsername(principal.getName()).get();
    	log.debug("REST request to get Additional Break Minutes by Date : {}", LocalDate.of(year, month, dayOfMonth));
    	return ResponseUtil.wrapOrNotFound(workDayService.findByEmployeeAndDate(employee, LocalDate.of(year, month, dayOfMonth)).map(wd->wd.getAdditionalBreakMinutes()));
    }
}
