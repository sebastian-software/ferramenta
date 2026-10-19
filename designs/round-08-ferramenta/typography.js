const headingControl = document.querySelector('select[name="headings"]');
const bodyControl = document.querySelector('select[name="body"]');
const parameters = new URLSearchParams(window.location.search);

for (const [control, key, attribute] of [
  [headingControl, "headings", "headingFont"],
  [bodyControl, "body", "bodyFont"],
]) {
  const requested = parameters.get(key);
  if ([...control.options].some((option) => option.value === requested)) control.value = requested;
  const update = () => {
    document.documentElement.dataset[attribute] = control.value;
    parameters.set(key, control.value);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${parameters}${window.location.hash}`,
    );
  };
  update();
  control.disabled = false;
  control.addEventListener("change", update);
}
