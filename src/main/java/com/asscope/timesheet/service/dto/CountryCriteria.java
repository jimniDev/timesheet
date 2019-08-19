package com.asscope.timesheet.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.asscope.timesheet.domain.Country} entity. This class is used
 * in {@link com.asscope.timesheet.web.rest.CountryResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /countries?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class CountryCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter countryName;

    private LongFilter locationId;

    public CountryCriteria(){
    }

    public CountryCriteria(CountryCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.countryName = other.countryName == null ? null : other.countryName.copy();
        this.locationId = other.locationId == null ? null : other.locationId.copy();
    }

    @Override
    public CountryCriteria copy() {
        return new CountryCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getCountryName() {
        return countryName;
    }

    public void setCountryName(StringFilter countryName) {
        this.countryName = countryName;
    }

    public LongFilter getLocationId() {
        return locationId;
    }

    public void setLocationId(LongFilter locationId) {
        this.locationId = locationId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final CountryCriteria that = (CountryCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(countryName, that.countryName) &&
            Objects.equals(locationId, that.locationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        countryName,
        locationId
        );
    }

    @Override
    public String toString() {
        return "CountryCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (countryName != null ? "countryName=" + countryName + ", " : "") +
                (locationId != null ? "locationId=" + locationId + ", " : "") +
            "}";
    }

}
