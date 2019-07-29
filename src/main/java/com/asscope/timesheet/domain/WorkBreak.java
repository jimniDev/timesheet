package com.asscope.timesheet.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A WorkBreak.
 */
@Entity
@Table(name = "work_break")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WorkBreak implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "minutes", nullable = false)
    private Integer minutes;

    @ManyToOne
    @JsonIgnoreProperties("workBreaks")
    private Employee employee;

    @ManyToOne
    @JsonIgnoreProperties("workBreaks")
    private WorkDay workDay;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMinutes() {
        return minutes;
    }

    public WorkBreak minutes(Integer minutes) {
        this.minutes = minutes;
        return this;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }

    public Employee getEmployee() {
        return employee;
    }

    public WorkBreak employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public WorkDay getWorkDay() {
        return workDay;
    }

    public WorkBreak workDay(WorkDay workDay) {
        this.workDay = workDay;
        return this;
    }

    public void setWorkDay(WorkDay workDay) {
        this.workDay = workDay;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WorkBreak)) {
            return false;
        }
        return id != null && id.equals(((WorkBreak) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "WorkBreak{" +
            "id=" + getId() +
            ", minutes=" + getMinutes() +
            "}";
    }
}
