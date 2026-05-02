const statuses = [
  "Applied",
  "Resume Screening",
  "Interview Scheduled",
  "Interview Completed",
  "Offer Pending",
  "Offered",
  "Accepted",
  "Rejected",
  "Withdrawn",
];

const state = {
  candidates: [
    {
      id: 1,
      name: "Mia Chen",
      email: "mia.chen@example.com",
      position: "Frontend Engineer",
      source: "LinkedIn",
      education: "NTU, Master",
      experience: "4 years SaaS product UI",
      skills: "React, TypeScript, Design systems",
      languages: "Mandarin, English - Bilingual",
      expectedSalary: "NT$1,250,000",
      availableStart: "2026-06-15",
      remarks: "NTU, Master, Bilingual",
      resume: "https://example.com/resumes/mia-chen.pdf",
      status: "Interview Scheduled",
      confirmed: true,
      communication: ["Confirmation email sent", "Candidate confirmed attendance"],
    },
    {
      id: 2,
      name: "Jay Lin",
      email: "jay.lin@example.com",
      position: "Backend Engineer",
      source: "Referral",
      education: "NCKU, Bachelor",
      experience: "6 years API and cloud services",
      skills: "Node.js, PostgreSQL, AWS",
      languages: "Mandarin, English - Fluent",
      expectedSalary: "NT$1,450,000",
      availableStart: "2026-07-01",
      remarks: "Referral, strong system design",
      resume: "https://example.com/resumes/jay-lin.pdf",
      status: "Interview Scheduled",
      confirmed: false,
      communication: ["Reschedule request received"],
    },
    {
      id: 3,
      name: "Sofia Wang",
      email: "",
      position: "HR Operations Specialist",
      source: "104 Job Bank",
      education: "NCCU, Bachelor",
      experience: "3 years HR operations",
      skills: "ATS, onboarding, reporting",
      languages: "Mandarin, English - Intermediate",
      expectedSalary: "NT$820,000",
      availableStart: "2026-05-20",
      remarks: "Missing email, resume pending",
      resume: "",
      status: "Resume Screening",
      confirmed: false,
      communication: ["Phone screen completed"],
    },
    {
      id: 4,
      name: "Daniel Kao",
      email: "daniel.kao@example.com",
      position: "Product Manager",
      source: "Company site",
      education: "National Tsing Hua University, MBA",
      experience: "7 years B2B workflow products",
      skills: "Roadmapping, analytics, stakeholder management",
      languages: "Mandarin, English - Bilingual",
      expectedSalary: "NT$1,650,000",
      availableStart: "2026-06-01",
      remarks: "Strong enterprise background",
      resume: "https://example.com/resumes/daniel-kao.pdf",
      status: "Interview Completed",
      confirmed: true,
      communication: ["Evaluation reminder sent"],
    },
  ],
  interviews: [
    {
      id: 101,
      candidateId: 1,
      date: "2026-05-04",
      time: "09:30",
      duration: 60,
      place: "Meeting room 301",
      meetingLink: "https://meet.example.com/mia-chen",
      interviewers: ["Mr. Dawson", "Ms. Cathy"],
      personInCharge: "Angel",
      stage: "1st interview",
      feedbackStatus: "Pending",
      status: "Scheduled",
    },
    {
      id: 102,
      candidateId: 2,
      date: "2026-05-05",
      time: "11:00",
      duration: 60,
      place: "Meeting room 502",
      meetingLink: "https://meet.example.com/jay-lin",
      interviewers: ["Mr. Dawson"],
      personInCharge: "Angel",
      stage: "2nd interview",
      feedbackStatus: "Pending",
      status: "Reschedule Requested",
    },
    {
      id: 103,
      candidateId: 4,
      date: "2026-05-06",
      time: "14:00",
      duration: 60,
      place: "Google Meet",
      meetingLink: "https://meet.example.com/daniel-kao",
      interviewers: ["Ms. Cathy", "Mr. Liu"],
      personInCharge: "Bella",
      stage: "1st interview",
      feedbackStatus: "Overdue",
      status: "Completed",
    },
  ],
  blockedSlots: [
    { day: "2026-05-04", time: "12:00", label: "Lunch" },
    { day: "2026-05-05", time: "12:00", label: "Lunch" },
    { day: "2026-05-06", time: "12:00", label: "Lunch" },
    { day: "2026-05-07", time: "12:00", label: "Lunch" },
    { day: "2026-05-08", time: "12:00", label: "Lunch" },
    { day: "2026-05-07", time: "15:00", label: "HR sync" },
  ],
};

