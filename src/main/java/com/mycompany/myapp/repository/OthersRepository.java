package com.mycompany.myapp.repository;
import com.mycompany.myapp.domain.Others;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Others entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OthersRepository extends JpaRepository<Others, Long> {

    @Query("select others from Others others where others.user.login = ?#{principal.username}")
    List<Others> findByUserIsCurrentUser();

}
