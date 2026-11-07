/**
 * Monografie: the page system for the Ferramenta family site, the engine
 * homepages and their documentation (ADR-0012). Import with
 * `ferramenta-family/monografie.css`, and on documentation pages also
 * `monografie-docs.css` and `monografie-ardo.css`. The entry also carries what
 * such a page needs from the rest of the package — the line-icon sprite, the
 * live registry facts and the comparison types — so a site imports from one
 * place.
 */
export type { ComparisonCell, ComparisonMark, ComparisonRow, ComparisonTableProps, Contender, MeasuredProps, MeasuredRow, } from "./comparison-types.js";
export { hasIdentity, IDENTITIES, type Identity } from "./identity.js";
export { Mark, MarkDefs, type MarkProps } from "./Mark.js";
export { MonoBarChart, type MonoBarChartProps, type MonoBarRow, MonoSegmented, type MonoSegmentedOption, type MonoSegmentedProps, MonoTableView, type MonoTableViewProps, } from "./MonoChart.js";
export { MonoFooter, type MonoFooterProps, MonoHeader, type MonoHeaderProps, MonoPage, } from "./MonoChrome.js";
export { MonoCode, MonoCodePair, type MonoCodeProps, MonoDiagram, MonoRenderedCode, type MonoRenderedCodeProps, } from "./MonoDocsCode.js";
export { MonoArticle, type MonoArticleProps, type MonoBar, MonoBars, type MonoBarsProps, MonoChoices, MonoColumns, MonoExample, MonoFeatureGrid, MonoMeasured, MonoMedia, MonoSelect, MonoSteps, MonoTabs, MonoToggle, } from "./MonoDocsParts.js";
export { MonoApplications, MonoEngineCatalog, type MonoEngineCatalogProps, MonoWorkshop, } from "./MonoFamily.js";
export { MonoAction, type MonoActionProps, MonoClosing, type MonoClosingProps, MonoColophon, MonoEngraving, type MonoFact, MonoLeadIn, type MonoNoteProps, MonoOpening, type MonoOpeningProps, MonoPassage, type MonoPassageProps, MonoSection, type MonoSectionProps, } from "./MonoParts.js";
export { MonoBenchmarkTable, MonoComparisonTable, MonoGuideNavigation, MonoReadingLayout, type MonoReadingLayoutProps, MonoReadingTable, MonoSectionRail, type MonoSectionRailProps, MonoTable, type MonoTableProps, MonoTableViewport, } from "./MonoReading.js";
export { MonoCaption, MonoCard, type MonoCardProps, MonoCards, type MonoCardsProps, MonoCredit, MonoFacing, type MonoProof, MonoProofs, MonoSheet, type MonoSheetProps, type MonoTerm, MonoTerms, type MonoTermsProps, MonoVerdict, MonoWide, } from "./MonoSpecimens.js";
export { RegistryFacts, type RegistryFactsProps, useToolFacts } from "./RegistryFacts.js";