let currentWeekStart = new Date("2026-05-04T00:00:00");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function visibleWeekDays() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + index);
    return formatDate(date);
  });
}

function visibleWeekNames() {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + index);
    return `${names[date.getDay()]} ${displayDate(date)}`;
  });
}

function candidate(id) {
  return state.candidates.find((item) => item.id === Number(id));
}

function detectConflict(nextInterview) {
  return state.interviews.find((interview) => {
    if (interview.id === nextInterview.id || interview.date !== nextInterview.date || interview.time !== nextInterview.time) {
      return false;
    }
    const sameCandidate = interview.candidateId === nextInterview.candidateId;
    const sharedInterviewer = interview.interviewers.some((person) => nextInterview.interviewers.includes(person));
    return sameCandidate || sharedInterviewer;
  });
}

function alerts() {
  const issues = [];
  state.candidates.forEach((person) => {
    if (!person.email) issues.push(`${person.name} has no email.`);
    if (!person.resume) issues.push(`${person.name} is missing a resume.`);
    if (!person.confirmed) issues.push(`${person.name} has not confirmed attendance.`);
  });
  state.interviews.forEach((interview) => {
    const person = candidate(interview.candidateId);
    if (!interview.interviewers.length) issues.push(`${person.name} has no interviewer assigned.`);
    if (!interview.personInCharge) issues.push(`${person.name} has no person in charge.`);
    if (interview.feedbackStatus === "Overdue") issues.push(`${person.name} has overdue interviewer feedback.`);
    if (detectConflict(interview)) issues.push(`${person.name} has a schedule conflict.`);
  });
  return issues;
}

function dashboard() {
  const weekDays = visibleWeekDays();
  const stageCounts = statuses.map((status) => ({
    status,
    count: state.candidates.filter((person) => person.status === status).length,
  }));
  const workload = {};
  state.interviews.forEach((interview) => {
    interview.interviewers.forEach((person) => {
      workload[person] = (workload[person] || 0) + 1;
    });
  });
  return {
    interviewsThisWeek: state.interviews.filter((interview) => weekDays.includes(interview.date)).length,
    pendingFeedback: state.interviews.filter((interview) => interview.feedbackStatus !== "Submitted").length,
    upcomingToday: state.interviews.filter((interview) => interview.date === formatDate(currentWeekStart)).length,
    noShowRate: "3.8%",
    offerAcceptanceRate: "72%",
    averageTimeToHire: "18 days",
    stageCounts,
    workload,
  };
}

function filteredInterviews() {
  const search = document.querySelector("#search").value.toLowerCase();
  const status = document.querySelector("#statusFilter").value;
  const feedback = document.querySelector("#feedbackFilter").value;
  const owner = document.querySelector("#ownerFilter").value;
  return state.interviews.filter((interview) => {
    const person = candidate(interview.candidateId);
    const haystack = [
      person.name,
      person.position,
      interview.personInCharge,
      interview.interviewers.join(" "),
      person.education,
      person.languages,
      person.source,
    ].join(" ").toLowerCase();
    return (!search || haystack.includes(search)) &&
      (!status || person.status === status) &&
      (!feedback || interview.feedbackStatus === feedback) &&
      (!owner || interview.personInCharge === owner);
  });
}

function renderDashboard() {
  const data = dashboard();
  const workloadEntries = Object.entries(data.workload).sort((a, b) => b[1] - a[1]);
  document.querySelector("#metrics").innerHTML = [
    ["Interviews this week", data.interviewsThisWeek],
    ["Pending feedback", data.pendingFeedback],
    ["Upcoming today", data.upcomingToday],
    ["Average time-to-hire", data.averageTimeToHire],
    ["No-show rate", data.noShowRate],
    ["Offer acceptance", data.offerAcceptanceRate],
    ["Top source", "LinkedIn"],
    ["Busy interviewer", workloadEntries[0] ? workloadEntries[0][0] : "None"],
  ].map(([label, value]) => `<div class="card metric"><div class="label">${label}</div><div class="value">${value}</div></div>`).join("");
  document.querySelector("#stageSummary").innerHTML = data.stageCounts
    .map((item) => `<p><span class="badge">${item.count}</span> ${item.status}</p>`)
    .join("");
  document.querySelector("#alerts").innerHTML = alerts()
    .map((issue) => `<div class="alert">${issue}</div>`)
    .join("") || '<p class="subtitle">No validation alerts.</p>';
}

