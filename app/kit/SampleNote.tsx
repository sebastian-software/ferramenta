import { Link } from "react-router";

import { SAMPLE } from "./sample";

/** The strip under the header of a sample page: what this is, and the way back. */
export function SampleNote() {
  return (
    <div className="kit-sample-note">
      <div className="wrap">
        <p>
          A sample page. {SAMPLE.title} is invented to show the kit at work; nothing on it is a real
          tool or a real measurement. <Link to="/kit">Back to the kit</Link>
        </p>
      </div>
    </div>
  );
}
