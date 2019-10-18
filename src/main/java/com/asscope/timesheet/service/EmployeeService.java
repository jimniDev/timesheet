package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.User;
import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.repository.EmployeeRepository;
import com.asscope.timesheet.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.IsoFields;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service Implementation for managing {@link Employee}.
 */
@Service
@Transactional
public class EmployeeService {

    private final Logger log = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;
    
    private final UserRepository userRepository;
    
    private final HolidayService holidayService;

    public EmployeeService(EmployeeRepository employeeRepository, UserRepository userRepository, HolidayService holidayService) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.holidayService = holidayService;
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
    
    @Transactional(readOnly = true)
    public int targetWorkTime(Principal principal, int year, int month) {
    	Employee employee = this.findOneByUsername(principal.getName()).get();
    	YearMonth yearMonth = YearMonth.of(year, month);
    	return yearMonth.atDay(1).datesUntil(yearMonth.atEndOfMonth().plusDays(1L))
    	.filter(date -> !date.getDayOfWeek().equals(DayOfWeek.SATURDAY) && !date.getDayOfWeek().equals(DayOfWeek.SUNDAY) && !this.holidayService.isfixedHoliday(date) && !this.holidayService.isflexibleHoliday(date))
    	.map(workDay -> getTargetWorkMinutesForDate(employee, workDay))
    	.reduce(0, Integer::sum);
    }
    
    @Transactional(readOnly = true)
    public long getWorkTimeMinutes(Principal principal, int year, int month) {
    	Optional<Employee> employee = this.findOneByUsername(principal.getName());
    	if (employee.isPresent()) {
    		return employee.get().getWorkDays().stream()
    				.filter(wd -> wd.getDate().getYear() == year && wd.getDate().getMonthValue() == month)
    				.map(wd -> wd.getTotalWorkingMinutes())
    				.reduce(0L, Long::sum);
    	} else {
    		return 0L;
    	}
    }
    
	@Transactional(readOnly = true)
	public long targetWorkTimeMinutes(Principal principal, Integer year, Integer month, Integer day) {
		Optional<Employee> employee = this.findOneByUsername(principal.getName());
		LocalDate date = LocalDate.of(year, month, day);
		if (employee.isPresent()) {
			return employee.get()
					.getWeeklyWorkingHours()
					.stream()
					.filter(wwh -> (wwh.getStartDate().isBefore(date) || wwh.getStartDate().equals(date)) && (wwh.getEndDate() == null || wwh.getEndDate().isAfter(date) || wwh.getEndDate().equals(date)))
					.map(wwh -> wwh.getHours() * 60L / 5L)
					.findFirst()
					.orElse(0L);
		} else {
			return 0L;
		}
	}
	
    @Transactional(readOnly = true)
    public long weeklyWorkTimeMinutes(Principal principal, int year, int isoWeek) {
    	Optional<Employee> employee = this.findOneByUsername(principal.getName());
    	if (employee.isPresent()) {
    		return employee.get().getWorkDays().stream()
    				.filter(wd -> wd.getDate().get(IsoFields.WEEK_BASED_YEAR) == year && wd.getDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) == isoWeek)
    				.map(wd -> {
    					return wd.getTotalWorkingMinutes();
    					}
    				)
    				.reduce(0L, Long::sum);
    	} else {
    		return 0L;
    	}
    }

	@Transactional(readOnly = true)
	public long weeklyTargetWorktimeMinutes(Principal principal, int year, int isoWeek) {
		Optional<Employee> employee = this.findOneByUsername(principal.getName());
		if (employee.isPresent()) {
			return getWorkingDatesOfIsoWeek(year, isoWeek)
			.stream()
			.filter(date -> !holidayService.isHoliday(date))
			.map(workDay -> (long) getTargetWorkMinutesForDate(employee.get(), workDay))
	    	.reduce(0L, Long::sum);	
		}
		return 0L;
	}
	
	public Set<LocalDate> getWorkingDatesOfIsoWeek(int year, int isoWeek) {
		Set<LocalDate> dates = new HashSet<>();
		for(DayOfWeek dayOW: DayOfWeek.values()) {
			if(!dayOW.equals(DayOfWeek.SATURDAY) && !dayOW.equals(DayOfWeek.SUNDAY)) {
				dates.add(LocalDate.ofYearDay(year, 125)
				.with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, isoWeek)
				.with(dayOW));
			}
		}
		return dates;
	}
}
