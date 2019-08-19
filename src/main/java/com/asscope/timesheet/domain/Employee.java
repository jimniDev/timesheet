package com.asscope.timesheet.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Employee.
 */
@Entity
@NamedEntityGraph(name = "Employee.weeklyWorkingHours",
attributeNodes = @NamedAttributeNode("weeklyWorkingHours"))
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "is_employed")
    private Boolean isEmployed;

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkingEntry> workingEntries = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TargetWorkingDay> targetWorkingDays = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WeeklyWorkingHours> weeklyWorkingHours = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkDay> workDays = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkBreak> workBreaks = new HashSet<>();
    
    @OneToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Boolean isIsEmployed() {
        return isEmployed;
    }

    public Employee isEmployed(Boolean isEmployed) {
        this.isEmployed = isEmployed;
        return this;
    }

    public void setIsEmployed(Boolean isEmployed) {
        this.isEmployed = isEmployed;
    }

    public Set<WorkingEntry> getWorkingEntries() {
        return workingEntries;
    }

    public Employee workingEntries(Set<WorkingEntry> workingEntries) {
        this.workingEntries = workingEntries;
        return this;
    }

    public Employee addWorkingEntry(WorkingEntry workingEntry) {
        this.workingEntries.add(workingEntry);
        workingEntry.setEmployee(this);
        return this;
    }

    public Employee removeWorkingEntry(WorkingEntry workingEntry) {
        this.workingEntries.remove(workingEntry);
        workingEntry.setEmployee(null);
        return this;
    }

    public void setWorkingEntries(Set<WorkingEntry> workingEntries) {
        this.workingEntries = workingEntries;
    }

    public Set<TargetWorkingDay> getTargetWorkingDays() {
        return targetWorkingDays;
    }

    public Employee targetWorkingDays(Set<TargetWorkingDay> targetWorkingDays) {
        this.targetWorkingDays = targetWorkingDays;
        return this;
    }

    public Employee addTargetWorkingDay(TargetWorkingDay targetWorkingDay) {
        this.targetWorkingDays.add(targetWorkingDay);
        targetWorkingDay.setEmployee(this);
        return this;
    }

    public Employee removeTargetWorkingDay(TargetWorkingDay targetWorkingDay) {
        this.targetWorkingDays.remove(targetWorkingDay);
        targetWorkingDay.setEmployee(null);
        return this;
    }

    public void setTargetWorkingDays(Set<TargetWorkingDay> targetWorkingDays) {
        this.targetWorkingDays = targetWorkingDays;
    }

    public Set<WeeklyWorkingHours> getWeeklyWorkingHours() {
        return weeklyWorkingHours;
    }

    public Employee weeklyWorkingHours(Set<WeeklyWorkingHours> weeklyWorkingHours) {
        this.weeklyWorkingHours = weeklyWorkingHours;
        return this;
    }

    public Employee addWeeklyWorkingHours(WeeklyWorkingHours weeklyWorkingHours) {
        this.weeklyWorkingHours.add(weeklyWorkingHours);
        weeklyWorkingHours.setEmployee(this);
        return this;
    }

    public Employee removeWeeklyWorkingHours(WeeklyWorkingHours weeklyWorkingHours) {
        this.weeklyWorkingHours.remove(weeklyWorkingHours);
        weeklyWorkingHours.setEmployee(null);
        return this;
    }

    public void setWeeklyWorkingHours(Set<WeeklyWorkingHours> weeklyWorkingHours) {
        this.weeklyWorkingHours = weeklyWorkingHours;
    }

    public Set<WorkDay> getWorkDays() {
        return workDays;
    }

    public Employee workDays(Set<WorkDay> workDays) {
        this.workDays = workDays;
        return this;
    }

    public Employee addWorkDay(WorkDay workDay) {
        this.workDays.add(workDay);
        workDay.setEmployee(this);
        return this;
    }

    public Employee removeWorkDay(WorkDay workDay) {
        this.workDays.remove(workDay);
        workDay.setEmployee(null);
        return this;
    }

    public void setWorkDays(Set<WorkDay> workDays) {
        this.workDays = workDays;
    }

    public Set<WorkBreak> getWorkBreaks() {
        return workBreaks;
    }

    public Employee workBreaks(Set<WorkBreak> workBreaks) {
        this.workBreaks = workBreaks;
        return this;
    }

    public Employee addWorkBreak(WorkBreak workBreak) {
        this.workBreaks.add(workBreak);
        workBreak.setEmployee(this);
        return this;
    }

    public Employee removeWorkBreak(WorkBreak workBreak) {
        this.workBreaks.remove(workBreak);
        workBreak.setEmployee(null);
        return this;
    }

    public void setWorkBreaks(Set<WorkBreak> workBreaks) {
        this.workBreaks = workBreaks;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", isEmployed='" + isIsEmployed() + "'" +
            "}";
    }
}
