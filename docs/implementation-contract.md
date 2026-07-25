# Implementation Contract v1.1

## 1. Purpose

This document is the definitive Implementation Contract for the Precision Archive project. It serves as the ultimate, immutable bridge between approved design/architectural specifications and production implementation. 

**Why it exists:** To prevent implementation drift over a multi-year lifespan. Engineering teams and AI assistants naturally introduce technical drift, UI inconsistencies, or deviations from original UX intent. This contract eliminates that drift, functioning as the permanent constitution governing every engineering milestone, regardless of underlying framework changes (e.g., React, Next.js, Tailwind).

**Implementation Mandate:** Implementation must *faithfully translate* approved specifications into code. Engineers and AI assistants are explicitly forbidden from redesigning, re-architecting, or "improving" the product outside the bounds of this contract. The objective is precise construction of the blueprinted architecture.

---

## 2. Hierarchy of Authority

To resolve conflicts, governance documents are prioritized in the following strict order of precedence:

1. **Implementation Contract (This Document):** The supreme governing policy for all engineering efforts.
2. **Approved Amendments:** Formally accepted change requests via the Change Control Policy.
3. **Phase 5 (Engineering Architecture):** Governs technical strategy.
4. **Phase 4.7 (Final Product QA):** Governs final validation states.
5. **Phase 4.6 (Content Design):** Governs vocabulary and tone.
6. **Phase 4.5 (Motion & Interaction):** Governs UI physics.
7. **Phase 4.4 (Accessibility):** Governs universal usability.
8. **Phase 4.3 (Supporting Experiences):** Governs resilience and edge cases.
9. **Phase 4.2 (Core Experiences):** Governs primary workflows.
10. **Phase 4.1 (Information Architecture):** Governs entity and routing structure.
11. **Phase 3 (Design System):** Governs visual language.
12. **Phase 2 (Product Strategy):** Governs fundamental product philosophy.
13. **Phase 1 (UX Audit):** Governs the original product intent.

In any conflict between framework documentation and this Hierarchy of Authority, this Hierarchy takes absolute precedence.

---

## 3. Source of Truth

The following approved artifacts constitute the foundational Source of Truth.

- **Phase 1 — UX Audit:** Governs the product's fundamental purpose. Engineers must extract the mandate to protect the zero-friction creation flow.
- **Phase 2 — Product Strategy:** Governs the "Precision Archive" identity. Engineers must extract the core philosophy and ensure no features compromise these principles.
- **Phase 3 — Design System Architecture:** Governs visual grammar, geometry, typography, and spacing. Engineers must map these rules directly to the chosen styling framework tokens.
- **Phase 4.1 — Information Architecture:** Governs the structural entity model. Engineers must extract the flat routing architecture and inline workflow rules.
- **Phase 4.2 — Core Experiences:** Governs primary user flows. Engineers must extract the exact sequence of events for Origin, Console, and Signal.
- **Phase 4.3 — Supporting Experiences:** Governs resilience. Engineers must extract fallback behaviors, offline queuing mechanics, and network timeout limits.
- **Phase 4.4 — Responsive & Accessibility:** Governs universal usability. Engineers must extract keyboard navigation rules, touch targets, and mobile stacking rules.
- **Phase 4.5 — Motion & Interaction:** Governs the physics of the UI. Engineers must extract the mandate for zero-latency feedback and mechanical snapping.
- **Phase 4.6 — Content Design & Product Language:** Governs vocabulary and tone. Engineers must extract the exact microcopy.
- **Phase 4.7 — Final Product QA:** Governs gating criteria.
- **Phase 5 — Engineering Architecture:** Governs technology stack, security, and repository structure.
- **Milestone 1 Review:** Governs the pristine repository baseline.

---

## 4. Product Constitution

The immutable product philosophy, translated into generalized engineering responsibilities:

- **Immediate Momentum (Zero Friction):** 
  - *Responsibility:* The primary interaction must be immediately available after page load. Applications must achieve near-zero time-to-interactive. Blocking modals and signup walls are strictly forbidden.
- **Engineered Permanence (Tactile Reliability):** 
  - *Responsibility:* UI components must feel structurally sound. Client-side validation must preempt network failures. Data must persist securely across browser sessions.
