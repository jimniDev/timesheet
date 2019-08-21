package com.asscope.timesheet.domain.monthlyInformation;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.asscope.timesheet.domain.WorkDay;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Year {
	
	
	private Map<String, Month> months;
	
	private int year;
	
	@JsonIgnore
	private List<WorkDay> workDays;
	
//	public Year(List<WorkDay> workdays, int year) {
//		this.months = new Month[12];
//		this.year = year;
//	}
	
	public Year(int year) {
		this.months = new HashMap<>();
		this.year = year;
		this.workDays = new ArrayList<WorkDay>();
	}
	
	public Month getMonth(int i) {
		return getMonth(java.time.Month.of(i));
	}
	
	public Month getMonth(java.time.Month name) {
		if (months.containsKey(name.name())) {
			return months.get(name.name());
		}
		return null;
	}
	
	@JsonProperty("months")
	public Collection<Month> toCollection() {
		return months.values();
	}
	
	public void setMonth(Month month) {
//		int idx = months.indexOf(month);
//		if (idx == -1) {
//			months.add(month);
//		} else {
//			months.add(idx, month);
//		}
		String key = month.getName().name();
		if (months.containsKey(key)) {
			months.replace(key, month);
		} else {
			months.put(key, month);
		}
	}
	
	public void addWorkDay(WorkDay workDay) {
		int monthNumber = workDay.getDate().getMonth().getValue();
		Month month = this.getMonth(monthNumber);
		if (month == null) {
			month = new Month(this, workDay.getDate().getMonth());
		}
		month.addWorkDay(workDay);
		this.setMonth(month);
	}

	public Map<String, Month> getMonths() {
		return months;
	}

	public void setMonths(Map<String, Month> months) {
		this.months = months;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public List<WorkDay> getWorkDays() {
		return workDays;
	}

	public void setWorkDays(List<WorkDay> workDays) {
		this.workDays = workDays;
	}
	
}
