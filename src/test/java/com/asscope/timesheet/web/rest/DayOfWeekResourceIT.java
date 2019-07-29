package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.DayOfWeek;
import com.asscope.timesheet.domain.TargetWorkingDay;
import com.asscope.timesheet.repository.DayOfWeekRepository;
import com.asscope.timesheet.service.DayOfWeekService;
import com.asscope.timesheet.web.rest.errors.ExceptionTranslator;
import com.asscope.timesheet.service.dto.DayOfWeekCriteria;
import com.asscope.timesheet.service.DayOfWeekQueryService;

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
 * Integration tests for the {@Link DayOfWeekResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class DayOfWeekResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private DayOfWeekRepository dayOfWeekRepository;

    @Autowired
    private DayOfWeekService dayOfWeekService;

    @Autowired
    private DayOfWeekQueryService dayOfWeekQueryService;

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

    private MockMvc restDayOfWeekMockMvc;

    private DayOfWeek dayOfWeek;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DayOfWeekResource dayOfWeekResource = new DayOfWeekResource(dayOfWeekService, dayOfWeekQueryService);
        this.restDayOfWeekMockMvc = MockMvcBuilders.standaloneSetup(dayOfWeekResource)
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
    public static DayOfWeek createEntity(EntityManager em) {
        DayOfWeek dayOfWeek = new DayOfWeek()
            .name(DEFAULT_NAME);
        return dayOfWeek;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DayOfWeek createUpdatedEntity(EntityManager em) {
        DayOfWeek dayOfWeek = new DayOfWeek()
            .name(UPDATED_NAME);
        return dayOfWeek;
    }

    @BeforeEach
    public void initTest() {
        dayOfWeek = createEntity(em);
    }

    @Test
    @Transactional
    public void createDayOfWeek() throws Exception {
        int databaseSizeBeforeCreate = dayOfWeekRepository.findAll().size();

        // Create the DayOfWeek
        restDayOfWeekMockMvc.perform(post("/api/day-of-weeks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dayOfWeek)))
            .andExpect(status().isCreated());

        // Validate the DayOfWeek in the database
        List<DayOfWeek> dayOfWeekList = dayOfWeekRepository.findAll();
        assertThat(dayOfWeekList).hasSize(databaseSizeBeforeCreate + 1);
        DayOfWeek testDayOfWeek = dayOfWeekList.get(dayOfWeekList.size() - 1);
        assertThat(testDayOfWeek.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createDayOfWeekWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dayOfWeekRepository.findAll().size();

        // Create the DayOfWeek with an existing ID
        dayOfWeek.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDayOfWeekMockMvc.perform(post("/api/day-of-weeks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dayOfWeek)))
            .andExpect(status().isBadRequest());

        // Validate the DayOfWeek in the database
        List<DayOfWeek> dayOfWeekList = dayOfWeekRepository.findAll();
        assertThat(dayOfWeekList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dayOfWeekRepository.findAll().size();
        // set the field null
        dayOfWeek.setName(null);

        // Create the DayOfWeek, which fails.

        restDayOfWeekMockMvc.perform(post("/api/day-of-weeks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dayOfWeek)))
            .andExpect(status().isBadRequest());

        List<DayOfWeek> dayOfWeekList = dayOfWeekRepository.findAll();
        assertThat(dayOfWeekList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDayOfWeeks() throws Exception {
        // Initialize the database
        dayOfWeekRepository.saveAndFlush(dayOfWeek);

        // Get all the dayOfWeekList
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dayOfWeek.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getDayOfWeek() throws Exception {
        // Initialize the database
        dayOfWeekRepository.saveAndFlush(dayOfWeek);

        // Get the dayOfWeek
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks/{id}", dayOfWeek.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dayOfWeek.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getAllDayOfWeeksByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        dayOfWeekRepository.saveAndFlush(dayOfWeek);

        // Get all the dayOfWeekList where name equals to DEFAULT_NAME
        defaultDayOfWeekShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the dayOfWeekList where name equals to UPDATED_NAME
        defaultDayOfWeekShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllDayOfWeeksByNameIsInShouldWork() throws Exception {
        // Initialize the database
        dayOfWeekRepository.saveAndFlush(dayOfWeek);

        // Get all the dayOfWeekList where name in DEFAULT_NAME or UPDATED_NAME
        defaultDayOfWeekShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the dayOfWeekList where name equals to UPDATED_NAME
        defaultDayOfWeekShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllDayOfWeeksByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        dayOfWeekRepository.saveAndFlush(dayOfWeek);

        // Get all the dayOfWeekList where name is not null
        defaultDayOfWeekShouldBeFound("name.specified=true");

        // Get all the dayOfWeekList where name is null
        defaultDayOfWeekShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    public void getAllDayOfWeeksByTargetWorkingDayIsEqualToSomething() throws Exception {
        // Initialize the database
        TargetWorkingDay targetWorkingDay = TargetWorkingDayResourceIT.createEntity(em);
        em.persist(targetWorkingDay);
        em.flush();
        dayOfWeek.addTargetWorkingDay(targetWorkingDay);
        dayOfWeekRepository.saveAndFlush(dayOfWeek);
        Long targetWorkingDayId = targetWorkingDay.getId();

        // Get all the dayOfWeekList where targetWorkingDay equals to targetWorkingDayId
        defaultDayOfWeekShouldBeFound("targetWorkingDayId.equals=" + targetWorkingDayId);

        // Get all the dayOfWeekList where targetWorkingDay equals to targetWorkingDayId + 1
        defaultDayOfWeekShouldNotBeFound("targetWorkingDayId.equals=" + (targetWorkingDayId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultDayOfWeekShouldBeFound(String filter) throws Exception {
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dayOfWeek.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));

        // Check, that the count call also returns 1
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultDayOfWeekShouldNotBeFound(String filter) throws Exception {
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingDayOfWeek() throws Exception {
        // Get the dayOfWeek
        restDayOfWeekMockMvc.perform(get("/api/day-of-weeks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDayOfWeek() throws Exception {
        // Initialize the database
        dayOfWeekService.save(dayOfWeek);

        int databaseSizeBeforeUpdate = dayOfWeekRepository.findAll().size();

        // Update the dayOfWeek
        DayOfWeek updatedDayOfWeek = dayOfWeekRepository.findById(dayOfWeek.getId()).get();
        // Disconnect from session so that the updates on updatedDayOfWeek are not directly saved in db
        em.detach(updatedDayOfWeek);
        updatedDayOfWeek
            .name(UPDATED_NAME);

        restDayOfWeekMockMvc.perform(put("/api/day-of-weeks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDayOfWeek)))
            .andExpect(status().isOk());

        // Validate the DayOfWeek in the database
        List<DayOfWeek> dayOfWeekList = dayOfWeekRepository.findAll();
        assertThat(dayOfWeekList).hasSize(databaseSizeBeforeUpdate);
        DayOfWeek testDayOfWeek = dayOfWeekList.get(dayOfWeekList.size() - 1);
        assertThat(testDayOfWeek.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingDayOfWeek() throws Exception {
        int databaseSizeBeforeUpdate = dayOfWeekRepository.findAll().size();

        // Create the DayOfWeek

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDayOfWeekMockMvc.perform(put("/api/day-of-weeks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dayOfWeek)))
            .andExpect(status().isBadRequest());

        // Validate the DayOfWeek in the database
        List<DayOfWeek> dayOfWeekList = dayOfWeekRepository.findAll();
        assertThat(dayOfWeekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDayOfWeek() throws Exception {
        // Initialize the database
        dayOfWeekService.save(dayOfWeek);

        int databaseSizeBeforeDelete = dayOfWeekRepository.findAll().size();

        // Delete the dayOfWeek
        restDayOfWeekMockMvc.perform(delete("/api/day-of-weeks/{id}", dayOfWeek.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DayOfWeek> dayOfWeekList = dayOfWeekRepository.findAll();
        assertThat(dayOfWeekList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DayOfWeek.class);
        DayOfWeek dayOfWeek1 = new DayOfWeek();
        dayOfWeek1.setId(1L);
        DayOfWeek dayOfWeek2 = new DayOfWeek();
        dayOfWeek2.setId(dayOfWeek1.getId());
        assertThat(dayOfWeek1).isEqualTo(dayOfWeek2);
        dayOfWeek2.setId(2L);
        assertThat(dayOfWeek1).isNotEqualTo(dayOfWeek2);
        dayOfWeek1.setId(null);
        assertThat(dayOfWeek1).isNotEqualTo(dayOfWeek2);
    }
}
