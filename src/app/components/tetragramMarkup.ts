const TETRAGRAM_HTML = `
<span class="tetragram tetragram--inline" aria-label="Tetragram adonaï IHVH">
  <span class="tetragram__letters" aria-hidden="true">
    <span class="tetragram__letter tetragram__letter--tall">I</span>
    <span class="tetragram__middle">
      <span class="tetragram__adonai">adonaï</span>
      <span class="tetragram__middle-line">
        <span class="tetragram__letter tetragram__letter--mid">H</span>
        <span class="tetragram__letter tetragram__letter--mid">V</span>
      </span>
    </span>
    <span class="tetragram__letter tetragram__letter--tall">H</span>
  </span>
</span>
`
  .trim()
  .replace(/\s+/g, " ");

export const replaceTetragram = (text: string) =>
  text.replace(/IHVH-?Adona(?:ï|i)/g, TETRAGRAM_HTML);
