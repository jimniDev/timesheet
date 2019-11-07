package com.asscope.timesheet.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A DayOfWeek.
 */
@Entity
@Table(name = "day_of_week")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DayOfWeek implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "dayOfWeek")
//    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TargetWorkingDay> targetWorkingDays = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public DayOfWeek name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<TargetWorkingDay> getTargetWorkingDays() {
        return targetWorkingDays;
    }

    public DayOfWeek targetWorkingDays(Set<TargetWorkingDay> targetWorkingDays) {
        this.targetWorkingDays = targetWorkingDays;
        return this;
    }

    public DayOfWeek addTargetWorkingDay(TargetWorkingDay targetWorkingDay) {
        this.targetWorkingDays.add(targetWorkingDay);
        targetWorkingDay.setDayOfWeek(this);
        return this;
    }

    public DayOfWeek removeTargetWorkingDay(TargetWorkingDay targetWorkingDay) {
        this.targetWorkingDays.remove(targetWorkingDay);
        targetWorkingDay.setDayOfWeek(null);
        return this;
    }

    public void setTargetWorkingDays(Set<TargetWorkingDay> targetWorkingDays) {
        this.targetWorkingDays = targetWorkingDays;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DayOfWeek)) {
            return false;
        }
        return id != null && id.equals(((DayOfWeek) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "DayOfWeek{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
