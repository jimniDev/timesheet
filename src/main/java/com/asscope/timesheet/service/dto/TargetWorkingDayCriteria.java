package com.asscope.timesheet.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.TargetWorkingDay} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.TargetWorkingDayResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /target-working-days?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class TargetWorkingDayCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private IntegerFilter hours;

    private LongFilter employeeId;

    private LongFilter dayOfWeekId;

    public TargetWorkingDayCriteria(){
    }

    public TargetWorkingDayCriteria(TargetWorkingDayCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.hours = other.hours == null ? null : other.hours.copy();
        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
        this.dayOfWeekId = other.dayOfWeekId == null ? null : other.dayOfWeekId.copy();
    }

    @Override
    public TargetWorkingDayCriteria copy() {
        return new TargetWorkingDayCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public IntegerFilter getHours() {
        return hours;
    }

    public void setHours(IntegerFilter hours) {
        this.hours = hours;
    }

    public LongFilter getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(LongFilter employeeId) {
        this.employeeId = employeeId;
    }

    public LongFilter getDayOfWeekId() {
        return dayOfWeekId;
    }

    public void setDayOfWeekId(LongFilter dayOfWeekId) {
        this.dayOfWeekId = dayOfWeekId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TargetWorkingDayCriteria that = (TargetWorkingDayCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(hours, that.hours) &&
            Objects.equals(employeeId, that.employeeId) &&
            Objects.equals(dayOfWeekId, that.dayOfWeekId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        hours,
        employeeId,
        dayOfWeekId
        );
    }

    @Override
    public String toString() {
        return "TargetWorkingDayCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (hours != null ? "hours=" + hours + ", " : "") +
                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
                (dayOfWeekId != null ? "dayOfWeekId=" + dayOfWeekId + ", " : "") +
            "}";
    }

}