function renderCalendar() {
  const grid = document.querySelector("#calendarGrid");
  const slotSize = Number(document.querySelector("#slotSize").value);
  const days = visibleWeekDays();
  const dayNames = visibleWeekNames();
  const times = [];
  for (let hour = 9; hour <= 17; hour += 1) {
    times.push(`${String(hour).padStart(2, "0")}:00`);
    if (slotSize === 30 && hour < 17) times.push(`${String(hour).padStart(2, "0")}:30`);
  }

  document.querySelector("#weekTitle").textContent = `${displayDate(currentWeekStart)} - ${displayDate(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 4))}`;
  grid.innerHTML = `<div class="cell head"></div>${dayNames.map((day) => `<div class="cell head">${day}</div>`).join("")}`;
  const visible = filteredInterviews();
  times.forEach((time) => {
    grid.insertAdjacentHTML("beforeend", `<div class="cell time">${time}</div>`);
    days.forEach((day) => {
      const blocked = state.blockedSlots.find((slot) => slot.day === day && slot.time === time);
      const interview = visible.find((item) => item.date === day && item.time === time);
      const slot = document.createElement("div");
      slot.className = blocked ? "cell slot blocked" : "cell slot";
      slot.dataset.date = day;
      slot.dataset.time = time;
      slot.addEventListener("dragover", (event) => event.preventDefault());
      slot.addEventListener("drop", onDrop);
      if (blocked) slot.textContent = blocked.label;
      if (interview) slot.appendChild(interviewButton(interview));
      grid.appendChild(slot);
    });
  });
}

function interviewButton(interview) {
  const person = candidate(interview.candidateId);
  const button = document.createElement("button");
  button.className = `interview ${calendarColorClass(interview, person)}`;
  button.draggable = true;
  button.dataset.id = interview.id;
  button.innerHTML = `<div class="candidate-name">${person.name}</div><div>${interview.personInCharge}</div><div class="small">${interview.stage} - ${interview.place}</div>`;
  button.addEventListener("click", () => openDetail(interview.id));
  button.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", String(interview.id)));
  return button;
}

function calendarColorClass(interview, person) {
  if (["Offered", "Accepted"].includes(person.status)) return "stage-success";
  if (["Rejected", "Withdrawn"].includes(person.status)) return "stage-closed";
  if (interview.stage === "2nd interview") return "stage-second";
  return "stage-first";
}

function onDrop(event) {
  const id = Number(event.dataTransfer.getData("text/plain"));
  const date = event.currentTarget.dataset.date;
  const time = event.currentTarget.dataset.time;
  const interview = state.interviews.find((item) => item.id === id);
  if (state.blockedSlots.some((slot) => slot.day === date && slot.time === time)) {
    window.alert("This time slot is blocked.");
    return;
  }
  const next = { ...interview, date, time };
  if (detectConflict(next)) {
    window.alert("Interviewer or candidate is already booked at this time.");
    return;
  }
  interview.date = date;
  interview.time = time;
  interview.status = "Rescheduled";
  renderAll();
}

function renderCandidates() {
  document.querySelector("#candidateRows").innerHTML = state.candidates.map((person) => `
    <tr>
      <td><button class="btn" data-candidate="${person.id}">${person.name}</button><div class="small">${person.email || "Missing email"}</div></td>
      <td>${person.position}<div class="small">${person.source}</div></td>
      <td><span class="badge">${person.status}</span></td>
      <td>${person.education}</td>
      <td>${person.languages}</td>
      <td>${person.resume ? `<a href="${person.resume}" target="_blank">Open resume</a>` : '<span class="badge red">Missing</span>'}</td>
      <td>${person.confirmed ? '<span class="badge green">Confirmed</span>' : '<span class="badge amber">Waiting</span>'}<br><button class="btn" data-edit-candidate="${person.id}">Edit</button></td>
    </tr>
  `).join("");
  document.querySelectorAll("[data-candidate]").forEach((button) => {
    button.addEventListener("click", () => openCandidate(button.dataset.candidate));
  });
  document.querySelectorAll("[data-edit-candidate]").forEach((button) => {
    button.addEventListener("click", () => openCandidateForm(button.dataset.editCandidate));
  });
}

