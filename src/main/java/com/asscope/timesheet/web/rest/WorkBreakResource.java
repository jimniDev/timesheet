package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.WorkBreak;
import com.asscope.timesheet.service.WorkBreakService;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;
import com.asscope.timesheet.service.dto.WorkBreakCriteria;
import com.asscope.timesheet.service.WorkBreakQueryService;

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
 * REST controller for managing {@link com.asscope.timesheet.domain.WorkBreak}.
 */
@RestController
@RequestMapping("/api")
public class WorkBreakResource {

    private final Logger log = LoggerFactory.getLogger(WorkBreakResource.class);

    private static final String ENTITY_NAME = "workBreak";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkBreakService workBreakService;

    private final WorkBreakQueryService workBreakQueryService;

    public WorkBreakResource(WorkBreakService workBreakService, WorkBreakQueryService workBreakQueryService) {
        this.workBreakService = workBreakService;
        this.workBreakQueryService = workBreakQueryService;
    }

    /**
     * {@code POST  /work-breaks} : Create a new workBreak.
     *
     * @param workBreak the workBreak to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workBreak, or with status {@code 400 (Bad Request)} if the workBreak has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/work-breaks")
    public ResponseEntity<WorkBreak> createWorkBreak(@Valid @RequestBody WorkBreak workBreak) throws URISyntaxException {
        log.debug("REST request to save WorkBreak : {}", workBreak);
        if (workBreak.getId() != null) {
            throw new BadRequestAlertException("A new workBreak cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkBreak result = workBreakService.save(workBreak);
        return ResponseEntity.created(new URI("/api/work-breaks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /work-breaks} : Updates an existing workBreak.
     *
     * @param workBreak the workBreak to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workBreak,
     * or with status {@code 400 (Bad Request)} if the workBreak is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workBreak couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/work-breaks")
    public ResponseEntity<WorkBreak> updateWorkBreak(@Valid @RequestBody WorkBreak workBreak) throws URISyntaxException {
        log.debug("REST request to update WorkBreak : {}", workBreak);
        if (workBreak.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WorkBreak result = workBreakService.save(workBreak);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workBreak.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /work-breaks} : get all the workBreaks.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workBreaks in body.
     */
    @GetMapping("/work-breaks")
    public ResponseEntity<List<WorkBreak>> getAllWorkBreaks(WorkBreakCriteria criteria) {
        log.debug("REST request to get WorkBreaks by criteria: {}", criteria);
        List<WorkBreak> entityList = workBreakQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
    * {@code GET  /work-breaks/count} : count all the workBreaks.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
    @GetMapping("/work-breaks/count")
    public ResponseEntity<Long> countWorkBreaks(WorkBreakCriteria criteria) {
        log.debug("REST request to count WorkBreaks by criteria: {}", criteria);
        return ResponseEntity.ok().body(workBreakQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /work-breaks/:id} : get the "id" workBreak.
     *
     * @param id the id of the workBreak to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workBreak, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/work-breaks/{id}")
    public ResponseEntity<WorkBreak> getWorkBreak(@PathVariable Long id) {
        log.debug("REST request to get WorkBreak : {}", id);
        Optional<WorkBreak> workBreak = workBreakService.findOne(id);
        return ResponseUtil.wrapOrNotFound(workBreak);
    }

    /**
     * {@code DELETE  /work-breaks/:id} : delete the "id" workBreak.
     *
     * @param id the id of the workBreak to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/work-breaks/{id}")
    public ResponseEntity<Void> deleteWorkBreak(@PathVariable Long id) {
        log.debug("REST request to delete WorkBreak : {}", id);
        workBreakService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
