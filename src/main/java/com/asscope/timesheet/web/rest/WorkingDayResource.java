package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.WorkingDay;
import com.asscope.timesheet.service.WorkingDayService;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.asscope.timesheet.domain.WorkingDay}.
 */
@RestController
@RequestMapping("/api")
public class WorkingDayResource {

    private final Logger log = LoggerFactory.getLogger(WorkingDayResource.class);

    private static final String ENTITY_NAME = "workingDay";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkingDayService workingDayService;

    public WorkingDayResource(WorkingDayService workingDayService) {
        this.workingDayService = workingDayService;
    }

    /**
     * {@code POST  /working-days} : Create a new workingDay.
     *
     * @param workingDay the workingDay to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workingDay, or with status {@code 400 (Bad Request)} if the workingDay has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/working-days")
    public ResponseEntity<WorkingDay> createWorkingDay(@RequestBody WorkingDay workingDay) throws URISyntaxException {
        log.debug("REST request to save WorkingDay : {}", workingDay);
        if (workingDay.getId() != null) {
            throw new BadRequestAlertException("A new workingDay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkingDay result = workingDayService.save(workingDay);
        return ResponseEntity.created(new URI("/api/working-days/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /working-days} : Updates an existing workingDay.
     *
     * @param workingDay the workingDay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workingDay,
     * or with status {@code 400 (Bad Request)} if the workingDay is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workingDay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/working-days")
    public ResponseEntity<WorkingDay> updateWorkingDay(@RequestBody WorkingDay workingDay) throws URISyntaxException {
        log.debug("REST request to update WorkingDay : {}", workingDay);
        if (workingDay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WorkingDay result = workingDayService.save(workingDay);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workingDay.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /working-days} : get all the workingDays.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workingDays in body.
     */
    @GetMapping("/working-days")
    public List<WorkingDay> getAllWorkingDays() {
        log.debug("REST request to get all WorkingDays");
        return workingDayService.findAll();
    }

    /**
     * {@code GET  /working-days/:id} : get the "id" workingDay.
     *
     * @param id the id of the workingDay to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workingDay, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/working-days/{id}")
    public ResponseEntity<WorkingDay> getWorkingDay(@PathVariable Long id) {
        log.debug("REST request to get WorkingDay : {}", id);
        Optional<WorkingDay> workingDay = workingDayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(workingDay);
    }

    /**
     * {@code DELETE  /working-days/:id} : delete the "id" workingDay.
     *
     * @param id the id of the workingDay to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/working-days/{id}")
    public ResponseEntity<Void> deleteWorkingDay(@PathVariable Long id) {
        log.debug("REST request to delete WorkingDay : {}", id);
        workingDayService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
