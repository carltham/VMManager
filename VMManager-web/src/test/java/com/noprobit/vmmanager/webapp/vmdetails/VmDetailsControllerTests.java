package com.noprobit.vmmanager.webapp.vmdetails;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
class VmDetailsControllerTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void validateXmlReturnsErrorsForInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/vm-details/1/xml/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":\"<domain type=\\\"kvm\\\"><name>fedora-test</name></domain>\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false))
                .andExpect(jsonPath("$.errors", hasSize(1)))
                .andExpect(jsonPath("$.errors[0]").value("Missing memory element"));
    }

    @Test
    void validateXmlAcceptsWellFormedPayload() throws Exception {
        mockMvc.perform(post("/api/vm-details/1/xml/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":\"<domain type=\\\"kvm\\\"><name>fedora-test</name><memory unit=\\\"MiB\\\">4096</memory><devices/></domain>\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.errors", hasSize(0)));
    }

    @Test
    void osListSupportsQueryFiltering() throws Exception {
        mockMvc.perform(get("/api/vm-details/1/os-list").param("query", "fedora"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].id").value("fedora41"))
                .andExpect(jsonPath("$.items[0].label").value("Fedora 41"));
    }
}
