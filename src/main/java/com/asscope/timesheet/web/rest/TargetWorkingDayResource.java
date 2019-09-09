package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.TargetWorkingDay;
import com.asscope.timesheet.service.TargetWorkingDayService;
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
 * REST controller for managing {@link com.asscope.timesheet.domain.TargetWorkingDay}.
 */
@RestController
@RequestMapping("/api")
public class TargetWorkingDayResource {

    private final Logger log = LoggerFactory.getLogger(TargetWorkingDayResource.class);

    private static final String ENTITY_NAME = "targetWorkingDay";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TargetWorkingDayService targetWorkingDayService;

    public TargetWorkingDayResource(TargetWorkingDayService targetWorkingDayService) {
        this.targetWorkingDayService = targetWorkingDayService;
    }

    /**
     * {@code POST  /target-working-days} : Create a new targetWorkingDay.
     *
     * @param targetWorkingDay the targetWorkingDay to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new targetWorkingDay, or with status {@code 400 (Bad Request)} if the targetWorkingDay has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/target-working-days")
    public ResponseEntity<TargetWorkingDay> createTargetWorkingDay(@Valid @RequestBody TargetWorkingDay targetWorkingDay) throws URISyntaxException {
        log.debug("REST request to save TargetWorkingDay : {}", targetWorkingDay);
        if (targetWorkingDay.getId() != null) {
            throw new BadRequestAlertException("A new targetWorkingDay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TargetWorkingDay result = targetWorkingDayService.save(targetWorkingDay);
        return ResponseEntity.created(new URI("/api/target-working-days/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /target-working-days} : Updates an existing targetWorkingDay.
     *
     * @param targetWorkingDay the targetWorkingDay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated targetWorkingDay,
     * or with status {@code 400 (Bad Request)} if the targetWorkingDay is not valid,
     * or with status {@code 500 (Internal Server Error)} if the targetWorkingDay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/target-working-days")
    public ResponseEntity<TargetWorkingDay> updateTargetWorkingDay(@Valid @RequestBody TargetWorkingDay targetWorkingDay) throws URISyntaxException {
        log.debug("REST request to update TargetWorkingDay : {}", targetWorkingDay);
        if (targetWorkingDay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TargetWorkingDay result = targetWorkingDayService.save(targetWorkingDay);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, targetWorkingDay.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /target-working-days} : get all the targetWorkingDays.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of targetWorkingDays in body.
     */
    @GetMapping("/target-working-days")
    public ResponseEntity<List<TargetWorkingDay>> getAllTargetWorkingDays() {
        log.debug("REST request to get all TargetWorkingDays.");
        List<TargetWorkingDay> entityList = targetWorkingDayService.findAll();
        return ResponseEntity.ok().body(entityList);
    }

    /**
    * {@code GET  /target-working-days/count} : count all the targetWorkingDays.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
//    @GetMapping("/target-working-days/count")
//    public ResponseEntity<Long> countTargetWorkingDays(TargetWorkingDayCriteria criteria) {
//        log.debug("REST request to count TargetWorkingDays by criteria: {}", criteria);
//        return ResponseEntity.ok().body(targetWorkingDayQueryService.countByCriteria(criteria));
//    }

    /**
     * {@code GET  /target-working-days/:id} : get the "id" targetWorkingDay.
     *
     * @param id the id of the targetWorkingDay to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the targetWorkingDay, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/target-working-days/{id}")
    public ResponseEntity<TargetWorkingDay> getTargetWorkingDay(@PathVariable Long id) {
        log.debug("REST request to get TargetWorkingDay : {}", id);
        Optional<TargetWorkingDay> targetWorkingDay = targetWorkingDayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(targetWorkingDay);
    }

    /**
     * {@code DELETE  /target-working-days/:id} : delete the "id" targetWorkingDay.
     *
     * @param id the id of the targetWorkingDay to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/target-working-days/{id}")
    public ResponseEntity<Void> deleteTargetWorkingDay(@PathVariable Long id) {
        log.debug("REST request to delete TargetWorkingDay : {}", id);
        targetWorkingDayService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
