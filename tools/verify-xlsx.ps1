param([string]$Path, [string[]]$Names = @('TargetPrice','Upside','SOTPValue','DCFValue'))
# Opens a model workbook in Excel, recalculates, reports error cells per sheet and the named
# outputs for each scenario (1 = Base, 2 = Bull, 3 = Bear). ASCII-only on purpose.
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false; $xl.DisplayAlerts = $false
try {
  $wb = $xl.Workbooks.Open($Path)
  $xl.CalculateFull()
  foreach ($ws in $wb.Worksheets) {
    $ur = $ws.UsedRange; $v = $ur.Value2; $errs = 0; $first = ''
    if ($v -is [System.Array]) {
      $r0 = $ur.Row; $c0 = $ur.Column
      for ($i = 1; $i -le $v.GetLength(0); $i++) { for ($j = 1; $j -le $v.GetLength(1); $j++) {
        $x = $v[$i, $j]
        if ($x -is [int] -and $x -lt -2146820000) { $errs++; if (-not $first) { $first = $ws.Cells.Item($r0 + $i - 1, $c0 + $j - 1).Address($false, $false) + ' ' + $ws.Cells.Item($r0 + $i - 1, $c0 + $j - 1).Formula } }
      } }
    }
    Write-Output ("{0,-18} errors={1} {2}" -f $ws.Name, $errs, $first)
  }
  foreach ($s in 1, 2, 3) {
    $wb.Names.Item('Scenario').RefersToRange.Value2 = $s
    $xl.CalculateFull()
    $out = @()
    foreach ($n in $Names) { try { $out += ('{0}={1:N1}' -f $n, $wb.Names.Item($n).RefersToRange.Value2) } catch { $out += "$n=n/a" } }
    Write-Output ("Scenario {0}: {1}" -f $s, ($out -join '  '))
  }
  $wb.Close($false)
} finally { $xl.Quit(); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl) }
