package com.asscope.timesheet.domain.monthlyInformation;

import java.util.List;

import com.asscope.timesheet.domain.WorkDay;

public class worktimeInformation {
	private List<Year> years;
	
	public worktimeInformation(List<WorkDay> workDays) {
		for (WorkDay workDay: workDays) {
			Year year = new Year();
		}
	}
	
	public Year getYear(int year) {
		for (Year y: years) {
			if (y.getYear() == year) {
				return y;
			}
		}
		return null;
	}
	
	
}
