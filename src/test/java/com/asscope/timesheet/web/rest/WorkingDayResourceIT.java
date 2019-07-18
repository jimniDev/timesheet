package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.WorkingDay;
import com.asscope.timesheet.repository.WorkingDayRepository;
import com.asscope.timesheet.service.WorkingDayService;
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
 * Integration tests for the {@Link WorkingDayResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class WorkingDayResourceIT {

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    @Autowired
    private WorkingDayRepository workingDayRepository;

    @Autowired
    private WorkingDayService workingDayService;

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

    private MockMvc restWorkingDayMockMvc;

    private WorkingDay workingDay;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WorkingDayResource workingDayResource = new WorkingDayResource(workingDayService);
        this.restWorkingDayMockMvc = MockMvcBuilders.standaloneSetup(workingDayResource)
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
    public static WorkingDay createEntity(EntityManager em) {
        WorkingDay workingDay = new WorkingDay()
            .hours(DEFAULT_HOURS);
        return workingDay;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkingDay createUpdatedEntity(EntityManager em) {
        WorkingDay workingDay = new WorkingDay()
            .hours(UPDATED_HOURS);
        return workingDay;
    }

    @BeforeEach
    public void initTest() {
        workingDay = createEntity(em);
    }

    @Test
    @Transactional
    public void createWorkingDay() throws Exception {
        int databaseSizeBeforeCreate = workingDayRepository.findAll().size();

        // Create the WorkingDay
        restWorkingDayMockMvc.perform(post("/api/working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingDay)))
            .andExpect(status().isCreated());

        // Validate the WorkingDay in the database
        List<WorkingDay> workingDayList = workingDayRepository.findAll();
        assertThat(workingDayList).hasSize(databaseSizeBeforeCreate + 1);
        WorkingDay testWorkingDay = workingDayList.get(workingDayList.size() - 1);
        assertThat(testWorkingDay.getHours()).isEqualTo(DEFAULT_HOURS);
    }

    @Test
    @Transactional
    public void createWorkingDayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = workingDayRepository.findAll().size();

        // Create the WorkingDay with an existing ID
        workingDay.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkingDayMockMvc.perform(post("/api/working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingDay)))
            .andExpect(status().isBadRequest());

        // Validate the WorkingDay in the database
        List<WorkingDay> workingDayList = workingDayRepository.findAll();
        assertThat(workingDayList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllWorkingDays() throws Exception {
        // Initialize the database
        workingDayRepository.saveAndFlush(workingDay);

        // Get all the workingDayList
        restWorkingDayMockMvc.perform(get("/api/working-days?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workingDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)));
    }
    
    @Test
    @Transactional
    public void getWorkingDay() throws Exception {
        // Initialize the database
        workingDayRepository.saveAndFlush(workingDay);

        // Get the workingDay
        restWorkingDayMockMvc.perform(get("/api/working-days/{id}", workingDay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(workingDay.getId().intValue()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS));
    }

    @Test
    @Transactional
    public void getNonExistingWorkingDay() throws Exception {
        // Get the workingDay
        restWorkingDayMockMvc.perform(get("/api/working-days/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorkingDay() throws Exception {
        // Initialize the database
        workingDayService.save(workingDay);

        int databaseSizeBeforeUpdate = workingDayRepository.findAll().size();

        // Update the workingDay
        WorkingDay updatedWorkingDay = workingDayRepository.findById(workingDay.getId()).get();
        // Disconnect from session so that the updates on updatedWorkingDay are not directly saved in db
        em.detach(updatedWorkingDay);
        updatedWorkingDay
            .hours(UPDATED_HOURS);

        restWorkingDayMockMvc.perform(put("/api/working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorkingDay)))
            .andExpect(status().isOk());

        // Validate the WorkingDay in the database
        List<WorkingDay> workingDayList = workingDayRepository.findAll();
        assertThat(workingDayList).hasSize(databaseSizeBeforeUpdate);
        WorkingDay testWorkingDay = workingDayList.get(workingDayList.size() - 1);
        assertThat(testWorkingDay.getHours()).isEqualTo(UPDATED_HOURS);
    }

    @Test
    @Transactional
    public void updateNonExistingWorkingDay() throws Exception {
        int databaseSizeBeforeUpdate = workingDayRepository.findAll().size();

        // Create the WorkingDay

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkingDayMockMvc.perform(put("/api/working-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workingDay)))
            .andExpect(status().isBadRequest());

        // Validate the WorkingDay in the database
        List<WorkingDay> workingDayList = workingDayRepository.findAll();
        assertThat(workingDayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWorkingDay() throws Exception {
        // Initialize the database
        workingDayService.save(workingDay);

        int databaseSizeBeforeDelete = workingDayRepository.findAll().size();

        // Delete the workingDay
        restWorkingDayMockMvc.perform(delete("/api/working-days/{id}", workingDay.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkingDay> workingDayList = workingDayRepository.findAll();
        assertThat(workingDayList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkingDay.class);
        WorkingDay workingDay1 = new WorkingDay();
        workingDay1.setId(1L);
        WorkingDay workingDay2 = new WorkingDay();
        workingDay2.setId(workingDay1.getId());
        assertThat(workingDay1).isEqualTo(workingDay2);
        workingDay2.setId(2L);
        assertThat(workingDay1).isNotEqualTo(workingDay2);
        workingDay1.setId(null);
        assertThat(workingDay1).isNotEqualTo(workingDay2);
    }
}
