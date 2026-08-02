package com.noprobit.vmmanager.webapp.manager;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
class ManagerControllerTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void aboutReturnsTypedMetadata() throws Exception {
        mockMvc.perform(get("/api/manager/about"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("VMManager-web"))
                .andExpect(jsonPath("$.module").value("manager"))
                .andExpect(jsonPath("$.version").value("0.0.1-SNAPSHOT"));
    }

    @Test
    void preferencesReturnsTypedSettings() throws Exception {
        mockMvc.perform(get("/api/manager/preferences"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme").value("system"))
                .andExpect(jsonPath("$.defaultConnectionUri").value("qemu:///system"))
                .andExpect(jsonPath("$.autoConnect").value("true"));
    }

    @Test
    void hostDetailsReturnsTypedMetrics() throws Exception {
        mockMvc.perform(get("/api/manager/host/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.connectionId").value(1))
                .andExpect(jsonPath("$.connectionName").value("Local QEMU"))
                .andExpect(jsonPath("$.uri").value("qemu:///system"))
                .andExpect(jsonPath("$.cpuUsage").value(38))
                .andExpect(jsonPath("$.memoryUsageMb").value(4096))
                .andExpect(jsonPath("$.vmCount").isNumber());
    }

    @Test
    void addConnectionRejectsBlankInput() throws Exception {
        mockMvc.perform(post("/api/manager/connections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"uri\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void addConnectionRejectsInvalidUri() throws Exception {
        mockMvc.perform(post("/api/manager/connections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bad URI\",\"uri\":\"not-a-uri\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void disconnectConnectionRemovesTheConnection() throws Exception {
        MvcResult created = mockMvc.perform(post("/api/manager/connections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Disconnect test\",\"uri\":\"qemu:///test\"}"))
                .andExpect(status().isOk())
                .andReturn();

        Matcher idMatcher = Pattern.compile("\\\"id\\\":(\\d+)").matcher(created.getResponse().getContentAsString());
        if (!idMatcher.find()) {
            throw new AssertionError("Created connection response does not contain an ID");
        }

        mockMvc.perform(delete("/api/manager/connections/" + idMatcher.group(1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.action").value("disconnect connection"));
    }
}