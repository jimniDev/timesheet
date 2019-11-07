package com.asscope.timesheet.web.rest;

import com.asscope.timesheet.TimesheetApp;
import com.asscope.timesheet.config.TestSecurityConfiguration;
import com.asscope.timesheet.domain.Employee;
import com.asscope.timesheet.domain.WorkingEntry;
import com.asscope.timesheet.domain.WeeklyWorkingHours;
import com.asscope.timesheet.domain.WorkDay;
import com.asscope.timesheet.repository.EmployeeRepository;
import com.asscope.timesheet.service.EmployeeService;
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
 * Integration tests for the {@Link EmployeeResource} REST controller.
 */
@SpringBootTest(classes = {TimesheetApp.class, TestSecurityConfiguration.class})
public class EmployeeResourceIT {

    private static final Boolean DEFAULT_IS_EMPLOYED = false;
    private static final Boolean UPDATED_IS_EMPLOYED = true;

    @Autowired
    private EmployeeRepository employeeRepository;

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

    private MockMvc restEmployeeMockMvc;

    private Employee employee;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EmployeeResource employeeResource = new EmployeeResource(employeeService);
        this.restEmployeeMockMvc = MockMvcBuilders.standaloneSetup(employeeResource)
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
    public static Employee createEntity(EntityManager em) {
        Employee employee = new Employee()
            .editPermitted(DEFAULT_IS_EMPLOYED);
        return employee;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employee createUpdatedEntity(EntityManager em) {
        Employee employee = new Employee()
            .editPermitted(UPDATED_IS_EMPLOYED);
        return employee;
    }

    @BeforeEach
    public void initTest() {
        employee = createEntity(em);
    }

    @Test
    @Transactional
    public void createEmployee() throws Exception {
        int databaseSizeBeforeCreate = employeeRepository.findAll().size();

        // Create the Employee
        restEmployeeMockMvc.perform(post("/api/employees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(employee)))
            .andExpect(status().isCreated());

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll();
        assertThat(employeeList).hasSize(databaseSizeBeforeCreate + 1);
        Employee testEmployee = employeeList.get(employeeList.size() - 1);
        assertThat(testEmployee.isEditPermitted()).isEqualTo(DEFAULT_IS_EMPLOYED);
    }

    @Test
    @Transactional
    public void createEmployeeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = employeeRepository.findAll().size();

        // Create the Employee with an existing ID
        employee.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmployeeMockMvc.perform(post("/api/employees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(employee)))
            .andExpect(status().isBadRequest());

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll();
        assertThat(employeeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllEmployees() throws Exception {
        // Initialize the database
        employeeRepository.saveAndFlush(employee);

        // Get all the employeeList
        restEmployeeMockMvc.perform(get("/api/employees?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(employee.getId().intValue())))
            .andExpect(jsonPath("$.[*].isEmployed").value(hasItem(DEFAULT_IS_EMPLOYED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getEmployee() throws Exception {
        // Initialize the database
        employeeRepository.saveAndFlush(employee);

        // Get the employee
        restEmployeeMockMvc.perform(get("/api/employees/{id}", employee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(employee.getId().intValue()))
            .andExpect(jsonPath("$.isEmployed").value(DEFAULT_IS_EMPLOYED.booleanValue()));
    }

    @Test
    @Transactional
    public void getAllEmployeesByIsEmployedIsEqualToSomething() throws Exception {
        // Initialize the database
        employeeRepository.saveAndFlush(employee);

        // Get all the employeeList where isEmployed equals to DEFAULT_IS_EMPLOYED
        defaultEmployeeShouldBeFound("isEmployed.equals=" + DEFAULT_IS_EMPLOYED);

        // Get all the employeeList where isEmployed equals to UPDATED_IS_EMPLOYED
        defaultEmployeeShouldNotBeFound("isEmployed.equals=" + UPDATED_IS_EMPLOYED);
    }

    @Test
    @Transactional
    public void getAllEmployeesByIsEmployedIsInShouldWork() throws Exception {
        // Initialize the database
        employeeRepository.saveAndFlush(employee);

        // Get all the employeeList where isEmployed in DEFAULT_IS_EMPLOYED or UPDATED_IS_EMPLOYED
        defaultEmployeeShouldBeFound("isEmployed.in=" + DEFAULT_IS_EMPLOYED + "," + UPDATED_IS_EMPLOYED);

        // Get all the employeeList where isEmployed equals to UPDATED_IS_EMPLOYED
        defaultEmployeeShouldNotBeFound("isEmployed.in=" + UPDATED_IS_EMPLOYED);
    }

    @Test
    @Transactional
    public void getAllEmployeesByIsEmployedIsNullOrNotNull() throws Exception {
        // Initialize the database
        employeeRepository.saveAndFlush(employee);

        // Get all the employeeList where isEmployed is not null
        defaultEmployeeShouldBeFound("isEmployed.specified=true");

        // Get all the employeeList where isEmployed is null
        defaultEmployeeShouldNotBeFound("isEmployed.specified=false");
    }

    @Test
    @Transactional
    public void getAllEmployeesByWorkingEntryIsEqualToSomething() throws Exception {
        // Initialize the database
        WorkingEntry workingEntry = WorkingEntryResourceIT.createEntity(em);
        em.persist(workingEntry);
        em.flush();
        employee.addWorkingEntry(workingEntry);
        employeeRepository.saveAndFlush(employee);
        Long workingEntryId = workingEntry.getId();

        // Get all the employeeList where workingEntry equals to workingEntryId
        defaultEmployeeShouldBeFound("workingEntryId.equals=" + workingEntryId);

        // Get all the employeeList where workingEntry equals to workingEntryId + 1
        defaultEmployeeShouldNotBeFound("workingEntryId.equals=" + (workingEntryId + 1));
    }

    @Test
    @Transactional
    public void getAllEmployeesByWeeklyWorkingHoursIsEqualToSomething() throws Exception {
        // Initialize the database
        WeeklyWorkingHours weeklyWorkingHours = WeeklyWorkingHoursResourceIT.createEntity(em);
        em.persist(weeklyWorkingHours);
        em.flush();
        employee.addWeeklyWorkingHours(weeklyWorkingHours);
        employeeRepository.saveAndFlush(employee);
        Long weeklyWorkingHoursId = weeklyWorkingHours.getId();

        // Get all the employeeList where weeklyWorkingHours equals to weeklyWorkingHoursId
        defaultEmployeeShouldBeFound("weeklyWorkingHoursId.equals=" + weeklyWorkingHoursId);

        // Get all the employeeList where weeklyWorkingHours equals to weeklyWorkingHoursId + 1
        defaultEmployeeShouldNotBeFound("weeklyWorkingHoursId.equals=" + (weeklyWorkingHoursId + 1));
    }


    @Test
    @Transactional
    public void getAllEmployeesByWorkDayIsEqualToSomething() throws Exception {
        // Initialize the database
        WorkDay workDay = WorkDayResourceIT.createEntity(em);
        em.persist(workDay);
        em.flush();
        employee.addWorkDay(workDay);
        employeeRepository.saveAndFlush(employee);
        Long workDayId = workDay.getId();

        // Get all the employeeList where workDay equals to workDayId
        defaultEmployeeShouldBeFound("workDayId.equals=" + workDayId);

        // Get all the employeeList where workDay equals to workDayId + 1
        defaultEmployeeShouldNotBeFound("workDayId.equals=" + (workDayId + 1));
    }


    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultEmployeeShouldBeFound(String filter) throws Exception {
        restEmployeeMockMvc.perform(get("/api/employees?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(employee.getId().intValue())))
            .andExpect(jsonPath("$.[*].isEmployed").value(hasItem(DEFAULT_IS_EMPLOYED.booleanValue())));

        // Check, that the count call also returns 1
        restEmployeeMockMvc.perform(get("/api/employees/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultEmployeeShouldNotBeFound(String filter) throws Exception {
        restEmployeeMockMvc.perform(get("/api/employees?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restEmployeeMockMvc.perform(get("/api/employees/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingEmployee() throws Exception {
        // Get the employee
        restEmployeeMockMvc.perform(get("/api/employees/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEmployee() throws Exception {
        // Initialize the database
        employeeService.save(employee);

        int databaseSizeBeforeUpdate = employeeRepository.findAll().size();

        // Update the employee
        Employee updatedEmployee = employeeRepository.findById(employee.getId()).get();
        // Disconnect from session so that the updates on updatedEmployee are not directly saved in db
        em.detach(updatedEmployee);
        updatedEmployee
            .editPermitted(UPDATED_IS_EMPLOYED);

        restEmployeeMockMvc.perform(put("/api/employees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEmployee)))
            .andExpect(status().isOk());

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
        Employee testEmployee = employeeList.get(employeeList.size() - 1);
        assertThat(testEmployee.isEditPermitted()).isEqualTo(UPDATED_IS_EMPLOYED);
    }

    @Test
    @Transactional
    public void updateNonExistingEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().size();

        // Create the Employee

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployeeMockMvc.perform(put("/api/employees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(employee)))
            .andExpect(status().isBadRequest());

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEmployee() throws Exception {
        // Initialize the database
        employeeService.save(employee);

        int databaseSizeBeforeDelete = employeeRepository.findAll().size();

        // Delete the employee
        restEmployeeMockMvc.perform(delete("/api/employees/{id}", employee.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Employee> employeeList = employeeRepository.findAll();
        assertThat(employeeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Employee.class);
        Employee employee1 = new Employee();
        employee1.setId(1L);
        Employee employee2 = new Employee();
        employee2.setId(employee1.getId());
        assertThat(employee1).isEqualTo(employee2);
        employee2.setId(2L);
        assertThat(employee1).isNotEqualTo(employee2);
        employee1.setId(null);
        assertThat(employee1).isNotEqualTo(employee2);
    }
}
