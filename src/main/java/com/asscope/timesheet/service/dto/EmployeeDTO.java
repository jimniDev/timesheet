package com.asscope.timesheet.service.dto;

import com.asscope.timesheet.domain.Employee;

public class EmployeeDTO extends Employee {
	private static final long serialVersionUID = 1L;
	
	private Long balance;

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}
	
}
