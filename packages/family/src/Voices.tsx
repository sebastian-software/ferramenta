import type { ReactNode } from "react";

export type Voice = {
  /** The words, verbatim and short: a sentence, not a paragraph. Without quotation marks. */
  quote: ReactNode;
  /** Who said it, as their name is written. Also the key, so keep it unique. */
  who: string;
  /** Where and when: "Rails World 2026 keynote", "on X, August 2026". */
  where: ReactNode;
  /** The source, so a reader can check the words in their context. */
  href?: string;
};

export type VoicesProps = {
  /** What the voices speak to: "Others on the material". */
  title?: ReactNode;
  voices: Voice[];
};

/**
 * Outside voices, verbatim and attributed: what others say about the material
 * the family builds with. Each one names its source and links it, so it is
 * evidence a reader can check, not social proof. A family site never puts
 * words in anyone's mouth about the family itself.
 */
export function Voices({ title, voices }: VoicesProps) {
  return (
    <div className="fam-voices">
      {title !== undefined && <h3 className="fam-voices-title">{title}</h3>}
      <ul className="fam-voices-list">
        {voices.map((voice) => (
          <li key={voice.who}>
            <blockquote cite={voice.href}>
              <p>“{voice.quote}”</p>
              <footer>
                <cite>{voice.who}</cite>
                {voice.href === undefined ? (
                  <span>{voice.where}</span>
                ) : (
                  <a href={voice.href}>{voice.where}</a>
                )}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
