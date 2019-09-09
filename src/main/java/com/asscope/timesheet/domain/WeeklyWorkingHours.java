package com.asscope.timesheet.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * A WeeklyWorkingHours.
 */
@Entity
@Table(name = "weekly_working_hours")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WeeklyWorkingHours implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "hours")
    private Integer hours;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne
    @JsonIgnoreProperties("weeklyWorkingHours")
    private Employee employee;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getHours() {
        return hours;
    }

    public WeeklyWorkingHours hours(Integer hours) {
        this.hours = hours;
        return this;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public WeeklyWorkingHours startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public WeeklyWorkingHours endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Employee getEmployee() {
        return employee;
    }

    public WeeklyWorkingHours employee(Employee employee) {
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
        if (!(o instanceof WeeklyWorkingHours)) {
            return false;
        }
        return id != null && id.equals(((WeeklyWorkingHours) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "WeeklyWorkingHours{" +
            "id=" + getId() +
            ", hours=" + getHours() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            "}";
    }
}
