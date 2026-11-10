/*
 * Monografie: shared behavior for Ferramenta engine homepages.
 * Engraved section rules, the segmented toggles and the comparison bar chart.
 * Engine pages call these with their own data; nothing here knows a member.
 */
window.Mono = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  /* Five engraved hairlines between sections, one of them in oxide. The seed
     varies the lengths so neighbouring rules never repeat. */
  const LENGTHS = [128, 96, 120, 82, 112, 104, 130, 88, 118, 100, 124, 92, 110, 86, 116];
  function engravings() {
    document.querySelectorAll("svg.engraving[data-seed]").forEach((svg) => {
      const seed = Number(svg.dataset.seed);
      svg.setAttribute("viewBox", "0 0 132 34");
      svg.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 5; i++) {
        const line = document.createElementNS(NS, "line");
        const length = LENGTHS[(seed * 7 + i * 4) % LENGTHS.length];
        line.setAttribute("x1", 2);
        line.setAttribute("x2", length);
        line.setAttribute("y1", 2 + i * 7);
        line.setAttribute("y2", 2 + i * 7);
        if (i === seed % 5) line.setAttribute("class", "o");
        svg.appendChild(line);
      }
    });
  }

  /* Segmented toggles: <div class="seg" data-key="…"><button data-value="…">. */
  function segmented(root, onChange) {
    root.querySelectorAll(".seg").forEach((group) => {
      group.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          group
            .querySelectorAll("button")
            .forEach((other) => other.setAttribute("aria-pressed", other === button));
          onChange(group.dataset.key, button.dataset.value);
        });
      });
    });
  }

  /* Horizontal comparison bars: the engine's own row in oxide, the others in
     steel, a hairline at 1×, a value at the end of every row, a tooltip on
     hover and focus, and one growth when the chart first comes into view.
     rows() returns [{ label, sub, value, own }]; describe(row, cut) the tip. */
  function barChart({ list, tip, ticks, scale, tickValues, rows, describe }) {
    tickValues.forEach((t) => {
      const span = document.createElement("span");
      span.style.left = (t / scale) * 100 + "%";
      span.textContent = t + "×";
      ticks.appendChild(span);
    });
    function render(animate) {
      list.textContent = "";
      rows().forEach((row, i) => {
        const cut = row.value > scale;
        const li = document.createElement("li");
        li.tabIndex = 0;
        const name = document.createElement("span");
        name.className = "name";
        name.textContent = row.label;
        const small = document.createElement("small");
        small.textContent = row.sub;
        name.appendChild(small);
        const track = document.createElement("span");
        track.className = "track";
        const ref = document.createElement("span");
        ref.className = "ref";
        ref.style.left = (1 / scale) * 100 + "%";
        const bar = document.createElement("span");
        bar.className = "bar" + (row.own ? " own" : "") + (cut ? " broken" : "");
        track.append(bar, ref);
        const val = document.createElement("span");
        val.className = "val" + (row.own ? " own" : "");
        val.textContent = row.value.toFixed(2) + "×";
        li.append(name, track, val);
        li.setAttribute("aria-label", li.textContent.replace(/\s+/g, " "));
        const show = () => {
          tip.innerHTML = describe(row, cut);
          const lr = li.getBoundingClientRect();
          const pr = list.getBoundingClientRect();
          // Below the row, after the name column, inside the chart at any width.
          const left = Math.max(0, Math.min(210, pr.width - tip.offsetWidth));
          tip.style.left = left + "px";
          tip.style.top = lr.bottom - pr.top - 2 + "px";
          tip.classList.add("show");
        };
        const hide = () => tip.classList.remove("show");
        li.addEventListener("mouseenter", show);
        li.addEventListener("mouseleave", hide);
        li.addEventListener("focus", show);
        li.addEventListener("blur", hide);
        list.appendChild(li);
        const set = () => (bar.style.width = (Math.min(row.value, scale) / scale) * 100 + "%");
        if (!animate || reduce) set();
        else setTimeout(set, 60 + i * 90);
      });
    }
    render(false);
    if (!reduce) {
      list.querySelectorAll(".bar").forEach((bar) => (bar.style.width = "0"));
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            render(true);
            io.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      io.observe(list);
    }
    return { redraw: () => render(true) };
  }

  /* The navigation folds into a menu on narrow screens. */
  function menu() {
    const nav = document.querySelector(".nav");
    const button = nav && nav.querySelector(".menu-button");
    if (!button) return;
    const set = (open) => {
      nav.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
    };
    button.addEventListener("click", () => set(!nav.classList.contains("open")));
    nav
      .querySelectorAll(".nav-menu a")
      .forEach((a) => a.addEventListener("click", () => set(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        set(false);
        button.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) set(false);
    });
    matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && set(false));
  }

  engravings();
  menu();
  return { reduce, segmented, barChart };
})();
