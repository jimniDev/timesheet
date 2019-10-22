package com.asscope.timesheet.service;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

@Service
public class HolidayService {

	ArrayList<LocalDate> fixedHolidayList = new ArrayList<LocalDate>();
	ArrayList<LocalDate> flexibleHolidayList = new ArrayList<LocalDate>();

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
		fixedHolidayList.add(LocalDate.of(date.getYear(), 1, 1)); // New Year's Day
		fixedHolidayList.add(LocalDate.of(date.getYear(), 5, 1)); // Labour Day
		fixedHolidayList.add(LocalDate.of(date.getYear(), 10, 3)); // German Unity Day
		fixedHolidayList.add(LocalDate.of(date.getYear(), 12, 25)); // Christmas Day
		fixedHolidayList.add(LocalDate.of(date.getYear(), 12, 26)); // St Stephens Day
		fixedHolidayList.add(LocalDate.of(date.getYear(), 12, 24)); // Christmas Eve
		fixedHolidayList.add(LocalDate.of(date.getYear(), 12, 31)); // New Years Eve

		if (fixedHolidayList.indexOf(date) != -1) {
			return true;
		}
		return false;
	}

	public boolean isflexibleHoliday(LocalDate date) {
		LocalDate myDate = this.getEasterDate(date.getYear());

		flexibleHolidayList.add(myDate.plusDays(50));// Whit Monday
		flexibleHolidayList.add(myDate.plusDays(39));// Ascension day
		flexibleHolidayList.add(myDate.plusDays(1));//  Easter Monday
		flexibleHolidayList.add(myDate.plusDays(60));// Corpus Christi
		flexibleHolidayList.add(myDate.minusDays(2));// Good Friday

		if (flexibleHolidayList.indexOf(date) != -1) {
			return true;
		}
		return false;
	}

}
