package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.repository.WeeklyWorkingHoursRepository;
import com.asscope.timesheet.service.WeeklyWorkingHoursService;
import com.asscope.timesheet.web.rest.errors.ExceptionTranslator;
import com.asscope.timesheet.service.dto.WeeklyWorkingHoursCriteria;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.asscope.timesheet.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link WeeklyWorkingHoursResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class WeeklyWorkingHoursResourceIT {

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now();

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now();

    @Autowired
    private WeeklyWorkingHoursRepository weeklyWorkingHoursRepository;

    @Autowired
    private WeeklyWorkingHoursService weeklyWorkingHoursService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restWeeklyWorkingHoursMockMvc;

    private WeeklyWorkingHours weeklyWorkingHours;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WeeklyWorkingHoursResource weeklyWorkingHoursResource = new WeeklyWorkingHoursResource(weeklyWorkingHoursService);
        this.restWeeklyWorkingHoursMockMvc = MockMvcBuilders.standaloneSetup(weeklyWorkingHoursResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WeeklyWorkingHours createEntity(EntityManager em) {
        WeeklyWorkingHours weeklyWorkingHours = new WeeklyWorkingHours()
            .hours(DEFAULT_HOURS)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
        return weeklyWorkingHours;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WeeklyWorkingHours createUpdatedEntity(EntityManager em) {
        WeeklyWorkingHours weeklyWorkingHours = new WeeklyWorkingHours()
            .hours(UPDATED_HOURS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
        return weeklyWorkingHours;
    }

    @BeforeEach
    public void initTest() {
        weeklyWorkingHours = createEntity(em);
    }

    @Test
    @Transactional
    public void createWeeklyWorkingHours() throws Exception {
        int databaseSizeBeforeCreate = weeklyWorkingHoursRepository.findAll().size();

        // Create the WeeklyWorkingHours
        restWeeklyWorkingHoursMockMvc.perform(post("/api/weekly-working-hours")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weeklyWorkingHours)))
            .andExpect(status().isCreated());

        // Validate the WeeklyWorkingHours in the database
        List<WeeklyWorkingHours> weeklyWorkingHoursList = weeklyWorkingHoursRepository.findAll();
        assertThat(weeklyWorkingHoursList).hasSize(databaseSizeBeforeCreate + 1);
        WeeklyWorkingHours testWeeklyWorkingHours = weeklyWorkingHoursList.get(weeklyWorkingHoursList.size() - 1);
        assertThat(testWeeklyWorkingHours.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testWeeklyWorkingHours.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testWeeklyWorkingHours.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    public void createWeeklyWorkingHoursWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = weeklyWorkingHoursRepository.findAll().size();

        // Create the WeeklyWorkingHours with an existing ID
        weeklyWorkingHours.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeeklyWorkingHoursMockMvc.perform(post("/api/weekly-working-hours")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weeklyWorkingHours)))
            .andExpect(status().isBadRequest());

        // Validate the WeeklyWorkingHours in the database
        List<WeeklyWorkingHours> weeklyWorkingHoursList = weeklyWorkingHoursRepository.findAll();
        assertThat(weeklyWorkingHoursList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllWeeklyWorkingHours() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weeklyWorkingHours.getId().intValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getWeeklyWorkingHours() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get the weeklyWorkingHours
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours/{id}", weeklyWorkingHours.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(weeklyWorkingHours.getId().intValue()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByHoursIsEqualToSomething() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where hours equals to DEFAULT_HOURS
        defaultWeeklyWorkingHoursShouldBeFound("hours.equals=" + DEFAULT_HOURS);

        // Get all the weeklyWorkingHoursList where hours equals to UPDATED_HOURS
        defaultWeeklyWorkingHoursShouldNotBeFound("hours.equals=" + UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByHoursIsInShouldWork() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where hours in DEFAULT_HOURS or UPDATED_HOURS
        defaultWeeklyWorkingHoursShouldBeFound("hours.in=" + DEFAULT_HOURS + "," + UPDATED_HOURS);

        // Get all the weeklyWorkingHoursList where hours equals to UPDATED_HOURS
        defaultWeeklyWorkingHoursShouldNotBeFound("hours.in=" + UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByHoursIsNullOrNotNull() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where hours is not null
        defaultWeeklyWorkingHoursShouldBeFound("hours.specified=true");

        // Get all the weeklyWorkingHoursList where hours is null
        defaultWeeklyWorkingHoursShouldNotBeFound("hours.specified=false");
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByHoursIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where hours greater than or equals to DEFAULT_HOURS
        defaultWeeklyWorkingHoursShouldBeFound("hours.greaterOrEqualThan=" + DEFAULT_HOURS);

        // Get all the weeklyWorkingHoursList where hours greater than or equals to UPDATED_HOURS
        defaultWeeklyWorkingHoursShouldNotBeFound("hours.greaterOrEqualThan=" + UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByHoursIsLessThanSomething() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where hours less than or equals to DEFAULT_HOURS
        defaultWeeklyWorkingHoursShouldNotBeFound("hours.lessThan=" + DEFAULT_HOURS);

        // Get all the weeklyWorkingHoursList where hours less than or equals to UPDATED_HOURS
        defaultWeeklyWorkingHoursShouldBeFound("hours.lessThan=" + UPDATED_HOURS);
    }


    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByStartDateIsEqualToSomething() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where startDate equals to DEFAULT_START_DATE
        defaultWeeklyWorkingHoursShouldBeFound("startDate.equals=" + DEFAULT_START_DATE);

        // Get all the weeklyWorkingHoursList where startDate equals to UPDATED_START_DATE
        defaultWeeklyWorkingHoursShouldNotBeFound("startDate.equals=" + UPDATED_START_DATE);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByStartDateIsInShouldWork() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where startDate in DEFAULT_START_DATE or UPDATED_START_DATE
        defaultWeeklyWorkingHoursShouldBeFound("startDate.in=" + DEFAULT_START_DATE + "," + UPDATED_START_DATE);

        // Get all the weeklyWorkingHoursList where startDate equals to UPDATED_START_DATE
        defaultWeeklyWorkingHoursShouldNotBeFound("startDate.in=" + UPDATED_START_DATE);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByStartDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where startDate is not null
        defaultWeeklyWorkingHoursShouldBeFound("startDate.specified=true");

        // Get all the weeklyWorkingHoursList where startDate is null
        defaultWeeklyWorkingHoursShouldNotBeFound("startDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByEndDateIsEqualToSomething() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where endDate equals to DEFAULT_END_DATE
        defaultWeeklyWorkingHoursShouldBeFound("endDate.equals=" + DEFAULT_END_DATE);

        // Get all the weeklyWorkingHoursList where endDate equals to UPDATED_END_DATE
        defaultWeeklyWorkingHoursShouldNotBeFound("endDate.equals=" + UPDATED_END_DATE);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByEndDateIsInShouldWork() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where endDate in DEFAULT_END_DATE or UPDATED_END_DATE
        defaultWeeklyWorkingHoursShouldBeFound("endDate.in=" + DEFAULT_END_DATE + "," + UPDATED_END_DATE);

        // Get all the weeklyWorkingHoursList where endDate equals to UPDATED_END_DATE
        defaultWeeklyWorkingHoursShouldNotBeFound("endDate.in=" + UPDATED_END_DATE);
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByEndDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);

        // Get all the weeklyWorkingHoursList where endDate is not null
        defaultWeeklyWorkingHoursShouldBeFound("endDate.specified=true");

        // Get all the weeklyWorkingHoursList where endDate is null
        defaultWeeklyWorkingHoursShouldNotBeFound("endDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllWeeklyWorkingHoursByEmployeeIsEqualToSomething() throws Exception {
        // Initialize the database
        Employee employee = EmployeeResourceIT.createEntity(em);
        em.persist(employee);
        em.flush();
        weeklyWorkingHours.setEmployee(employee);
        weeklyWorkingHoursRepository.saveAndFlush(weeklyWorkingHours);
        Long employeeId = employee.getId();

        // Get all the weeklyWorkingHoursList where employee equals to employeeId
        defaultWeeklyWorkingHoursShouldBeFound("employeeId.equals=" + employeeId);

        // Get all the weeklyWorkingHoursList where employee equals to employeeId + 1
        defaultWeeklyWorkingHoursShouldNotBeFound("employeeId.equals=" + (employeeId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultWeeklyWorkingHoursShouldBeFound(String filter) throws Exception {
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weeklyWorkingHours.getId().intValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));

        // Check, that the count call also returns 1
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultWeeklyWorkingHoursShouldNotBeFound(String filter) throws Exception {
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingWeeklyWorkingHours() throws Exception {
        // Get the weeklyWorkingHours
        restWeeklyWorkingHoursMockMvc.perform(get("/api/weekly-working-hours/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWeeklyWorkingHours() throws Exception {
        // Initialize the database
        weeklyWorkingHoursService.save(weeklyWorkingHours);

        int databaseSizeBeforeUpdate = weeklyWorkingHoursRepository.findAll().size();

        // Update the weeklyWorkingHours
        WeeklyWorkingHours updatedWeeklyWorkingHours = weeklyWorkingHoursRepository.findById(weeklyWorkingHours.getId()).get();
        // Disconnect from session so that the updates on updatedWeeklyWorkingHours are not directly saved in db
        em.detach(updatedWeeklyWorkingHours);
        updatedWeeklyWorkingHours
            .hours(UPDATED_HOURS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restWeeklyWorkingHoursMockMvc.perform(put("/api/weekly-working-hours")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWeeklyWorkingHours)))
            .andExpect(status().isOk());

        // Validate the WeeklyWorkingHours in the database
        List<WeeklyWorkingHours> weeklyWorkingHoursList = weeklyWorkingHoursRepository.findAll();
        assertThat(weeklyWorkingHoursList).hasSize(databaseSizeBeforeUpdate);
        WeeklyWorkingHours testWeeklyWorkingHours = weeklyWorkingHoursList.get(weeklyWorkingHoursList.size() - 1);
        assertThat(testWeeklyWorkingHours.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testWeeklyWorkingHours.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testWeeklyWorkingHours.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingWeeklyWorkingHours() throws Exception {
        int databaseSizeBeforeUpdate = weeklyWorkingHoursRepository.findAll().size();

        // Create the WeeklyWorkingHours

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeeklyWorkingHoursMockMvc.perform(put("/api/weekly-working-hours")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weeklyWorkingHours)))
            .andExpect(status().isBadRequest());

        // Validate the WeeklyWorkingHours in the database
        List<WeeklyWorkingHours> weeklyWorkingHoursList = weeklyWorkingHoursRepository.findAll();
        assertThat(weeklyWorkingHoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWeeklyWorkingHours() throws Exception {
        // Initialize the database
        weeklyWorkingHoursService.save(weeklyWorkingHours);

        int databaseSizeBeforeDelete = weeklyWorkingHoursRepository.findAll().size();

        // Delete the weeklyWorkingHours
        restWeeklyWorkingHoursMockMvc.perform(delete("/api/weekly-working-hours/{id}", weeklyWorkingHours.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WeeklyWorkingHours> weeklyWorkingHoursList = weeklyWorkingHoursRepository.findAll();
        assertThat(weeklyWorkingHoursList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeeklyWorkingHours.class);
        WeeklyWorkingHours weeklyWorkingHours1 = new WeeklyWorkingHours();
        weeklyWorkingHours1.setId(1L);
        WeeklyWorkingHours weeklyWorkingHours2 = new WeeklyWorkingHours();
        weeklyWorkingHours2.setId(weeklyWorkingHours1.getId());
        assertThat(weeklyWorkingHours1).isEqualTo(weeklyWorkingHours2);
        weeklyWorkingHours2.setId(2L);
        assertThat(weeklyWorkingHours1).isNotEqualTo(weeklyWorkingHours2);
        weeklyWorkingHours1.setId(null);
        assertThat(weeklyWorkingHours1).isNotEqualTo(weeklyWorkingHours2);
    }
}
