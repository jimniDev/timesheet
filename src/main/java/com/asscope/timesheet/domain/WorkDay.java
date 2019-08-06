package com.asscope.timesheet.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
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

    @OneToMany(mappedBy = "workDay")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkingEntry> workingEntries = new HashSet<>();

    @OneToMany(mappedBy = "workDay")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkBreak> workBreaks = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties("workDays")
    private Employee employee;

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

    public Set<WorkBreak> getWorkBreaks() {
        return workBreaks;
    }

    public WorkDay workBreaks(Set<WorkBreak> workBreaks) {
        this.workBreaks = workBreaks;
        return this;
    }

    public WorkDay addWorkBreak(WorkBreak workBreak) {
        this.workBreaks.add(workBreak);
        workBreak.setWorkDay(this);
        return this;
    }

    public WorkDay removeWorkBreak(WorkBreak workBreak) {
        this.workBreaks.remove(workBreak);
        workBreak.setWorkDay(null);
        return this;
    }

    public void setWorkBreaks(Set<WorkBreak> workBreaks) {
        this.workBreaks = workBreaks;
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
