package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Others;
import com.mycompany.myapp.repository.OthersRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Others}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OthersResource {

    private final Logger log = LoggerFactory.getLogger(OthersResource.class);

    private static final String ENTITY_NAME = "others";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OthersRepository othersRepository;

    public OthersResource(OthersRepository othersRepository) {
        this.othersRepository = othersRepository;
    }

    /**
     * {@code POST  /others} : Create a new others.
     *
     * @param others the others to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new others, or with status {@code 400 (Bad Request)} if the others has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/others")
    public ResponseEntity<Others> createOthers(@RequestBody Others others) throws URISyntaxException {
        log.debug("REST request to save Others : {}", others);
        if (others.getId() != null) {
            throw new BadRequestAlertException("A new others cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Others result = othersRepository.save(others);
        return ResponseEntity.created(new URI("/api/others/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /others} : Updates an existing others.
     *
     * @param others the others to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated others,
     * or with status {@code 400 (Bad Request)} if the others is not valid,
     * or with status {@code 500 (Internal Server Error)} if the others couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/others")
    public ResponseEntity<Others> updateOthers(@RequestBody Others others) throws URISyntaxException {
        log.debug("REST request to update Others : {}", others);
        if (others.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Others result = othersRepository.save(others);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, others.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /others} : get all the others.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of others in body.
     */
    @GetMapping("/others")
    public List<Others> getAllOthers() {
        log.debug("REST request to get all Others");
        return othersRepository.findAll();
    }

    /**
     * {@code GET  /others/:id} : get the "id" others.
     *
     * @param id the id of the others to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the others, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/others/{id}")
    public ResponseEntity<Others> getOthers(@PathVariable Long id) {
        log.debug("REST request to get Others : {}", id);
        Optional<Others> others = othersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(others);
    }

    /**
     * {@code DELETE  /others/:id} : delete the "id" others.
     *
     * @param id the id of the others to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/others/{id}")
    public ResponseEntity<Void> deleteOthers(@PathVariable Long id) {
        log.debug("REST request to delete Others : {}", id);
        othersRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
