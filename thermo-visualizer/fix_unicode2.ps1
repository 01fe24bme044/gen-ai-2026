# Fix corrupted multi-byte sequences by direct string replacement
$file = Join-Path $PSScriptRoot 'js\app.js'
$c = Get-Content -Path $file -Raw -Encoding UTF8

# Heat Transfer double-encoded sequences (lines 1580-1582)
$c = $c.Replace('Ã¢Ë†â€¡', 'nabla_')
$c = $c.Replace('ÃŽâ€', 'Delta_')
$c = $c.Replace('ÃÆ''+"'", 'sigma_')
$c = $c.Replace('Ã¢Â´', '^4')

# Greek capital letters (2-byte mojibake)
$c = $c.Replace('Î"', 'Delta_')
$c = $c.Replace('Î³', 'gamma')
$c = $c.Replace('Î·', 'eta')
$c = $c.Replace('Î¾', 'xi')
$c = $c.Replace('Îž', 'Xi')
$c = $c.Replace('Î¼', 'mu')
$c = $c.Replace('Î½', 'nu')
$c = $c.Replace('Îº', 'kappa')
$c = $c.Replace('Î±', 'alpha')
$c = $c.Replace('Î²', 'beta')
$c = $c.Replace('Î´', 'delta')

# Math symbols (3-byte mojibake)
$c = $c.Replace('âˆ«', 'Integral ')
$c = $c.Replace('âˆ'', 'Sum_')
$c = $c.Replace('âˆ', ' ~ ')
$c = $c.Replace('â‰¥', '>=')
$c = $c.Replace('â‰¤', '<=')
$c = $c.Replace('âˆ‡', 'nabla_')
$c = $c.Replace('âˆ‚', 'd')

# Subscript digits (3-byte mojibake)
$c = $c.Replace('â‚€', '0')
$c = $c.Replace('â‚', '1')
$c = $c.Replace('â‚‚', '2')
$c = $c.Replace('â‚ƒ', '3')
$c = $c.Replace('â‚„', '4')

# Superscripts
$c = $c.Replace('Â²', '^2')
$c = $c.Replace('Â³', '^3')
$c = $c.Replace('Â·', '*')

# Typographic quotes and dashes
$c = $c.Replace('â€"', '--')
$c = $c.Replace('â€"', '-')
$c = $c.Replace('â€™', "'")
$c = $c.Replace('â€˜', "'")
$c = $c.Replace('â€œ', '"')
$c = $c.Replace('â€', '"')

# Greek lowercase (2-byte)
$c = $c.Replace('Ï„', 'tau')
$c = $c.Replace('Ïƒ', 'sigma')
$c = $c.Replace('Ï€', 'pi')

# Arrows
$c = $c.Replace('â†'', '->')

# Special fix: Â followed by nothing useful
$c = $c.Replace('Â ', ' ')

# Write back
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $c, $utf8NoBom)
Write-Host "SUCCESS: Pass 2 complete"
