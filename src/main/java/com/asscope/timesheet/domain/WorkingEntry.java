package com.asscope.timesheet.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Optional;

/**
 * A WorkingEntry.
 */
@Entity
@Table(name = "working_entry")
@Where(clause="deleted_flag=0")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WorkingEntry extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "start", nullable = false)
    private Instant start;

    @Column(name = "jhi_end")
    private Instant end;

    @Column(name = "deleted_flag", nullable = false)
    @JsonIgnore
    private Boolean deleted;

    @Column(name = "locked_flag")
    private Boolean locked;

    @ManyToOne
    @JsonIgnoreProperties({"workingEntries", "workDays", "weeklyWorkingHours", "user"})
    private Employee employee;

    @ManyToOne
    @JsonIgnoreProperties("workingEntries")
    private Activity activity;

    @ManyToOne
    @JsonIgnoreProperties({"workingEntries", "employee", "activeWeeklyWorkingHours"})
    private WorkDay workDay;

    @ManyToOne
    @JsonIgnoreProperties("workingEntries")
    private Location location;
    
    @JsonProperty("workingTimeInSeconds")
    public Long getWorkingTimeInSeconds() {
    	if(this.activity != null && this.activity.isReduce()) {
    		return 0L;
    	} else if(this.isCompleted()) {
        	return end.getEpochSecond() - start.getEpochSecond();
    	} else {
    		return 0L;
    	}
    }
    
    public boolean isCompleted() {
    	return this.getEnd() != null && this.getStart() != null;
    }

    public boolean isValid() {
    	return this.isCompleted() && (this.isDeleted() == null || !this.isDeleted());
    }
    
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStart() {
        return start;
    }

    public WorkingEntry start(Instant start) {
        this.start = start;
        return this;
    }

    public void setStart(Instant start) {
        this.start = start;
    }

    public Instant getEnd() {
        return end;
    }

    public WorkingEntry end(Instant end) {
        this.end = end;
        return this;
    }

    public void setEnd(Instant end) {
        this.end = end;
    }

    public Boolean isDeleted() {
        return deleted;
    }

    public WorkingEntry deleted(Boolean deleteFlag) {
        this.deleted = deleteFlag;
        return this;
    }

    public void setDeleted(Boolean deleteFlag) {
        this.deleted = deleteFlag;
    }

    public Boolean isLocked() {
        return locked;
    }

    public WorkingEntry locked(Boolean lockedFlag) {
        this.locked = lockedFlag;
        return this;
    }

    public void setLocked(Boolean lockedFlag) {
        this.locked = lockedFlag;
    }

    public Employee getEmployee() {
        return employee;
    }

    public WorkingEntry employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Activity getActivity() {
        return activity;
    }

    public WorkingEntry activity(Activity activity) {
        this.activity = activity;
        return this;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public WorkDay getWorkDay() {
        return workDay;
    }

    public WorkingEntry workDay(WorkDay workDay) {
        this.workDay = workDay;
        return this;
    }

    public void setWorkDay(WorkDay workDay) {
        this.workDay = workDay;
    }

    public Location getLocation() {
        return location;
    }

    public WorkingEntry location(Location location) {
        this.location = location;
        return this;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WorkingEntry)) {
            return false;
        }
        return id != null && id.equals(((WorkingEntry) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "WorkingEntry{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", deleteFlag='" + isDeleted() + "'" +
            ", lockedFlag='" + isLocked() + "'" +
            "}";
    }
}
