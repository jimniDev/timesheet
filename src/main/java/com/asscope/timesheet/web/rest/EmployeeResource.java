package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.service.EmployeeService;
import com.asscope.timesheet.service.dto.EmployeeDTO;
import com.asscope.timesheet.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * {@code PUT  /employees} : Updates an existing employee.
     *
     * @param employee the employee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employee,
     * or with status {@code 400 (Bad Request)} if the employee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the employee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        log.debug("REST request to get all Employees");
        List<Employee> entityList = employeeService.findAll();
        return ResponseEntity.ok().body(entityList.stream().map(e -> mapToDto(e)).collect(Collectors.toList()));
    }
    
    private EmployeeDTO mapToDto(Employee employee) {
    	EmployeeDTO eDTO = new EmployeeDTO();
    	eDTO.setUser(employee.getUser());
    	eDTO.setId(employee.getId());
    	eDTO.setEditPermitted(employee.isEditPermitted());
    	eDTO.setWeeklyWorkingHours(employee.getWeeklyWorkingHours());
    	eDTO.setBalance(employeeService.currentWorktimeBalance(employee.getUser().getId()));
    	return eDTO;
    }

    /**
     * {@code GET  /employees/:id} : get the "id" employee.
     *
     * @param id the id of the employee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the employee, or with status {@code 404 (Not Found)}.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        log.debug("REST request to get Employee : {}", id);
        Optional<Employee> employee = employeeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(employee);
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping({"/employees/me/target-work-time/{year}/{month}"})
    public ResponseEntity<Integer> getTargetWorktimeInformation(Principal principal, @PathVariable("year") Integer year, @PathVariable("month") Integer month) {
    	log.debug("REST request to get worktimeInformation for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.getTargetWorkTimeMinutes(principal.getName(), year, month));
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping({"/employees/me/work-time/{year}/{month}"})
    public ResponseEntity<Integer> getWorktimeInformation(Principal principal, @PathVariable("year") Integer year, @PathVariable("month") Integer month) {
    	log.debug("REST request to get worktime in minutes for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.getWorkTimeMinutes(principal.getName(), year, month));
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping({"/employees/me/target-work-time/{year}/{month}/{day}"})
    public ResponseEntity<Integer> getTargetWorktimeInformation(Principal principal, @PathVariable("year") Integer year, @PathVariable("month") Integer month, @PathVariable("day") Integer day) {
    	log.debug("REST request to get worktimeInformation for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.targetWorkTimeMinutes(principal.getName(), year, month, day));
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/employees/me/target-work-time/{year}/iso-week/{isoWeek}")
    public ResponseEntity<Integer> getTargetWorktimeInformation(Principal principal, @PathVariable("year") int year, @PathVariable("isoWeek") int isoWeek) {
    	log.debug("REST request to get weekly worktimeInformation for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.weeklyTargetWorktimeMinutes(principal.getName(), year, isoWeek));
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/employees/me/work-time/{year}/iso-week/{isoWeek}")
    public ResponseEntity<Integer> getWorktimeInformation(Principal principal, @PathVariable("year") int year, @PathVariable("isoWeek") int isoWeek) {
    	log.debug("REST request to get weekly worktimeInformation for Employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.weeklyWorkTimeMinutes(principal.getName(), year, isoWeek));
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/employees/me/work-time/balance")
    public ResponseEntity<Integer> currentBalance(Principal principal) {
    	log.debug("REST request to get current worktime balance for employee : {}", principal.getName());
    	return ResponseEntity.ok().body(employeeService.currentWorktimeBalance(principal.getName()));
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping("/employees/{id}/work-time/balance")
    public ResponseEntity<Integer> currentBalance(@PathVariable long id) {
    	log.debug("REST request to get current worktime balance for employee : {}", id);
    	Optional<Employee> employee = employeeService.findOne(id);
    	if (employee.isPresent()) {
        	return ResponseEntity.ok().body(employeeService.currentWorktimeBalance(employee.get().getUser().getId()));
    	} else {
    		return ResponseEntity.notFound().build();
    	}

    }
}
