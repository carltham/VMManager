package com.noprobit.vmmanager.webapp.createvm;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
class CreateVmControllerTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void openReturnsWizardState() throws Exception {
        mockMvc.perform(post("/api/create-vm/open"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.open").value(true))
                .andExpect(jsonPath("$.step").value(1))
                .andExpect(jsonPath("$.installMethod").value("iso"));
    }

    @Test
    void finishCreatesVmInManagerOverview() throws Exception {
        MvcResult openResult = mockMvc.perform(post("/api/create-vm/open"))
                .andExpect(status().isOk())
                .andReturn();

        long wizardId = extractWizardId(openResult.getResponse().getContentAsString());

        mockMvc.perform(post("/api/create-vm/{wizardId}/edit-vm-name", wizardId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":\"ci-createvm-persisted\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vmName").value("ci-createvm-persisted"));

        mockMvc.perform(post("/api/create-vm/{wizardId}/finish", wizardId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusMessage").value("VM created: ci-createvm-persisted"));

        mockMvc.perform(get("/api/manager/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$..name").value(hasItem("ci-createvm-persisted")));
    }

    private long extractWizardId(String json) {
        Matcher matcher = Pattern.compile("\\\"wizardId\\\":(\\d+)").matcher(json);
        if (!matcher.find()) {
            throw new IllegalStateException("wizardId missing from response: " + json);
        }
        return Long.parseLong(matcher.group(1));
    }
}
