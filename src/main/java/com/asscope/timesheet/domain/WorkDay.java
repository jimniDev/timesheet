package com.asscope.timesheet.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * A WorkDay.
 */
@Entity
@Table(name = "work_day", uniqueConstraints=
@UniqueConstraint(columnNames={"date", "employee_id"}))
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WorkDay implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @JsonIgnoreProperties("workDay")
    @OneToMany(mappedBy = "workDay", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkingEntry> workingEntries = new HashSet<>();

    @Column(name = "additional_break_minutes")
    private int additionalBreakMinutes;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties("workDays")
    private Employee employee;
    
    @JsonProperty("totalWorkingMinutes")
    public long getTotalWorkingMinutes() {
    	long seconds = 0;
    	for (WorkingEntry workingEntry: workingEntries) {
    		if(workingEntry.isValid()) {
        		seconds += workingEntry.getWorkingTimeInSeconds();
    		}
    	}
    	long minutes = seconds / 60 - this.additionalBreakMinutes;
    	return minutes >= 0? minutes : 0;
    }
    
    @JsonProperty("targetWorkingMinutes")
    public Optional<Integer> getTargetWorkminutes() {
    	Optional<WeeklyWorkingHours> wwh = this.getWeeklyWorkingHours();
    	if(wwh.isPresent()) {
    		return Optional.of(wwh.get().getHours() / 5 * 60);
    	} else {
    		return Optional.empty();
    	}
    }
    
    @JsonProperty("activeWeeklyWorkingHours")
    public Optional<WeeklyWorkingHours> getWeeklyWorkingHours() {
    	return this.employee
    			.getWeeklyWorkingHours()
    			.stream()
    			.filter(wwH -> {
    				return (wwH.getStartDate().isBefore(this.date) || wwH.getStartDate().isEqual(this.date)) 
    						&& (wwH.getEndDate() == null || wwH.getEndDate().isAfter(this.date) || wwH.getEndDate().isEqual(this.date));
    			}).findFirst();
    }
    
    
    @JsonProperty("startTime")
    public Instant getStartTime() {
    	Instant start = Instant.MAX;   	
    	for(WorkingEntry workingEntry: this.workingEntries) {
    		if(workingEntry.isValid()) {
        		if(workingEntry.getStart().isBefore(start)) {
        			start = workingEntry.getStart();
        		}
    		}
    	}
    	return start;
    }
    
    @JsonProperty("endTime")
    public Instant getEndTime() {
    	Instant end = Instant.MIN;   	
    	for(WorkingEntry workingEntry: this.workingEntries) {
    		if(workingEntry.isValid()) {
        		if(workingEntry.getEnd().isAfter(end)) {
        			end = workingEntry.getEnd();
        		}
    		}
    	}
    	return end;
    }
    
    @JsonProperty("calculatedBreakMinutes")
    public int getCalculatedBreakMinutes() {
    	int minutes = 0;
    	Instant firstStart = Instant.MAX;
    	Instant lastEnd = Instant.MIN;
    	long totalWorkingSeconds = 0;
    	if(this.workingEntries.stream().filter(we -> we.isValid()).count() > 1) {
        	for(WorkingEntry workingEntry: this.workingEntries) {
            	if(workingEntry.isValid()) {
            		totalWorkingSeconds += workingEntry.getWorkingTimeInSeconds();
            		if(workingEntry.getStart().isBefore(firstStart)) {
            			firstStart = workingEntry.getStart();
            		}
            		if(workingEntry.getEnd().isAfter(lastEnd)) {
            			lastEnd = workingEntry.getEnd();
            		}
        		}
        	}
        	long totalSeconds = lastEnd.getEpochSecond() - firstStart.getEpochSecond();
        	minutes += (int) (totalSeconds - totalWorkingSeconds) / 60;
    	}
    	return minutes;
    }
    
    @JsonProperty("totalBreakMinutes")
    public int getTotalBreakMinutes() {
    	return this.getCalculatedBreakMinutes() + this.additionalBreakMinutes;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public WorkDay date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<WorkingEntry> getWorkingEntries() {
        return workingEntries;
    }

    public WorkDay workingEntries(Set<WorkingEntry> workingEntries) {
        this.workingEntries = workingEntries;
        return this;
    }

    public WorkDay addWorkingEntry(WorkingEntry workingEntry) {
        this.workingEntries.add(workingEntry);
        workingEntry.setWorkDay(this);
        return this;
    }

    public WorkDay removeWorkingEntry(WorkingEntry workingEntry) {
        this.workingEntries.remove(workingEntry);
        workingEntry.setWorkDay(null);
        return this;
    }

    public void setWorkingEntries(Set<WorkingEntry> workingEntries) {
        this.workingEntries = workingEntries;
    }

    public int getAdditionalBreakMinutes() {
		return additionalBreakMinutes;
	}

	public void setAdditionalBreakMinutes(int additionalBreakMinutes) {
		this.additionalBreakMinutes = additionalBreakMinutes;
	}

	public Employee getEmployee() {
        return employee;
    }

    public WorkDay employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WorkDay)) {
            return false;
        }
        return id != null && id.equals(((WorkDay) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "WorkDay{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
