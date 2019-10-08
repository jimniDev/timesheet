package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.monthlyInformation.WorktimeInformation;
import com.asscope.timesheet.service.EmployeeService;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.asscope.timesheet.domain.Employee}.
 */
@RestController
@RequestMapping("/api")
public class EmployeeResource {

    private final Logger log = LoggerFactory.getLogger(EmployeeResource.class);

    private static final String ENTITY_NAME = "employee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmployeeService employeeService;

    public EmployeeResource(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * {@code POST  /employees} : Create a new employee.
     *
     * @param employee the employee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new employee, or with status {@code 400 (Bad Request)} if the employee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PostMapping("/employees")
//    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) throws URISyntaxException {
//        log.debug("REST request to save Employee : {}", employee);
//        if (employee.getId() != null) {
//            throw new BadRequestAlertException("A new employee cannot already have an ID", ENTITY_NAME, "idexists");
//        }
//        Employee result = employeeService.save(employee);
//        return ResponseEntity.created(new URI("/api/employees/" + result.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
//            .body(result);
//    }

    /**
     * {@code PUT  /employees} : Updates an existing employee.
     *
     * @param employee the employee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employee,
     * or with status {@code 400 (Bad Request)} if the employee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the employee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/employees")
    public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee) throws URISyntaxException {
        log.debug("REST request to update Employee : {}", employee);
        if (employee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Employee result = employeeService.save(employee);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employee.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /employees} : get all the employees.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employees in body.
     */
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        log.debug("REST request to get all Employees");
        List<Employee> entityList = employeeService.findAll();
        return ResponseEntity.ok().body(entityList);
    }

    /**
    * {@code GET  /employees/count} : count all the employees.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
//    @GetMapping("/employees/count")
//    public ResponseEntity<Long> countEmployees(EmployeeCriteria criteria) {
//        log.debug("REST request to count Employees by criteria: {}", criteria);
//        return ResponseEntity.ok().body(employeeQueryService.countByCriteria(criteria));
//    }

    /**
     * {@code GET  /employees/:id} : get the "id" employee.
     *
     * @param id the id of the employee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the employee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        log.debug("REST request to get Employee : {}", id);
        Optional<Employee> employee = employeeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(employee);
    }

    /**
     * {@code DELETE  /employees/:id} : delete the "id" employee.
     *
     * @param id the id of the employee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.debug("REST request to delete Employee : {}", id);
        employeeService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
//    @GetMapping({"/employees/{id}/worktime", "/employees/{id}/worktime/{year}"})
//    public ResponseEntity<WorktimeInformation> getWorktimeInformation(@PathVariable("id") Long id, @PathVariable("year") Optional<Integer> year) {
//    	log.debug("REST request to get worktimeInformation for Employee : {}", id);
//    	Optional<WorktimeInformation> wtInfo = employeeService.getWorkTimeInformation(id, year);
//    	return ResponseUtil.wrapOrNotFound(wtInfo);
//    }
//    
//    @GetMapping({"/employees/me/worktime", "/employees/me/worktime/{year}"})
//    public ResponseEntity<WorktimeInformation> getWorktimeInformation(Principal principal, @PathVariable("year") Optional<Integer> year) {
//    	log.debug("REST request to get worktimeInformation for Employee : {}", principal.getName());
//    	Optional<WorktimeInformation> wtInfo = employeeService.getWorkTimeInformation(principal, year);
//    	return ResponseUtil.wrapOrNotFound(wtInfo);
//    }
    
    @GetMapping({"/employees/me/target-work-time/{year}/{month}"})
    public ResponseEntity<Integer> getTargetWorktimeInformation(Principal principal, @PathVariable("year") Integer year, @PathVariable("month") Integer month) {
    	log.debug("REST request to get worktimeInformation for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.targetWorkTime(principal, year, month));
    }
    
    @GetMapping({"/employees/me/work-time/{year}/{month}"})
    public ResponseEntity<Long> getWorktimeInformation(Principal principal, @PathVariable("year") Integer year, @PathVariable("month") Integer month) {
    	log.debug("REST request to get worktime in minutes for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.getWorkTimeMinutes(principal, year, month));
    }
    
    @GetMapping({"/employees/me/target-work-time/{year}/{month}/{day}"})
    public ResponseEntity<Long> getTargetWorktimeInformation(Principal principal, @PathVariable("year") Integer year, @PathVariable("month") Integer month, @PathVariable("day") Integer day) {
    	log.debug("REST request to get worktimeInformation for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.targetWorkTimeMinutes(principal, year, month, day));
    }
}