function renderPipeline() {
  document.querySelector("#pipelineBoard").innerHTML = statuses.map((status) => {
    const cards = state.candidates.filter((person) => person.status === status).map((person) => `
      <div class="candidate-card">
        <strong>${person.name}</strong>
        <div class="small">${person.position}</div>
        <select data-stage="${person.id}">
          ${statuses.map((item) => `<option ${item === person.status ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>
    `).join("");
    return `<div class="lane"><h3>${status}</h3>${cards}</div>`;
  }).join("");
  document.querySelectorAll("[data-stage]").forEach((select) => {
    select.addEventListener("change", () => {
      const person = candidate(select.dataset.stage);
      person.status = select.value;
      syncCandidateStatusWithInterviews(person.id);
      renderAll();
    });
  });
}

function syncCandidateStatusWithInterviews(candidateId) {
  const person = candidate(candidateId);
  state.interviews
    .filter((interview) => interview.candidateId === person.id)
    .forEach((interview) => {
      if (person.status === "Interview Completed") interview.status = "Completed";
      if (["Offered", "Accepted", "Rejected", "Withdrawn"].includes(person.status)) {
        interview.status = "Completed";
      }
      if (person.status === "Interview Scheduled" && interview.status === "Completed") {
        interview.status = "Scheduled";
      }
    });
}

function renderForms() {
  const selectedStatus = document.querySelector("#statusFilter").value;
  const selectedOwner = document.querySelector("#ownerFilter").value;
  const owners = [...new Set(state.interviews.map((item) => item.personInCharge))];
  document.querySelector("#ownerFilter").innerHTML = `<option value="">All owners</option>${owners.map((item) => `<option>${item}</option>`).join("")}`;
  document.querySelector("#statusFilter").innerHTML = `<option value="">All status</option>${statuses.map((item) => `<option>${item}</option>`).join("")}`;
  document.querySelector("#statusFilter").value = statuses.includes(selectedStatus) ? selectedStatus : "";
  document.querySelector("#ownerFilter").value = owners.includes(selectedOwner) ? selectedOwner : "";
  document.querySelector("#candidateSelect").innerHTML = state.candidates
    .map((person) => `<option value="${person.id}">${person.name} - ${person.position}</option>`)
    .join("");
  document.querySelector("#candidateStatusSelect").innerHTML = statuses.map((item) => `<option>${item}</option>`).join("");
  document.querySelector("#evaluationInterview").innerHTML = state.interviews
    .map((interview) => `<option value="${interview.id}">${candidate(interview.candidateId).name} - ${interview.date} ${interview.time}</option>`)
    .join("");
  document.querySelector("#feedbackList").innerHTML = state.interviews
    .map((interview) => `<p><strong>${candidate(interview.candidateId).name}</strong><br><span class="badge ${feedbackClass(interview.feedbackStatus)}">${interview.feedbackStatus}</span></p>`)
    .join("");
}

function feedbackClass(status) {
  if (status === "Overdue") return "red";
  if (status === "Submitted") return "green";
  return "amber";
}

function openCandidate(id) {
  const interview = state.interviews.find((item) => item.candidateId === Number(id));
  if (interview) openDetail(interview.id);
  if (!interview) openCandidateForm(id);
}

function openDetail(id) {
  const interview = state.interviews.find((item) => item.id === Number(id));
  const person = candidate(interview.candidateId);
  document.querySelector("#modalTitle").textContent = person.name;
  document.querySelector("#modalSubtitle").textContent = `${person.position} - ${interview.stage}`;
  document.querySelector("#modalBody").innerHTML = `<div class="detail-grid">
    ${detail("Interview date", interview.date)}
    ${detail("Interview time", `${interview.time} - ${interview.duration} min`)}
    ${detail("Candidate email", person.email || "Missing")}
    ${detail("Resume file", person.resume ? `<a href="${person.resume}" target="_blank">Open resume</a>` : "Missing")}
    ${detail("Remarks", person.remarks)}
    ${detail("Place", interview.place)}
    ${detail("Interviewers", interview.interviewers.join(", ") || "Missing")}
    ${detail("Person in charge", interview.personInCharge || "Missing")}
    ${detail("Current recruitment status", person.status)}
    ${detail("Feedback status", interview.feedbackStatus)}
    ${detail("Meeting link", interview.meetingLink ? `<a href="${interview.meetingLink}" target="_blank">Open meeting</a>` : "Not set")}
    ${detail("Communication history", person.communication.join("<br>"))}
  </div>`;
  document.querySelector("#detailModal").classList.add("open");
}

function detail(label, value) {
  return `<div class="detail"><div class="label">${label}</div><div>${value}</div></div>`;
}

function addInterview(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const interviewers = data.interviewers.split(",").map((item) => item.trim()).filter(Boolean);
  const next = {
    id: Date.now(),
    candidateId: Number(data.candidateId),
    date: data.date,
    time: data.time,
    duration: Number(data.duration),
    place: data.place || "TBD",
    meetingLink: data.meetingLink,
    interviewers,
    personInCharge: data.personInCharge,
    stage: data.stage || "1st interview",
    feedbackStatus: "Pending",
    status: "Scheduled",
  };
  if (detectConflict(next)) {
    window.alert("Interviewer or candidate is already booked at this time.");
    return;
  }
  state.interviews.push(next);
  candidate(next.candidateId).status = "Interview Scheduled";
  document.querySelector("#addModal").classList.remove("open");
  renderAll();
}

function openCandidateForm(id) {
  const form = document.querySelector("#candidateForm");
  form.reset();
  document.querySelector("#candidateModalTitle").textContent = id ? "Edit candidate" : "Add candidate";
  document.querySelector("#candidateFormId").value = id || "";
  document.querySelector("#candidateStatusSelect").innerHTML = statuses.map((status) => `<option>${status}</option>`).join("");

  if (id) {
    const person = candidate(id);
    Object.entries(person).forEach(([key, value]) => {
      const field = form.elements[key];
      if (!field) return;
      field.value = key === "confirmed" ? String(value) : value;
    });
  } else {
    form.elements.status.value = "Applied";
    form.elements.confirmed.value = "false";
  }
  document.querySelector("#candidateModal").classList.add("open");
}

function saveCandidate(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const id = Number(data.id);
  const values = {
    name: data.name.trim(),
    email: data.email.trim(),
    position: data.position.trim(),
    source: data.source.trim(),
    education: data.education.trim(),
    experience: data.experience.trim(),
    skills: data.skills.trim(),
    languages: data.languages.trim(),
    expectedSalary: data.expectedSalary.trim(),
    availableStart: data.availableStart,
    remarks: data.remarks.trim(),
    resume: data.resume.trim(),
    status: data.status,
    confirmed: data.confirmed === "true",
  };

  if (id) {
    Object.assign(candidate(id), values);
    syncCandidateStatusWithInterviews(id);
  } else {
    state.candidates.push({
      id: Date.now(),
      ...values,
      communication: ["Candidate profile created"],
    });
  }
  document.querySelector("#candidateModal").classList.remove("open");
  renderAll();
}

function renderAll() {
  renderForms();
  renderDashboard();
  renderCalendar();
  renderCandidates();
  renderPipeline();
}

document.querySelectorAll(".nav button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav button").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.view}`).classList.add("active");
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest(".modal-backdrop").classList.remove("open"));
});

["search", "statusFilter", "feedbackFilter", "ownerFilter", "slotSize"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("input", renderCalendar);
});

