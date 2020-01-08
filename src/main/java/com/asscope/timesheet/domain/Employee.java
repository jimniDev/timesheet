package com.asscope.timesheet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Optional;
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

    @Column(name = "edit_permitted", nullable = false, columnDefinition = "bit default 0")
    private Boolean editPermitted = false;

    @Column(nullable = false, columnDefinition = "varchar(100) default 'FFM'")
    private String office;
    
    @JsonIgnoreProperties("employee")
    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkingEntry> workingEntries = new HashSet<>();

    @JsonIgnoreProperties("employee")
    @OneToMany(mappedBy = "employee", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WeeklyWorkingHours> weeklyWorkingHours = new HashSet<>();

    @JsonIgnoreProperties("employee")
    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkDay> workDays = new HashSet<>();
    
    @OneToOne
    private User user;
    
    @JsonIgnoreProperties("employee")
    @JsonProperty("activeWeeklyWorkingHours")
    public Optional<WeeklyWorkingHours> getActiveWeeklyWorkingHours() {
    	return this.weeklyWorkingHours.stream().max((wwH1, wwH2) -> wwH1.getStartDate().compareTo(wwH2.getStartDate()));
    }
       
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

	public Boolean isEditPermitted() {
		return editPermitted;
	}

	public void setEditPermitted(Boolean editPermitted) {
		this.editPermitted = editPermitted;
	}

    public Employee editPermitted(Boolean editPermitted) {
        this.editPermitted = editPermitted;
        return this;
    }
    
    public String getOffice() {
		return office;
	}

	public void setOffice(String office) {
		this.office = office;
	}
	
    public Employee office(String office) {
        this.office = office;
        return this;
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
            ", editPermitted='" + isEditPermitted() + "'" +
            ", office='" + getOffice() + "'" +
            "}";
    }
}
