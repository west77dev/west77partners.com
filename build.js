const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'src/pages');
const PARTIALS_DIR = path.join(__dirname, 'src/partials');
const DIST_DIR = __dirname; // output to root so existing links work

// Read partials
const headPartial = fs.readFileSync(path.join(PARTIALS_DIR, 'head.html'), 'utf8');
const headerPartial = fs.readFileSync(path.join(PARTIALS_DIR, 'header.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8');

// Parse frontmatter from page files
function parsePage(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      let val = rest.join(':').trim();
      // Parse arrays like ["about.css"]
      if (val.startsWith('[')) {
        val = JSON.parse(val);
      } else if (val === '""' || val === "''") {
        val = '';
      } else {
        val = val.replace(/^["']|["']$/g, '');
      }
      meta[key.trim()] = val;
    }
  });

  return { meta, body: match[2] };
}

// Build nav active classes map
const NAV_KEYS = ['about', 'services', 'projects', 'press', 'contact'];

function buildHeader(meta) {
  let header = headerPartial;
  header = header.replace('{{HEADER_CLASS}}', meta.headerClass || '');
  NAV_KEYS.forEach(key => {
    const placeholder = `{{NAV_ACTIVE_${key.toUpperCase()}}}`;
    const activeClass = meta.navActive === key ? 'nav__link--active' : '';
    header = header.replace(placeholder, activeClass);
  });
  return header;
}

// Build extra stylesheet links
function buildStyleLinks(styles) {
  if (!styles || !styles.length) return '';
  return styles.map(s => `  <link rel="stylesheet" href="${s}">`).join('\n');
}

// Process each page
const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));

pageFiles.forEach(file => {
  const raw = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
  const { meta, body } = parsePage(raw);

  const extraStyles = buildStyleLinks(meta.styles);
  const header = buildHeader(meta);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${meta.title || 'West77 Partners'}</title>
${headPartial}${extraStyles ? '\n' + extraStyles : ''}
</head>
<body>

${header}
${body}
${footerPartial}
</body>
</html>
`;

  fs.writeFileSync(path.join(DIST_DIR, file), html);
  console.log(`  Built: ${file}`);
});

console.log(`\nDone! ${pageFiles.length} pages built.`);
