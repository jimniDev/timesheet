package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.service.WeeklyWorkingHoursService;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;
import com.asscope.timesheet.service.dto.WeeklyWorkingHoursCriteria;

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
 * REST controller for managing {@link com.asscope.timesheet.domain.WeeklyWorkingHours}.
 */
@RestController
@RequestMapping("/api")
public class WeeklyWorkingHoursResource {

    private final Logger log = LoggerFactory.getLogger(WeeklyWorkingHoursResource.class);

    private static final String ENTITY_NAME = "weeklyWorkingHours";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WeeklyWorkingHoursService weeklyWorkingHoursService;

    public WeeklyWorkingHoursResource(WeeklyWorkingHoursService weeklyWorkingHoursService) {
        this.weeklyWorkingHoursService = weeklyWorkingHoursService;
    }

    /**
     * {@code POST  /weekly-working-hours} : Create a new weeklyWorkingHours.
     *
     * @param weeklyWorkingHours the weeklyWorkingHours to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new weeklyWorkingHours, or with status {@code 400 (Bad Request)} if the weeklyWorkingHours has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/weekly-working-hours")
    public ResponseEntity<WeeklyWorkingHours> createWeeklyWorkingHours(@RequestBody WeeklyWorkingHours weeklyWorkingHours) throws URISyntaxException {
        log.debug("REST request to save WeeklyWorkingHours : {}", weeklyWorkingHours);
        if (weeklyWorkingHours.getId() != null) {
            throw new BadRequestAlertException("A new weeklyWorkingHours cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WeeklyWorkingHours result = weeklyWorkingHoursService.save(weeklyWorkingHours);
        return ResponseEntity.created(new URI("/api/weekly-working-hours/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /weekly-working-hours} : Updates an existing weeklyWorkingHours.
     *
     * @param weeklyWorkingHours the weeklyWorkingHours to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weeklyWorkingHours,
     * or with status {@code 400 (Bad Request)} if the weeklyWorkingHours is not valid,
     * or with status {@code 500 (Internal Server Error)} if the weeklyWorkingHours couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/weekly-working-hours")
    public ResponseEntity<WeeklyWorkingHours> updateWeeklyWorkingHours(@RequestBody WeeklyWorkingHours weeklyWorkingHours) throws URISyntaxException {
        log.debug("REST request to update WeeklyWorkingHours : {}", weeklyWorkingHours);
        if (weeklyWorkingHours.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WeeklyWorkingHours result = weeklyWorkingHoursService.save(weeklyWorkingHours);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, weeklyWorkingHours.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /weekly-working-hours} : get all the weeklyWorkingHours.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of weeklyWorkingHours in body.
     */
    @GetMapping("/weekly-working-hours")
    public ResponseEntity<List<WeeklyWorkingHours>> getAllWeeklyWorkingHours(WeeklyWorkingHoursCriteria criteria) {
        log.debug("REST request to get WeeklyWorkingHours by criteria: {}", criteria);
        List<WeeklyWorkingHours> entityList = weeklyWorkingHoursService.findAll();
        return ResponseEntity.ok().body(entityList);
    }

//    /**
//    * {@code GET  /weekly-working-hours/count} : count all the weeklyWorkingHours.
//    *
//    * @param criteria the criteria which the requested entities should match.
//    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
//    */
//    @GetMapping("/weekly-working-hours/count")
//    public ResponseEntity<Long> countWeeklyWorkingHours(WeeklyWorkingHoursCriteria criteria) {
//        log.debug("REST request to count WeeklyWorkingHours by criteria: {}", criteria);
//        return ResponseEntity.ok().body(weeklyWorkingHoursService.count());
//    }

    /**
     * {@code GET  /weekly-working-hours/:id} : get the "id" weeklyWorkingHours.
     *
     * @param id the id of the weeklyWorkingHours to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the weeklyWorkingHours, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/weekly-working-hours/{id}")
    public ResponseEntity<WeeklyWorkingHours> getWeeklyWorkingHours(@PathVariable Long id) {
        log.debug("REST request to get WeeklyWorkingHours : {}", id);
        Optional<WeeklyWorkingHours> weeklyWorkingHours = weeklyWorkingHoursService.findOne(id);
        return ResponseUtil.wrapOrNotFound(weeklyWorkingHours);
    }

    /**
     * {@code DELETE  /weekly-working-hours/:id} : delete the "id" weeklyWorkingHours.
     *
     * @param id the id of the weeklyWorkingHours to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/weekly-working-hours/{id}")
    public ResponseEntity<Void> deleteWeeklyWorkingHours(@PathVariable Long id) {
        log.debug("REST request to delete WeeklyWorkingHours : {}", id);
        weeklyWorkingHoursService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
