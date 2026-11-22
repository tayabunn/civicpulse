# CivicPulse Frontend Structure and Content Plan

## Recommended approach

CivicPulse should not be treated as one large page. Build it as two connected frontend experiences:

1. **Public website:** explains CivicPulse and helps citizens submit or track a report.
2. **Authenticated application:** provides role-based dashboards for citizens, department managers, maintenance staff, and administrators.

For the public landing page, use **8 core sections**. This is enough to communicate the product clearly without making the page feel crowded. The dashboards should then contain the operational pages required by each user role.

The central product message should be:

> **See a problem. Report it. Track the progress. Improve your city.**

The reference products consistently emphasize four useful ideas: reporting with a photo and accurate location, routing the report to the responsible team, tracking progress after submission, and giving staff a structured dashboard for verification and resolution. Love Clean Streets also makes an important distinction that CivicPulse should communicate clearly: the platform is the reporting and workflow system, while the responsible department performs the repair or service work.

## A. Public landing page: 8 sections

### 1. Navigation bar

**Purpose:** Give visitors immediate access to the brand, reporting flow, and authentication.

**Content:**

- Logo: `CivicPulse`
- Navigation links: `How It Works`, `Report an Issue`, `Explore Reports`, `About`
- Secondary action: `Sign In`
- Primary action: `Report an Issue`

**Mobile navigation:** Keep only the logo, `Sign In`, and a prominent `Report an Issue` button. Put the remaining links inside a menu.

---

### 2. Hero section

**Purpose:** Explain the platform in one sentence and move citizens toward the main action.

**Recommended headline:**

> **Make your city better, one report at a time.**

**Supporting text:**

> Spot a pothole, broken streetlight, blocked drain, overflowing bin, or damaged footpath? Report it with a photo and location. CivicPulse sends it to the right department and keeps you updated until it is resolved.

**Primary button:** `Report an Issue`

**Secondary button:** `Explore Reported Issues`

**Trust text below buttons:**

> Clear reports. Faster coordination. More responsive communities.

**Hero visual:** Show a map with several colored issue markers and a small report card containing an image, category, location, and status. Do not make the hero purely decorative; it should demonstrate the product.

---

### 3. Problem categories / reportable issues

**Purpose:** Help visitors understand what they can report.

**Section label:** `WHAT CAN YOU REPORT?`

**Heading:**

> **If it affects public space, it belongs on the map.**

**Supporting text:**

> CivicPulse helps residents report everyday infrastructure problems before they become bigger safety, accessibility, or environmental concerns.

**Category cards:**

- **Road Damage** — Potholes, cracks, damaged road surfaces, and unsafe driving conditions.
- **Streetlights** — Broken, flickering, missing, or unsafe public lighting.
- **Drainage** — Blocked drains, standing water, flooding risks, and damaged drainage systems.
- **Footpaths** — Cracked, blocked, uneven, or inaccessible sidewalks and walkways.
- **Waste Management** — Overflowing bins, illegal dumping, litter, and missed collection.
- **Public Infrastructure** — Damaged signs, benches, barriers, public facilities, and other civic assets.

**Card action:** `Report this issue`

---

### 4. How CivicPulse works

**Purpose:** Show the complete citizen-to-department workflow in a simple sequence.

**Section label:** `HOW IT WORKS`

**Heading:**

> **From a quick report to a visible resolution.**

**Step 1 — Spot it**

> Notice a problem in your neighborhood and open CivicPulse.

**Step 2 — Report it**

> Add a short description, choose a category, upload a photo, and place the issue accurately on the map.

**Step 3 — We route it**

> Your report is reviewed and assigned to the department responsible for that location and issue type.

**Step 4 — Track it**

> Follow status updates from submission to review, assignment, active work, resolution, and closure.

**Step 5 — Confirm the change**

> Review the resolution update and share feedback when the issue is closed.

**CTA:** `Create a Report`

---

### 5. Live issue map / transparency section

**Purpose:** Demonstrate that CivicPulse is not just a private form; it creates a visible, location-based view of community issues.

**Heading:**

> **See what needs attention in your community.**

**Supporting text:**

> Explore reported issues by location, category, priority, and status. A shared view helps residents understand local needs and helps teams identify recurring problems.

**Map controls:**

- Search by address or area
- Filter by category
- Filter by status
- Filter by priority
- View nearby reports

**Map legend:**

- Submitted
- Under Review
- Assigned
- In Progress
- Resolved
- Closed

**Empty state copy:**

> No reports match your current filters. Try expanding the area or removing a filter.

**Privacy note:**

> Exact reporter details are never displayed publicly.

**CTA:** `Open the Issue Map`

---

### 6. Benefits by audience

