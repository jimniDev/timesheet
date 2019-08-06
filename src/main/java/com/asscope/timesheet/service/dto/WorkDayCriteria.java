package com.asscope.timesheet.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LocalDateFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.WorkDay} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.WorkDayResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /work-days?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class WorkDayCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LocalDateFilter date;

    private LongFilter workingEntryId;

    private LongFilter workBreakId;

    private LongFilter employeeId;

    public WorkDayCriteria(){
    }

    public WorkDayCriteria(WorkDayCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.date = other.date == null ? null : other.date.copy();
        this.workingEntryId = other.workingEntryId == null ? null : other.workingEntryId.copy();
        this.workBreakId = other.workBreakId == null ? null : other.workBreakId.copy();
        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
    }

    @Override
    public WorkDayCriteria copy() {
        return new WorkDayCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public LocalDateFilter getDate() {
        return date;
    }

    public void setDate(LocalDateFilter date) {
        this.date = date;
    }

    public LongFilter getWorkingEntryId() {
        return workingEntryId;
    }

    public void setWorkingEntryId(LongFilter workingEntryId) {
        this.workingEntryId = workingEntryId;
    }

    public LongFilter getWorkBreakId() {
        return workBreakId;
    }

    public void setWorkBreakId(LongFilter workBreakId) {
        this.workBreakId = workBreakId;
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
        final WorkDayCriteria that = (WorkDayCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(date, that.date) &&
            Objects.equals(workingEntryId, that.workingEntryId) &&
            Objects.equals(workBreakId, that.workBreakId) &&
            Objects.equals(employeeId, that.employeeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        date,
        workingEntryId,
        workBreakId,
        employeeId
        );
    }

    @Override
    public String toString() {
        return "WorkDayCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (date != null ? "date=" + date + ", " : "") +
                (workingEntryId != null ? "workingEntryId=" + workingEntryId + ", " : "") +
                (workBreakId != null ? "workBreakId=" + workBreakId + ", " : "") +
                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
            "}";
    }

}
