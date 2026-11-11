$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\JAYANT VAIBHAV\.gemini\antigravity\brain\71abb253-29f6-4004-a432-3a7886ad8b01"

$targets = @(
  @{ name = "dashboard_organised_desktop_light.png"; w = 1440; h = 960; url = "http://localhost:5173/?theme=light" },
  @{ name = "dashboard_organised_desktop_dark.png";  w = 1440; h = 960; url = "http://localhost:5173/?theme=dark" },
  @{ name = "dashboard_organised_mobile_light.png";  w = 390;  h = 844; url = "http://localhost:5173/?theme=light" },
  @{ name = "dashboard_organised_mobile_dark.png";   w = 390;  h = 844; url = "http://localhost:5173/?theme=dark" }
)

foreach ($t in $targets) {
  $file = Join-Path $outDir $t.name
  Write-Host "Capturing $($t.name)..."
  & $chrome --headless --disable-gpu "--window-size=$($t.w),$($t.h)" "--screenshot=$file" $t.url
}

Get-ChildItem -Path "$outDir\dashboard_organised_*.png" | Select-Object Name, Length
