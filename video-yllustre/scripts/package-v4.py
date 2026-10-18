from pathlib import Path
import zipfile

root=Path(__file__).resolve().parent.parent
out=root.parent/'entregas/Yllustre-Projeto-Remotion-V4.zip'
files=[root/n for n in ['package.json','package-lock.json','README.md','README-V2.md','README-V3.md','README-V4.md','preview.html','preview-v2.html','preview-v3.html','preview-v4.html','.gitignore','remotion.config.ts']]
for folder in ['src','src-v1','scripts','public-v2','skill']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
files.extend((root/'public/fonts').glob('*.ttf'))
files.extend(p for p in (root/'review-v4').rglob('*') if p.is_file() and p.name not in ['previews.jpg','draft-stills.jpg'] and p.suffix in ['.md','.json','.jpg','.txt'])
repo=root/'references/motionmaxxing'
files.extend(repo/n for n in ['SKILL.md','README.md','LICENSE','NOTICE'])
for folder in ['references','taste']:
    files.extend((repo/folder).glob('*.md'))
files.extend(repo/'scripts'/n for n in ['look.py','lint.mjs','_cdp.mjs'])
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for file in dict.fromkeys(files):
        z.write(file,Path('video-yllustre')/file.relative_to(root))
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    assert not any(n.lower().endswith(('.exe','.dll','.crdownload')) or '/.git/' in n for n in z.namelist())
    print(f'{out}: {len(z.namelist())} files, {out.stat().st_size} bytes; integrity OK.')
