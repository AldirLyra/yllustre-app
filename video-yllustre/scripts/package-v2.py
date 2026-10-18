from pathlib import Path
import zipfile

root=Path(__file__).resolve().parent.parent
out=root.parent/'entregas/Yllustre-Projeto-Remotion-V2.zip'
files=[root/n for n in ['package.json','package-lock.json','README.md','README-V2.md','preview-v2.html','preview.html','.gitignore','remotion.config.ts']]
for folder in ['src','src-v1','scripts','public-v2','skill']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file())
# CSS contains relative font URLs for both preserved compositions.
files.extend(p for p in (root/'public/fonts').glob('*.ttf'))
files.extend(p for p in (root/'review-v2').glob('*') if p.is_file() and p.suffix in ['.md','.json','.jpg'])
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for file in files:
        z.write(file,Path('video-yllustre')/file.relative_to(root))
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    assert not any(name.lower().endswith(('.exe','.dll','.crdownload')) for name in z.namelist())
    print(f'{out}: {len(z.namelist())} files, {out.stat().st_size} bytes; integrity OK.')
