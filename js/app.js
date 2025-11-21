// ===========================
// State Management
// ===========================

const state = {
  allContributors: [],
  filteredContributors: [],
  currentPage: 1,
  perPage: 100,
  sortDirection: "desc",
  searchQuery: "",
};

// ===========================
// Data Fetching
// ===========================

async function fetchContributorsData() {
  console.log("🔍 Fetching contributors from committers.top...");
  
  try {
    const response = await fetch("https://committers.top/tunisia");
    const html = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const rows = doc.querySelectorAll(".users-list tbody tr");
    const contributors = [];
    
    rows.forEach((row, index) => {
      const rank = index + 1;
      const usernameLink = row.querySelector("td:nth-child(2) a");
      const username = usernameLink ? usernameLink.getAttribute("href").split("/").pop() : "";
      const nameText = row.querySelector("td:nth-child(2)")?.textContent.trim() || "";
      const nameParts = nameText.split("\n").filter(p => p.trim());
      const name = nameParts.length > 1 ? nameParts[1].replace(/[()]/g, "").trim() : username;
      const commits = parseInt(row.querySelector("td:nth-child(3)")?.textContent.trim() || "0");
      const avatarImg = row.querySelector("td:nth-child(4) img");
      const avatar = avatarImg ? (avatarImg.getAttribute("data-src") || avatarImg.src) : `https://github.com/${username}.png`;
      
      if (username && commits > 0) {
        contributors.push({
          rank,
          username,
          name: name || username,
          commits,
          avatar,
          followers: 0,
          public_repos: 0,
        });
      }
    });
    
    console.log(`✅ Found ${contributors.length} contributors`);
    
    // Add boussaid001 if not already in list
    const hasBoussaid = contributors.some(c => c.username.toLowerCase() === 'boussaid001');
    if (!hasBoussaid) {
      console.log("➕ Adding boussaid001 to the list");
      contributors.push({
        rank: 0,
        username: 'boussaid001',
        name: 'Mohamed Amine Boussaid',
        commits: 777,
        avatar: 'https://avatars.githubusercontent.com/u/155114938?v=4',
        followers: 15,
        public_repos: 25,
      });
    }
    
    // Sort by commits and reassign ranks
    contributors.sort((a, b) => b.commits - a.commits);
    contributors.forEach((c, i) => c.rank = i + 1);
    
    return contributors;
    
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return [];
  }
}

// ===========================
// Podium Rendering
// ===========================

function renderPodium(contributors) {
  const podiumContent = document.getElementById("podium-content");
  const podiumLoading = document.getElementById("podium-loading");
  
  const top5 = contributors.slice(0, 4);
  
  podiumContent.innerHTML = "";
  
  top5.forEach((contributor) => {
    const card = document.createElement("div");
    card.className = `podium-card rank-${contributor.rank}`;
    
    card.innerHTML = `
      <div class="rank-badge">#${contributor.rank}</div>
      <img src="${contributor.avatar}" alt="${contributor.name}" class="podium-avatar" loading="lazy" onerror="this.src='https://github.com/${contributor.username}.png'" />
      <div class="podium-name">${contributor.name}</div>
      <div class="podium-username">@${contributor.username}</div>
      <div class="podium-stats">
        <div class="podium-stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <strong>${contributor.commits.toLocaleString()}</strong> commits
        </div>
        ${contributor.public_repos ? `
        <div class="podium-stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <strong>${contributor.public_repos}</strong> repos
        </div>
        ` : ''}
        ${contributor.followers ? `
        <div class="podium-stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <strong>${contributor.followers}</strong> followers
        </div>
        ` : ''}
      </div>
    `;
    
    podiumContent.appendChild(card);
  });
  
  podiumLoading.style.display = "none";
  podiumContent.style.display = "flex";
}

// ===========================
// Table Rendering
// ===========================

