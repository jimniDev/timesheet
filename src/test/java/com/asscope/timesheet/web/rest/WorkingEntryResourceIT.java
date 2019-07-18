package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.repository.WorkingEntryRepository;
import com.asscope.timesheet.service.WorkingEntryService;
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

    @Autowired
    private WorkingEntryRepository workingEntryRepository;

    @Autowired
    private WorkingEntryService workingEntryService;

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
        final WorkingEntryResource workingEntryResource = new WorkingEntryResource(workingEntryService);
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
            .deleteFlag(DEFAULT_DELETE_FLAG);
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
            .deleteFlag(UPDATED_DELETE_FLAG);
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
        assertThat(testWorkingEntry.isDeleteFlag()).isEqualTo(DEFAULT_DELETE_FLAG);
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
            .andExpect(jsonPath("$.[*].deleteFlag").value(hasItem(DEFAULT_DELETE_FLAG.booleanValue())));
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
            .andExpect(jsonPath("$.deleteFlag").value(DEFAULT_DELETE_FLAG.booleanValue()));
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
            .deleteFlag(UPDATED_DELETE_FLAG);

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
        assertThat(testWorkingEntry.isDeleteFlag()).isEqualTo(UPDATED_DELETE_FLAG);
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
