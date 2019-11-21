package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.Application;
import com.mycompany.myapp.domain.Others;
import com.mycompany.myapp.repository.OthersRepository;
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
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link OthersResource} REST controller.
 */
@SpringBootTest(classes = Application.class)
public class OthersResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    @Autowired
    private OthersRepository othersRepository;

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

    private MockMvc restOthersMockMvc;

    private Others others;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OthersResource othersResource = new OthersResource(othersRepository);
        this.restOthersMockMvc = MockMvcBuilders.standaloneSetup(othersResource)
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
    public static Others createEntity(EntityManager em) {
        Others others = new Others()
            .description(DEFAULT_DESCRIPTION)
            .content(DEFAULT_CONTENT);
        return others;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Others createUpdatedEntity(EntityManager em) {
        Others others = new Others()
            .description(UPDATED_DESCRIPTION)
            .content(UPDATED_CONTENT);
        return others;
    }

    @BeforeEach
    public void initTest() {
        others = createEntity(em);
    }

    @Test
    @Transactional
    public void createOthers() throws Exception {
        int databaseSizeBeforeCreate = othersRepository.findAll().size();

        // Create the Others
        restOthersMockMvc.perform(post("/api/others")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(others)))
            .andExpect(status().isCreated());

        // Validate the Others in the database
        List<Others> othersList = othersRepository.findAll();
        assertThat(othersList).hasSize(databaseSizeBeforeCreate + 1);
        Others testOthers = othersList.get(othersList.size() - 1);
        assertThat(testOthers.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testOthers.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    public void createOthersWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = othersRepository.findAll().size();

        // Create the Others with an existing ID
        others.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOthersMockMvc.perform(post("/api/others")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(others)))
            .andExpect(status().isBadRequest());

        // Validate the Others in the database
        List<Others> othersList = othersRepository.findAll();
        assertThat(othersList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllOthers() throws Exception {
        // Initialize the database
        othersRepository.saveAndFlush(others);

        // Get all the othersList
        restOthersMockMvc.perform(get("/api/others?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(others.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)));
    }
    
    @Test
    @Transactional
    public void getOthers() throws Exception {
        // Initialize the database
        othersRepository.saveAndFlush(others);

        // Get the others
        restOthersMockMvc.perform(get("/api/others/{id}", others.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(others.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT));
    }

    @Test
    @Transactional
    public void getNonExistingOthers() throws Exception {
        // Get the others
        restOthersMockMvc.perform(get("/api/others/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOthers() throws Exception {
        // Initialize the database
        othersRepository.saveAndFlush(others);

        int databaseSizeBeforeUpdate = othersRepository.findAll().size();

        // Update the others
        Others updatedOthers = othersRepository.findById(others.getId()).get();
        // Disconnect from session so that the updates on updatedOthers are not directly saved in db
        em.detach(updatedOthers);
        updatedOthers
            .description(UPDATED_DESCRIPTION)
            .content(UPDATED_CONTENT);

        restOthersMockMvc.perform(put("/api/others")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOthers)))
            .andExpect(status().isOk());

        // Validate the Others in the database
        List<Others> othersList = othersRepository.findAll();
        assertThat(othersList).hasSize(databaseSizeBeforeUpdate);
        Others testOthers = othersList.get(othersList.size() - 1);
        assertThat(testOthers.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOthers.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    public void updateNonExistingOthers() throws Exception {
        int databaseSizeBeforeUpdate = othersRepository.findAll().size();

        // Create the Others

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOthersMockMvc.perform(put("/api/others")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(others)))
            .andExpect(status().isBadRequest());

        // Validate the Others in the database
        List<Others> othersList = othersRepository.findAll();
        assertThat(othersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOthers() throws Exception {
        // Initialize the database
        othersRepository.saveAndFlush(others);

        int databaseSizeBeforeDelete = othersRepository.findAll().size();

        // Delete the others
        restOthersMockMvc.perform(delete("/api/others/{id}", others.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Others> othersList = othersRepository.findAll();
        assertThat(othersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
