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
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.WeeklyWorkingHours} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.WeeklyWorkingHoursResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /weekly-working-hours?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class WeeklyWorkingHoursCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private IntegerFilter hours;

    private InstantFilter startDate;

    private InstantFilter endDate;

    private LongFilter employeeId;

    public WeeklyWorkingHoursCriteria(){
    }

    public WeeklyWorkingHoursCriteria(WeeklyWorkingHoursCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.hours = other.hours == null ? null : other.hours.copy();
        this.startDate = other.startDate == null ? null : other.startDate.copy();
        this.endDate = other.endDate == null ? null : other.endDate.copy();
        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
    }

    @Override
    public WeeklyWorkingHoursCriteria copy() {
        return new WeeklyWorkingHoursCriteria(this);
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

    public InstantFilter getStartDate() {
        return startDate;
    }

    public void setStartDate(InstantFilter startDate) {
        this.startDate = startDate;
    }

    public InstantFilter getEndDate() {
        return endDate;
    }

    public void setEndDate(InstantFilter endDate) {
        this.endDate = endDate;
    }

    public LongFilter getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(LongFilter employeeId) {
        this.employeeId = employeeId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final WeeklyWorkingHoursCriteria that = (WeeklyWorkingHoursCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(hours, that.hours) &&
            Objects.equals(startDate, that.startDate) &&
            Objects.equals(endDate, that.endDate) &&
            Objects.equals(employeeId, that.employeeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        hours,
        startDate,
        endDate,
        employeeId
        );
    }

    @Override
    public String toString() {
        return "WeeklyWorkingHoursCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (hours != null ? "hours=" + hours + ", " : "") +
                (startDate != null ? "startDate=" + startDate + ", " : "") +
                (endDate != null ? "endDate=" + endDate + ", " : "") +
                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
            "}";
    }

}