**Purpose:** Explain the value of the platform to citizens and the teams operating it.

**Heading:**

> **One platform for everyone responsible for a better city.**

**Citizen card:**

> **For residents**
>
> Report problems without searching for the right department. Add evidence, follow progress, and receive updates in one place.

**Department manager card:**

> **For department managers**
>
> Review incoming reports, verify details, set priorities, assign work, and monitor department performance from one dashboard.

**Maintenance staff card:**

> **For field teams**
>
> See assigned tasks, navigate to the correct location, upload completion photos, add notes, and update work status from the field.

**Administrator card:**

> **For administrators**
>
> Manage departments, users, permissions, service activity, and city-wide analytics with complete operational visibility.

---

### 7. Trust, process, and accountability

**Purpose:** Reduce uncertainty and explain what happens after a report is submitted.

**Heading:**

> **Every report has a responsible team and a visible history.**

**Supporting text:**

> CivicPulse records who reviewed a report, when it was assigned, what work was completed, and how its status changed. This creates a reliable history for residents, departments, and maintenance teams.

**Trust points:**

- Location-based department assignment
- Photo and evidence attachments
- Role-based access control
- Status updates with timestamps
- Resolution photographs and maintenance notes
- Activity history from submission to closure

**Suggested note:**

> CivicPulse coordinates reports and service workflows. The responsible department decides how and when the physical work is carried out.

---

### 8. Final call to action and footer

**Purpose:** End with one clear action instead of several competing messages.

**Heading:**

> **Help your community move from noticed to resolved.**

**Supporting text:**

> The next improvement may start with one photo, one location, and one report.

**Primary button:** `Report an Issue`

**Secondary button:** `Sign In to Track Reports`

**Footer links:**

- About CivicPulse
- How It Works
- Issue Map
- Help Center
- Contact
- Privacy Policy
- Terms of Service

**Footer statement:**

> CivicPulse connects citizens, city departments, and maintenance teams through a shared issue-resolution workflow.

## B. Public pages besides the landing page

The landing page should link to these pages:

### Report an issue

Use a focused multi-step form rather than showing every field at once.

**Page heading:** `Report a public issue`

**Intro text:**

> Tell us what you found. A photo and accurate location help the responsible team understand and act on your report faster.

**Step labels:**

1. `Issue details`
2. `Photo and evidence`
3. `Location`
4. `Review and submit`

**Helpful field text:**

- Title: `Give your report a short, descriptive title`
- Description: `Describe what is wrong and how it affects people.`
- Category: `Choose the issue type`
- Location: `Place the pin on the issue, not where you are standing now.`
- Photo: `Upload a clear photo if it is safe to do so.`

**Submit button:** `Submit Report`

**Success message:**

> Your report has been submitted successfully. Your reference number is **CP-000000**. You can follow updates from your dashboard.

### Issue details page

**Page heading:** `Issue details`

**Status text:** `Current status: Under Review`

**Information blocks:**

- Report reference
- Category
- Location
- Submitted date
- Priority
- Responsible department
- Description
- Photos
- Activity history

**Citizen-facing explanation:**

> This timeline shows the important updates made to your report. You will see when it is reviewed, assigned, updated, resolved, or closed.

### Help / FAQ page

Recommended questions:

- What can I report?
- How do I choose the correct location?
- Can I update a report after submitting it?
- How do I track my report?
- What does each status mean?
- Who is responsible for resolving an issue?
- What should I do if the issue is urgent or dangerous?
- How is my personal information protected?

## C. Authenticated frontend structure by role

### Citizen workspace

**Main navigation:** `Overview`, `Report an Issue`, `My Reports`, `Issue Map`, `Notifications`, `Profile`

**Dashboard heading:**

> **Welcome back, [Name].**

**Dashboard supporting text:**

> Track your reports, see local updates, and help keep your community moving forward.

**Summary cards:**

- Total reports
- Under review
- In progress
- Resolved

**Empty state for My Reports:**

> You have not submitted a report yet. If you notice a public issue, you can report it in a few steps.

**Feedback prompt after resolution:**

> Was this issue resolved satisfactorily?

Buttons: `Yes, resolved` and `Not yet`

### Department manager workspace

**Main navigation:** `Dashboard`, `All Issues`, `Map View`, `Assignments`, `Team`, `Reports`, `Settings`

**Dashboard heading:**

> **Department operations**

**Supporting text:**

> Review incoming reports, prioritize the work, and keep your team moving toward resolution.

**Key cards:**

- New reports
- Awaiting verification
- High-priority issues
- In-progress tasks
- Resolved this month
- Average resolution time

**Verification action copy:**

> Confirm the report details before assigning this issue to a team member.

