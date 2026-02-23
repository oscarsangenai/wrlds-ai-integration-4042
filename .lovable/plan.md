
## Add Bylaws Page

### What will change

1. **Footer** -- A new "Bylaws" link will be added under the "Company" column, below the existing "Resources" link, pointing to `/bylaws`.

2. **New Bylaws page** (`src/pages/Bylaws.tsx`) -- A new page following the same layout pattern as the Privacy Policy page (PageLayout wrapper, back-to-home link, prose-styled content). It will contain the full bylaws text provided, with proper headings (h1, h2, h3), paragraphs, and bullet lists.

3. **Router** -- A new lazy-loaded route `/bylaws` will be added in `src/App.tsx`.

### Technical details

**src/components/Footer.tsx**
- Add `<li><Link to="/bylaws">Bylaws</Link></li>` after the Resources link in the Company column.

**src/pages/Bylaws.tsx** (new file)
- Uses `PageLayout`, `SEO`, `ArrowLeft` back link -- same structure as `PrivacyPolicy.tsx`.
- SEO title: "Bylaws | Gen AI Global", description summarizing the document.
- All 11 sections rendered with `prose prose-lg` styling, using `h2` for top-level sections, `h3` for subsections, `ul` for bullet lists.

**src/App.tsx**
- Add `const Bylaws = lazy(() => import('./pages/Bylaws'));`
- Add route: `<Route path="/bylaws" element={<TransitionRoute><Bylaws /></TransitionRoute>} />`
