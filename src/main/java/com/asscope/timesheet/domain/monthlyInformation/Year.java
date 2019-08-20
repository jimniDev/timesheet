package com.asscope.timesheet.domain.monthlyInformation;

import java.util.List;

import com.asscope.timesheet.domain.WorkDay;

public class Year {
	
	private Month[] months;
	private int year;
	
	public Year(List<WorkDay> workdays, int year) {
		this.months = new Month[12];
		this.year = year;
	}
	
	public Month getMonth(int i) {
		return this.months[i - 1];
	}
	
	public Month getMonth(MonthName name) {
		for (Month month: months) {
			if (month.getName() == name) {
				return month;
			}
		}
		return null;
	}

	public Month[] getMonths() {
		return months;
	}

	public void setMonths(Month[] months) {
		this.months = months;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}
	
}
