package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.Application;
import com.mycompany.myapp.domain.Points;
import com.mycompany.myapp.repository.PointsRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PointsResource} REST controller.
 */
@SpringBootTest(classes = Application.class)
public class PointsResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_EVENT = "AAAAAAAAAA";
    private static final String UPDATED_EVENT = "BBBBBBBBBB";

    @Autowired
    private PointsRepository pointsRepository;

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

    private MockMvc restPointsMockMvc;

    private Points points;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PointsResource pointsResource = new PointsResource(pointsRepository);
        this.restPointsMockMvc = MockMvcBuilders.standaloneSetup(pointsResource)
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
    public static Points createEntity(EntityManager em) {
        Points points = new Points()
            .date(DEFAULT_DATE)
            .event(DEFAULT_EVENT);
        return points;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Points createUpdatedEntity(EntityManager em) {
        Points points = new Points()
            .date(UPDATED_DATE)
            .event(UPDATED_EVENT);
        return points;
    }

    @BeforeEach
    public void initTest() {
        points = createEntity(em);
    }

    @Test
    @Transactional
    public void createPoints() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // Create the Points
        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isCreated());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate + 1);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPoints.getEvent()).isEqualTo(DEFAULT_EVENT);
    }

    @Test
    @Transactional
    public void createPointsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // Create the Points with an existing ID
        points.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsRepository.findAll().size();
        // set the field null
        points.setDate(null);

        // Create the Points, which fails.

        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEventIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsRepository.findAll().size();
        // set the field null
        points.setEvent(null);

        // Create the Points, which fails.

        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get all the pointsList
        restPointsMockMvc.perform(get("/api/points?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].event").value(hasItem(DEFAULT_EVENT)));
    }
    
    @Test
    @Transactional
    public void getPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get the points
        restPointsMockMvc.perform(get("/api/points/{id}", points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(points.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.event").value(DEFAULT_EVENT));
    }

    @Test
    @Transactional
    public void getNonExistingPoints() throws Exception {
        // Get the points
        restPointsMockMvc.perform(get("/api/points/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Update the points
        Points updatedPoints = pointsRepository.findById(points.getId()).get();
        // Disconnect from session so that the updates on updatedPoints are not directly saved in db
        em.detach(updatedPoints);
        updatedPoints
            .date(UPDATED_DATE)
            .event(UPDATED_EVENT);

        restPointsMockMvc.perform(put("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPoints)))
            .andExpect(status().isOk());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getEvent()).isEqualTo(UPDATED_EVENT);
    }

    @Test
    @Transactional
    public void updateNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Create the Points

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsMockMvc.perform(put("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeDelete = pointsRepository.findAll().size();

        // Delete the points
        restPointsMockMvc.perform(delete("/api/points/{id}", points.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
