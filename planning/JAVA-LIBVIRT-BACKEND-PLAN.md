# Java Libvirt Backend Plan

1. Identify the Java backend boundary for each libvirt-backed flow: connection creation/auth, host details, VM console/window actions, XML editor, OS list, and snapshots.
2. Map each Python class to a Spring service/controller pair in `VMManager-web/src/main/java`, reusing the existing manager/vm-details/vm-window patterns where possible.
3. Add a real libvirt integration layer in Java for connection handling, VM lookup, host metrics, console state, snapshot lifecycle, and XML/edit operations.
4. Keep lightweight non-libvirt screens like About and Preferences as config/app metadata endpoints, not libvirt calls.
5. Implement connection/auth flows first, since they are the entry point to every other libvirt-backed action.
6. Implement host details next, then VM console, XML editor, OS list, and snapshot flows behind the existing VM details routes.
7. Add async job handling in Java for long-running libvirt operations like snapshot creation or other blocking actions.
8. Wire the new Java endpoints into the Angular services already created, without changing the UI layout yet.
9. Add backend tests for each service/controller path, especially error handling and libvirt connection failures.
10. Validate with backend build/tests first, then do one end-to-end pass through the Angular app.

## Notes

- This plan focuses on the original virt-manager flows that actually talk to libvirt.
- About and Preferences remain thin metadata/config endpoints.
- UI-only scaffolding is out of scope for this plan.