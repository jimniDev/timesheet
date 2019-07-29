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
 * Criteria class for the {@link com.asscope.timesheet.domain.Employee} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.EmployeeResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /employees?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class EmployeeCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private BooleanFilter isEmployed;

    private LongFilter workingEntryId;

    private LongFilter targetWorkingDayId;

    private LongFilter weeklyWorkingHoursId;

    private LongFilter workDayId;

    private LongFilter workBreakId;

    public EmployeeCriteria(){
    }

    public EmployeeCriteria(EmployeeCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.isEmployed = other.isEmployed == null ? null : other.isEmployed.copy();
        this.workingEntryId = other.workingEntryId == null ? null : other.workingEntryId.copy();
        this.targetWorkingDayId = other.targetWorkingDayId == null ? null : other.targetWorkingDayId.copy();
        this.weeklyWorkingHoursId = other.weeklyWorkingHoursId == null ? null : other.weeklyWorkingHoursId.copy();
        this.workDayId = other.workDayId == null ? null : other.workDayId.copy();
        this.workBreakId = other.workBreakId == null ? null : other.workBreakId.copy();
    }

    @Override
    public EmployeeCriteria copy() {
        return new EmployeeCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public BooleanFilter getIsEmployed() {
        return isEmployed;
    }

    public void setIsEmployed(BooleanFilter isEmployed) {
        this.isEmployed = isEmployed;
    }

    public LongFilter getWorkingEntryId() {
        return workingEntryId;
    }

    public void setWorkingEntryId(LongFilter workingEntryId) {
        this.workingEntryId = workingEntryId;
    }

    public LongFilter getTargetWorkingDayId() {
        return targetWorkingDayId;
    }

    public void setTargetWorkingDayId(LongFilter targetWorkingDayId) {
        this.targetWorkingDayId = targetWorkingDayId;
    }

    public LongFilter getWeeklyWorkingHoursId() {
        return weeklyWorkingHoursId;
    }

    public void setWeeklyWorkingHoursId(LongFilter weeklyWorkingHoursId) {
        this.weeklyWorkingHoursId = weeklyWorkingHoursId;
    }

    public LongFilter getWorkDayId() {
        return workDayId;
    }

    public void setWorkDayId(LongFilter workDayId) {
        this.workDayId = workDayId;
    }

    public LongFilter getWorkBreakId() {
        return workBreakId;
    }

    public void setWorkBreakId(LongFilter workBreakId) {
        this.workBreakId = workBreakId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final EmployeeCriteria that = (EmployeeCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(isEmployed, that.isEmployed) &&
            Objects.equals(workingEntryId, that.workingEntryId) &&
            Objects.equals(targetWorkingDayId, that.targetWorkingDayId) &&
            Objects.equals(weeklyWorkingHoursId, that.weeklyWorkingHoursId) &&
            Objects.equals(workDayId, that.workDayId) &&
            Objects.equals(workBreakId, that.workBreakId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        isEmployed,
        workingEntryId,
        targetWorkingDayId,
        weeklyWorkingHoursId,
        workDayId,
        workBreakId
        );
    }

    @Override
    public String toString() {
        return "EmployeeCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (isEmployed != null ? "isEmployed=" + isEmployed + ", " : "") +
                (workingEntryId != null ? "workingEntryId=" + workingEntryId + ", " : "") +
                (targetWorkingDayId != null ? "targetWorkingDayId=" + targetWorkingDayId + ", " : "") +
                (weeklyWorkingHoursId != null ? "weeklyWorkingHoursId=" + weeklyWorkingHoursId + ", " : "") +
                (workDayId != null ? "workDayId=" + workDayId + ", " : "") +
                (workBreakId != null ? "workBreakId=" + workBreakId + ", " : "") +
            "}";
    }

}
