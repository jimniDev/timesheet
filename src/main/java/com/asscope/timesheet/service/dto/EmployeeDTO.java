package com.asscope.timesheet.service.dto;

import com.asscope.timesheet.domain.Employee;

public class EmployeeDTO extends Employee {
	private static final long serialVersionUID = 1L;
	
	private Integer balance;

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}
	
}
