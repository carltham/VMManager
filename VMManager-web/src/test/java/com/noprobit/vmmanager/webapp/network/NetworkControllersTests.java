package com.noprobit.vmmanager.webapp.network;

import static org.hamcrest.Matchers.hasItem;
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
class NetworkControllersTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void createdNetworkAppearsInNetworkListDialog() throws Exception {
        createNetwork("ci-net", "nat", "192.168.220.0/24");

        mockMvc.perform(post("/api/network-list/open"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.availableNetworks[*]").value(hasItem("ci-net")));
    }

    @Test
    void createdNetworkAppearsInHostNetworks() throws Exception {
        createNetwork("ops-net", "isolated", "10.44.0.0/24");

        mockMvc.perform(post("/api/host-networks/open"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].name").value(hasItem("ops-net")));
    }

    @Test
    void hostNetworkStartStopTogglesState() throws Exception {
        mockMvc.perform(post("/api/host-networks/1/stop"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));

        mockMvc.perform(post("/api/host-networks/1/start"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true));
    }

    private void createNetwork(String name, String mode, String range) throws Exception {
        MvcResult openResult = mockMvc.perform(post("/api/create-network/open"))
                .andExpect(status().isOk())
                .andReturn();

        long wizardId = extractWizardId(openResult.getResponse().getContentAsString());

        mockMvc.perform(post("/api/create-network/{wizardId}/configure-network", wizardId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"networkName\":\"" + name + "\",\"mode\":\"" + mode + "\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/create-network/{wizardId}/set-address-range", wizardId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":\"" + range + "\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/create-network/{wizardId}/create", wizardId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusMessage").value("Network created: " + name));
    }

        private long extractWizardId(String json) {
                Matcher matcher = Pattern.compile("\\\"wizardId\\\":(\\d+)").matcher(json);
                if (!matcher.find()) {
                        throw new IllegalStateException("wizardId missing from response: " + json);
                }
                return Long.parseLong(matcher.group(1));
        }
}
