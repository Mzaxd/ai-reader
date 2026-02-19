(function () {
  function navTarget(link) {
    var href = link.getAttribute("href") || "";
    var file = href.split("/").pop() || "";
    return file.split("?")[0].split("#")[0];
  }

  var links = document.querySelectorAll("[data-nav-link]");
  var path = window.location.pathname.split("/").pop() || "index.html";
  links.forEach(function (link) {
    var target = navTarget(link);
    if (target === path) {
      link.classList.add("active");
    }
  });

  var navIconPaths = {
    "index.html": "M2.5 7.2 8 2.5l5.5 4.7V13.5H9.5v-3h-3v3H2.5z",
    "library.html": "M2.5 3h3.5v10h-3.5zM6.7 3h3.3v10H6.7zM10.7 3h2.8v10h-2.8z",
    "reader.html": "M2.5 3h4.8a2 2 0 0 1 2 2v8H4.4a1.9 1.9 0 0 0-1.9 1.9V3zM13.5 3H8.7a2 2 0 0 0-2 2v8h4.9a1.9 1.9 0 0 1 1.9 1.9V3z",
    "characters.html": "M8 3.2a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 0 1 0-3.2zM3.2 10.8a1.6 1.6 0 1 1 0-3.2a1.6 1.6 0 0 1 0 3.2zM12.8 10.8a1.6 1.6 0 1 1 0-3.2a1.6 1.6 0 0 1 0 3.2zM4.6 8l2.1-1.3M9.3 6.7L11.4 8M4.6 8h6.8",
    "timeline.html": "M2.8 4.2h1.9v7.6H2.8zM6.1 7.1h2.2v4.7H6.1zM9.7 5.4h2.2v6.4H9.7zM2.2 12.5h11.6",
    "events.html": "M3 3h10v10H3zM5.2 5.2h5.6M5.2 7.9h5.6M5.2 10.6h3.8",
    "chat.html": "M2.5 3.5h11v7h-6.8l-2.7 2.2v-2.2H2.5zM5 6.2h6M5 8.2h4",
    "settings.html": "M3 8h10M5.3 8a1.3 1.3 0 1 1-2.6 0a1.3 1.3 0 0 1 2.6 0zM13.3 8a1.3 1.3 0 1 1-2.6 0a1.3 1.3 0 0 1 2.6 0zM8 3v10",
  };

  function createNavIcon(pathData) {
    var icon = document.createElement("span");
    icon.className = "nav-icon";
    icon.setAttribute("aria-hidden", "true");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 16 16");

    var pathNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathNode.setAttribute("d", pathData || "M3 3h10v10H3z");
    svg.appendChild(pathNode);

    icon.appendChild(svg);
    return icon;
  }

  links.forEach(function (link) {
    var label = (link.textContent || "").trim();
    if (!label || link.querySelector(".nav-text")) return;

    var target = navTarget(link);
    var icon = createNavIcon(navIconPaths[target]);
    var text = document.createElement("span");
    text.className = "nav-text";
    text.textContent = label;

    link.setAttribute("aria-label", label);
    link.textContent = "";
    link.appendChild(icon);
    link.appendChild(text);
  });

  var nav = document.querySelector(".nav");
  if (nav) {
    var groups = [
      { title: "全局总览", targets: ["index.html"] },
      {
        title: "核心阅读流",
        targets: [
          "library.html",
          "reader.html",
          "characters.html",
          "timeline.html",
          "events.html",
          "chat.html",
        ],
      },
      { title: "系统状态", targets: ["settings.html"] },
    ];

    groups.forEach(function (group) {
      var firstLink = null;
      links.forEach(function (link) {
        if (firstLink) return;
        if (group.targets.indexOf(navTarget(link)) !== -1) {
          firstLink = link;
        }
      });
      if (firstLink) {
        var titleNode = document.createElement("div");
        titleNode.className = "nav-group-title";
        titleNode.textContent = group.title;
        nav.insertBefore(titleNode, firstLink);
      }
    });
  }

  var layout = document.querySelector(".layout");
  var sidebar = document.querySelector(".sidebar");
  if (layout && sidebar) {
    var mainArea = layout.querySelector(".main");
    if (mainArea) {
      var navSplitter = layout.querySelector("[data-nav-splitter]");
      if (!navSplitter) {
        navSplitter = document.createElement("div");
        navSplitter.className = "nav-splitter";
        navSplitter.setAttribute("data-nav-splitter", "");
        navSplitter.setAttribute("role", "separator");
        navSplitter.setAttribute("aria-orientation", "vertical");
        navSplitter.setAttribute("aria-label", "调整导航宽度");
        layout.insertBefore(navSplitter, mainArea);
      }

      layout.classList.add("layout-resizable-nav");

      var navWidthKey = "ai_reader_nav_width_v1";
      var navDefault = document.body.classList.contains("page-reader") ? 208 : 248;
      var navMin = 84;
      var navMax = 340;
      var navWidth = navDefault;
      var navDragging = false;
      var navStartX = 0;
      var navStartWidth = 0;

      function navMaxAllowedWidth() {
        var total = layout.getBoundingClientRect().width || 0;
        var byRatio = Math.floor(total * 0.45);
        return Math.max(navMin, Math.min(navMax, byRatio || navMax));
      }

      function clampNavWidth(value) {
        var numeric = Number(value);
        if (!isFinite(numeric)) numeric = navWidth;
        var upper = navMaxAllowedWidth();
        return Math.max(navMin, Math.min(upper, Math.round(numeric)));
      }

      function applyNavWidth(value) {
        navWidth = clampNavWidth(value);
        document.body.style.setProperty("--nav-width", navWidth + "px");
        var compact = window.innerWidth > 980 && navWidth <= 120;
        document.body.classList.toggle("nav-icon-only", compact);
      }

      try {
        var savedNavWidth = localStorage.getItem(navWidthKey);
        if (savedNavWidth) {
          var parsedNav = parseInt(savedNavWidth, 10);
          if (!isNaN(parsedNav)) navWidth = parsedNav;
        }
      } catch (e) {
        // ignore storage failures
      }
      applyNavWidth(navWidth);

      function saveNavWidth() {
        try {
          localStorage.setItem(navWidthKey, String(navWidth));
        } catch (e) {
          // ignore storage failures
        }
      }

      function stopNavDrag() {
        if (!navDragging) return;
        navDragging = false;
        document.body.classList.remove("is-resizing-split");
        window.removeEventListener("pointermove", onNavPointerMove);
        window.removeEventListener("pointerup", onNavPointerUp);
        window.removeEventListener("pointercancel", onNavPointerUp);
        saveNavWidth();
      }

      function onNavPointerMove(event) {
        if (!navDragging) return;
        var delta = event.clientX - navStartX;
        applyNavWidth(navStartWidth + delta);
      }

      function onNavPointerUp() {
        stopNavDrag();
      }

      navSplitter.addEventListener("pointerdown", function (event) {
        if (
          document.body.classList.contains("workbench-nav-collapsed") ||
          document.body.classList.contains("reader-nav-collapsed") ||
          document.body.classList.contains("workbench-focus") ||
          document.body.classList.contains("reader-focus-mode")
        ) {
          return;
        }
        if (window.getComputedStyle(sidebar).display === "none") {
          return;
        }
        navDragging = true;
        navStartX = event.clientX;
        navStartWidth = sidebar.getBoundingClientRect().width || navWidth;
        document.body.classList.add("is-resizing-split");
        window.addEventListener("pointermove", onNavPointerMove);
        window.addEventListener("pointerup", onNavPointerUp);
        window.addEventListener("pointercancel", onNavPointerUp);
        event.preventDefault();
      });

      navSplitter.addEventListener("dblclick", function () {
        applyNavWidth(navDefault);
        saveNavWidth();
      });

      window.addEventListener("resize", function () {
        applyNavWidth(navWidth);
      });
    }
  }

  var tag = document.querySelector("[data-network]");
  if (tag) {
    tag.remove();
  }

  var themeKey = "ai_reader_theme";
  var themes = [
    { value: "warm-paper", label: "暖纸主题" },
    { value: "ink-slate", label: "冷墨主题" },
    { value: "night-contrast", label: "夜读高对比" },
  ];

  function applyTheme(theme) {
    var valid = themes.some(function (item) {
      return item.value === theme;
    });
    var finalTheme = valid ? theme : "warm-paper";
    document.body.setAttribute("data-theme", finalTheme);
    try {
      localStorage.setItem(themeKey, finalTheme);
    } catch (e) {
      // ignore storage failures
    }
    return finalTheme;
  }

  applyTheme("warm-paper");

  var topbar = document.querySelector(".topbar");
  function ensureTopbarRightSlot() {
    if (!topbar) return null;
    var slot = topbar.querySelector("[data-topbar-right-controls]");
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "topbar-right-controls";
      slot.setAttribute("data-topbar-right-controls", "");
      topbar.appendChild(slot);
    }
    return slot;
  }

  if (document.body.classList.contains("page-library")) {
    var importModal = document.querySelector("[data-import-modal]");
    if (importModal) {
      var openImportButtons = document.querySelectorAll("[data-open-import]");
      var closeImportButtons = document.querySelectorAll("[data-close-import]");
      var submitImportButton = document.querySelector("[data-submit-import]");

      function openImportModal() {
        importModal.hidden = false;
        document.body.classList.add("modal-open");
      }

      function closeImportModal() {
        importModal.hidden = true;
        document.body.classList.remove("modal-open");
      }

      openImportButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          openImportModal();
        });
      });

      closeImportButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          closeImportModal();
        });
      });

      importModal.addEventListener("click", function (event) {
        if (event.target === importModal) {
          closeImportModal();
        }
      });

      if (submitImportButton) {
        submitImportButton.addEventListener("click", function () {
          submitImportButton.textContent = "导入处理中...";
          submitImportButton.setAttribute("aria-busy", "true");
          setTimeout(function () {
            submitImportButton.textContent = "开始导入";
            submitImportButton.removeAttribute("aria-busy");
            closeImportModal();
          }, 800);
        });
      }

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !importModal.hidden) {
          closeImportModal();
        }
      });

      var openByQuery = false;
      try {
        openByQuery = new URLSearchParams(window.location.search).get("import") === "1";
      } catch (e) {
        openByQuery = false;
      }
      if (openByQuery) {
        openImportModal();
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, "", "library.html");
        }
      }
    }
  }

  if (document.body.classList.contains("page-split-workbench")) {
    var workbenchKey = "ai_reader_workbench_v2";
    var workbenchDefault = {
      navCollapsed: false,
      rightCollapsed: true,
      focusMode: false,
    };

    function loadWorkbenchState() {
      try {
        var raw = localStorage.getItem(workbenchKey);
        if (!raw) {
          return {
            navCollapsed: false,
            rightCollapsed: document.body.classList.contains("page-chat") ? false : true,
            focusMode: false,
          };
        }
        var parsed = JSON.parse(raw);
        return {
          navCollapsed: !!parsed.navCollapsed,
          rightCollapsed: !!parsed.rightCollapsed,
          focusMode: !!parsed.focusMode,
        };
      } catch (e) {
        return workbenchDefault;
      }
    }

    function saveWorkbenchState(state) {
      try {
        localStorage.setItem(workbenchKey, JSON.stringify(state));
      } catch (e) {
        // ignore storage failures
      }
    }

    var workbenchState = loadWorkbenchState();
    var workbenchButtons = document.querySelectorAll("[data-workbench-toggle]");
    var workbenchBody = document.body;

    if (topbar && workbenchButtons.length === 0) {
      var workbenchControls = ensureTopbarRightSlot();
      if (workbenchControls) {
        workbenchControls.innerHTML = "";
      }

      function createWorkbenchButton(mode, label) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "workbench-icon-btn";
        button.setAttribute("data-workbench-toggle", mode);
        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
        button.setAttribute("aria-pressed", "false");
        button.innerHTML = '<span class="wb-icon wb-icon-' + mode + '" aria-hidden="true"></span>';
        return button;
      }

      if (workbenchControls) {
        workbenchControls.appendChild(createWorkbenchButton("right", "切换右侧面板"));
      }

      workbenchButtons = document.querySelectorAll("[data-workbench-toggle]");
    }

    function applyWorkbenchState() {
      workbenchBody.classList.toggle("workbench-nav-collapsed", workbenchState.navCollapsed);
      workbenchBody.classList.toggle("workbench-right-collapsed", workbenchState.rightCollapsed);
      workbenchBody.classList.toggle("workbench-focus", workbenchState.focusMode);

      workbenchButtons.forEach(function (button) {
        var mode = button.getAttribute("data-workbench-toggle");
        var active = false;
        if (mode === "nav") active = !workbenchState.navCollapsed;
        if (mode === "right") active = !workbenchState.rightCollapsed;
        if (mode === "focus") active = workbenchState.focusMode;

        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    workbenchButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var mode = button.getAttribute("data-workbench-toggle");
        if (mode === "nav") workbenchState.navCollapsed = !workbenchState.navCollapsed;
        if (mode === "right") workbenchState.rightCollapsed = !workbenchState.rightCollapsed;
        if (mode === "focus") workbenchState.focusMode = !workbenchState.focusMode;
        saveWorkbenchState(workbenchState);
        applyWorkbenchState();
      });
    });

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "\\") {
        workbenchState.rightCollapsed = !workbenchState.rightCollapsed;
      } else if (event.key === "f" || event.key === "F") {
        workbenchState.focusMode = !workbenchState.focusMode;
      } else if (event.key === "Escape" && workbenchState.focusMode) {
        workbenchState.focusMode = false;
      } else {
        return;
      }

      saveWorkbenchState(workbenchState);
      applyWorkbenchState();
    });

    applyWorkbenchState();
  }

  if (document.body.classList.contains("page-split-workbench")) {
    var panelGroups = document.querySelectorAll("[data-resizable-panel]");
    panelGroups.forEach(function (panel) {
      var splitter = panel.querySelector(":scope > [data-panel-splitter]");
      var aside = panel.querySelector(":scope > aside");
      if (!splitter || !aside) return;

      var resizeKeyName = panel.getAttribute("data-resize-key") || "panel";
      var resizeKey = "ai_reader_panel_width_" + resizeKeyName + "_v1";
      var defaultWidth = parseInt(panel.getAttribute("data-resize-default") || "320", 10);
      var minWidth = parseInt(panel.getAttribute("data-resize-min") || "240", 10);
      var maxWidthAttr = parseInt(panel.getAttribute("data-resize-max") || "560", 10);
      var currentWidth = isNaN(defaultWidth) ? 320 : defaultWidth;
      var dragging = false;
      var dragStartX = 0;
      var dragStartWidth = 0;

      function maxAllowedWidth() {
        var total = panel.getBoundingClientRect().width || 0;
        var byRatio = Math.floor(total * 0.58);
        var maxWidth = isNaN(maxWidthAttr) ? byRatio : Math.min(maxWidthAttr, byRatio || maxWidthAttr);
        return Math.max(minWidth, maxWidth);
      }

      function clampWidth(value) {
        var numeric = Number(value);
        if (!isFinite(numeric)) numeric = currentWidth;
        var upper = maxAllowedWidth();
        return Math.max(minWidth, Math.min(upper, Math.round(numeric)));
      }

      function applyPanelWidth(value) {
        currentWidth = clampWidth(value);
        panel.style.setProperty("--panel-side-width", currentWidth + "px");
      }

      try {
        var rawSaved = localStorage.getItem(resizeKey);
        if (rawSaved) {
          var parsed = parseInt(rawSaved, 10);
          if (!isNaN(parsed)) currentWidth = parsed;
        }
      } catch (e) {
        // ignore storage failures
      }
      applyPanelWidth(currentWidth);

      function savePanelWidth() {
        try {
          localStorage.setItem(resizeKey, String(currentWidth));
        } catch (e) {
          // ignore storage failures
        }
      }

      function stopDragging() {
        if (!dragging) return;
        dragging = false;
        document.body.classList.remove("is-resizing-split");
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        savePanelWidth();
      }

      function onPointerMove(event) {
        if (!dragging) return;
        var delta = dragStartX - event.clientX;
        applyPanelWidth(dragStartWidth + delta);
      }

      function onPointerUp() {
        stopDragging();
      }

      splitter.addEventListener("pointerdown", function (event) {
        if (
          document.body.classList.contains("workbench-right-collapsed") ||
          document.body.classList.contains("workbench-focus")
        ) {
          return;
        }
        dragging = true;
        dragStartX = event.clientX;
        dragStartWidth = aside.getBoundingClientRect().width || currentWidth;
        document.body.classList.add("is-resizing-split");
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
        event.preventDefault();
      });

      window.addEventListener("resize", function () {
        applyPanelWidth(currentWidth);
      });
    });
  }

  if (document.body.classList.contains("page-reader")) {
    var readerKey = "ai_reader_reader_layout_v2";
    var defaultState = {
      navCollapsed: true,
      leftCollapsed: true,
      rightCollapsed: true,
      focusMode: false,
      chatCollapsed: true,
    };

    function loadReaderState() {
      try {
        var raw = localStorage.getItem(readerKey);
        if (!raw) return defaultState;
        var parsed = JSON.parse(raw);
        return {
          navCollapsed: !!parsed.navCollapsed,
          leftCollapsed: !!parsed.leftCollapsed,
          rightCollapsed: !!parsed.rightCollapsed,
          focusMode: !!parsed.focusMode,
          chatCollapsed: !!parsed.chatCollapsed,
        };
      } catch (e) {
        return defaultState;
      }
    }

    function saveReaderState(nextState) {
      try {
        localStorage.setItem(readerKey, JSON.stringify(nextState));
      } catch (e) {
        // ignore storage failures
      }
    }

    var readerState = loadReaderState();
    var readerButtons = document.querySelectorAll("[data-reader-toggle]");
    var readerBody = document.body;

    if (topbar && !topbar.querySelector("[data-reader-top-controls]")) {
      var readerTopControls = ensureTopbarRightSlot();
      if (readerTopControls) {
        readerTopControls.innerHTML = "";
        readerTopControls.classList.add("reader-top-controls");
        readerTopControls.setAttribute("data-reader-top-controls", "");

        var readerRightButton = document.createElement("button");
        readerRightButton.type = "button";
        readerRightButton.className = "workbench-icon-btn reader-top-btn";
        readerRightButton.setAttribute("data-reader-toggle", "right");
        readerRightButton.setAttribute("data-label-on", "隐藏洞察");
        readerRightButton.setAttribute("data-label-off", "显示洞察");
        readerRightButton.setAttribute("aria-label", "显示洞察");
        readerRightButton.setAttribute("title", "显示洞察");
        readerRightButton.setAttribute("aria-pressed", "false");
        readerRightButton.innerHTML = '<span class="wb-icon wb-icon-right" aria-hidden="true"></span>';
        readerTopControls.appendChild(readerRightButton);
      }
    }
    readerButtons = document.querySelectorAll("[data-reader-toggle]");

    function applyReaderState() {
      readerBody.classList.toggle("reader-nav-collapsed", readerState.navCollapsed);
      readerBody.classList.toggle("reader-left-collapsed", readerState.leftCollapsed);
      readerBody.classList.toggle("reader-right-collapsed", readerState.rightCollapsed);
      readerBody.classList.toggle("reader-focus-mode", readerState.focusMode);
      readerBody.classList.toggle("reader-chat-collapsed", readerState.chatCollapsed);

      readerButtons.forEach(function (button) {
        var mode = button.getAttribute("data-reader-toggle");
        var active = false;
        if (mode === "nav") active = !readerState.navCollapsed;
        if (mode === "left") active = !readerState.leftCollapsed;
        if (mode === "right") active = !readerState.rightCollapsed;
        if (mode === "focus") active = readerState.focusMode;
        if (mode === "chat") active = !readerState.chatCollapsed;

        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
        var labelOn = button.getAttribute("data-label-on");
        var labelOff = button.getAttribute("data-label-off");
        if (labelOn || labelOff) {
          var label = active ? labelOn || labelOff || "" : labelOff || labelOn || "";
          button.setAttribute("aria-label", label);
          button.setAttribute("title", label);
        }
      });
    }

    var readerLayout = document.querySelector(".reader-pro");
    var readerInsightRail = document.querySelector(".reader-pro .insight-rail");
    var readerSplitter = document.querySelector("[data-reader-splitter]");
    if (readerLayout && readerInsightRail && readerSplitter) {
      var readerRightWidthKey = "ai_reader_reader_right_width_v1";
      var readerRightDefault = 332;
      var readerRightMin = 260;
      var readerRightMax = 560;
      var readerRightWidth = readerRightDefault;
      var readerDragging = false;
      var readerStartX = 0;
      var readerStartWidth = 0;

      function maxReaderRightWidth() {
        var total = readerLayout.getBoundingClientRect().width || 0;
        var byRatio = Math.floor(total * 0.5);
        return Math.max(readerRightMin, Math.min(readerRightMax, byRatio || readerRightMax));
      }

      function clampReaderRightWidth(value) {
        var numeric = Number(value);
        if (!isFinite(numeric)) numeric = readerRightWidth;
        var upper = maxReaderRightWidth();
        return Math.max(readerRightMin, Math.min(upper, Math.round(numeric)));
      }

      function applyReaderRightWidth(value) {
        readerRightWidth = clampReaderRightWidth(value);
        readerLayout.style.setProperty("--reader-link-width", readerRightWidth + "px");
      }

      function saveReaderRightWidth() {
        try {
          localStorage.setItem(readerRightWidthKey, String(readerRightWidth));
        } catch (e) {
          // ignore storage failures
        }
      }

      try {
        var rawReaderWidth = localStorage.getItem(readerRightWidthKey);
        if (rawReaderWidth) {
          var parsedReaderWidth = parseInt(rawReaderWidth, 10);
          if (!isNaN(parsedReaderWidth)) readerRightWidth = parsedReaderWidth;
        }
      } catch (e) {
        // ignore storage failures
      }
      applyReaderRightWidth(readerRightWidth);

      function stopReaderDrag() {
        if (!readerDragging) return;
        readerDragging = false;
        document.body.classList.remove("is-resizing-split");
        window.removeEventListener("pointermove", onReaderPointerMove);
        window.removeEventListener("pointerup", onReaderPointerUp);
        window.removeEventListener("pointercancel", onReaderPointerUp);
        saveReaderRightWidth();
      }

      function onReaderPointerMove(event) {
        if (!readerDragging) return;
        var delta = readerStartX - event.clientX;
        applyReaderRightWidth(readerStartWidth + delta);
      }

      function onReaderPointerUp() {
        stopReaderDrag();
      }

      readerSplitter.addEventListener("pointerdown", function (event) {
        if (
          document.body.classList.contains("reader-right-collapsed") ||
          document.body.classList.contains("reader-focus-mode")
        ) {
          return;
        }
        readerDragging = true;
        readerStartX = event.clientX;
        readerStartWidth = readerInsightRail.getBoundingClientRect().width || readerRightWidth;
        document.body.classList.add("is-resizing-split");
        window.addEventListener("pointermove", onReaderPointerMove);
        window.addEventListener("pointerup", onReaderPointerUp);
        window.addEventListener("pointercancel", onReaderPointerUp);
        event.preventDefault();
      });

      readerSplitter.addEventListener("dblclick", function () {
        applyReaderRightWidth(readerRightDefault);
        saveReaderRightWidth();
      });

      window.addEventListener("resize", function () {
        applyReaderRightWidth(readerRightWidth);
      });
    }

    var linkPanel = document.querySelector("[data-link-panel]");
    if (linkPanel) {
      var linkPanelBody = linkPanel.querySelector("[data-link-panel-body]");
      var linkTabButtons = linkPanel.querySelectorAll("[data-link-tab]");
      var linkTokens = document.querySelectorAll(".reader-article [data-link]");
      var spanNodes = document.querySelectorAll(".reader-article [data-span-id]");
      var readerArticle = document.querySelector(".reader-article");
      var linkState = {
        activeTab: "summary",
        activeSpanId: "s17-01",
        activeEntityId: "",
      };

      var spanSummaries = {
        "s17-01": {
          title: "事件触发",
          text: "叶文洁做出关键决断，事件链从“隐性风险”进入“显性触发”。",
          event: "E-17-03 红岸响应",
        },
        "s17-02": {
          title: "人物对照",
          text: "史强的现实主义立场与叶文洁的激进决策形成正面对比。",
          event: "人物冲突窗口",
        },
        "s17-03": {
          title: "叙事信号",
          text: "该标注段是价值冲突高点，建议纳入事件链复核。",
          event: "冲突阈值抬升",
        },
        "s17-04": {
          title: "认知转折",
          text: "汪淼由调查“组织”转向理解“机制”，阅读视角切换完成。",
          event: "认知链路转向",
        },
        "s17-05": {
          title: "后果扩散",
          text: "红岸事件影响从个体扩展到文明层级，风险范围扩大。",
          event: "后果扩散段",
        },
        "s17-06": {
          title: "时间推进",
          text: "出现“翌日”锚点，时间线进入作战会议阶段。",
          event: "T+1 时间锚",
        },
      };

      var entityData = {
        actors: {
          actor_ye: {
            title: "叶文洁",
            info: "动机强度 0.91，上升区间；当前为事件 E-17-03 的核心触发者。",
            spanId: "s17-01",
            link: "characters.html",
          },
          actor_shi: {
            title: "史强",
            info: "冲突缓冲角色；在该段提供现实主义对照语义。",
            spanId: "s17-02",
            link: "characters.html",
          },
          actor_wang: {
            title: "汪淼",
            info: "当前章节中承担“认知转折”视角，建议结合事件链复核。",
            spanId: "s17-04",
            link: "characters.html",
          },
        },
        time: {
          time_t_plus_1: {
            title: "翌日",
            info: "推断为上一绝对锚点后 +1 天，置信度 84%。",
            spanId: "s17-06",
            link: "timeline.html",
          },
        },
        event: {
          event_red_coast: {
            title: "红岸基地首次响应",
            info: "原因：外部信号确认；结果：事件链进入公开对抗阶段。",
            spanId: "s17-01",
            link: "events.html",
          },
          event_deliver_earth: {
            title: "递交地球决断",
            info: "原因：文明幻灭判断；结果：主线风险等级提升。",
            spanId: "s17-01",
            link: "events.html",
          },
        },
      };

      function openReaderRightPanel() {
        if (readerState.rightCollapsed) {
          readerState.rightCollapsed = false;
          saveReaderState(readerState);
          applyReaderState();
        }
      }

      function setActiveLinkTab(tab) {
        linkState.activeTab = tab;
        linkTabButtons.forEach(function (button) {
          var active = button.getAttribute("data-link-tab") === tab;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", active ? "true" : "false");
        });
      }

      function clearEvidenceHighlight() {
        spanNodes.forEach(function (node) {
          node.classList.remove("is-evidence-active");
        });
      }

      function highlightSpan(spanId) {
        clearEvidenceHighlight();
        if (!spanId) return;
        var target = document.querySelector('.reader-article [data-span-id="' + spanId + '"]');
        if (target) target.classList.add("is-evidence-active");
      }

      function renderSummary(spanId) {
        var summary = spanSummaries[spanId] || spanSummaries["s17-01"];
        linkPanelBody.innerHTML =
          '<div class="insight-card">' +
          "<strong>本段摘要 · " +
          summary.title +
          "</strong>" +
          "<p>" +
          summary.text +
          "</p>" +
          '<p class="setting-hint">关联信号：' +
          summary.event +
          "</p>" +
          '<div class="btn-row" style="margin-top:8px">' +
          '<button class="btn btn-flat" type="button" data-jump-span="' +
          (spanId || "s17-01") +
          '">回跳证据</button>' +
          "</div>" +
          "</div>";
      }

      function renderEntity(tab, id) {
        var source = entityData[tab] || {};
        var detail = source[id];
        if (!detail) {
          renderSummary(linkState.activeSpanId);
          return;
        }
        linkPanelBody.innerHTML =
          '<div class="insight-card">' +
          "<strong>" +
          detail.title +
          "</strong>" +
          "<p>" +
          detail.info +
          "</p>" +
          '<div class="btn-row" style="margin-top:8px">' +
          '<button class="btn btn-flat" type="button" data-jump-span="' +
          detail.spanId +
          '">回跳证据</button>' +
          '<a class="btn btn-ghost" href="' +
          detail.link +
          '">查看全局</a>' +
          "</div>" +
          "</div>";
        linkState.activeSpanId = detail.spanId;
        highlightSpan(detail.spanId);
      }

      function mapTokenTypeToTab(type) {
        if (type === "actor") return "actors";
        if (type === "time") return "time";
        return "event";
      }

      function detectVisibleSpan() {
        if (!readerArticle || spanNodes.length === 0) return;
        var center = window.innerHeight * 0.42;
        var best = null;
        var bestDiff = Infinity;
        spanNodes.forEach(function (node) {
          var rect = node.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          var diff = Math.abs(rect.top - center);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = node;
          }
        });
        if (!best) return;
        var spanId = best.getAttribute("data-span-id");
        if (!spanId || spanId === linkState.activeSpanId) return;
        linkState.activeSpanId = spanId;
        if (linkState.activeTab === "summary" && !linkState.activeEntityId) {
          renderSummary(spanId);
          highlightSpan(spanId);
        }
      }

      linkTabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var tab = button.getAttribute("data-link-tab") || "summary";
          setActiveLinkTab(tab);
          if (tab === "summary") {
            linkState.activeEntityId = "";
            renderSummary(linkState.activeSpanId);
            highlightSpan(linkState.activeSpanId);
          } else if (linkState.activeEntityId) {
            renderEntity(tab, linkState.activeEntityId);
          } else {
            renderSummary(linkState.activeSpanId);
            highlightSpan(linkState.activeSpanId);
          }
        });
      });

      linkTokens.forEach(function (token) {
        token.addEventListener("click", function () {
          var kind = token.getAttribute("data-link");
          var id = token.getAttribute("data-id") || "";
          var tab = mapTokenTypeToTab(kind);
          var spanContainer = token.closest("[data-span-id]");
          if (spanContainer) {
            linkState.activeSpanId = spanContainer.getAttribute("data-span-id") || linkState.activeSpanId;
          }
          linkState.activeEntityId = id;
          setActiveLinkTab(tab);
          renderEntity(tab, id);
          openReaderRightPanel();
        });
      });

      linkPanelBody.addEventListener("click", function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) return;
        var jumpSpanId = target.getAttribute("data-jump-span");
        if (!jumpSpanId) return;
        var spanTarget = document.querySelector('.reader-article [data-span-id="' + jumpSpanId + '"]');
        if (!spanTarget) return;
        spanTarget.scrollIntoView({ behavior: "smooth", block: "center" });
        linkState.activeSpanId = jumpSpanId;
        highlightSpan(jumpSpanId);
      });

      var scrollTicking = false;
      document.addEventListener("scroll", function () {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(function () {
          detectVisibleSpan();
          scrollTicking = false;
        });
      }, { passive: true });

      setActiveLinkTab("summary");
      renderSummary(linkState.activeSpanId);
      highlightSpan(linkState.activeSpanId);
    }

    readerButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var mode = button.getAttribute("data-reader-toggle");
        if (mode === "nav") readerState.navCollapsed = !readerState.navCollapsed;
        if (mode === "left") readerState.leftCollapsed = !readerState.leftCollapsed;
        if (mode === "right") readerState.rightCollapsed = !readerState.rightCollapsed;
        if (mode === "focus") readerState.focusMode = !readerState.focusMode;
        if (mode === "chat") readerState.chatCollapsed = !readerState.chatCollapsed;
        saveReaderState(readerState);
        applyReaderState();
      });
    });

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "f" || event.key === "F") {
        readerState.focusMode = !readerState.focusMode;
      } else if (event.key === "[") {
        readerState.leftCollapsed = !readerState.leftCollapsed;
      } else if (event.key === "]") {
        readerState.rightCollapsed = !readerState.rightCollapsed;
      } else if (event.key === "Escape" && readerState.focusMode) {
        readerState.focusMode = false;
      } else {
        return;
      }

      saveReaderState(readerState);
      applyReaderState();
    });

    applyReaderState();
  }

  if (
    topbar &&
    !document.body.classList.contains("page-split-workbench") &&
    !document.body.classList.contains("page-reader")
  ) {
    var passiveTopbarControls = ensureTopbarRightSlot();
    if (passiveTopbarControls && passiveTopbarControls.children.length === 0) {
      var passiveRightButton = document.createElement("button");
      passiveRightButton.type = "button";
      passiveRightButton.className = "workbench-icon-btn topbar-right-btn is-disabled";
      passiveRightButton.setAttribute("aria-label", "当前页面无右侧面板");
      passiveRightButton.setAttribute("title", "当前页面无右侧面板");
      passiveRightButton.setAttribute("disabled", "disabled");
      passiveRightButton.innerHTML = '<span class="wb-icon wb-icon-right" aria-hidden="true"></span>';
      passiveTopbarControls.appendChild(passiveRightButton);
    }
  }

  if (document.body.classList.contains("page-chat")) {
    var chatResizeKey = "ai_reader_chat_sidebar_width_v1";
    var chatLayout = document.querySelector(".chat-pro");
    var chatAside = document.querySelector(".evidence-panel");
    var chatSplitter = document.querySelector("[data-chat-splitter]");

    if (chatLayout && chatAside && chatSplitter) {
      var minWidth = 260;
      var maxWidth = 520;
      var currentWidth = 332;
      var dragging = false;
      var dragStartX = 0;
      var dragStartWidth = 0;

      function maxAllowedWidth() {
        var total = chatLayout.getBoundingClientRect().width || 0;
        var byRatio = Math.floor(total * 0.52);
        return Math.max(minWidth, Math.min(maxWidth, byRatio || maxWidth));
      }

      function clampWidth(value) {
        var numeric = Number(value);
        if (!isFinite(numeric)) numeric = currentWidth;
        var upper = maxAllowedWidth();
        return Math.max(minWidth, Math.min(upper, Math.round(numeric)));
      }

      function applyChatWidth(value) {
        currentWidth = clampWidth(value);
        chatLayout.style.setProperty("--chat-side-width", currentWidth + "px");
        return currentWidth;
      }

      try {
        var rawSaved = localStorage.getItem(chatResizeKey);
        if (rawSaved) {
          var parsed = parseInt(rawSaved, 10);
          if (!isNaN(parsed)) currentWidth = parsed;
        }
      } catch (e) {
        // ignore storage failures
      }
      applyChatWidth(currentWidth);

      function saveChatWidth() {
        try {
          localStorage.setItem(chatResizeKey, String(currentWidth));
        } catch (e) {
          // ignore storage failures
        }
      }

      function stopDragging() {
        if (!dragging) return;
        dragging = false;
        document.body.classList.remove("is-resizing-split");
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        saveChatWidth();
      }

      function onPointerMove(event) {
        if (!dragging) return;
        var delta = dragStartX - event.clientX;
        applyChatWidth(dragStartWidth + delta);
      }

      function onPointerUp() {
        stopDragging();
      }

      chatSplitter.addEventListener("pointerdown", function (event) {
        if (document.body.classList.contains("workbench-right-collapsed")) {
          return;
        }
        dragging = true;
        dragStartX = event.clientX;
        dragStartWidth = chatAside.getBoundingClientRect().width || currentWidth;
        document.body.classList.add("is-resizing-split");
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
        event.preventDefault();
      });

      window.addEventListener("resize", function () {
        applyChatWidth(currentWidth);
      });
    }
  }
})();
