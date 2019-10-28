package com.asscope.timesheet.service.erros;

public class OlderThanOneMonthTimeEntryException extends Exception {

	private static final long serialVersionUID = 1L;

	private static final String DEFAULT_MESSAGE = "TimeEntry is older than 1 month.";

	public OlderThanOneMonthTimeEntryException() {
		super(DEFAULT_MESSAGE);
	}
}