- **Radical Focus (Cognitive Clarity):** 
  - *Responsibility:* Action Zones must be strictly separated from Management Zones. Progressive disclosure mechanisms must remain unobtrusive and never obscure primary data inputs.
- **Tactile Acknowledgement (Mechanical Feedback):** 
  - *Responsibility:* Primary actions must acknowledge user interaction immediately before network completion, utilizing instant state changes to bypass rendering latencies.
- **Quiet Accountability (Objective Data):** 
  - *Responsibility:* Data must be rendered exactly as provided, objectively. Gamification elements (badges, decorative charts) outside of approved functional visualizations are forbidden.

---

## 5. UX Constitution

Engineers may never violate the following UX rules:

- **Information Architecture:** Must remain mathematically flat. Navigation relies entirely on URL possession. Global headers or navigation bars are strictly forbidden.
- **Core Experiences:** State transitions between primary zones (e.g., Origin to Console) must execute instantly. The primary input must permanently reside at the absolute top of the visual hierarchy.
- **Supporting Experiences:** Destructive actions must employ inline, time-bound, auto-collapsing confirmations. Backup mechanisms must be inline.
- **Responsive Rules:** Horizontal layouts must stack vertically on narrow viewports. Primary inputs must remain above the fold. Management tools shift to the absolute bottom.
- **Accessibility:** 100% keyboard navigability is mandatory. Focus indicators must possess high contrast. Complex visual data must include hidden, screen-reader-accessible equivalents.
- **Motion:** Transitional motion must be linear or mechanical. Elastic, bouncy, or floating animations are banned.
- **Content:** The exact approved microcopy must be used. Conversational filler and apologies are forbidden.

---

## 6. Design Constitution

Implementation must preserve the Design System, regardless of the underlying CSS framework:

- **Geometry:** Borders must remain at 0px unless specifically dictated. Containers must not simulate floating via soft drop-shadows; they must appear physically inset or stacked.
- **Typography:** UI text must utilize an engineered sans-serif. Tabular data, URLs, and timestamps strictly utilize a monospaced typeface.
- **Colors:** The palette must remain monochromatic and highly contrasted. The designated primary action color is strictly reserved for momentum-driving actions and focus rings.
- **Spacing:** Component padding and margins must adhere to a strict, rigid geometric multiplier.
- **Whitespace:** Massive negative space must structurally separate functional zones. Empty space must not be filled with decoration.
- **Hierarchy:** Primary inputs and critical data points must command the highest visual weight through extreme scale contrast.
- **Interaction:** Visual state changes upon hover or focus must possess a transition delay of `0ms`.

---

## 7. Engineering Constitution

Generalized engineering responsibilities derived from Phase 5:

- **Repository Architecture:** Must maintain a strict separation of primitive UI components (which carry styling) and domain components (which carry business logic).
- **Data Mutations:** All mutations must utilize native server-side actions or framework equivalents. Traditional REST APIs for core client-server mutations are disallowed unless architecturally required for external consumers.
- **Database Rules:** The existing schema is immutable. Terminology must be mapped correctly at the domain layer (e.g., `Goal` maps to Tracker).
- **Security:** Queries for public-facing read-only pages must explicitly omit internal primary keys.
- **Performance:** History data must be streamed from the server to minimize client-side JavaScript payloads. Heavy client-side state management libraries are banned.
- **Offline Architecture:** Hanging network requests must be aborted after a strict timeout. Dropped logs must queue locally with visual pending states and sync invisibly upon reconnection.
- **State Management:** Rely purely on URL state, server-side data, and isolated native local storage wrappers. Cross-tab synchronization must utilize native browser visibility events.
- **Validation:** Strict runtime validation must be applied to environment variables and all client-side inputs.

---

## 8. Terminology Constitution

Future drift is forbidden. Use this exact vocabulary in code (ARIA labels, placeholders, UI text, variable naming):

| Allowed User Terminology | Forbidden Synonyms | Definition |
| :--- | :--- | :--- |
| **Tracker** | Goal, Habit, Stratum, Project | The specific goal being recorded. |
| **Ledger** | History, Logbook, Timeline, Feed | The chronological list of past entries. |
| **Log Entry** | Post, Update, Catalyst, Check-in | The act of recording progress. |
| **Secret Link** | Admin Link, Private URL | The private URL used for editing. |
| **Public Link** | Share URL, Profile, Signal | The read-only URL used for sharing. |
| **Vault** | Backup, Save, Account | Securing the Secret Link via email. |
| **Origin** | Home, Landing | The initial creation page. (Internal) |
| **Console** | Dashboard, Edit Page | The private management workspace. (Internal) |
| **Signal** | Public Profile | The public read-only view. (Internal) |

