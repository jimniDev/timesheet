package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.domain.WorkBreak;
import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.repository.WorkDayRepository;
import com.asscope.timesheet.service.WorkDayService;
import com.asscope.timesheet.web.rest.errors.ExceptionTranslator;
import com.asscope.timesheet.service.dto.WorkDayCriteria;
import com.asscope.timesheet.service.WorkDayQueryService;

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
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.asscope.timesheet.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link WorkDayResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class WorkDayResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private WorkDayRepository workDayRepository;

    @Autowired
    private WorkDayService workDayService;

    @Autowired
    private WorkDayQueryService workDayQueryService;

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

    private MockMvc restWorkDayMockMvc;

    private WorkDay workDay;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WorkDayResource workDayResource = new WorkDayResource(workDayService, workDayQueryService);
        this.restWorkDayMockMvc = MockMvcBuilders.standaloneSetup(workDayResource)
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
    public static WorkDay createEntity(EntityManager em) {
        WorkDay workDay = new WorkDay()
            .date(DEFAULT_DATE);
        return workDay;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkDay createUpdatedEntity(EntityManager em) {
        WorkDay workDay = new WorkDay()
            .date(UPDATED_DATE);
        return workDay;
    }

    @BeforeEach
    public void initTest() {
        workDay = createEntity(em);
    }

    @Test
    @Transactional
    public void createWorkDay() throws Exception {
        int databaseSizeBeforeCreate = workDayRepository.findAll().size();

        // Create the WorkDay
        restWorkDayMockMvc.perform(post("/api/work-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workDay)))
            .andExpect(status().isCreated());

        // Validate the WorkDay in the database
        List<WorkDay> workDayList = workDayRepository.findAll();
        assertThat(workDayList).hasSize(databaseSizeBeforeCreate + 1);
        WorkDay testWorkDay = workDayList.get(workDayList.size() - 1);
        assertThat(testWorkDay.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createWorkDayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = workDayRepository.findAll().size();

        // Create the WorkDay with an existing ID
        workDay.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkDayMockMvc.perform(post("/api/work-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workDay)))
            .andExpect(status().isBadRequest());

        // Validate the WorkDay in the database
        List<WorkDay> workDayList = workDayRepository.findAll();
        assertThat(workDayList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = workDayRepository.findAll().size();
        // set the field null
        workDay.setDate(null);

        // Create the WorkDay, which fails.

        restWorkDayMockMvc.perform(post("/api/work-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workDay)))
            .andExpect(status().isBadRequest());

        List<WorkDay> workDayList = workDayRepository.findAll();
        assertThat(workDayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWorkDays() throws Exception {
        // Initialize the database
        workDayRepository.saveAndFlush(workDay);

        // Get all the workDayList
        restWorkDayMockMvc.perform(get("/api/work-days?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getWorkDay() throws Exception {
        // Initialize the database
        workDayRepository.saveAndFlush(workDay);

        // Get the workDay
        restWorkDayMockMvc.perform(get("/api/work-days/{id}", workDay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(workDay.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getAllWorkDaysByDateIsEqualToSomething() throws Exception {
        // Initialize the database
        workDayRepository.saveAndFlush(workDay);

        // Get all the workDayList where date equals to DEFAULT_DATE
        defaultWorkDayShouldBeFound("date.equals=" + DEFAULT_DATE);

        // Get all the workDayList where date equals to UPDATED_DATE
        defaultWorkDayShouldNotBeFound("date.equals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllWorkDaysByDateIsInShouldWork() throws Exception {
        // Initialize the database
        workDayRepository.saveAndFlush(workDay);

        // Get all the workDayList where date in DEFAULT_DATE or UPDATED_DATE
        defaultWorkDayShouldBeFound("date.in=" + DEFAULT_DATE + "," + UPDATED_DATE);

        // Get all the workDayList where date equals to UPDATED_DATE
        defaultWorkDayShouldNotBeFound("date.in=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllWorkDaysByDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        workDayRepository.saveAndFlush(workDay);

        // Get all the workDayList where date is not null
        defaultWorkDayShouldBeFound("date.specified=true");

        // Get all the workDayList where date is null
        defaultWorkDayShouldNotBeFound("date.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkDaysByWorkingEntryIsEqualToSomething() throws Exception {
        // Initialize the database
        WorkingEntry workingEntry = WorkingEntryResourceIT.createEntity(em);
        em.persist(workingEntry);
        em.flush();
        workDay.addWorkingEntry(workingEntry);
        workDayRepository.saveAndFlush(workDay);
        Long workingEntryId = workingEntry.getId();

        // Get all the workDayList where workingEntry equals to workingEntryId
        defaultWorkDayShouldBeFound("workingEntryId.equals=" + workingEntryId);

        // Get all the workDayList where workingEntry equals to workingEntryId + 1
        defaultWorkDayShouldNotBeFound("workingEntryId.equals=" + (workingEntryId + 1));
    }


    @Test
    @Transactional
    public void getAllWorkDaysByWorkBreakIsEqualToSomething() throws Exception {
        // Initialize the database
        WorkBreak workBreak = WorkBreakResourceIT.createEntity(em);
        em.persist(workBreak);
        em.flush();
        workDay.addWorkBreak(workBreak);
        workDayRepository.saveAndFlush(workDay);
        Long workBreakId = workBreak.getId();

        // Get all the workDayList where workBreak equals to workBreakId
        defaultWorkDayShouldBeFound("workBreakId.equals=" + workBreakId);

        // Get all the workDayList where workBreak equals to workBreakId + 1
        defaultWorkDayShouldNotBeFound("workBreakId.equals=" + (workBreakId + 1));
    }


    @Test
    @Transactional
    public void getAllWorkDaysByEmployeeIsEqualToSomething() throws Exception {
        // Initialize the database
        Employee employee = EmployeeResourceIT.createEntity(em);
        em.persist(employee);
        em.flush();
        workDay.setEmployee(employee);
        workDayRepository.saveAndFlush(workDay);
        Long employeeId = employee.getId();

        // Get all the workDayList where employee equals to employeeId
        defaultWorkDayShouldBeFound("employeeId.equals=" + employeeId);

        // Get all the workDayList where employee equals to employeeId + 1
        defaultWorkDayShouldNotBeFound("employeeId.equals=" + (employeeId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultWorkDayShouldBeFound(String filter) throws Exception {
        restWorkDayMockMvc.perform(get("/api/work-days?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));

        // Check, that the count call also returns 1
        restWorkDayMockMvc.perform(get("/api/work-days/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultWorkDayShouldNotBeFound(String filter) throws Exception {
        restWorkDayMockMvc.perform(get("/api/work-days?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restWorkDayMockMvc.perform(get("/api/work-days/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingWorkDay() throws Exception {
        // Get the workDay
        restWorkDayMockMvc.perform(get("/api/work-days/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorkDay() throws Exception {
        // Initialize the database
        workDayService.save(workDay);

        int databaseSizeBeforeUpdate = workDayRepository.findAll().size();

        // Update the workDay
        WorkDay updatedWorkDay = workDayRepository.findById(workDay.getId()).get();
        // Disconnect from session so that the updates on updatedWorkDay are not directly saved in db
        em.detach(updatedWorkDay);
        updatedWorkDay
            .date(UPDATED_DATE);

        restWorkDayMockMvc.perform(put("/api/work-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorkDay)))
            .andExpect(status().isOk());

        // Validate the WorkDay in the database
        List<WorkDay> workDayList = workDayRepository.findAll();
        assertThat(workDayList).hasSize(databaseSizeBeforeUpdate);
        WorkDay testWorkDay = workDayList.get(workDayList.size() - 1);
        assertThat(testWorkDay.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingWorkDay() throws Exception {
        int databaseSizeBeforeUpdate = workDayRepository.findAll().size();

        // Create the WorkDay

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkDayMockMvc.perform(put("/api/work-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workDay)))
            .andExpect(status().isBadRequest());

        // Validate the WorkDay in the database
        List<WorkDay> workDayList = workDayRepository.findAll();
        assertThat(workDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWorkDay() throws Exception {
        // Initialize the database
        workDayService.save(workDay);

        int databaseSizeBeforeDelete = workDayRepository.findAll().size();

        // Delete the workDay
        restWorkDayMockMvc.perform(delete("/api/work-days/{id}", workDay.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkDay> workDayList = workDayRepository.findAll();
        assertThat(workDayList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkDay.class);
        WorkDay workDay1 = new WorkDay();
        workDay1.setId(1L);
        WorkDay workDay2 = new WorkDay();
        workDay2.setId(workDay1.getId());
        assertThat(workDay1).isEqualTo(workDay2);
        workDay2.setId(2L);
        assertThat(workDay1).isNotEqualTo(workDay2);
        workDay1.setId(null);
        assertThat(workDay1).isNotEqualTo(workDay2);
    }
}
