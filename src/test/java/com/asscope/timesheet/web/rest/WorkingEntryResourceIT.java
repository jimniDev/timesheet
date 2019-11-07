package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.Activity;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.repository.WorkingEntryRepository;
import com.asscope.timesheet.service.WorkingEntryService;
import com.asscope.timesheet.web.rest.errors.ExceptionTranslator;
import com.asscope.timesheet.service.EmployeeService;

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
 * Integration tests for the {@Link WorkingEntryResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class WorkingEntryResourceIT {

    private static final Instant DEFAULT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_DELETE_FLAG = false;
    private static final Boolean UPDATED_DELETE_FLAG = true;

    private static final Boolean DEFAULT_LOCKED_FLAG = false;
    private static final Boolean UPDATED_LOCKED_FLAG = true;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private WorkingEntryRepository workingEntryRepository;

    @Autowired
    private WorkingEntryService workingEntryService;
    
    @Autowired
    private EmployeeService employeeService;

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

    private MockMvc restWorkingEntryMockMvc;

    private WorkingEntry workingEntry;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WorkingEntryResource workingEntryResource = new WorkingEntryResource(workingEntryService, employeeService);
        this.restWorkingEntryMockMvc = MockMvcBuilders.standaloneSetup(workingEntryResource)
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
    public static WorkingEntry createEntity(EntityManager em) {
        WorkingEntry workingEntry = new WorkingEntry()
            .start(DEFAULT_START)
            .end(DEFAULT_END)
            .deleted(DEFAULT_DELETE_FLAG)
            .locked(DEFAULT_LOCKED_FLAG);
//            .createdAt(DEFAULT_CREATED_AT);
        return workingEntry;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkingEntry createUpdatedEntity(EntityManager em) {
        WorkingEntry workingEntry = new WorkingEntry()
            .start(UPDATED_START)
            .end(UPDATED_END)
            .deleted(UPDATED_DELETE_FLAG)
            .locked(UPDATED_LOCKED_FLAG);
//            .createdAt(UPDATED_CREATED_AT);
        return workingEntry;
    }

    @BeforeEach
    public void initTest() {
        workingEntry = createEntity(em);
    }

    @Test
    @Transactional
    public void createWorkingEntry() throws Exception {
        int databaseSizeBeforeCreate = workingEntryRepository.findAll().size();

        // Create the WorkingEntry
        restWorkingEntryMockMvc.perform(post("/api/working-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingEntry)))
            .andExpect(status().isCreated());

        // Validate the WorkingEntry in the database
        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeCreate + 1);
        WorkingEntry testWorkingEntry = workingEntryList.get(workingEntryList.size() - 1);
        assertThat(testWorkingEntry.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testWorkingEntry.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testWorkingEntry.isDeleted()).isEqualTo(DEFAULT_DELETE_FLAG);
        assertThat(testWorkingEntry.isLocked()).isEqualTo(DEFAULT_LOCKED_FLAG);
//        assertThat(testWorkingEntry.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    public void createWorkingEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = workingEntryRepository.findAll().size();

        // Create the WorkingEntry with an existing ID
        workingEntry.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkingEntryMockMvc.perform(post("/api/working-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingEntry)))
            .andExpect(status().isBadRequest());

        // Validate the WorkingEntry in the database
        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = workingEntryRepository.findAll().size();
        // set the field null
        workingEntry.setStart(null);

        // Create the WorkingEntry, which fails.

        restWorkingEntryMockMvc.perform(post("/api/working-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingEntry)))
            .andExpect(status().isBadRequest());

        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = workingEntryRepository.findAll().size();
        // set the field null
        workingEntry.setEnd(null);

        // Create the WorkingEntry, which fails.

        restWorkingEntryMockMvc.perform(post("/api/working-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingEntry)))
            .andExpect(status().isBadRequest());

        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeTest);
    }

//    @Test
//    @Transactional
//    public void checkCreatedAtIsRequired() throws Exception {
//        int databaseSizeBeforeTest = workingEntryRepository.findAll().size();
//        // set the field null
//        workingEntry.setCreatedAt(null);
//
//        // Create the WorkingEntry, which fails.
//
//        restWorkingEntryMockMvc.perform(post("/api/working-entries")
//            .contentType(TestUtil.APPLICATION_JSON_UTF8)
//            .content(TestUtil.convertObjectToJsonBytes(workingEntry)))
//            .andExpect(status().isBadRequest());
//
//        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
//        assertThat(workingEntryList).hasSize(databaseSizeBeforeTest);
//    }

    @Test
    @Transactional
    public void getAllWorkingEntries() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList
        restWorkingEntryMockMvc.perform(get("/api/working-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workingEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].deleteFlag").value(hasItem(DEFAULT_DELETE_FLAG.booleanValue())))
            .andExpect(jsonPath("$.[*].lockedFlag").value(hasItem(DEFAULT_LOCKED_FLAG.booleanValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }
    
    @Test
    @Transactional
    public void getWorkingEntry() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get the workingEntry
        restWorkingEntryMockMvc.perform(get("/api/working-entries/{id}", workingEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(workingEntry.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.deleteFlag").value(DEFAULT_DELETE_FLAG.booleanValue()))
            .andExpect(jsonPath("$.lockedFlag").value(DEFAULT_LOCKED_FLAG.booleanValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByStartIsEqualToSomething() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where start equals to DEFAULT_START
        defaultWorkingEntryShouldBeFound("start.equals=" + DEFAULT_START);

        // Get all the workingEntryList where start equals to UPDATED_START
        defaultWorkingEntryShouldNotBeFound("start.equals=" + UPDATED_START);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByStartIsInShouldWork() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where start in DEFAULT_START or UPDATED_START
        defaultWorkingEntryShouldBeFound("start.in=" + DEFAULT_START + "," + UPDATED_START);

        // Get all the workingEntryList where start equals to UPDATED_START
        defaultWorkingEntryShouldNotBeFound("start.in=" + UPDATED_START);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByStartIsNullOrNotNull() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where start is not null
        defaultWorkingEntryShouldBeFound("start.specified=true");

        // Get all the workingEntryList where start is null
        defaultWorkingEntryShouldNotBeFound("start.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByEndIsEqualToSomething() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where end equals to DEFAULT_END
        defaultWorkingEntryShouldBeFound("end.equals=" + DEFAULT_END);

        // Get all the workingEntryList where end equals to UPDATED_END
        defaultWorkingEntryShouldNotBeFound("end.equals=" + UPDATED_END);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByEndIsInShouldWork() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where end in DEFAULT_END or UPDATED_END
        defaultWorkingEntryShouldBeFound("end.in=" + DEFAULT_END + "," + UPDATED_END);

        // Get all the workingEntryList where end equals to UPDATED_END
        defaultWorkingEntryShouldNotBeFound("end.in=" + UPDATED_END);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByEndIsNullOrNotNull() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where end is not null
        defaultWorkingEntryShouldBeFound("end.specified=true");

        // Get all the workingEntryList where end is null
        defaultWorkingEntryShouldNotBeFound("end.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByDeleteFlagIsEqualToSomething() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where deleteFlag equals to DEFAULT_DELETE_FLAG
        defaultWorkingEntryShouldBeFound("deleteFlag.equals=" + DEFAULT_DELETE_FLAG);

        // Get all the workingEntryList where deleteFlag equals to UPDATED_DELETE_FLAG
        defaultWorkingEntryShouldNotBeFound("deleteFlag.equals=" + UPDATED_DELETE_FLAG);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByDeleteFlagIsInShouldWork() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where deleteFlag in DEFAULT_DELETE_FLAG or UPDATED_DELETE_FLAG
        defaultWorkingEntryShouldBeFound("deleteFlag.in=" + DEFAULT_DELETE_FLAG + "," + UPDATED_DELETE_FLAG);

        // Get all the workingEntryList where deleteFlag equals to UPDATED_DELETE_FLAG
        defaultWorkingEntryShouldNotBeFound("deleteFlag.in=" + UPDATED_DELETE_FLAG);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByDeleteFlagIsNullOrNotNull() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where deleteFlag is not null
        defaultWorkingEntryShouldBeFound("deleteFlag.specified=true");

        // Get all the workingEntryList where deleteFlag is null
        defaultWorkingEntryShouldNotBeFound("deleteFlag.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByLockedFlagIsEqualToSomething() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where lockedFlag equals to DEFAULT_LOCKED_FLAG
        defaultWorkingEntryShouldBeFound("lockedFlag.equals=" + DEFAULT_LOCKED_FLAG);

        // Get all the workingEntryList where lockedFlag equals to UPDATED_LOCKED_FLAG
        defaultWorkingEntryShouldNotBeFound("lockedFlag.equals=" + UPDATED_LOCKED_FLAG);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByLockedFlagIsInShouldWork() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where lockedFlag in DEFAULT_LOCKED_FLAG or UPDATED_LOCKED_FLAG
        defaultWorkingEntryShouldBeFound("lockedFlag.in=" + DEFAULT_LOCKED_FLAG + "," + UPDATED_LOCKED_FLAG);

        // Get all the workingEntryList where lockedFlag equals to UPDATED_LOCKED_FLAG
        defaultWorkingEntryShouldNotBeFound("lockedFlag.in=" + UPDATED_LOCKED_FLAG);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByLockedFlagIsNullOrNotNull() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where lockedFlag is not null
        defaultWorkingEntryShouldBeFound("lockedFlag.specified=true");

        // Get all the workingEntryList where lockedFlag is null
        defaultWorkingEntryShouldNotBeFound("lockedFlag.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where createdAt equals to DEFAULT_CREATED_AT
        defaultWorkingEntryShouldBeFound("createdAt.equals=" + DEFAULT_CREATED_AT);

        // Get all the workingEntryList where createdAt equals to UPDATED_CREATED_AT
        defaultWorkingEntryShouldNotBeFound("createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where createdAt in DEFAULT_CREATED_AT or UPDATED_CREATED_AT
        defaultWorkingEntryShouldBeFound("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT);

        // Get all the workingEntryList where createdAt equals to UPDATED_CREATED_AT
        defaultWorkingEntryShouldNotBeFound("createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        workingEntryRepository.saveAndFlush(workingEntry);

        // Get all the workingEntryList where createdAt is not null
        defaultWorkingEntryShouldBeFound("createdAt.specified=true");

        // Get all the workingEntryList where createdAt is null
        defaultWorkingEntryShouldNotBeFound("createdAt.specified=false");
    }

    @Test
    @Transactional
    public void getAllWorkingEntriesByEmployeeIsEqualToSomething() throws Exception {
        // Initialize the database
        Employee employee = EmployeeResourceIT.createEntity(em);
        em.persist(employee);
        em.flush();
        workingEntry.setEmployee(employee);
        workingEntryRepository.saveAndFlush(workingEntry);
        Long employeeId = employee.getId();

        // Get all the workingEntryList where employee equals to employeeId
        defaultWorkingEntryShouldBeFound("employeeId.equals=" + employeeId);

        // Get all the workingEntryList where employee equals to employeeId + 1
        defaultWorkingEntryShouldNotBeFound("employeeId.equals=" + (employeeId + 1));
    }


    @Test
    @Transactional
    public void getAllWorkingEntriesByActivityIsEqualToSomething() throws Exception {
        // Initialize the database
        Activity activity = ActivityResourceIT.createEntity(em);
        em.persist(activity);
        em.flush();
        workingEntry.setActivity(activity);
        workingEntryRepository.saveAndFlush(workingEntry);
        Long activityId = activity.getId();

        // Get all the workingEntryList where activity equals to activityId
        defaultWorkingEntryShouldBeFound("activityId.equals=" + activityId);

        // Get all the workingEntryList where activity equals to activityId + 1
        defaultWorkingEntryShouldNotBeFound("activityId.equals=" + (activityId + 1));
    }


    @Test
    @Transactional
    public void getAllWorkingEntriesByWorkDayIsEqualToSomething() throws Exception {
        // Initialize the database
        WorkDay workDay = WorkDayResourceIT.createEntity(em);
        em.persist(workDay);
        em.flush();
        workingEntry.setWorkDay(workDay);
        workingEntryRepository.saveAndFlush(workingEntry);
        Long workDayId = workDay.getId();

        // Get all the workingEntryList where workDay equals to workDayId
        defaultWorkingEntryShouldBeFound("workDayId.equals=" + workDayId);

        // Get all the workingEntryList where workDay equals to workDayId + 1
        defaultWorkingEntryShouldNotBeFound("workDayId.equals=" + (workDayId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultWorkingEntryShouldBeFound(String filter) throws Exception {
        restWorkingEntryMockMvc.perform(get("/api/working-entries?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workingEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].deleteFlag").value(hasItem(DEFAULT_DELETE_FLAG.booleanValue())))
            .andExpect(jsonPath("$.[*].lockedFlag").value(hasItem(DEFAULT_LOCKED_FLAG.booleanValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));

        // Check, that the count call also returns 1
        restWorkingEntryMockMvc.perform(get("/api/working-entries/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultWorkingEntryShouldNotBeFound(String filter) throws Exception {
        restWorkingEntryMockMvc.perform(get("/api/working-entries?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restWorkingEntryMockMvc.perform(get("/api/working-entries/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingWorkingEntry() throws Exception {
        // Get the workingEntry
        restWorkingEntryMockMvc.perform(get("/api/working-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorkingEntry() throws Exception {
        // Initialize the database
        workingEntryService.save(workingEntry);

        int databaseSizeBeforeUpdate = workingEntryRepository.findAll().size();

        // Update the workingEntry
        WorkingEntry updatedWorkingEntry = workingEntryRepository.findById(workingEntry.getId()).get();
        // Disconnect from session so that the updates on updatedWorkingEntry are not directly saved in db
        em.detach(updatedWorkingEntry);
        updatedWorkingEntry
            .start(UPDATED_START)
            .end(UPDATED_END)
            .deleted(UPDATED_DELETE_FLAG)
            .locked(UPDATED_LOCKED_FLAG);
//            .createdAt(UPDATED_CREATED_AT);

        restWorkingEntryMockMvc.perform(put("/api/working-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorkingEntry)))
            .andExpect(status().isOk());

        // Validate the WorkingEntry in the database
        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeUpdate);
        WorkingEntry testWorkingEntry = workingEntryList.get(workingEntryList.size() - 1);
        assertThat(testWorkingEntry.getStart()).isEqualTo(UPDATED_START);
        assertThat(testWorkingEntry.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testWorkingEntry.isDeleted()).isEqualTo(UPDATED_DELETE_FLAG);
        assertThat(testWorkingEntry.isLocked()).isEqualTo(UPDATED_LOCKED_FLAG);
//        assertThat(testWorkingEntry.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    public void updateNonExistingWorkingEntry() throws Exception {
        int databaseSizeBeforeUpdate = workingEntryRepository.findAll().size();

        // Create the WorkingEntry

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkingEntryMockMvc.perform(put("/api/working-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingEntry)))
            .andExpect(status().isBadRequest());

        // Validate the WorkingEntry in the database
        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWorkingEntry() throws Exception {
        // Initialize the database
        workingEntryService.save(workingEntry);

        int databaseSizeBeforeDelete = workingEntryRepository.findAll().size();

        // Delete the workingEntry
        restWorkingEntryMockMvc.perform(delete("/api/working-entries/{id}", workingEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkingEntry> workingEntryList = workingEntryRepository.findAll();
        assertThat(workingEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkingEntry.class);
        WorkingEntry workingEntry1 = new WorkingEntry();
        workingEntry1.setId(1L);
        WorkingEntry workingEntry2 = new WorkingEntry();
        workingEntry2.setId(workingEntry1.getId());
        assertThat(workingEntry1).isEqualTo(workingEntry2);
        workingEntry2.setId(2L);
        assertThat(workingEntry1).isNotEqualTo(workingEntry2);
        workingEntry1.setId(null);
        assertThat(workingEntry1).isNotEqualTo(workingEntry2);
    }
}