---

## 9. Security Constitution

Engineers must follow these rules without exception:

- **Auth-by-URL:** The unique identifier in the URL is the sole authentication mechanism. It must be cryptographically secure (e.g., UUIDv4).
- **No Data Leakage (CRITICAL):** The internal ID (Secret Link) must NEVER be exposed on the Public Link page payloads.
- **DTO Rules (Prisma Select):** Every database query for public pages MUST explicitly exclude the primary ID field to prevent the framework from inadvertently leaking the key to the client payload.
- **UUID Validation:** All server-side actions must validate the UUID format before querying the database to prevent injection attacks.

---

## 10. Accessibility Constitution

Implementation rules for universal access:

- **Keyboard:** Every interactive element must be reachable via `Tab`. The `Escape` key must collapse inline warnings.
- **Focus:** High-contrast focus rings are mandatory. Focus must never be trapped. Inputs must auto-focus on initial load where specified by UX.
- **Touch:** All interactive elements must possess a minimum `44x44` pixel tap target.
- **Responsive:** Layouts must fluidly stack into a single column on mobile viewports.
- **ARIA:** Secret links must utilize `aria-describedby` linking to the Vault warning. Buttons must possess explicit `aria-label`s if context is merely visually implied.
- **Screen Readers:** Complex visual data components must be paired with an `sr-only` chronological text table.
- **Contrast:** Reading text must meet WCAG AAA (7:1). Borders and focus rings must meet WCAG AA (4.5:1). Color is never the sole indicator of state.
- **Color Independence:** Interface state must be fully comprehensible in grayscale.
- **Reduced Motion:** If OS-level reduced motion is detected, all CSS transitions must instantly resolve to `0ms`.

---

## 11. Motion Constitution

The generalized physics engine of the Precision Archive:

- **Interaction Language:** Near-zero latency. Elastic or bouncy easing curves are strictly banned.
- **Hover:** Sharp, immediate visual shift (0ms).
- **Pressed:** Buttons physically depress instantly via transformation.
- **Focus:** Focus rings snap instantly.
- **Loading:** Non-blocking. Use geometric indicators on the specific component, not global overlays.
- **Success:** Instant snap to the new state. No celebratory animations.
- **Error:** Instant appearance. High contrast. No lateral "error shakes".
- **Pending:** Visual indicators (e.g., dashed borders) must remain static.
- **Route Transitions:** Instant cut. No cross-fades between primary architectural nodes.

---

## 12. Engineering Standards

Permanent repository standards governing code quality:

- **Strict TypeScript:** All code must adhere to strict type checking.
- **No Default Exports:** Default exports are banned except where strictly required by the underlying framework (e.g., Next.js page files). Use named exports for refactoring safety.
- **No Unnecessary Any:** The use of `any` is forbidden unless interfacing with untyped legacy external libraries.
- **Absolute Imports:** All internal module resolution must utilize absolute import paths.
- **Composition over Inheritance:** UI and logic must be built using functional composition.
- **Reusable before Specialized:** Engineers must verify a primitive component does not exist before creating a new one.
- **No Duplicated Utilities:** Shared logic must reside in a single centralized utility module.
- **Feature-first Organization:** Code should be grouped by domain/feature rather than by technical type (e.g., group a component and its specific hooks together).
- **Consistent Naming Conventions:** PascalCase for components, camelCase for functions/variables. Boolean variables must use prefixes (e.g., `is`, `has`, `should`).
- **Self-documenting Code:** Code structure and variable names must explain the *what*.
- **JSDoc Where Appropriate:** Use JSDoc to explain the *why* for complex business logic, regex, or architectural workarounds.
- **No Magic Values:** Hardcoded numbers or strings used multiple times must be extracted into explicit constants.

---

## 13. Dependency Governance

The addition of any new external dependency requires strict justification documented in the PR or milestone review:

- **Requirement:** Why is this strictly required?
- **Existing Tooling:** Why can't existing tooling or native APIs solve this?
- **Bundle Size:** What is the exact impact on the client bundle?
- **Maintenance:** Is the library actively maintained and widely adopted?
- **Security:** Does it introduce severe vulnerability risks?
- **Alternatives:** What alternatives were evaluated and rejected?

*No dependency may be added without this explicit documentation.*

---

## 14. Technical Debt Policy

Temporary implementations are heavily restricted.

- **Allowed Tags:** `TODO`, `FIXME`, `HACK`, `TEMP`, `WORKAROUND`.
- **Policy:** No temporary implementation may exist in the main branch unless it is explicitly documented with one of the tags above, tracked with a corresponding issue ticket, reviewed by a peer/AI, and explicitly listed in the Milestone Review. Undocumented "hacks" are forbidden.

---

## 15. Change Control Policy

Future changes to the architecture, design, or this contract are allowed ONLY through a formal process. No silent modifications are permitted.

Every change request must formally document:

- **Problem Statement:** What is breaking or failing?
- **Reason:** Why does this require a fundamental change?
- **Affected Documents:** Which artifacts or constitution sections are impacted?
- **Migration Impact:** How does this affect existing data or code?
- **Approval Status:** Accepted / Rejected.
- **Version History:** Tracked via document versioning.

---

## 16. Definition of Drift

Reviewers must actively identify and eliminate drift.

- **Design Drift:** Deviations from geometric rules (e.g., adding border-radius), color palettes, or spacing multipliers.
- **UX Drift:** Introducing new user flows, modifying the sequence of events, or adding unapproved friction (modals).
- **Architecture Drift:** Violating the flat routing structure, introducing global navigation, or changing the core entity model.
- **Engineering Drift:** Violating Engineering Standards (e.g., adding `any`, bypassing Server Actions, adding heavy state managers).
- **Content Drift:** Altering approved terminology, adding conversational tone, or changing error messaging.
- **Accessibility Drift:** Introducing features that break keyboard tab order, fail contrast ratios, or ignore ARIA requirements.
- **Performance Drift:** Increasing bundle size unnecessarily, blocking the main thread, or increasing Time-To-Interactive.

---

## 17. AI Collaboration Policy

Since implementation is performed by AI-assisted engineering, the following permanent rules apply to all AI agents.

The AI MUST NEVER:

- Redesign UX or invent unauthorized features.
- Rename approved terminology.
- Modify the established architecture.
- Merge multiple milestones into a single unreviewable monolith.
- Implement out-of-scope work.
- Ignore failed quality gates (linting, typechecking, building).
- Bypass accessibility mandates.
- Introduce dependency creep without invoking Dependency Governance.
- Skip producing documentation or the Expanded Self Review.

---

## 18. Milestone Governance

A milestone is a strict, isolated unit of work.

Every milestone MUST:

- Have exactly one overarching objective.
- Have explicit, documented scope.
- Have explicit, documented out-of-scope work.
- Leave the repository in a fully deployable state.
- Leave no unfinished architectural scaffolding.
- Pass every quality gate (lint, typecheck, build).
- Remain independently reviewable (not overly massive).

---

## 19. Implementation Workflow

Every future milestone MUST execute this precise process:

1. **Review all approved artifacts.**
2. **Review this Implementation Contract.**
3. **Produce an internal implementation checklist** mapped directly to requirements.
4. **Clearly define milestone scope.**
5. **Clearly define out-of-scope work.**
6. **Implement** (Code the milestone).
7. **Run quality gates:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm run dev`.
8. **Perform Expanded Self Review.**
9. **Produce Milestone Review** using the required format.
10. **Pass the Milestone Acceptance Gate.**

---

## 20. Expanded Self Review

Replace hostile reviews with this structured audit. Every milestone must document compliance across these categories:

- **Design Compliance:** Does the UI perfectly match Phase 3 geometry and tokens?
- **UX Compliance:** Are the core flows unaltered? Are no modals introduced?
- **Accessibility:** Is it 100% keyboard navigable? Are touch targets 44x44?
- **Performance:** Have we maintained 0ms interaction latency and server-side rendering advantages?
- **Security:** Are UUIDs validated? Are IDs perfectly isolated from public payloads?
- **Architecture:** Does it adhere to the monolithic, framework-approved structure?
- **Maintainability:** Does it follow strict TypeScript and absolute import rules?
- **Code Duplication:** Has shared logic been centralized?
- **Dependency Impact:** Have any new packages been justified via Governance?
- **Technical Debt:** Are all `TODO` or `HACK` tags documented?
- **Regression Risk:** Does this break any existing offline queueing or UI?
- **Documentation:** Has the Milestone Review been fully populated?

---

## 21. Required Milestone Review Format

Every milestone must end with an artifact matching this exact format:

```markdown
# Implementation Summary
[Brief description of what was achieved]