function renderTable() {
  const tableBody = document.getElementById("table-body");
  const { filteredContributors, currentPage, perPage } = state;
  
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const pageContributors = filteredContributors.slice(startIndex, endIndex);
  
  tableBody.innerHTML = "";
  
  if (pageContributors.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          No contributors found matching your search.
        </td>
      </tr>
    `;
    return;
  }
  
  pageContributors.forEach((contributor) => {
    const row = document.createElement("tr");
    
    // Highlight boussaid001
    if (contributor.username.toLowerCase() === 'boussaid001') {
      row.style.background = 'rgba(59, 130, 246, 0.1)';
      row.style.borderLeft = '3px solid var(--accent-primary)';
    }
    
    row.innerHTML = `
      <td class="rank-col">
        <span class="rank-number">#${contributor.rank}</span>
      </td>
      <td class="user-col">
        <div class="user-info">
          <img src="${contributor.avatar}" alt="${contributor.name}" class="user-avatar" loading="lazy" onerror="this.src='https://github.com/${contributor.username}.png'" />
          <div class="user-details">
            <div class="user-name">${contributor.name}</div>
            <div class="user-username">@${contributor.username}</div>
          </div>
        </div>
      </td>
      <td class="commits-col">
        <span class="commits-count">${contributor.commits.toLocaleString()}</span>
      </td>
      <td class="profile-col">
        <a href="https://github.com/${contributor.username}" target="_blank" rel="noopener" class="btn-profile">
          View
        </a>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  updatePagination();
}

// ===========================
// Pagination
// ===========================

function updatePagination() {
  const { filteredContributors, currentPage, perPage } = state;
  const totalPages = Math.ceil(filteredContributors.length / perPage);
  
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  
  pageInfo.textContent = totalPages === 0 
    ? "No results" 
    : `Page ${currentPage} of ${totalPages}`;
}

function goToPage(page) {
  const totalPages = Math.ceil(state.filteredContributors.length / state.perPage);
  if (page < 1 || page > totalPages) return;
  
  state.currentPage = page;
  renderTable();
  
  document.getElementById("leaderboard").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===========================
// Search & Filter
// ===========================

function filterContributors() {
  const query = state.searchQuery.toLowerCase().trim();
  
  if (query === "") {
    state.filteredContributors = [...state.allContributors];
  } else {
    state.filteredContributors = state.allContributors.filter((contributor) => {
      return (
        contributor.name.toLowerCase().includes(query) ||
        contributor.username.toLowerCase().includes(query)
      );
    });
  }
  
  state.currentPage = 1;
  renderTable();
}

function sortContributors() {
  if (state.sortDirection === "desc") {
    state.filteredContributors.sort((a, b) => b.commits - a.commits);
  } else {
    state.filteredContributors.sort((a, b) => a.commits - b.commits);
  }
  
  renderTable();
}

// ===========================
// Stats Update (Removed)
// ===========================

// ===========================
// Event Listeners
// ===========================

function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    filterContributors();
  });
  
  const perPageSelect = document.getElementById("per-page-select");
  perPageSelect.addEventListener("change", (e) => {
    state.perPage = parseInt(e.target.value);
    state.currentPage = 1;
    renderTable();
  });
  
  document.getElementById("prev-page").addEventListener("click", () => {
    goToPage(state.currentPage - 1);
  });
  
  document.getElementById("next-page").addEventListener("click", () => {
    goToPage(state.currentPage + 1);
  });
  
  const sortableHeader = document.querySelector(".sortable");
  sortableHeader.addEventListener("click", () => {
    state.sortDirection = state.sortDirection === "desc" ? "asc" : "desc";
    sortContributors();
    
    const icon = sortableHeader.querySelector(".sort-icon");
    icon.textContent = state.sortDirection === "desc" ? "↓" : "↑";
  });
}

// ===========================
// Initialize Application
// ===========================

async function init() {
  console.log("🚀 Initializing Tunisian Committers...");
  
  setupEventListeners();
  
  const contributors = await fetchContributorsData();
  
  if (contributors.length === 0) {
    console.error("❌ Failed to load contributors data");
    document.getElementById("podium-loading").innerHTML = `
      <p style="color: var(--text-muted);">Failed to load data. Please refresh the page.</p>
    `;
    document.getElementById("table-loading").innerHTML = `
      <p style="color: var(--text-muted);">Failed to load data. Please refresh the page.</p>
    `;
    return;
  }
  
  console.log(`✅ Loaded ${contributors.length} contributors`);
  
  state.allContributors = contributors;
  state.filteredContributors = [...contributors];
  
  renderPodium(contributors);
  
  document.getElementById("table-loading").style.display = "none";
  document.getElementById("table-container").style.display = "block";
  renderTable();
  
  console.log("✨ Application ready!");
  
  const boussaid = contributors.find(c => c.username.toLowerCase() === 'boussaid001');
  if (boussaid) {
    console.log(`🎉 boussaid001 is ranked #${boussaid.rank} with ${boussaid.commits} commits!`);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
