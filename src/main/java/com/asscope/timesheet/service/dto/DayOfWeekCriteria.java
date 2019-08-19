package com.asscope.timesheet.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.DayOfWeek} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.DayOfWeekResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /day-of-weeks?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class DayOfWeekCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private LongFilter targetWorkingDayId;

    public DayOfWeekCriteria(){
    }

    public DayOfWeekCriteria(DayOfWeekCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.targetWorkingDayId = other.targetWorkingDayId == null ? null : other.targetWorkingDayId.copy();
    }

    @Override
    public DayOfWeekCriteria copy() {
        return new DayOfWeekCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public LongFilter getTargetWorkingDayId() {
        return targetWorkingDayId;
    }

    public void setTargetWorkingDayId(LongFilter targetWorkingDayId) {
        this.targetWorkingDayId = targetWorkingDayId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final DayOfWeekCriteria that = (DayOfWeekCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(targetWorkingDayId, that.targetWorkingDayId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        name,
        targetWorkingDayId
        );
    }

    @Override
    public String toString() {
        return "DayOfWeekCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (targetWorkingDayId != null ? "targetWorkingDayId=" + targetWorkingDayId + ", " : "") +
            "}";
    }

}
