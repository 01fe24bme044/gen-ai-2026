import os

files = [
    'c:/Users/dell/OneDrive/Desktop/thermo-visualizer/js/app.js',
    'c:/Users/dell/OneDrive/Desktop/thermo-visualizer/app.html'
]

replacements = [
    ('P âˆ  1/V', 'P ∝ 1/V'),
    ('Pâ‚\x81Vâ‚\x81 = Pâ‚‚Vâ‚‚', 'P₁V₁ = P₂V₂'),
    ('Pâ‚ Vâ‚  = Pâ‚‚Vâ‚‚', 'P₁V₁ = P₂V₂'),
    ('V âˆ  T', 'V ∝ T'),
    ('Vâ‚\x81/Tâ‚\x81 = Vâ‚‚/Tâ‚‚', 'V₁/T₁ = V₂/T₂'),
    ('Vâ‚ /Tâ‚  = Vâ‚‚/Tâ‚‚', 'V₁/T₁ = V₂/T₂'),
    ('P âˆ  T', 'P ∝ T'),
    ('Pâ‚\x81/Tâ‚\x81 = Pâ‚‚/Tâ‚‚', 'P₁/T₁ = P₂/T₂'),
    ('Pâ‚ /Tâ‚  = Pâ‚‚/Tâ‚‚', 'P₁/T₁ = P₂/T₂'),
    ('molÂ·K', 'mol·K'),
    ('ÐŸ†', '🏆'),
    ('ðŸ †', '🏆'),
    ('ÐŸ§ª', '🧪'),
    ('ðŸ§ª', '🧪'),
    ('â€”', '—'),
    ('ÐŸŸ¢', '🟢'),
    ('ÐŸ”µ', '🔵'),
    ('ÐŸ”´', '🔴'),
    ('J/(molÂ·K)', 'J/(mol·K)'),
    ('P âˆ 1/V', 'P ∝ 1/V'),
    ('V âˆ T', 'V ∝ T'),
    ('P âˆ T', 'P ∝ T')
]

for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
    except:
        text = content.decode('windows-1252', errors='ignore')

    # Also handle the exact bytes if needed
    for old, new in replacements:
        text = text.replace(old, new)
        
    # Some special ones that might have invisible chars
    text = text.replace('P âˆ\x9d 1/V', 'P ∝ 1/V')
    text = text.replace('V âˆ\x9d T', 'V ∝ T')
    text = text.replace('P âˆ\x9d T', 'P ∝ T')
    text = text.replace('Pâ‚\x81Vâ‚\x81', 'P₁V₁')
    text = text.replace('Pâ‚‚Vâ‚‚', 'P₂V₂')
    text = text.replace('Vâ‚\x81/Tâ‚\x81', 'V₁/T₁')
    text = text.replace('Vâ‚‚/Tâ‚‚', 'V₂/T₂')
    text = text.replace('Pâ‚\x81/Tâ‚\x81', 'P₁/T₁')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print('Done applying python fix.')
