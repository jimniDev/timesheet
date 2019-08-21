package com.asscope.timesheet.domain.monthlyInformation;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.asscope.timesheet.domain.WorkDay;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WorktimeInformation {
	
	@JsonIgnore
	private Map<Integer, Year> years;
	
	public WorktimeInformation(Collection<WorkDay> workDays) {
		this.years = new HashMap<>();
		for (WorkDay workDay: workDays) {
			int yearNumber = workDay.getDate().getYear();
			Year year = this.getYear(yearNumber);
			if (year == null) {
				year = new Year(yearNumber);
			}
			year.addWorkDay(workDay);
			this.years.put(yearNumber, year);
		}
	}
	
	@JsonProperty("years")
	public Collection<Year> toCollection() {
		return years.values();
	}
	
	public Year getYear(int year) {
		if (years.containsKey(year)){
			return years.get(year);
		}
		return null;
	}

	public Map<Integer, Year> getYears() {
		return years;
	}

	public void setYears(Map<Integer, Year> years) {
		this.years = years;
	}
	
	
}
