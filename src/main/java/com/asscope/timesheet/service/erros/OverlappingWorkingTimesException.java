package com.asscope.timesheet.service.erros;

public class OverlappingWorkingTimesException extends Exception {

	private static final long serialVersionUID = 1L;
	
	private static final String DEFAULT_MESSAGE = "WorkingEntry has overlapping time with another entry of the given date.";
	
	public OverlappingWorkingTimesException() {
		super(DEFAULT_MESSAGE);
	}

	public OverlappingWorkingTimesException(String message) {
		super(message);
	}
}
