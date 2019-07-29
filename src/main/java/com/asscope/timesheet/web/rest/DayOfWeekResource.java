package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.DayOfWeek;
import com.asscope.timesheet.service.DayOfWeekService;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;
import com.asscope.timesheet.service.dto.DayOfWeekCriteria;
import com.asscope.timesheet.service.DayOfWeekQueryService;

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
 * REST controller for managing {@link com.asscope.timesheet.domain.DayOfWeek}.
 */
@RestController
@RequestMapping("/api")
public class DayOfWeekResource {

    private final Logger log = LoggerFactory.getLogger(DayOfWeekResource.class);

    private static final String ENTITY_NAME = "dayOfWeek";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DayOfWeekService dayOfWeekService;

    private final DayOfWeekQueryService dayOfWeekQueryService;

    public DayOfWeekResource(DayOfWeekService dayOfWeekService, DayOfWeekQueryService dayOfWeekQueryService) {
        this.dayOfWeekService = dayOfWeekService;
        this.dayOfWeekQueryService = dayOfWeekQueryService;
    }

    /**
     * {@code POST  /day-of-weeks} : Create a new dayOfWeek.
     *
     * @param dayOfWeek the dayOfWeek to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dayOfWeek, or with status {@code 400 (Bad Request)} if the dayOfWeek has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/day-of-weeks")
    public ResponseEntity<DayOfWeek> createDayOfWeek(@Valid @RequestBody DayOfWeek dayOfWeek) throws URISyntaxException {
        log.debug("REST request to save DayOfWeek : {}", dayOfWeek);
        if (dayOfWeek.getId() != null) {
            throw new BadRequestAlertException("A new dayOfWeek cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DayOfWeek result = dayOfWeekService.save(dayOfWeek);
        return ResponseEntity.created(new URI("/api/day-of-weeks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /day-of-weeks} : Updates an existing dayOfWeek.
     *
     * @param dayOfWeek the dayOfWeek to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dayOfWeek,
     * or with status {@code 400 (Bad Request)} if the dayOfWeek is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dayOfWeek couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/day-of-weeks")
    public ResponseEntity<DayOfWeek> updateDayOfWeek(@Valid @RequestBody DayOfWeek dayOfWeek) throws URISyntaxException {
        log.debug("REST request to update DayOfWeek : {}", dayOfWeek);
        if (dayOfWeek.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DayOfWeek result = dayOfWeekService.save(dayOfWeek);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dayOfWeek.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /day-of-weeks} : get all the dayOfWeeks.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dayOfWeeks in body.
     */
    @GetMapping("/day-of-weeks")
    public ResponseEntity<List<DayOfWeek>> getAllDayOfWeeks(DayOfWeekCriteria criteria) {
        log.debug("REST request to get DayOfWeeks by criteria: {}", criteria);
        List<DayOfWeek> entityList = dayOfWeekQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
    * {@code GET  /day-of-weeks/count} : count all the dayOfWeeks.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
    @GetMapping("/day-of-weeks/count")
    public ResponseEntity<Long> countDayOfWeeks(DayOfWeekCriteria criteria) {
        log.debug("REST request to count DayOfWeeks by criteria: {}", criteria);
        return ResponseEntity.ok().body(dayOfWeekQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /day-of-weeks/:id} : get the "id" dayOfWeek.
     *
     * @param id the id of the dayOfWeek to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dayOfWeek, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/day-of-weeks/{id}")
    public ResponseEntity<DayOfWeek> getDayOfWeek(@PathVariable Long id) {
        log.debug("REST request to get DayOfWeek : {}", id);
        Optional<DayOfWeek> dayOfWeek = dayOfWeekService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dayOfWeek);
    }

    /**
     * {@code DELETE  /day-of-weeks/:id} : delete the "id" dayOfWeek.
     *
     * @param id the id of the dayOfWeek to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/day-of-weeks/{id}")
    public ResponseEntity<Void> deleteDayOfWeek(@PathVariable Long id) {
        log.debug("REST request to delete DayOfWeek : {}", id);
        dayOfWeekService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
