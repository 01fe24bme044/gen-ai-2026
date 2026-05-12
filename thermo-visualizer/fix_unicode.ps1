# Fix corrupted Unicode characters in ThermoViz app.js
# Replaces all non-ASCII math/Greek symbols with plain English ASCII

$file = Join-Path $PSScriptRoot 'js\app.js'
$bytes = [System.IO.File]::ReadAllBytes($file)
$c = [System.Text.Encoding]::UTF8.GetString($bytes)

# === Double-encoded corruption (worst offenders from heat transfer section) ===
$c = $c.Replace([char]0x00C3 + [char]0x00A2 + [char]0x02C6 + [char]0x2021, 'nabla')
$c = $c.Replace([char]0x00C3 + [char]0x0178 + [char]0x201C + [char]0x2020, 'Delta')
$c = $c.Replace([char]0x00C3 + [char]0x0192, 'sigma')
$c = $c.Replace([char]0x00C3 + [char]0x00A2 + [char]0x00B4, '^4')

# === Greek Capital Letters ===
$c = $c.Replace([string][char]0x0394, 'Delta')   # Δ
$c = $c.Replace([string][char]0x039E, 'Xi')       # Ξ
$c = $c.Replace([string][char]0x03A3, 'Sigma')    # Σ
$c = $c.Replace([string][char]0x03A9, 'Omega')    # Ω

# === Greek Lowercase Letters ===
$c = $c.Replace([string][char]0x03B1, 'alpha')    # α
$c = $c.Replace([string][char]0x03B2, 'beta')     # β
$c = $c.Replace([string][char]0x03B3, 'gamma')    # γ
$c = $c.Replace([string][char]0x03B4, 'delta')    # δ
$c = $c.Replace([string][char]0x03B5, 'epsilon')  # ε
$c = $c.Replace([string][char]0x03B7, 'eta')      # η
$c = $c.Replace([string][char]0x03B8, 'theta')    # θ
$c = $c.Replace([string][char]0x03BA, 'kappa')    # κ
$c = $c.Replace([string][char]0x03BB, 'lambda')   # λ
$c = $c.Replace([string][char]0x03BC, 'mu')       # μ
$c = $c.Replace([string][char]0x03BD, 'nu')       # ν
$c = $c.Replace([string][char]0x03BE, 'xi')       # ξ
$c = $c.Replace([string][char]0x03C0, 'pi')       # π
$c = $c.Replace([string][char]0x03C1, 'rho')      # ρ
$c = $c.Replace([string][char]0x03C3, 'sigma')    # σ
$c = $c.Replace([string][char]0x03C4, 'tau')      # τ
$c = $c.Replace([string][char]0x03C6, 'phi')      # φ
$c = $c.Replace([string][char]0x03C8, 'psi')      # ψ
$c = $c.Replace([string][char]0x03C9, 'omega')    # ω

# === Math Symbols ===
$c = $c.Replace([string][char]0x222B, 'Integral ') # ∫
$c = $c.Replace([string][char]0x2211, 'Sum')       # ∑
$c = $c.Replace([string][char]0x221D, ' ~ ')       # ∝ proportional to
$c = $c.Replace([string][char]0x2265, '>=')        # ≥
$c = $c.Replace([string][char]0x2264, '<=')        # ≤
$c = $c.Replace([string][char]0x2207, 'nabla')     # ∇
$c = $c.Replace([string][char]0x2202, 'd')         # ∂
$c = $c.Replace([string][char]0x221E, 'infinity')  # ∞
$c = $c.Replace([string][char]0x2248, '~=')        # ≈
$c = $c.Replace([string][char]0x2260, '!=')        # ≠
$c = $c.Replace([string][char]0x00D7, 'x')         # ×
$c = $c.Replace([string][char]0x00F7, '/')         # ÷

# === Subscript digits ===
$c = $c.Replace([string][char]0x2080, '0')  # ₀
$c = $c.Replace([string][char]0x2081, '1')  # ₁
$c = $c.Replace([string][char]0x2082, '2')  # ₂
$c = $c.Replace([string][char]0x2083, '3')  # ₃
$c = $c.Replace([string][char]0x2084, '4')  # ₄
$c = $c.Replace([string][char]0x2085, '5')  # ₅
$c = $c.Replace([string][char]0x2086, '6')  # ₆
$c = $c.Replace([string][char]0x2087, '7')  # ₇
$c = $c.Replace([string][char]0x2088, '8')  # ₈
$c = $c.Replace([string][char]0x2089, '9')  # ₉

# === Superscript digits ===
$c = $c.Replace([string][char]0x00B2, '^2')  # ²
$c = $c.Replace([string][char]0x00B3, '^3')  # ³
$c = $c.Replace([string][char]0x2074, '^4')  # ⁴
$c = $c.Replace([string][char]0x2075, '^5')  # ⁵

# === Special punctuation ===
$c = $c.Replace([string][char]0x00B7, '*')   # · middle dot -> multiply
$c = $c.Replace([string][char]0x2022, '*')   # • bullet
$c = $c.Replace([string][char]0x2014, '--')  # — em dash
$c = $c.Replace([string][char]0x2013, '-')   # – en dash
$c = $c.Replace([string][char]0x2019, "'")   # ' right single quote
$c = $c.Replace([string][char]0x2018, "'")   # ' left single quote
$c = $c.Replace([string][char]0x201C, '"')   # " left double quote
$c = $c.Replace([string][char]0x201D, '"')   # " right double quote
$c = $c.Replace([string][char]0x2026, '...')  # … ellipsis
$c = $c.Replace([string][char]0x00AB, '<<')  # «
$c = $c.Replace([string][char]0x00BB, '>>')  # »
$c = $c.Replace([string][char]0x2192, '->')  # →
$c = $c.Replace([string][char]0x2190, '<-')  # ←

# === Arrows used in text ===
$c = $c.Replace([string][char]0x21D2, '=>')  # ⇒

# === Misc ===
$c = $c.Replace([string][char]0x00B0, ' deg ')  # °

# Now fix any remaining Latin-1 / Windows-1252 artifacts
# These are bytes 0x80-0xFF that appear as corrupted Latin chars
$c = $c.Replace([string][char]0x00C0 + 'T', 'DeltaT')
$c = $c.Replace([string][char]0x00CE + [char]0x0094, 'Delta')

# Write back as UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $c, $utf8NoBom)
Write-Host "SUCCESS: Fixed app.js - all corrupted Unicode replaced with ASCII"

# === Now fix app.html ===
$htmlFile = Join-Path $PSScriptRoot 'app.html'
$h = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)

# Fix corrupted emoji sequences
$h = $h.Replace([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x2020, 'TROPHY')
$h = $h.Replace([char]0x00F0 + [char]0x0178 + '', '')

# Write back
[System.IO.File]::WriteAllText($htmlFile, $h, $utf8NoBom)
Write-Host "SUCCESS: Fixed app.html"
