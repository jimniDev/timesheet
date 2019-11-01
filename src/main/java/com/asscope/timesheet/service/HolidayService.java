package com.asscope.timesheet.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Service
@Scope("singleton")
public class HolidayService {
	
	HashMap<Integer, List<Integer>> holidayMap = new HashMap<>();

	HolidayService() {
	}

	public LocalDate getEasterDate(int year) {
		int aYear = year % 19;
		int bYear = year % 4;
		int cYear = year % 7;
		int kYear = year / 100;
		int pYear = (13 + 8 * kYear) / 25;
		int qYear = kYear / 4;
		int mYear = (15 - pYear + kYear - qYear) % 30;
		int nYear = (4 + kYear - qYear) % 7;
		int dYear = (19 * aYear + mYear) % 30;
		int eYear = (2 * bYear + 4 * cYear + 6 * dYear + nYear) % 7;

		if (dYear == 29 && eYear == 6) {
			return LocalDate.of(year, 3, 22).plusDays(dYear + eYear).minusDays(7);
		} else
			return LocalDate.of(year, 3, 22).plusDays(dYear + eYear);
	}
	
	public boolean isHoliday(LocalDate date) {
		return isfixedHoliday(date) || isflexibleHoliday(date);
	}

	public boolean isfixedHoliday(LocalDate date) {	
		if(date.getMonthValue() == 1 && date.getDayOfMonth() == 1) {
			return true;
		}

		if(date.getMonthValue() == 1 && date.getDayOfMonth() == 1) {
			return true;
		}
		if(date.getMonthValue() == 5 && date.getDayOfMonth() == 1) {
			return true;
		}
		if(date.getMonthValue() == 10 && date.getDayOfMonth() == 3) {
			return true;
		}
		if(date.getMonthValue() == 12 ) {
			if(date.getDayOfMonth() == 24 || date.getDayOfMonth() == 25 || date.getDayOfMonth() == 26 || date.getDayOfMonth() == 31)
			return true;
		}
		
		return false;
	}

	public boolean isflexibleHoliday(LocalDate date) {
		List<Integer> holidays = this.holidayMap.get(date.getYear());
		if(holidays == null) {
			LocalDate easter = getEasterDate(date.getYear());
			holidays = new ArrayList<>();
			holidays.add(easter.plusDays(50).getDayOfYear());
			holidays.add(easter.plusDays(39).getDayOfYear());
			holidays.add(easter.plusDays(1).getDayOfYear());
			holidays.add(easter.plusDays(60).getDayOfYear());
			holidays.add(easter.minusDays(2).getDayOfYear());
			this.holidayMap.put(date.getYear(), holidays);
		} 
		return holidays.contains(date.getDayOfYear());		
	}

}
