package com.asscope.timesheet.domain.monthlyInformation;

import java.util.ArrayList;
import java.util.List;

import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.domain.WorkDay;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Month {
	
	@JsonIgnore
	private Year year;
	
	@JsonIgnore
	private List<WeeklyWorkingHours> weeklyWorkingHours;
	
	private int targetWorkingMinutes;
	
	//private int actualWorkingMinutes;
	
	@JsonIgnore
	private List<WorkDay> workDays;
	
	private java.time.Month name;
	
	public Month(Year year, java.time.Month name, List<WorkDay> workDays, List<WeeklyWorkingHours> weeklyWorkingHours) {
		this.year = year;
		this.workDays = workDays;
		this.weeklyWorkingHours = weeklyWorkingHours;
		this.name = name;
	}
	
	public Month(Year year, java.time.Month name) {
		this.year = year;
		this.workDays = new ArrayList<>();
		this.weeklyWorkingHours = new ArrayList<>();
		this.name = name;
	}
	
	public void addWorkDay(WorkDay workDay) {
		this.workDays.add(workDay);
	}
	
	@JsonProperty("actualWorkingMinutes")
	public int calculateActualWorkingMinutes() {
		int minutes = 0;
		for (WorkDay workDay: this.workDays) {
			minutes += workDay.getTotalWorkingMinutes();
		}
		return minutes;
	}

	public Year getYear() {
		return year;
	}

	public void setYear(Year year) {
		this.year = year;
	}

	public List<WeeklyWorkingHours> getWeeklyWorkingHours() {
		return weeklyWorkingHours;
	}

	public void setWeeklyWorkingHours(List<WeeklyWorkingHours> weeklyWorkingHours) {
		this.weeklyWorkingHours = weeklyWorkingHours;
	}

	public int getTargetWorkingMinutes() {
		return targetWorkingMinutes;
	}

	public void setTargetWorkingMinutes(int targetWorkingMinutes) {
		this.targetWorkingMinutes = targetWorkingMinutes;
	}

//	public int getActualWorkingMinutes() {
//		return actualWorkingMinutes;
//	}
//
//	public void setActualWorkingMinutes(int actualWorkingMinutes) {
//		this.actualWorkingMinutes = actualWorkingMinutes;
//	}

	public List<WorkDay> getWorkDays() {
		return workDays;
	}

	public void setWorkDays(List<WorkDay> workDays) {
		this.workDays = workDays;
	}

	public java.time.Month getName() {
		return name;
	}

	public void setName(java.time.Month name) {
		this.name = name;
	}
	
	
}
