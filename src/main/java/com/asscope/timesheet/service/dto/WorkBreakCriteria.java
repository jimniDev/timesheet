package com.asscope.timesheet.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.WorkBreak} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.WorkBreakResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /work-breaks?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class WorkBreakCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private IntegerFilter minutes;

    private LongFilter employeeId;

    private LongFilter workDayId;

    public WorkBreakCriteria(){
    }

    public WorkBreakCriteria(WorkBreakCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.minutes = other.minutes == null ? null : other.minutes.copy();
        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
        this.workDayId = other.workDayId == null ? null : other.workDayId.copy();
    }

    @Override
    public WorkBreakCriteria copy() {
        return new WorkBreakCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public IntegerFilter getMinutes() {
        return minutes;
    }

    public void setMinutes(IntegerFilter minutes) {
        this.minutes = minutes;
    }

    public LongFilter getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(LongFilter employeeId) {
        this.employeeId = employeeId;
    }

    public LongFilter getWorkDayId() {
        return workDayId;
    }

    public void setWorkDayId(LongFilter workDayId) {
        this.workDayId = workDayId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final WorkBreakCriteria that = (WorkBreakCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(minutes, that.minutes) &&
            Objects.equals(employeeId, that.employeeId) &&
            Objects.equals(workDayId, that.workDayId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        minutes,
        employeeId,
        workDayId
        );
    }

    @Override
    public String toString() {
        return "WorkBreakCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (minutes != null ? "minutes=" + minutes + ", " : "") +
                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
                (workDayId != null ? "workDayId=" + workDayId + ", " : "") +
            "}";
    }

}
