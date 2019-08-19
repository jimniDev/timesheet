package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.TargetWorkingDay;
import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.DayOfWeek;
import com.asscope.timesheet.repository.TargetWorkingDayRepository;
import com.asscope.timesheet.service.TargetWorkingDayService;
import com.asscope.timesheet.web.rest.errors.ExceptionTranslator;
import com.asscope.timesheet.service.TargetWorkingDayQueryService;

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
import java.util.List;

import static com.asscope.timesheet.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link TargetWorkingDayResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class TargetWorkingDayResourceIT {

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    @Autowired
    private TargetWorkingDayRepository targetWorkingDayRepository;

    @Autowired
    private TargetWorkingDayService targetWorkingDayService;

    @Autowired
    private TargetWorkingDayQueryService targetWorkingDayQueryService;

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

    private MockMvc restTargetWorkingDayMockMvc;

    private TargetWorkingDay targetWorkingDay;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TargetWorkingDayResource targetWorkingDayResource = new TargetWorkingDayResource(targetWorkingDayService, targetWorkingDayQueryService);
        this.restTargetWorkingDayMockMvc = MockMvcBuilders.standaloneSetup(targetWorkingDayResource)
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
    public static TargetWorkingDay createEntity(EntityManager em) {
        TargetWorkingDay targetWorkingDay = new TargetWorkingDay()
            .hours(DEFAULT_HOURS);
        return targetWorkingDay;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TargetWorkingDay createUpdatedEntity(EntityManager em) {
        TargetWorkingDay targetWorkingDay = new TargetWorkingDay()
            .hours(UPDATED_HOURS);
        return targetWorkingDay;
    }

    @BeforeEach
    public void initTest() {
        targetWorkingDay = createEntity(em);
    }

    @Test
    @Transactional
    public void createTargetWorkingDay() throws Exception {
        int databaseSizeBeforeCreate = targetWorkingDayRepository.findAll().size();

        // Create the TargetWorkingDay
        restTargetWorkingDayMockMvc.perform(post("/api/target-working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetWorkingDay)))
            .andExpect(status().isCreated());

        // Validate the TargetWorkingDay in the database
        List<TargetWorkingDay> targetWorkingDayList = targetWorkingDayRepository.findAll();
        assertThat(targetWorkingDayList).hasSize(databaseSizeBeforeCreate + 1);
        TargetWorkingDay testTargetWorkingDay = targetWorkingDayList.get(targetWorkingDayList.size() - 1);
        assertThat(testTargetWorkingDay.getHours()).isEqualTo(DEFAULT_HOURS);
    }

    @Test
    @Transactional
    public void createTargetWorkingDayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = targetWorkingDayRepository.findAll().size();

        // Create the TargetWorkingDay with an existing ID
        targetWorkingDay.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTargetWorkingDayMockMvc.perform(post("/api/target-working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetWorkingDay)))
            .andExpect(status().isBadRequest());

        // Validate the TargetWorkingDay in the database
        List<TargetWorkingDay> targetWorkingDayList = targetWorkingDayRepository.findAll();
        assertThat(targetWorkingDayList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkHoursIsRequired() throws Exception {
        int databaseSizeBeforeTest = targetWorkingDayRepository.findAll().size();
        // set the field null
        targetWorkingDay.setHours(null);

        // Create the TargetWorkingDay, which fails.

        restTargetWorkingDayMockMvc.perform(post("/api/target-working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetWorkingDay)))
            .andExpect(status().isBadRequest());

        List<TargetWorkingDay> targetWorkingDayList = targetWorkingDayRepository.findAll();
        assertThat(targetWorkingDayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTargetWorkingDays() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get all the targetWorkingDayList
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(targetWorkingDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)));
    }
    
    @Test
    @Transactional
    public void getTargetWorkingDay() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get the targetWorkingDay
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days/{id}", targetWorkingDay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(targetWorkingDay.getId().intValue()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS));
    }

    @Test
    @Transactional
    public void getAllTargetWorkingDaysByHoursIsEqualToSomething() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get all the targetWorkingDayList where hours equals to DEFAULT_HOURS
        defaultTargetWorkingDayShouldBeFound("hours.equals=" + DEFAULT_HOURS);

        // Get all the targetWorkingDayList where hours equals to UPDATED_HOURS
        defaultTargetWorkingDayShouldNotBeFound("hours.equals=" + UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void getAllTargetWorkingDaysByHoursIsInShouldWork() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get all the targetWorkingDayList where hours in DEFAULT_HOURS or UPDATED_HOURS
        defaultTargetWorkingDayShouldBeFound("hours.in=" + DEFAULT_HOURS + "," + UPDATED_HOURS);

        // Get all the targetWorkingDayList where hours equals to UPDATED_HOURS
        defaultTargetWorkingDayShouldNotBeFound("hours.in=" + UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void getAllTargetWorkingDaysByHoursIsNullOrNotNull() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get all the targetWorkingDayList where hours is not null
        defaultTargetWorkingDayShouldBeFound("hours.specified=true");

        // Get all the targetWorkingDayList where hours is null
        defaultTargetWorkingDayShouldNotBeFound("hours.specified=false");
    }

    @Test
    @Transactional
    public void getAllTargetWorkingDaysByHoursIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get all the targetWorkingDayList where hours greater than or equals to DEFAULT_HOURS
        defaultTargetWorkingDayShouldBeFound("hours.greaterOrEqualThan=" + DEFAULT_HOURS);

        // Get all the targetWorkingDayList where hours greater than or equals to UPDATED_HOURS
        defaultTargetWorkingDayShouldNotBeFound("hours.greaterOrEqualThan=" + UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void getAllTargetWorkingDaysByHoursIsLessThanSomething() throws Exception {
        // Initialize the database
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);

        // Get all the targetWorkingDayList where hours less than or equals to DEFAULT_HOURS
        defaultTargetWorkingDayShouldNotBeFound("hours.lessThan=" + DEFAULT_HOURS);

        // Get all the targetWorkingDayList where hours less than or equals to UPDATED_HOURS
        defaultTargetWorkingDayShouldBeFound("hours.lessThan=" + UPDATED_HOURS);
    }


    @Test
    @Transactional
    public void getAllTargetWorkingDaysByEmployeeIsEqualToSomething() throws Exception {
        // Initialize the database
        Employee employee = EmployeeResourceIT.createEntity(em);
        em.persist(employee);
        em.flush();
        targetWorkingDay.setEmployee(employee);
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);
        Long employeeId = employee.getId();

        // Get all the targetWorkingDayList where employee equals to employeeId
        defaultTargetWorkingDayShouldBeFound("employeeId.equals=" + employeeId);

        // Get all the targetWorkingDayList where employee equals to employeeId + 1
        defaultTargetWorkingDayShouldNotBeFound("employeeId.equals=" + (employeeId + 1));
    }


    @Test
    @Transactional
    public void getAllTargetWorkingDaysByDayOfWeekIsEqualToSomething() throws Exception {
        // Initialize the database
        DayOfWeek dayOfWeek = DayOfWeekResourceIT.createEntity(em);
        em.persist(dayOfWeek);
        em.flush();
        targetWorkingDay.setDayOfWeek(dayOfWeek);
        targetWorkingDayRepository.saveAndFlush(targetWorkingDay);
        Long dayOfWeekId = dayOfWeek.getId();

        // Get all the targetWorkingDayList where dayOfWeek equals to dayOfWeekId
        defaultTargetWorkingDayShouldBeFound("dayOfWeekId.equals=" + dayOfWeekId);

        // Get all the targetWorkingDayList where dayOfWeek equals to dayOfWeekId + 1
        defaultTargetWorkingDayShouldNotBeFound("dayOfWeekId.equals=" + (dayOfWeekId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTargetWorkingDayShouldBeFound(String filter) throws Exception {
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(targetWorkingDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)));

        // Check, that the count call also returns 1
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTargetWorkingDayShouldNotBeFound(String filter) throws Exception {
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingTargetWorkingDay() throws Exception {
        // Get the targetWorkingDay
        restTargetWorkingDayMockMvc.perform(get("/api/target-working-days/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTargetWorkingDay() throws Exception {
        // Initialize the database
        targetWorkingDayService.save(targetWorkingDay);

        int databaseSizeBeforeUpdate = targetWorkingDayRepository.findAll().size();

        // Update the targetWorkingDay
        TargetWorkingDay updatedTargetWorkingDay = targetWorkingDayRepository.findById(targetWorkingDay.getId()).get();
        // Disconnect from session so that the updates on updatedTargetWorkingDay are not directly saved in db
        em.detach(updatedTargetWorkingDay);
        updatedTargetWorkingDay
            .hours(UPDATED_HOURS);

        restTargetWorkingDayMockMvc.perform(put("/api/target-working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTargetWorkingDay)))
            .andExpect(status().isOk());

        // Validate the TargetWorkingDay in the database
        List<TargetWorkingDay> targetWorkingDayList = targetWorkingDayRepository.findAll();
        assertThat(targetWorkingDayList).hasSize(databaseSizeBeforeUpdate);
        TargetWorkingDay testTargetWorkingDay = targetWorkingDayList.get(targetWorkingDayList.size() - 1);
        assertThat(testTargetWorkingDay.getHours()).isEqualTo(UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void updateNonExistingTargetWorkingDay() throws Exception {
        int databaseSizeBeforeUpdate = targetWorkingDayRepository.findAll().size();

        // Create the TargetWorkingDay

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTargetWorkingDayMockMvc.perform(put("/api/target-working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetWorkingDay)))
            .andExpect(status().isBadRequest());

        // Validate the TargetWorkingDay in the database
        List<TargetWorkingDay> targetWorkingDayList = targetWorkingDayRepository.findAll();
        assertThat(targetWorkingDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTargetWorkingDay() throws Exception {
        // Initialize the database
        targetWorkingDayService.save(targetWorkingDay);

        int databaseSizeBeforeDelete = targetWorkingDayRepository.findAll().size();

        // Delete the targetWorkingDay
        restTargetWorkingDayMockMvc.perform(delete("/api/target-working-days/{id}", targetWorkingDay.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TargetWorkingDay> targetWorkingDayList = targetWorkingDayRepository.findAll();
        assertThat(targetWorkingDayList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TargetWorkingDay.class);
        TargetWorkingDay targetWorkingDay1 = new TargetWorkingDay();
        targetWorkingDay1.setId(1L);
        TargetWorkingDay targetWorkingDay2 = new TargetWorkingDay();
        targetWorkingDay2.setId(targetWorkingDay1.getId());
        assertThat(targetWorkingDay1).isEqualTo(targetWorkingDay2);
        targetWorkingDay2.setId(2L);
        assertThat(targetWorkingDay1).isNotEqualTo(targetWorkingDay2);
        targetWorkingDay1.setId(null);
        assertThat(targetWorkingDay1).isNotEqualTo(targetWorkingDay2);
    }
}
