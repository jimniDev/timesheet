package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.User;
import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.domain.monthlyInformation.WorktimeInformation;
import com.asscope.timesheet.repository.EmployeeRepository;
import com.asscope.timesheet.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Employee}.
 */
@Service
@Transactional
public class EmployeeService {

    private final Logger log = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;
    
    private final UserRepository userRepository;
    
    private final CacheManager cacheManager;

    public EmployeeService(EmployeeRepository employeeRepository, UserRepository userRepository, CacheManager cacheManager) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.cacheManager = cacheManager;
    }

	/**
     * Save a employee.
     *
     * @param employee the entity to save.
     * @return the persisted entity.
     */
    public Employee save(Employee employee) {
        log.debug("Request to save Employee : {}", employee);
        Employee queriedEmployee = employeeRepository.findById(employee.getId()).get();
        employee.setUser(queriedEmployee.getUser());
        return employeeRepository.save(employee);
    }

    /**
     * Get all the employees.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Employee> findAll() {
        log.debug("Request to get all Employees");
        return employeeRepository.findAllWithWeeklyWorkingHours();
    }
    
    @Transactional(readOnly = true)
    public Optional<WorktimeInformation> getWorkTimeInformation(long employeeID, Optional<Integer> optionalYear) {
        Objects.requireNonNull(cacheManager.getCache(com.asscope.timesheet.domain.Employee.class.getName() + ".workDays")).clear();
    	Optional<Employee> queriedEmployee = employeeRepository.findById(employeeID);
    	if (queriedEmployee.isPresent()) {
    		Employee employee = queriedEmployee.get();
    		if (optionalYear.isPresent()) {
    			int year = optionalYear.get();
    			List<WorkDay> filteredWorkDays = employee.getWorkDays().stream().filter(wd -> wd.getDate().getYear() == year).collect(Collectors.toList());
    			WorktimeInformation wtInfo = new WorktimeInformation(filteredWorkDays); 
    			return Optional.of(wtInfo);
    		} else {
    			WorktimeInformation wtInfo = new WorktimeInformation(employee.getWorkDays());
    			return Optional.of(wtInfo);
    		}
    	} else {
        	return Optional.empty();
    	}
    }
    
    @Transactional(readOnly = true)
    public Optional<WorktimeInformation> getWorkTimeInformation(Principal principal, Optional<Integer> optionalYear) {
    	Optional<Employee> employee = this.findOneByUsername(principal.getName());
    	if (employee.isPresent()) {
    		return this.getWorkTimeInformation(employee.get().getId(), optionalYear);
    	} else {
    		return Optional.empty();
    	}
    }


    /**
     * Get one employee by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Employee> findOne(Long id) {
        log.debug("Request to get Employee : {}", id);
        return employeeRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Employee> findOneByUsername(String name) {
        log.debug("Request to get Employee : {}", name);
        User user = userRepository.findById(name).get();
        return employeeRepository.findOneByUser(user);
    }

    /**
     * Delete the employee by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Employee : {}", id);
        employeeRepository.deleteById(id);
    }
    
    public int getTargetWorkMinutesForDate(Employee employee, LocalDate date) {
    	Optional<WeeklyWorkingHours> oWwh = employee.getWeeklyWorkingHours().stream().filter(wwh -> (wwh.getStartDate().isBefore(date) || wwh.getStartDate().equals(date)) && (wwh.getEndDate() == null || wwh.getEndDate().isAfter(date))).findFirst();
    	if (oWwh.isPresent()) {
    		return (oWwh.get().getHours() * 60) / 5;
    	} else {
    		return 0;
    	}
    }
    
    public int targetWorkTime(Principal principal, int year, int month) {
    	Employee employee = this.findOneByUsername(principal.getName()).get();
    	YearMonth yearMonth = YearMonth.of(year, month);
    	return yearMonth.atDay(1).datesUntil(yearMonth.atEndOfMonth())
    	.filter(date -> !date.getDayOfWeek().equals(DayOfWeek.SATURDAY) && !date.getDayOfWeek().equals(DayOfWeek.SUNDAY))
    	.map(workDay -> getTargetWorkMinutesForDate(employee, workDay)).reduce(0, Integer::sum);
    }
}
