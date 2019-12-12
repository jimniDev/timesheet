package com.asscope.timesheet.service;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Service
@Scope("application")
public class WorktimeBalanceCacheService {
	
	private HashMap<String, Long> cache = new HashMap<>();
	
	public void set(String userId, YearMonth month, Long balance) {
		cache.keySet()
		.stream()
        .filter(key -> key.startsWith(userId))
        .forEach(key -> cache.remove(key));
		this.cache.put(userId + month.toString(), balance);
	}
	
	public Optional<Long> get(String userId, YearMonth month) {
		return Optional.ofNullable(this.cache.get(userId + month.toString()));
	}
}
