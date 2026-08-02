package com.noprobit.vmmanager.webapp.connectionauth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
class ConnectionAuthControllerTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void authenticateRejectsEmptyCredentials() throws Exception {
        long connectionId = createConnection("auth-empty", "qemu:///system");

        mockMvc.perform(post("/api/connection-auth/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"connectionId\":" + connectionId + ",\"username\":\"\",\"password\":\"\",\"remember\":false}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authenticateCreatesSession() throws Exception {
        long connectionId = createConnection("auth-ok", "qemu:///session");

        mockMvc.perform(post("/api/connection-auth/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"connectionId\":" + connectionId + ",\"username\":\"root\",\"password\":\"secret\",\"remember\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.sessionId").isNotEmpty())
                .andExpect(jsonPath("$.expiresAt").isNotEmpty());
    }

    @Test
    void authenticateRejectsBadCredentials() throws Exception {
        long connectionId = createConnection("auth-bad", "qemu:///test");

        mockMvc.perform(post("/api/connection-auth/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"connectionId\":" + connectionId + ",\"username\":\"root\",\"password\":\"bad\",\"remember\":false}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void closeSessionDeletesSession() throws Exception {
        long connectionId = createConnection("auth-close", "qemu:///close");

        MvcResult created = mockMvc.perform(post("/api/connection-auth/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"connectionId\":" + connectionId + ",\"username\":\"root\",\"password\":\"secret\",\"remember\":false}"))
                .andExpect(status().isOk())
                .andReturn();

        String sessionId = extractLongToken(created.getResponse().getContentAsString(), "sessionId");

        mockMvc.perform(delete("/api/connection-auth/sessions/" + sessionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    private long createConnection(String name, String uri) throws Exception {
        MvcResult created = mockMvc.perform(post("/api/manager/connections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + name + "\",\"uri\":\"" + uri + "\"}"))
                .andExpect(status().isOk())
                .andReturn();

        return Long.parseLong(extractLongToken(created.getResponse().getContentAsString(), "id"));
    }

    private String extractLongToken(String json, String fieldName) {
        Matcher matcher = Pattern.compile("\\\"" + fieldName + "\\\":\\\"?([^,\\\"}]+)").matcher(json);
        if (!matcher.find()) {
            throw new AssertionError("Response does not contain field " + fieldName);
        }
        return matcher.group(1);
    }
}
