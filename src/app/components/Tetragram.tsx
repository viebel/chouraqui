type TetragramProps = {
  className?: string;
};

export function Tetragram({ className = "" }: TetragramProps) {
  return (
    <span
      className={`tetragram ${className}`.trim()}
      aria-label="Tetragram Adonai IHVH"
    >
      <span className="tetragram__letters" aria-hidden="true">
        <span className="tetragram__letter tetragram__letter--tall">I</span>
        <span className="tetragram__middle">
          <span className="tetragram__adonai">adonaï</span>
          <span className="tetragram__middle-line">
            <span className="tetragram__letter tetragram__letter--mid">H</span>
            <span className="tetragram__letter tetragram__letter--mid">V</span>
          </span>
        </span>
        <span className="tetragram__letter tetragram__letter--tall">H</span>
      </span>
    </span>
  );
}
