const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./app/dashboard');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix main wrappers
  content = content.replace(/className="space-y-8 [^"]+"/g, 'className="space-y-6"');
  
  // Fix the massive header block specifically
  // E.g. <div className="flex items-center gap-6">\n <div className="flex h-16 w-16...
  const headerRegex = /<div className="flex items-center gap-6">\s*<div className="flex h-16 w-16 items-center justify-center rounded-\[2rem\] bg-gradient-to-br [^>]+>\s*<[a-zA-Z]+ className="h-8 w-8 text-white" \/>\s*<\/div>\s*<div>\s*<h1 className="text-4xl font-bold tracking-tight">([^<]+)<\/h1>\s*<p className="text-muted-foreground font-medium text-lg">([^<]+)<\/p>\s*<\/div>\s*<\/div>/g;
  content = content.replace(headerRegex, 
  `<div>
          <h1 className="text-2xl font-semibold tracking-tight">$1</h1>
          <p className="text-sm text-muted-foreground">$2</p>
        </div>`);
  
  // Fix header layout
  content = content.replace(/<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">/g, 
                            '<div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">');

  // Fix Action buttons
  content = content.replace(/<Button className="gap-2 rounded-2xl font-bold shadow-lg shadow-[^"]+"/g, 
                            '<Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium"');
  content = content.replace(/<Button variant="outline" className="gap-2 rounded-2xl border-border\/50 bg-background\/50 font-bold"/g, 
                            '<Button variant="outline" className="rounded-xl gap-2 font-medium border-border/50"');

  // Fix Stats Cards
  content = content.replace(/<Card className="rounded-\[2rem\] border-border\/40 shadow-none overflow-hidden bg-gradient-to-br [^"]+">/g, 
                            '<Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">');
  
  // Fix padding in cards
  content = content.replace(/<CardContent className="p-8">/g, '<CardContent className="p-6">');
  content = content.replace(/<CardHeader className="p-8 pb-2">/g, '<CardHeader className="p-6 pb-4">');
  content = content.replace(/<CardContent className="px-8 pb-8 pt-0">/g, '<CardContent className="px-6 pb-6 pt-0">');

  // Fix lower table cards
  content = content.replace(/<Card className="rounded-\[2.5rem\] border-border\/50 shadow-none overflow-hidden bg-card">/g, 
                            '<Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">');
  content = content.replace(/<Card className="rounded-2xl border-border\/50 shadow-none overflow-hidden bg-card">/g, 
                            '<Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">');

  // Cleanup heavy typography
  content = content.replace(/className="text-\[10px\] font-bold uppercase tracking-widest/g, 'className="text-sm font-semibold text-muted-foreground');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed: ' + file);
  }
});
