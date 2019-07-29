package com.asscope.timesheet.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A WorkingEntry.
 */
@Entity
@Table(name = "working_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WorkingEntry extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "start", nullable = false)
    private Instant start;

    @NotNull
    @Column(name = "jhi_end", nullable = false)
    private Instant end;

    @Column(name = "delete_flag")
    private Boolean deleteFlag;

    @Column(name = "locked_flag")
    private Boolean lockedFlag;

//    @NotNull
//    @Column(name = "created_at", nullable = false)
//    private Instant createdAt;

    @ManyToOne
    @JsonIgnoreProperties("workingEntries")
    private Employee employee;

    @ManyToOne
    @JsonIgnoreProperties("workingEntries")
    private Activity activity;

    @ManyToOne
    @JsonIgnoreProperties("workingEntries")
    private WorkDay workDay;

    @ManyToOne
    @JsonIgnoreProperties("workingEntries")
    private Location location;

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

    public Boolean isDeleteFlag() {
        return deleteFlag;
    }

    public WorkingEntry deleteFlag(Boolean deleteFlag) {
        this.deleteFlag = deleteFlag;
        return this;
    }

    public void setDeleteFlag(Boolean deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public Boolean isLockedFlag() {
        return lockedFlag;
    }

    public WorkingEntry lockedFlag(Boolean lockedFlag) {
        this.lockedFlag = lockedFlag;
        return this;
    }

    public void setLockedFlag(Boolean lockedFlag) {
        this.lockedFlag = lockedFlag;
    }

//    public Instant getCreatedAt() {
//        return createdAt;
//    }
//
//    public WorkingEntry createdAt(Instant createdAt) {
//        this.createdAt = createdAt;
//        return this;
//    }
//
//    public void setCreatedAt(Instant createdAt) {
//        this.createdAt = createdAt;
//    }

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
            ", deleteFlag='" + isDeleteFlag() + "'" +
            ", lockedFlag='" + isLockedFlag() + "'" +
//            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
