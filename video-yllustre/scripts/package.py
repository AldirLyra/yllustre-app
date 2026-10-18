from pathlib import Path
import zipfile

root=Path(__file__).resolve().parent.parent
out=root.parent/'entregas/yllustre-projeto-remotion.zip'
files=[root/n for n in ['package.json','package-lock.json','README.md','preview.html','.gitignore']]
for folder in ['src','scripts','public/media','public/audio','public/fonts','skill']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file())
for name in ['technical-report.json','revisao.md','mp4-storyboard.jpg']:
    p=root/'review'/name
    if p.exists(): files.append(p)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for file in files:
        z.write(file,Path('video-yllustre')/file.relative_to(root))
with zipfile.ZipFile(out) as z:
    bad=z.testzip()
    assert bad is None, bad
    assert not any(name.lower().endswith(('.exe','.dll','.crdownload')) for name in z.namelist())
    print(f'{out}: {len(z.namelist())} files, {out.stat().st_size} bytes; integrity OK.')
