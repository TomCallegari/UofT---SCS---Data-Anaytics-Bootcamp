
' Tom Callegari - U of T - SCS Data Analytics Bootcamp - Homework 2

' Excel VBA macro for stock data

' Script to create a summary table for the total volume traded for each
' ticker symbol for each years worksheet.

' Initialize the sub routine and name it GroupBySumStock
Sub GroupBySumStock()

  ' Initialize the ticker and volume total variables and set the volume to 0
  Dim Ticker_Name As String
  Dim Volume_Total As Double
  Volume_Total = 0

  ' Initialize a summary table start row variable and set to row 2
  Dim Summary_Table_Row As Integer
  Summary_Table_Row = 2

  ' Initialize a last row varialbe that will store the index of the last row 
  ' for the ticker symbols
  LastRow = Cells(Rows.Count, 1).End(xlUp).Row

  ' Begin the loop down the ticker symbol column, performing operations 
  ' at each row along the way
  For i = 2 To LastRow

    ' Set the collection of current ticker name and volumes to occur
    ' when the ticker symbol changes then store the information
    ' in the appropriate row of the summary table being built to the side
    If Cells(i + 1, 1).Value <> Cells(i, 1).Value Then

      Ticker_Name = Cells(i, 1).Value

      Volume_Total = Volume_Total + Cells(i, 7).Value

      Range("I" & Summary_Table_Row).Value = Ticker_Name

      Range("J" & Summary_Table_Row).Value = Volume_Total

      ' Add one row to the summary table start row after each ticker symbol
      Summary_Table_Row = Summary_Table_Row + 1

      ' Reset the volume to 0 for the next ticker
      Volume_Total = 0

    Else
      
      ' If not a new ticker symbol than continue collecting
      ' the volume traded and add to the current total
      Volume_Total = Volume_Total + Cells(i, 7).Value

    End If

  Next i
  
  ' Place appropriate header labels for the summary table
  Range("I1").Value = "Ticker"
  Range("J1").Value = "Volume"

End Sub

' ----------------------------------------------------------------------------

        




