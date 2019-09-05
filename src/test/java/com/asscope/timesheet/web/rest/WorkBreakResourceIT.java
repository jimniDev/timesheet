package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.WorkBreak;
import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.repository.WorkBreakRepository;
import com.asscope.timesheet.service.WorkBreakService;
import com.asscope.timesheet.web.rest.errors.ExceptionTranslator;

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
 * Integration tests for the {@Link WorkBreakResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class WorkBreakResourceIT {

    private static final Integer DEFAULT_MINUTES = 1;
    private static final Integer UPDATED_MINUTES = 2;

    @Autowired
    private WorkBreakRepository workBreakRepository;

    @Autowired
    private WorkBreakService workBreakService;

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

    private MockMvc restWorkBreakMockMvc;

    private WorkBreak workBreak;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WorkBreakResource workBreakResource = new WorkBreakResource(workBreakService);
        this.restWorkBreakMockMvc = MockMvcBuilders.standaloneSetup(workBreakResource)
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
    public static WorkBreak createEntity(EntityManager em) {
        WorkBreak workBreak = new WorkBreak()
            .minutes(DEFAULT_MINUTES);
        return workBreak;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkBreak createUpdatedEntity(EntityManager em) {
        WorkBreak workBreak = new WorkBreak()
            .minutes(UPDATED_MINUTES);
        return workBreak;
    }

    @BeforeEach
    public void initTest() {
        workBreak = createEntity(em);
    }

    @Test
    @Transactional
    public void createWorkBreak() throws Exception {
        int databaseSizeBeforeCreate = workBreakRepository.findAll().size();

        // Create the WorkBreak
        restWorkBreakMockMvc.perform(post("/api/work-breaks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workBreak)))
            .andExpect(status().isCreated());

        // Validate the WorkBreak in the database
        List<WorkBreak> workBreakList = workBreakRepository.findAll();
        assertThat(workBreakList).hasSize(databaseSizeBeforeCreate + 1);
        WorkBreak testWorkBreak = workBreakList.get(workBreakList.size() - 1);
        assertThat(testWorkBreak.getMinutes()).isEqualTo(DEFAULT_MINUTES);
    }

    @Test
    @Transactional
    public void createWorkBreakWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = workBreakRepository.findAll().size();

        // Create the WorkBreak with an existing ID
        workBreak.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkBreakMockMvc.perform(post("/api/work-breaks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workBreak)))
            .andExpect(status().isBadRequest());

        // Validate the WorkBreak in the database
        List<WorkBreak> workBreakList = workBreakRepository.findAll();
        assertThat(workBreakList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkMinutesIsRequired() throws Exception {
        int databaseSizeBeforeTest = workBreakRepository.findAll().size();
        // set the field null
        workBreak.setMinutes(null);

        // Create the WorkBreak, which fails.

        restWorkBreakMockMvc.perform(post("/api/work-breaks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workBreak)))
            .andExpect(status().isBadRequest());

        List<WorkBreak> workBreakList = workBreakRepository.findAll();
        assertThat(workBreakList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWorkBreaks() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get all the workBreakList
        restWorkBreakMockMvc.perform(get("/api/work-breaks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workBreak.getId().intValue())))
            .andExpect(jsonPath("$.[*].minutes").value(hasItem(DEFAULT_MINUTES)));
    }
    
    @Test
    @Transactional
    public void getWorkBreak() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get the workBreak
        restWorkBreakMockMvc.perform(get("/api/work-breaks/{id}", workBreak.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(workBreak.getId().intValue()))
            .andExpect(jsonPath("$.minutes").value(DEFAULT_MINUTES));
    }

    @Test
    @Transactional
    public void getAllWorkBreaksByMinutesIsEqualToSomething() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get all the workBreakList where minutes equals to DEFAULT_MINUTES
        defaultWorkBreakShouldBeFound("minutes.equals=" + DEFAULT_MINUTES);

        // Get all the workBreakList where minutes equals to UPDATED_MINUTES
        defaultWorkBreakShouldNotBeFound("minutes.equals=" + UPDATED_MINUTES);
    }

    @Test
    @Transactional
    public void getAllWorkBreaksByMinutesIsInShouldWork() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get all the workBreakList where minutes in DEFAULT_MINUTES or UPDATED_MINUTES
        defaultWorkBreakShouldBeFound("minutes.in=" + DEFAULT_MINUTES + "," + UPDATED_MINUTES);

        // Get all the workBreakList where minutes equals to UPDATED_MINUTES
        defaultWorkBreakShouldNotBeFound("minutes.in=" + UPDATED_MINUTES);
    }

    @Test
    @Transactional
    public void getAllWorkBreaksByMinutesIsNullOrNotNull() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get all the workBreakList where minutes is not null
        defaultWorkBreakShouldBeFound("minutes.specified=true");

        // Get all the workBreakList where minutes is null
        defaultWorkBreakShouldNotBeFound("minutes.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkBreaksByMinutesIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get all the workBreakList where minutes greater than or equals to DEFAULT_MINUTES
        defaultWorkBreakShouldBeFound("minutes.greaterOrEqualThan=" + DEFAULT_MINUTES);

        // Get all the workBreakList where minutes greater than or equals to UPDATED_MINUTES
        defaultWorkBreakShouldNotBeFound("minutes.greaterOrEqualThan=" + UPDATED_MINUTES);
    }

    @Test
    @Transactional
    public void getAllWorkBreaksByMinutesIsLessThanSomething() throws Exception {
        // Initialize the database
        workBreakRepository.saveAndFlush(workBreak);

        // Get all the workBreakList where minutes less than or equals to DEFAULT_MINUTES
        defaultWorkBreakShouldNotBeFound("minutes.lessThan=" + DEFAULT_MINUTES);

        // Get all the workBreakList where minutes less than or equals to UPDATED_MINUTES
        defaultWorkBreakShouldBeFound("minutes.lessThan=" + UPDATED_MINUTES);
    }


    @Test
    @Transactional
    public void getAllWorkBreaksByEmployeeIsEqualToSomething() throws Exception {
        // Initialize the database
        Employee employee = EmployeeResourceIT.createEntity(em);
        em.persist(employee);
        em.flush();
        workBreak.setEmployee(employee);
        workBreakRepository.saveAndFlush(workBreak);
        Long employeeId = employee.getId();

        // Get all the workBreakList where employee equals to employeeId
        defaultWorkBreakShouldBeFound("employeeId.equals=" + employeeId);

        // Get all the workBreakList where employee equals to employeeId + 1
        defaultWorkBreakShouldNotBeFound("employeeId.equals=" + (employeeId + 1));
    }


    @Test
    @Transactional
    public void getAllWorkBreaksByWorkDayIsEqualToSomething() throws Exception {
        // Initialize the database
        WorkDay workDay = WorkDayResourceIT.createEntity(em);
        em.persist(workDay);
        em.flush();
        workBreak.setWorkDay(workDay);
        workBreakRepository.saveAndFlush(workBreak);
        Long workDayId = workDay.getId();

        // Get all the workBreakList where workDay equals to workDayId
        defaultWorkBreakShouldBeFound("workDayId.equals=" + workDayId);

        // Get all the workBreakList where workDay equals to workDayId + 1
        defaultWorkBreakShouldNotBeFound("workDayId.equals=" + (workDayId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultWorkBreakShouldBeFound(String filter) throws Exception {
        restWorkBreakMockMvc.perform(get("/api/work-breaks?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workBreak.getId().intValue())))
            .andExpect(jsonPath("$.[*].minutes").value(hasItem(DEFAULT_MINUTES)));

        // Check, that the count call also returns 1
        restWorkBreakMockMvc.perform(get("/api/work-breaks/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultWorkBreakShouldNotBeFound(String filter) throws Exception {
        restWorkBreakMockMvc.perform(get("/api/work-breaks?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restWorkBreakMockMvc.perform(get("/api/work-breaks/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingWorkBreak() throws Exception {
        // Get the workBreak
        restWorkBreakMockMvc.perform(get("/api/work-breaks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorkBreak() throws Exception {
        // Initialize the database
        workBreakService.save(workBreak);

        int databaseSizeBeforeUpdate = workBreakRepository.findAll().size();

        // Update the workBreak
        WorkBreak updatedWorkBreak = workBreakRepository.findById(workBreak.getId()).get();
        // Disconnect from session so that the updates on updatedWorkBreak are not directly saved in db
        em.detach(updatedWorkBreak);
        updatedWorkBreak
            .minutes(UPDATED_MINUTES);

        restWorkBreakMockMvc.perform(put("/api/work-breaks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorkBreak)))
            .andExpect(status().isOk());

        // Validate the WorkBreak in the database
        List<WorkBreak> workBreakList = workBreakRepository.findAll();
        assertThat(workBreakList).hasSize(databaseSizeBeforeUpdate);
        WorkBreak testWorkBreak = workBreakList.get(workBreakList.size() - 1);
        assertThat(testWorkBreak.getMinutes()).isEqualTo(UPDATED_MINUTES);
    }

    @Test
    @Transactional
    public void updateNonExistingWorkBreak() throws Exception {
        int databaseSizeBeforeUpdate = workBreakRepository.findAll().size();

        // Create the WorkBreak

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkBreakMockMvc.perform(put("/api/work-breaks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workBreak)))
            .andExpect(status().isBadRequest());

        // Validate the WorkBreak in the database
        List<WorkBreak> workBreakList = workBreakRepository.findAll();
        assertThat(workBreakList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWorkBreak() throws Exception {
        // Initialize the database
        workBreakService.save(workBreak);

        int databaseSizeBeforeDelete = workBreakRepository.findAll().size();

        // Delete the workBreak
        restWorkBreakMockMvc.perform(delete("/api/work-breaks/{id}", workBreak.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkBreak> workBreakList = workBreakRepository.findAll();
        assertThat(workBreakList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkBreak.class);
        WorkBreak workBreak1 = new WorkBreak();
        workBreak1.setId(1L);
        WorkBreak workBreak2 = new WorkBreak();
        workBreak2.setId(workBreak1.getId());
        assertThat(workBreak1).isEqualTo(workBreak2);
        workBreak2.setId(2L);
        assertThat(workBreak1).isNotEqualTo(workBreak2);
        workBreak1.setId(null);
        assertThat(workBreak1).isNotEqualTo(workBreak2);
    }
}