## Scope
- **In-Scope:** [List items]
- **Out-of-Scope:** [List items]

## Files Created
- `path/to/file`

## Files Modified
- `path/to/file`

## Expanded Self Review
- **Design Compliance:** [Pass/Fail/Notes]
- **UX Compliance:** [Pass/Fail/Notes]
- **Accessibility:** [Pass/Fail/Notes]
- **Performance:** [Pass/Fail/Notes]
- **Security:** [Pass/Fail/Notes]
- **Architecture:** [Pass/Fail/Notes]
- **Maintainability:** [Pass/Fail/Notes]
- **Code Duplication:** [Pass/Fail/Notes]
- **Dependency Impact:** [Pass/Fail/Notes]
- **Technical Debt:** [Pass/Fail/Notes]
- **Regression Risk:** [Pass/Fail/Notes]
- **Documentation:** [Pass/Fail/Notes]

## Definition of Drift Check
[Explicitly verify no Design, UX, Architecture, Engineering, Content, Accessibility, or Performance drift occurred.]

## Milestone Acceptance Gate
(See Section 22)
```

---

## 22. Milestone Acceptance Gate

Every milestone MUST conclude with this formal checkpoint appended to the Milestone Review:

```markdown
# Milestone Acceptance Gate
- **Milestone Status:** [Accepted / Rejected]
- **Reason:** [Brief justification]
- **Reviewer:** [AI Agent / Human Lead]
- **Date:** [ISO 8601 Date]
- **Next Milestone:** [Title of the next logical phase]
- **Quality Gates Passed:** [Lint: Yes, Typecheck: Yes, Build: Yes]
```

---

## 23. Compliance Matrix

| Approved Phase | Implementation Responsibility | Verification Method |
| :--- | :--- | :--- |
| **Phase 2 (Strategy)** | Zero-friction creation; Immediate momentum | E2E testing; TTI metrics |
| **Phase 3 (Design)** | 0px borders; Typography scale; Monochromatic colors | Visual Regression; Code Review |
| **Phase 4.1 (IA)** | Flat URL structure; Inline workflows | Code Review; Manual UX testing |
| **Phase 4.2 (Experiences)**| Action Zone dominance; Contextual progressive UI | Visual Inspection |
| **Phase 4.3 (Resilience)** | Strict offline queue timeouts; Preserved input text | Network Throttling tests |
| **Phase 4.4 (A11y)** | Keyboard navigable; `sr-only` Lattice; Touch targets | Screen Reader audit; Lighthouse |
| **Phase 4.5 (Motion)** | 0ms hover; Mechanical snaps; No elastic easing | Code Review (CSS transitions) |
| **Phase 4.6 (Content)** | Exact microcopy; Objective errors | String matching; Code Review |
| **Phase 5 (Architecture)** | Server-side mutations; No ID leakage | Network Payload Inspection |
| **Contract (Standards)** | Strict TS; Absolute imports; No default exports | Static Analysis |

---

## 24. Definition of Done

The permanent Definition of Done for every milestone. A milestone is complete ONLY IF:

- ✓ Scope is completed.
- ✓ No scope creep occurred.
- ✓ All quality gates pass (`lint`, `typecheck`, `build`, `dev`).
- ✓ No Design drift.
- ✓ No UX drift.
- ✓ No Architecture drift.
- ✓ No Engineering drift.
- ✓ Accessibility is maintained (100% keyboard, contrast, ARIA).
- ✓ Security is maintained (Zero ID leakage).
- ✓ Performance is maintained.
- ✓ Expanded Self Review is completed.
- ✓ Milestone Acceptance Gate is signed and Accepted.
- ✓ Code is fully deployable.

---
*End of Implementation Contract v1.1*
