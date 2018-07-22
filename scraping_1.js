function scraping() {
    //現在のスプレッドシートを取得
    var aBook = SpreadsheetApp.getActiveSpreadsheet();
    
    //シートを取得
    var aSheet = aBook.getSheetByName("シート1");
    
    var options = {
      "muteHttpExceptions": true,　    // 404エラーでも処理を継続する
    }
    var url = aSheet.getRange('B1').getValue();
    var fetch = UrlFetchApp.fetch(url,options);
    var response = fetch.getContentText();
  //  aSheet.getRange(1, 4).setValue(response);
    var tag = getTags();
    Logger.log(tag);
    var viewpoint = getViewPoint();
    for(i=0; i<tag.length; i++){
      var itemName = getContentOfTagName(response, tag[i]);
      for(j=0; j<itemName.length; j++){
        aSheet.getRange(j+4, 1).setValue(tag[i]);
        aSheet.getRange(j+4, 2).setValue(itemName[j]);
      }
    }
    
    
    // タグ内の要素を取得
    function getContentOfTagName(html, tagName) {
      var i = 0;
      var j = 0;
      var startOfTag;
      var endOfTag;
      var str = [ ];
      
      while(html.indexOf('<' + tagName,j)!=-1){
        
        //"<タグ名"の開始位置を取得
        j = html.indexOf('<' + tagName,j);
        
        //次の">"位置 + 1を文字列の始めとする
        startOfStr = html.indexOf('>',j)+1;
        
        //次の"</タグ名>"位置を文字列の終わりとする
        endOfStr = html.indexOf('</' + tagName + '>',j);
        
        //タグの間の文字列を配列に追加
        str[i] = html.substring(startOfStr, endOfStr);
        
        j = endOfStr + 1;
        i++;
      }
      
      return str;
    }
  
    function getTags(){
      //現在のスプレッドシートを取得
      var aBook = SpreadsheetApp.getActiveSpreadsheet();
      //テスト観点のシートを取得
      var aSheet = aBook.getSheetByName("シート2");
      //最終行を取得
      var lastRow = aSheet.getDataRange().getLastRow();
      var tags = [];
      for(var i=3; i<=lastRow; i++){
        if(aSheet.getRange(i, 1).getValue() != ""){
          tags.push(aSheet.getRange(i, 1).getValue());
        }
      }
      tags = tags.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      return tags;
    }
    
    function getViewPoint(){
      //現在のスプレッドシートを取得
      var aBook = SpreadsheetApp.getActiveSpreadsheet();
      //テスト観点のシートを取得
      var aSheet = aBook.getSheetByName("シート2");
      //最終行を取得
      var lastRow = aSheet.getDataRange().getLastRow();
      var viewpoints = [];
      for (var i=3; i<=lastRow; i++){
        viewpoints.push({
          viewpoint:aSheet.getRange(i, 3).getValue(),
          condition:aSheet.getRange(i, 2).getValue(),
          tag:aSheet.getRange(i, 1).getValue()
        });
      }
      return viewpoints;
    }
    Logger.log(getViewPoint());
  }