package com.noprobit.vmmanager.webapp.vmwindow;

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
class VmWindowControllerTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void connectViewerOnRunningVmReturnsConsoleState() throws Exception {
        mockMvc.perform(post("/api/vm-window/1/console/connect-viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"viewer\":\"serial\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusMessage").value("Viewer connected: serial"))
                .andExpect(jsonPath("$.viewerType").value("serial"))
                .andExpect(jsonPath("$.consoleConnected").value(true));
    }

    @Test
    void connectViewerRejectsUnsupportedViewer() throws Exception {
        mockMvc.perform(post("/api/vm-window/1/console/connect-viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"viewer\":\"spice\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sendKeysRejectsWhenVmIsNotRunning() throws Exception {
        mockMvc.perform(post("/api/vm-window/3/shutdown"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/vm-window/3/console/send-keys")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"combo\":\"Ctrl+Alt+Del\"}"))
                .andExpect(status().isConflict());
    }

                    @Test
                    void sendKeysRejectsWhenConsoleDisconnected() throws Exception {
                        mockMvc.perform(post("/api/vm-window/1/close"))
                            .andExpect(status().isOk());

                    mockMvc.perform(post("/api/vm-window/1/console/send-keys")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"combo\":\"Ctrl+Alt+Del\"}"))
                        .andExpect(status().isConflict());
                    }

                    @Test
                    void sendKeysSucceedsAfterViewerConnect() throws Exception {
                    mockMvc.perform(post("/api/vm-window/1/console/connect-viewer")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"viewer\":\"graphics\"}"))
                        .andExpect(status().isOk());

                    mockMvc.perform(post("/api/vm-window/1/console/send-keys")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"combo\":\"Ctrl+Alt+Del\"}"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.statusMessage").value("Sent key combo: Ctrl+Alt+Del"))
                        .andExpect(jsonPath("$.keyboardGrabbed").value(true));
                    }

    @Test
    void fullscreenTogglesFullscreenAndKeyboardGrab() throws Exception {
        mockMvc.perform(post("/api/vm-window/1/console/fullscreen")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"enabled\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullscreen").value(true))
                .andExpect(jsonPath("$.keyboardGrabbed").value(true));

        mockMvc.perform(post("/api/vm-window/1/console/fullscreen")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"enabled\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullscreen").value(false))
                .andExpect(jsonPath("$.keyboardGrabbed").value(false));
    }
}
