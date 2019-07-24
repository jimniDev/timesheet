package com.asscope.timesheet.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "firstname", nullable = false)
    private String firstname;

    @NotNull
    @Column(name = "lastname", nullable = false)
    private String lastname;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkingEntry> workingEntries = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkingDay> workingDays = new HashSet<>();
    
    @OneToOne
    @MapsId
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public Employee firstname(String firstname) {
        this.firstname = firstname;
        return this;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public Employee lastname(String lastname) {
        this.lastname = lastname;
        return this;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public Employee email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public Employee phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public Set<WorkingDay> getWorkingDays() {
        return workingDays;
    }

    public Employee workingDays(Set<WorkingDay> workingDays) {
        this.workingDays = workingDays;
        return this;
    }

    public Employee addWorkingDay(WorkingDay workingDay) {
        this.workingDays.add(workingDay);
        workingDay.setEmployee(this);
        return this;
    }

    public Employee removeWorkingDay(WorkingDay workingDay) {
        this.workingDays.remove(workingDay);
        workingDay.setEmployee(null);
        return this;
    }

    public void setWorkingDays(Set<WorkingDay> workingDays) {
        this.workingDays = workingDays;
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
            ", firstname='" + getFirstname() + "'" +
            ", lastname='" + getLastname() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
