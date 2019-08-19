package com.asscope.timesheet.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.Location} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.LocationResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /locations?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class LocationCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter street;

    private StringFilter streetNumber;

    private StringFilter postalCode;

    private StringFilter city;

    private LongFilter workingEntryId;

    private LongFilter countryId;

    public LocationCriteria(){
    }

    public LocationCriteria(LocationCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.street = other.street == null ? null : other.street.copy();
        this.streetNumber = other.streetNumber == null ? null : other.streetNumber.copy();
        this.postalCode = other.postalCode == null ? null : other.postalCode.copy();
        this.city = other.city == null ? null : other.city.copy();
        this.workingEntryId = other.workingEntryId == null ? null : other.workingEntryId.copy();
        this.countryId = other.countryId == null ? null : other.countryId.copy();
    }

    @Override
    public LocationCriteria copy() {
        return new LocationCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getStreet() {
        return street;
    }

    public void setStreet(StringFilter street) {
        this.street = street;
    }

    public StringFilter getStreetNumber() {
        return streetNumber;
    }

    public void setStreetNumber(StringFilter streetNumber) {
        this.streetNumber = streetNumber;
    }

    public StringFilter getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(StringFilter postalCode) {
        this.postalCode = postalCode;
    }

    public StringFilter getCity() {
        return city;
    }

    public void setCity(StringFilter city) {
        this.city = city;
    }

    public LongFilter getWorkingEntryId() {
        return workingEntryId;
    }

    public void setWorkingEntryId(LongFilter workingEntryId) {
        this.workingEntryId = workingEntryId;
    }

    public LongFilter getCountryId() {
        return countryId;
    }

    public void setCountryId(LongFilter countryId) {
        this.countryId = countryId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final LocationCriteria that = (LocationCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(street, that.street) &&
            Objects.equals(streetNumber, that.streetNumber) &&
            Objects.equals(postalCode, that.postalCode) &&
            Objects.equals(city, that.city) &&
            Objects.equals(workingEntryId, that.workingEntryId) &&
            Objects.equals(countryId, that.countryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        street,
        streetNumber,
        postalCode,
        city,
        workingEntryId,
        countryId
        );
    }

    @Override
    public String toString() {
        return "LocationCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (street != null ? "street=" + street + ", " : "") +
                (streetNumber != null ? "streetNumber=" + streetNumber + ", " : "") +
                (postalCode != null ? "postalCode=" + postalCode + ", " : "") +
                (city != null ? "city=" + city + ", " : "") +
                (workingEntryId != null ? "workingEntryId=" + workingEntryId + ", " : "") +
                (countryId != null ? "countryId=" + countryId + ", " : "") +
            "}";
    }

}
