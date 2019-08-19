//package com.asscope.timesheet.service.dto;
//
//import java.io.Serializable;
//import java.util.Objects;
//import io.github.jhipster.service.Criteria;
//import io.github.jhipster.service.filter.BooleanFilter;
//import io.github.jhipster.service.filter.Filter;
//import io.github.jhipster.service.filter.LongFilter;
//import io.github.jhipster.service.filter.InstantFilter;
//import io.github.jhipster.service.filter.LocalDateFilter;
//
///**
// * Criteria class for the {@link com.asscope.timesheet.domain.WorkingEntry} entity. This class is used
// * in {@link com.asscope.timesheet.web.rest.WorkingEntryResource} to receive all the possible filtering options from
// * the Http GET request parameters.
// * For example the following could be a valid request:
// * {@code /working-entries?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
// * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
// * fix type specific filters.
// */
//public class WorkingEntryCriteria implements Serializable, Criteria {
//
//    private static final long serialVersionUID = 1L;
//
//    private LongFilter id;
//
//    private LocalDateFilter start;
//
//    private InstantFilter end;
//
//    private BooleanFilter deleteFlag;
//
//    private BooleanFilter lockedFlag;
//
//    private InstantFilter createdAt;
//
//    private LongFilter employeeId;
//
//    private LongFilter activityId;
//
//    private LongFilter workDayId;
//
//    private LongFilter locationId;
//
//    public WorkingEntryCriteria(){
//    }
//
//    public WorkingEntryCriteria(WorkingEntryCriteria other){
//        this.id = other.id == null ? null : other.id.copy();
//        this.start = other.start == null ? null : other.start.copy();
//        this.end = other.end == null ? null : other.end.copy();
//        this.deleteFlag = other.deleteFlag == null ? null : other.deleteFlag.copy();
//        this.lockedFlag = other.lockedFlag == null ? null : other.lockedFlag.copy();
//        this.createdAt = other.createdAt == null ? null : other.createdAt.copy();
//        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
//        this.activityId = other.activityId == null ? null : other.activityId.copy();
//        this.workDayId = other.workDayId == null ? null : other.workDayId.copy();
//        this.locationId = other.locationId == null ? null : other.locationId.copy();
//    }
//
//    @Override
//    public WorkingEntryCriteria copy() {
//        return new WorkingEntryCriteria(this);
//    }
//
//    public LongFilter getId() {
//        return id;
//    }
//
//    public void setId(LongFilter id) {
//        this.id = id;
//    }
//
//    public InstantFilter getStart() {
//        return start;
//    }
//
//    public void setStart(InstantFilter start) {
//        this.start = start;
//    }
//
//    public InstantFilter getEnd() {
//        return end;
//    }
//
//    public void setEnd(InstantFilter end) {
//        this.end = end;
//    }
//
//    public BooleanFilter getDeleteFlag() {
//        return deleteFlag;
//    }
//
//    public void setDeleteFlag(BooleanFilter deleteFlag) {
//        this.deleteFlag = deleteFlag;
//    }
//
//    public BooleanFilter getLockedFlag() {
//        return lockedFlag;
//    }
//
//    public void setLockedFlag(BooleanFilter lockedFlag) {
//        this.lockedFlag = lockedFlag;
//    }
//
//    public InstantFilter getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(InstantFilter createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LongFilter getEmployeeId() {
//        return employeeId;
//    }
//
//    public void setEmployeeId(LongFilter employeeId) {
//        this.employeeId = employeeId;
//    }
//
//    public LongFilter getActivityId() {
//        return activityId;
//    }
//
//    public void setActivityId(LongFilter activityId) {
//        this.activityId = activityId;
//    }
//
//    public LongFilter getWorkDayId() {
//        return workDayId;
//    }
//
//    public void setWorkDayId(LongFilter workDayId) {
//        this.workDayId = workDayId;
//    }
//
//    public LongFilter getLocationId() {
//        return locationId;
//    }
//
//    public void setLocationId(LongFilter locationId) {
//        this.locationId = locationId;
//    }
//
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) {
//            return true;
//        }
//        if (o == null || getClass() != o.getClass()) {
//            return false;
//        }
//        final WorkingEntryCriteria that = (WorkingEntryCriteria) o;
//        return
//            Objects.equals(id, that.id) &&
//            Objects.equals(start, that.start) &&
//            Objects.equals(end, that.end) &&
//            Objects.equals(deleteFlag, that.deleteFlag) &&
//            Objects.equals(lockedFlag, that.lockedFlag) &&
//            Objects.equals(createdAt, that.createdAt) &&
//            Objects.equals(employeeId, that.employeeId) &&
//            Objects.equals(activityId, that.activityId) &&
//            Objects.equals(workDayId, that.workDayId) &&
//            Objects.equals(locationId, that.locationId);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(
//        id,
//        start,
//        end,
//        deleteFlag,
//        lockedFlag,
//        createdAt,
//        employeeId,
//        activityId,
//        workDayId,
//        locationId
//        );
//    }
//
//    @Override
//    public String toString() {
//        return "WorkingEntryCriteria{" +
//                (id != null ? "id=" + id + ", " : "") +
//                (start != null ? "start=" + start + ", " : "") +
//                (end != null ? "end=" + end + ", " : "") +
//                (deleteFlag != null ? "deleteFlag=" + deleteFlag + ", " : "") +
//                (lockedFlag != null ? "lockedFlag=" + lockedFlag + ", " : "") +
//                (createdAt != null ? "createdAt=" + createdAt + ", " : "") +
//                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
//                (activityId != null ? "activityId=" + activityId + ", " : "") +
//                (workDayId != null ? "workDayId=" + workDayId + ", " : "") +
//                (locationId != null ? "locationId=" + locationId + ", " : "") +
//            "}";
//    }
//
//}
