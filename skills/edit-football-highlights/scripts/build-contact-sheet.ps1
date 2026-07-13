param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [string]$FfmpegPath,
  [int]$IntervalSeconds = 30,
  [int]$Columns = 4,
  [int]$MaxFrames = 32,
  [int]$CellWidth = 320,
  [int]$CellHeight = 180
)

$ErrorActionPreference = 'Stop'
$inputFile = (Resolve-Path -LiteralPath $InputPath).Path
$outputFile = [System.IO.Path]::GetFullPath($OutputPath)
$outputDir = Split-Path -Parent $outputFile
New-Item -ItemType Directory -Force $outputDir | Out-Null

if (-not $FfmpegPath) {
  $command = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($command) {
    $FfmpegPath = $command.Source
  } else {
    $candidate = Get-ChildItem -Path (Get-Location) -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -match '@remotion.+compositor' } |
      Select-Object -First 1
    if (-not $candidate) { throw 'Could not find FFmpeg. Pass -FfmpegPath explicitly.' }
    $FfmpegPath = $candidate.FullName
  }
}

$ffmpeg = (Resolve-Path -LiteralPath $FfmpegPath).Path
$ffprobe = Join-Path (Split-Path -Parent $ffmpeg) 'ffprobe.exe'
if (-not (Test-Path -LiteralPath $ffprobe)) { throw "Could not find ffprobe next to $ffmpeg" }

$durationText = & $ffprobe -v error -show_entries format=duration -of 'default=noprint_wrappers=1:nokey=1' $inputFile
$duration = [double]::Parse($durationText.Trim(), [System.Globalization.CultureInfo]::InvariantCulture)
$frameCount = [Math]::Min($MaxFrames, [Math]::Ceiling($duration / $IntervalSeconds))
$tempDir = Join-Path $outputDir ('.contact-sheet-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory $tempDir | Out-Null

try {
  $frames = @()
  for ($i = 0; $i -lt $frameCount; $i++) {
    $seconds = $i * $IntervalSeconds
    $framePath = Join-Path $tempDir ('frame-{0:D3}.jpg' -f $i)
    & $ffmpeg -hide_banner -loglevel error -ss $seconds -i $inputFile -frames:v 1 -q:v 3 $framePath
    if (Test-Path -LiteralPath $framePath) { $frames += $framePath }
  }

  if ($frames.Count -eq 0) { throw 'No frames were extracted.' }

  Add-Type -AssemblyName System.Drawing
  $rows = [Math]::Ceiling($frames.Count / $Columns)
  $canvas = New-Object System.Drawing.Bitmap ($Columns * $CellWidth), ($rows * $CellHeight)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear([System.Drawing.Color]::Black)
  $font = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)

  try {
    for ($i = 0; $i -lt $frames.Count; $i++) {
      $image = [System.Drawing.Image]::FromFile($frames[$i])
      try {
        $x = ($i % $Columns) * $CellWidth
        $y = [int]([Math]::Floor($i / $Columns)) * $CellHeight
        $graphics.DrawImage($image, $x, $y, $CellWidth, $CellHeight)
        $seconds = $i * $IntervalSeconds
        $label = '{0:D2}:{1:D2}' -f [int]([Math]::Floor($seconds / 60)), [int]($seconds % 60)
        $graphics.DrawString($label, $font, [System.Drawing.Brushes]::Yellow, $x + 8, $y + 8)
      } finally {
        $image.Dispose()
      }
    }
    $canvas.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  } finally {
    $font.Dispose()
    $graphics.Dispose()
    $canvas.Dispose()
  }
} finally {
  $resolvedTemp = [System.IO.Path]::GetFullPath($tempDir)
  if ($resolvedTemp.StartsWith([System.IO.Path]::GetFullPath($outputDir), [System.StringComparison]::OrdinalIgnoreCase)) {
    Remove-Item -LiteralPath $resolvedTemp -Recurse -Force -ErrorAction SilentlyContinue
  }
}

Get-Item -LiteralPath $outputFile | Select-Object FullName, Length
