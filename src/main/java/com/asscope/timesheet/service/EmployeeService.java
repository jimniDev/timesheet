package com.asscope.timesheet.service;

import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.User;
import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.repository.EmployeeRepository;
import com.asscope.timesheet.repository.UserRepository;
import com.asscope.timesheet.repository.WeeklyWorkingHoursRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.IsoFields;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.stream.IntStream;

/**
 * Service Implementation for managing {@link Employee}.
 */
@Service
@Transactional
public class EmployeeService {

	private final Logger log = LoggerFactory.getLogger(EmployeeService.class);

	private final EmployeeRepository employeeRepository;

	private final UserRepository userRepository;

	private final WeeklyWorkingHoursRepository wwhRepository;

	private final HolidayService holidayService;

	public EmployeeService(EmployeeRepository employeeRepository, UserRepository userRepository,
			WeeklyWorkingHoursRepository wwhRepository, HolidayService holidayService) {
		this.employeeRepository = employeeRepository;
		this.userRepository = userRepository;
		this.wwhRepository = wwhRepository;
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

	@Transactional(readOnly = true)
	public int getTargetWorkTimeMinutes(String userId, int year, int month) {
		Employee employee = this.findOneByUsername(userId).get();
		YearMonth yearMonth = YearMonth.of(year, month);
		return targetWorktimeMinutes(employee, yearMonth.atDay(1), yearMonth.atEndOfMonth());
	}

	@Transactional(readOnly = true)
	public int getWorkTimeMinutes(String userId, int year, int month) {
		Optional<Employee> employee = this.findOneByUsername(userId);
		if (employee.isPresent()) {
			Optional<Integer> minutes = employeeRepository.monthlyWorkMinutesOfEmployee(employee.get().getId(), year,
					month);
			if (minutes.isPresent()) {
				return minutes.get();
			}
		}
		return 0;
	}

	@Transactional(readOnly = true)
	public int weeklyWorkTimeMinutes(String userId, int year, int isoWeek) {
		Optional<Employee> employee = this.findOneByUsername(userId);
		if (employee.isPresent()) {
			Optional<Integer> minutes = employeeRepository.weeklyWorkMinutesOfEmployee(employee.get().getId(), year,
					isoWeek);
			if (minutes.isPresent()) {
				return minutes.get();
			}
		}
		return 0;
	}

	@Transactional(readOnly = true)
	public int weeklyTargetWorktimeMinutes(String userId, int year, int isoWeek) {
		Optional<Employee> employee = this.findOneByUsername(userId);
		if (employee.isPresent()) {
			SortedSet<LocalDate> dates = getWorkingDatesOfIsoWeek(year, isoWeek);
			return targetWorktimeMinutes(employee.get(), dates.first(), dates.last());
		}
		return 0;
	}

	@Transactional(readOnly = true)
	public int targetWorktimeMinutes(Employee employee, LocalDate start, LocalDate end) {
		final Set<WeeklyWorkingHours> wwhs = wwhRepository.findByEmployeeBetweenDates(employee, start, end);
		final SortedSet<LocalDate> holidays = holidayService.getHolidayDatesBetween(start, end);

		return start
				.datesUntil(end.plusDays(1L)).filter(d -> !d.getDayOfWeek().equals(DayOfWeek.SATURDAY)
						&& !d.getDayOfWeek().equals(DayOfWeek.SUNDAY) && !holidays.contains(d))
				.map(d -> targetTime(wwhs, d)).reduce(0, Integer::sum);
	}

	private int targetTime(Set<WeeklyWorkingHours> wwhs, LocalDate date) {
		for (WeeklyWorkingHours wwh : wwhs) {
			if ((wwh.getStartDate().isBefore(date) || wwh.getStartDate().equals(date))
					&& (wwh.getEndDate() == null || wwh.getEndDate().isAfter(date) || wwh.getEndDate().equals(date))) {
				return wwh.getHours() * 60 / 5;
			}
		}
		return 0;
	}

	@Transactional(readOnly = true)
	public int currentWorktimeBalance(String userId) {
		YearMonth currentMonth = YearMonth.now();
		// Optional<Long> oBalance = this.wbCache.get(userId, currentMonth);
		return worktimeBalance(userId, currentMonth);
		// if (oBalance.isPresent()) {
		// return oBalance.get();
		// } else {
		// Long balance = worktimeBalance(userId, currentMonth);
		// this.wbCache.set(userId, currentMonth, balance);
		// return balance;
		// }
	}

	@Transactional(readOnly = true)
	public int worktimeBalance(String userId, YearMonth currentMonth) {
		return IntStream.range(1, currentMonth.getMonthValue())
				.map(month -> this.getWorkTimeMinutes(userId, currentMonth.getYear(), month)
						- this.getTargetWorkTimeMinutes(userId, currentMonth.getYear(), month))
				.reduce(0, Integer::sum);
	}

	private SortedSet<LocalDate> getWorkingDatesOfIsoWeek(int year, int isoWeek) {
		SortedSet<LocalDate> dates = new TreeSet<>();
		for (DayOfWeek dayOW : DayOfWeek.values()) {
			if (!dayOW.equals(DayOfWeek.SATURDAY) && !dayOW.equals(DayOfWeek.SUNDAY)) {
				dates.add(LocalDate.ofYearDay(year, 125).with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, isoWeek).with(dayOW));
			}
		}
		return dates;
	}

	public int targetWorkTimeMinutes(String userId, Integer year, Integer month, Integer day) {
		Optional<Employee> employee = this.findOneByUsername(userId);
		if (employee.isPresent()) {
			LocalDate date = LocalDate.of(year, month, day);
			return targetWorktimeMinutes(employee.get(), date, date);
		}
		return 0;
	}

	@Transactional(readOnly = true)
	public HashMap<Integer, Integer> getAllMonthlyBalancesByYear(String name, Integer year) {
		HashMap<Integer, Integer> monthBalance = new HashMap<Integer, Integer>();
		if (year == YearMonth.now().getYear()) {
			for (int i = 1; i < YearMonth.now().getMonthValue() + 1; i++) {
				monthBalance.put(i,
						this.getWorkTimeMinutes(name, year, i) - this.getTargetWorkTimeMinutes(name, year, i));
			}
		} else {
			for (int i = 1; i < 13; i++) {
				monthBalance.put(i,
						this.getWorkTimeMinutes(name, year, i) - this.getTargetWorkTimeMinutes(name, year, i));
			}
		}
		return monthBalance;
	}

}
