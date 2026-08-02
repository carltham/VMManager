# Java Libvirt Backend Plan

## Goals

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

## Current Runtime Reality (as of Task 32 audit)

- Backend packages under `com.noprobit.vmmanager.webapp.*` are **in-memory / H2-backed mocks**, not live libvirt.
- Angular Tools/Storage/Network pages already call these mock endpoints (web evidence via Playwright).
- No `libvirt` Java binding dependency is present yet; Task 34 introduces the integration layer.

## Boundary Classification Legend

| Class | Meaning |
| --- | --- |
| **L** | libvirt-backed operation (needs live hypervisor/API) |
| **M** | metadata/config-only (app settings, static about data) |
| **H** | hybrid (libvirt + app/session state) |
| **U** | UI-local only (no backend required long-term, or client mock) |

## Boundary Matrix (Task 32 deliverable)

| UI action / flow | Original Python | Angular surface | Current Spring owner | Intended integration owner | Class | Error sources |
| --- | --- | --- | --- | --- | --- | --- |
| List connections / overview | `vmmManager` / conn manager | `app-manager`, create-connection list | `ManagerController` + `ManagerService` + H2 entities | `LibvirtConnectionService` + manager facade | **H** | transport, auth, libvirt connect |
| Add connection (name+URI) | `vmmCreateConn` | `app-create-connection` | `POST /api/manager/connections` (mock persist) | same + validate URI via libvirt open | **L** | validation, auth, libvirt |
| Disconnect connection | manager context menu | `app-manager` | `DELETE/POST disconnect` mock | close libvirt connection handle | **L** | not-found, libvirt |
| Connection auth prompt | `_vmmConnectAuth` / `connectauth` | `app-connection-auth` | **client mock** (`ConnectionAuthApiService` of()) | `ConnectionAuthController` + credential callback into libvirt open | **H** | validation, auth cancel, libvirt auth fail |
| Host details metrics | `vmmHost` | `app-host-details` | `GET /api/manager/host/{id}` fake CPU/mem | `LibvirtHostService` node info/stats | **L** | conn missing, libvirt |
| Preferences load | `vmmPreferences` | `app-preferences` | `GET /api/manager/preferences` static DTO | config/properties service (no libvirt) | **M** | IO/config |
| About load | `vmmAbout` | `app-about` | `GET /api/manager/about` static DTO | build-info / application metadata | **M** | none critical |
| Async job progress | job helpers / long ops | `app-async-job` | **client mock** interval ticks | `AsyncJobService` wrapping blocking libvirt ops | **H** | cancel, worker failure, libvirt |
| Console open/status/run/pause | `vmmConsolePages` / vm window | `app-console` | `VmWindowController` + `VmWindowService` mock | `LibvirtDomainService` lifecycle + console stream metadata | **L** | domain missing, state, libvirt |
| XML editor open/apply | `vmmXMLEditor` | `app-xml-editor` | `VmDetailsService` xml flags + apply mock | domain XML dump/define via libvirt | **L** | XML invalid, define fail |
| OS list open/apply | `vmmOSList` | `app-os-list` | `VmDetailsService` os list flags mock | metadata OS DB (**M**/partial) + optional domain metadata update (**H**) | **H** | validation, optional libvirt |
| Snapshots list/create/delete/revert | `vmmSnapshotPage` / `vmmSnapshotNew` | `app-snapshots`, `app-snapshot-new` | **client in-memory** `SnapshotsApiService` | `LibvirtSnapshotService` + async job for create | **L** | domain state, libvirt snapshot |
| Create network / host nets / net list | createnet / hostnets / netlist | network view components | `createnetwork`, `hostnets`, `networklist`, `network` packages mock | `LibvirtNetworkService` | **L** | validation, libvirt net |
| Storage pools/volumes/browse | createpool/vol, hoststorage, storagebrowse | storage view components | `storage` package mock + H2 | `LibvirtStorageService` | **L** | path/pool, libvirt storage |
| VM create/clone/delete/migrate | createvm/clone/delete/migrate | machines view | dedicated mock packages | domain define/clone/destroy/migrate libvirt ops | **L** | validation, libvirt |
| Device dialogs (graphics/tpm/vsock/fs/add hw/storage) | device/* | machines device components | dedicated mock services | domain device XML update via libvirt | **L** | XML/device, libvirt |

## Owner Mapping (controller → service → integration)

| Area | Controller (keep/adapt) | Application service | Future integration SPI |
| --- | --- | --- | --- |
| Connections / host / prefs / about | `manager.ManagerController` | `manager.ManagerService` | `libvirt.LibvirtConnectionGateway`, `LibvirtHostGateway` |
| Auth | **new** `connectionauth.ConnectionAuthController` | `ConnectionAuthService` | gateway open-with-credentials |
| VM window / console | `vmwindow.VmWindowController` | `VmWindowService` | `LibvirtDomainGateway` |
| VM details / XML / OS | `vmdetails.VmDetailsController` | `VmDetailsService` | domain XML + metadata gateways |
| Snapshots | **new** `snapshots.SnapshotsController` | `SnapshotsService` | `LibvirtSnapshotGateway` |
| Async jobs | **new** `asyncjob.AsyncJobController` | `AsyncJobService` | wraps gateways for long ops |
| Networks | `createnetwork` / `hostnets` / `networklist` controllers | existing services | `LibvirtNetworkGateway` |
| Storage | `storage.StorageManagementController` | `StorageManagementService` | `LibvirtStorageGateway` |

## Error-source Mapping

| Source | Examples | HTTP / UX handling |
| --- | --- | --- |
| User validation | empty name/URI/password, bad size | 400 + field message |
| Transport / app | Angular offline, wrong API base | client error banner |
| Auth | bad credentials, auth canceled | 401/403 + re-prompt connection-auth |
| Libvirt / runtime | connect failed, domain not found, snapshot unsupported | 502/409 + statusMessage/errorMessage |
| Config / metadata | missing build info (about/prefs) | 500 rare; defaults OK |

## Implementation Sequence (tasks 33-41)

1. **Task 33** — freeze service/controller mapping table from this matrix into package stubs/docs.
2. **Task 34** — introduce `libvirt` integration layer interfaces + no-op/mock adapter (swap later).
3. **Task 35** — create-connection + connection-auth real endpoint path (still mock gateway OK).
4. **Task 36** — host-details via host gateway.
5. **Task 37** — console via domain gateway.
6. **Task 38** — xml-editor + os-list.
7. **Task 39** — snapshots + async-job backend.
8. **Task 40** — about + preferences remain metadata-only (confirm no libvirt leakage).
9. **Task 41** — backend tests + Angular service wiring/integration.

## Notes

- This plan focuses on the original virt-manager flows that actually talk to libvirt.
- About and Preferences remain thin metadata/config endpoints.
- UI-only scaffolding is out of scope for live libvirt; Angular Playwright remains **web evidence only** (Verify 0%) until Python reference PW exists.
- Do not place integration code under `VMManager-web/bin/`; only `src/`.
