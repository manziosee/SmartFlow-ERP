const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(f => {
    f = path.resolve(dir, f);
    if (fs.statSync(f).isDirectory()) results = results.concat(walk(f));
    else if (f.endsWith('.tsx')) results.push(f);
  });
  return results;
}

const files = walk('./app/dashboard');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Fix page-level wrapper: space-y-8 -> space-y-6
  content = content.replace(/className="space-y-8"/g, 'className="space-y-6"');

  // 2. Fix page title: text-4xl font-black or font-bold -> text-2xl font-semibold
  content = content.replace(/className="text-4xl font-black tracking-tight"/g, 'className="text-2xl font-semibold tracking-tight"');
  content = content.replace(/className="text-4xl font-bold tracking-tight"/g, 'className="text-2xl font-semibold tracking-tight"');
  content = content.replace(/className="text-3xl font-bold tracking-tight"/g, 'className="text-2xl font-semibold tracking-tight"');

  // 3. Fix page subtitle: large font -> small muted
  content = content.replace(/className="text-muted-foreground font-medium text-lg"/g, 'className="text-sm text-muted-foreground"');

  // 4. Fix stat card container: heavy gradient -> plain white
  content = content.replace(/className="rounded-\[2rem\][^"]+"/g, 'className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card"');
  content = content.replace(/className="rounded-\[2\.5rem\][^"]+"/g, 'className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card"');
  content = content.replace(/className="rounded-\[2rem\] border-none shadow-none[^"]+"/g, 'className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card"');

  // 5. Fix stat card value color text: colored -> plain dark
  content = content.replace(/className="text-3xl font-bold tracking-tight text-[a-z]+-[0-9]+"/g, 'className="text-2xl font-bold"');
  content = content.replace(/className="text-3xl font-bold tracking-tight mb-1"/g, 'className="text-2xl font-bold"');
  content = content.replace(/className="text-3xl font-bold tracking-tight"/g, 'className="text-2xl font-bold"');
  content = content.replace(/className="text-2xl font-bold tracking-tight"/g, 'className="text-2xl font-bold"');

  // 6. Fix CardHeader padding: oversize -> standard
  content = content.replace(/className="p-8 pb-4"/g, 'className="flex flex-row items-center justify-between pb-2"');
  content = content.replace(/className="p-8"/g, 'className="pb-2 px-6 pt-6"');
  content = content.replace(/className="p-6 pb-4"/g, 'className="flex flex-row items-center justify-between pb-2"');
  content = content.replace(/className="p-6"/g, 'className="px-6 pt-6 pb-2"');

  // 7. Fix CardContent oversize padding -> standard
  content = content.replace(/className="px-8 pb-8 pt-0"/g, 'className="px-6 pb-6"');
  content = content.replace(/className="px-6 pb-6 pt-0"/g, 'className="px-6 pb-6"');
  content = content.replace(/className="p-8 pt-0"/g, 'className="px-6 pb-6"');

  // 8. Fix header icon container (remove heavy gradient icon block)
  // These patterns match the big icon div that wraps the page title
  content = content.replace(/<div className="flex h-16 w-16 items-center justify-center[^>]+>[\s\S]*?<\/div>\s*<div>/g, '<div>');

  // 9. Fix the sub-label italic text inside stats
  content = content.replace(/<p className="text-\[10px\][^"]+italic">[^<]+<\/p>/g, '');
  content = content.replace(/<p className="text-xs[^"]+italic">[^<]+<\/p>/g, '');

  // 10. Fix action button styles: heavy -> clean
  content = content.replace(/className="gap-2 rounded-2xl font-bold shadow-lg shadow-[^"]+"/g, 'className="gap-2 font-medium"');
  content = content.replace(/className="gap-2 rounded-2xl border-border\/50 bg-background\/50 font-bold"/g, 'className="gap-2 font-medium" variant="outline"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Standardized: ' + path.relative('.', file));
  }
});

console.log('Done!');
