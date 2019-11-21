package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class OthersTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Others.class);
        Others others1 = new Others();
        others1.setId(1L);
        Others others2 = new Others();
        others2.setId(others1.getId());
        assertThat(others1).isEqualTo(others2);
        others2.setId(2L);
        assertThat(others1).isNotEqualTo(others2);
        others1.setId(null);
        assertThat(others1).isNotEqualTo(others2);
    }
}