document.querySelector("#clearFilters").addEventListener("click", () => {
  ["search", "statusFilter", "feedbackFilter", "ownerFilter"].forEach((id) => {
    document.querySelector(`#${id}`).value = "";
  });
  renderCalendar();
});

document.querySelector("#openAdd").addEventListener("click", () => {
  document.querySelector("#addModal").classList.add("open");
});

document.querySelector("#openCandidateAdd").addEventListener("click", () => {
  openCandidateForm();
});

document.querySelector("#previousWeek").addEventListener("click", () => {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  renderAll();
});

document.querySelector("#nextWeek").addEventListener("click", () => {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  renderAll();
});

document.querySelector("#simulateReminders").addEventListener("click", () => {
  window.alert("Reminder run complete: confirmation, 24-hour, 1-hour, reschedule, cancellation, and feedback reminder queues checked.");
});

document.querySelector("#evaluationForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = Number(new FormData(event.target).get("interviewId"));
  const interview = state.interviews.find((item) => item.id === id);
  interview.feedbackStatus = "Submitted";
  renderAll();
  window.alert("Evaluation submitted.");
});

document.querySelector("#addForm").addEventListener("submit", (event) => {
  event.preventDefault();
  addInterview(event.target);
});

document.querySelector("#candidateForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveCandidate(event.target);
});

renderAll();
