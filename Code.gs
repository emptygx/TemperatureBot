var token = "1624681117:AAFjo3vZfJmHcacudBDYC39FO2bXEF0LLq4";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbzHb1XqVwm62GzJelTr9n3G8zSSNK2e7Qojw8YmV-Qq8w5rbkYSzSukuDZsOuajdw1s/exec";
var dateNow = new Date;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const d = new Date();
Logger.log("The current month is " + monthNames[d.getMonth()]);
var month = monthNames[d.getMonth()];
var reformattedDate = dateNow.getDate() + " " + month;
var time = dateNow.getHours();

Logger.log(reformattedDate);

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendMessage(id, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
}

function sendOption(id, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + '/', data);
}


function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var id = PropertiesService.getScriptProperties().getProperty(id);
  
  if (contents.message) {
    var id = contents.message.from.id;
    var text = contents.message.text;
    var firstname = contents.message.from.first_name;
    PropertiesService.getScriptProperties().setProperty(id, String(id));
    if (contents.message.text == "/start") {
      sendMessage(id, "Hello! To help me configure the right settings for you, please key in your appointment exactly as it appears in the temperature log :)");
    }
    else if (isFinite(text)) {
    var ssId = "1K05yAqARInY75wugYUKuPf3TAdpB-bx-pQ6FG-ecU7M";
    var sheet = SpreadsheetApp.openById(ssId).getSheetByName("Temperature Log - " + month + " 2021");
    var column = 1;
    var appointment = PropertiesService.getScriptProperties().getProperty(id + 'appointment');
    var userRow = sheet.createTextFinder(appointment).findNext().getRow(); //sets row to that of user
    var dateColumn = sheet.createTextFinder(reformattedDate).findNext().getColumn();
    if (time < 12) { var ampm = "AM" }
      else { ampm = "PM" };
      sendMessage(id, "Okay! Updating your " + ampm + " temperature for " + reformattedDate + "!");
      if (time < 12) { var column = dateColumn }
      else { column = dateColumn + 1 };
    sheet.getRange(userRow, column).setValue([text]);
    }
    
    else {
      sendMessage(id, "Thanks " + firstname + "! You may now key in your temperature");
      var appointment = contents.message.text.toUpperCase();
      PropertiesService.getScriptProperties().setProperty(id + 'appointment', appointment);
    }
  }

}