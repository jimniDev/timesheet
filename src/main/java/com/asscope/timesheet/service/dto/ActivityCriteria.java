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
 * Criteria class for the {@link com.asscope.timesheet.domain.Activity} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.ActivityResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /activities?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ActivityCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private StringFilter description;

    private BooleanFilter absence;

    private LongFilter workingEntryId;

    private LongFilter roleId;

    public ActivityCriteria(){
    }

    public ActivityCriteria(ActivityCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.description = other.description == null ? null : other.description.copy();
        this.absence = other.absence == null ? null : other.absence.copy();
        this.workingEntryId = other.workingEntryId == null ? null : other.workingEntryId.copy();
        this.roleId = other.roleId == null ? null : other.roleId.copy();
    }

    @Override
    public ActivityCriteria copy() {
        return new ActivityCriteria(this);
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

    public StringFilter getDescription() {
        return description;
    }

    public void setDescription(StringFilter description) {
        this.description = description;
    }

    public BooleanFilter getAbsence() {
        return absence;
    }

    public void setAbsence(BooleanFilter absence) {
        this.absence = absence;
    }

    public LongFilter getWorkingEntryId() {
        return workingEntryId;
    }

    public void setWorkingEntryId(LongFilter workingEntryId) {
        this.workingEntryId = workingEntryId;
    }

    public LongFilter getRoleId() {
        return roleId;
    }

    public void setRoleId(LongFilter roleId) {
        this.roleId = roleId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ActivityCriteria that = (ActivityCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(description, that.description) &&
            Objects.equals(absence, that.absence) &&
            Objects.equals(workingEntryId, that.workingEntryId) &&
            Objects.equals(roleId, that.roleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        name,
        description,
        absence,
        workingEntryId,
        roleId
        );
    }

    @Override
    public String toString() {
        return "ActivityCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (description != null ? "description=" + description + ", " : "") +
                (absence != null ? "absence=" + absence + ", " : "") +
                (workingEntryId != null ? "workingEntryId=" + workingEntryId + ", " : "") +
                (roleId != null ? "roleId=" + roleId + ", " : "") +
            "}";
    }

}
