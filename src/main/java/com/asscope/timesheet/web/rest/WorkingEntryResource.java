package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.service.WorkingEntryService;
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

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.asscope.timesheet.domain.WorkingEntry}.
 */
@RestController
@RequestMapping("/api")
public class WorkingEntryResource {

    private final Logger log = LoggerFactory.getLogger(WorkingEntryResource.class);

    private static final String ENTITY_NAME = "workingEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkingEntryService workingEntryService;

    public WorkingEntryResource(WorkingEntryService workingEntryService) {
        this.workingEntryService = workingEntryService;
    }

    /**
     * {@code POST  /working-entries} : Create a new workingEntry.
     *
     * @param workingEntry the workingEntry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workingEntry, or with status {@code 400 (Bad Request)} if the workingEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/working-entries")
    public ResponseEntity<WorkingEntry> createWorkingEntry(@Valid @RequestBody WorkingEntry workingEntry) throws URISyntaxException {
        log.debug("REST request to save WorkingEntry : {}", workingEntry);
        if (workingEntry.getId() != null) {
            throw new BadRequestAlertException("A new workingEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkingEntry result = workingEntryService.save(workingEntry);
        return ResponseEntity.created(new URI("/api/working-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /working-entries} : Updates an existing workingEntry.
     *
     * @param workingEntry the workingEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workingEntry,
     * or with status {@code 400 (Bad Request)} if the workingEntry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workingEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/working-entries")
    public ResponseEntity<WorkingEntry> updateWorkingEntry(@Valid @RequestBody WorkingEntry workingEntry) throws URISyntaxException {
        log.debug("REST request to update WorkingEntry : {}", workingEntry);
        if (workingEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WorkingEntry result = workingEntryService.save(workingEntry);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workingEntry.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /working-entries} : get all the workingEntries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workingEntries in body.
     */
    @GetMapping("/working-entries")
    public List<WorkingEntry> getAllWorkingEntries() {
        log.debug("REST request to get all WorkingEntries");
        return workingEntryService.findAll();
    }

    /**
     * {@code GET  /working-entries/:id} : get the "id" workingEntry.
     *
     * @param id the id of the workingEntry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workingEntry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/working-entries/{id}")
    public ResponseEntity<WorkingEntry> getWorkingEntry(@PathVariable Long id) {
        log.debug("REST request to get WorkingEntry : {}", id);
        Optional<WorkingEntry> workingEntry = workingEntryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(workingEntry);
    }

    /**
     * {@code DELETE  /working-entries/:id} : delete the "id" workingEntry.
     *
     * @param id the id of the workingEntry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/working-entries/{id}")
    public ResponseEntity<Void> deleteWorkingEntry(@PathVariable Long id) {
        log.debug("REST request to delete WorkingEntry : {}", id);
        workingEntryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