Buttons: `Verify Report`, `Mark as Duplicate`, `Request More Information`, `Reject Report`

**Assignment modal copy:**

> Assign this issue to a department and maintenance staff member. The assignee will receive the task with its location, priority, evidence, and due date.

### Maintenance staff workspace

**Main navigation:** `My Tasks`, `Task Map`, `Updates`, `Profile`

**Dashboard heading:**

> **My maintenance tasks**

**Supporting text:**

> View your assigned work, update progress from the field, and document completed repairs.

**Task statuses:** `Assigned`, `Accepted`, `In Progress`, `Waiting`, `Completed`

**Task detail prompt:**

> Review the issue location and description before starting work. Add a progress note or photo whenever the task status changes.

**Completion form labels:**

- Work completed: `Describe what was done`
- Completion photo: `Upload a photo showing the completed work`
- Additional notes: `Add any information the department should know`

**Completion button:** `Mark Task as Completed`

**Success message:**

> Task completed. Your update has been sent to the department manager for review.

### Admin workspace

**Main navigation:** `Overview`, `Issues`, `Users`, `Departments`, `Teams`, `Analytics`, `Audit Log`, `Settings`

**Dashboard heading:**

> **City-wide overview**

**Supporting text:**

> Monitor service performance, manage platform access, and understand where your city needs attention.

**Analytics cards:**

- Total reported issues
- Open issues
- Resolved issues
- Active maintenance tasks
- Average resolution time
- Citizen satisfaction

**Admin warning copy:**

> Changes to user roles and department permissions affect access across CivicPulse. Review the details before saving.

## D. Status language and workflow copy

Use the same labels everywhere so citizens and staff understand the workflow consistently.

### Submitted

> Your report was received and is waiting for review.

### Under Review

> A department manager is checking the report details and deciding the next action.

### Assigned

> The report has been assigned to the responsible department or maintenance team.

### In Progress

> Work has started on this issue.

### Resolved

> The responsible team has reported that the issue has been fixed. Review the update and share feedback if available.

### Closed

> This report has been reviewed and closed. Its activity history remains available for reference.

### Duplicate

> This report matches an existing issue. Your report has been linked to the original case so progress can be tracked in one place.

### Rejected / Not actionable

> This report could not be accepted for action. Review the reason provided by the responsible department.

## E. Important UI states to design

These states are especially important for a professional frontend and should not be left to browser defaults.

### Loading

> Loading your reports…

### Network error

> We could not load this information. Check your connection and try again.

Button: `Try Again`

### Permission error

> You do not have permission to view this page.

Button: `Return to Dashboard`

### Missing location

> Please place the map pin on the issue location before continuing.

### Unsafe reporting warning

> Only take photos or inspect the issue when it is safe to do so. Do not enter traffic or restricted areas.

### Delete / destructive action confirmation

> Are you sure you want to continue? This action may affect the report workflow and cannot be easily undone.

## F. Suggested page order for implementation

Build in this order so the frontend becomes usable early:

1. Shared layout, navigation, buttons, cards, badges, modal, toast, and form components.
2. Authentication redirect and role-based route protection.
3. Citizen dashboard and report creation flow.
4. My Reports and issue details with status timeline.
5. Department manager issue list, issue detail, verification, priority, and assignment.
6. Maintenance staff task list, task detail, progress update, and completion evidence.
7. Admin dashboard, user management, department management, and analytics.
8. Map view, filters, notifications, empty states, error states, and responsive polish.

## Recommended final page inventory

### Public pages

- Landing page
- Report an issue
- Public issue map
- Issue details
- How it works
- Help / FAQ
- Sign in
- Profile / registration completion

### Citizen pages

- Citizen dashboard
- Create issue
- My reports
- Report details
- Notifications
- Profile settings

### Department manager pages

- Department dashboard
- All issues
- Issue details and verification
- Assignments
- Team management
- Department reports

### Maintenance staff pages

- My tasks
- Task details
- Task map
- Progress update
- Profile settings

### Admin pages

- Admin dashboard
- All issues
- User management
- Department management
- Team management
- Analytics
- Audit log
- System settings

This gives CivicPulse a focused public website with eight marketing sections and a complete authenticated application that matches the backend roles and workflow already described in the project brief.

## References

[1]: https://userguide.lovecleanstreets.com/ "Love Clean Streets User Guide"

[2]: https://civicspot.io/ "CivicSpot Civic Reporting Platform"

[3]: https://www.mark-a-spot.com/ "Mark-a-Spot Open-Source Citizen Reporting Platform"

[4]: https://bbits.co.uk/products/love-clean-streets "bbits Love Clean Streets Product Page"

[5]: https://www.civisnap.com/ "CiviSnap Community Reporting Platform"
