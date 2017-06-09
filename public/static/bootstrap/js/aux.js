wordifyDate = function(date) {
  var month = date.getMonth()+1;
  var day = date.getDate();
  var year = date.getFullYear();

  switch(month) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
    default:
  }

  // switch(day) {
  //   case 1:
  //     day = "First";
  //     break;
  //   case 2:
  //     day = "Second";
  //     break;
  //   case 3:
  //     day = "Third";
  //     break;
  //   case 4:
  //     day = "Fourth";
  //     break;
  //   case 5:
  //     day = "Fifth";
  //     break;
  //   case 6:
  //     day = "Sixth";
  //     break;
  //   case 7:
  //     day = "Seventh";
  //     break;
  //   case 8:
  //     day = "Eighth";
  //     break;
  //   case 9:
  //     day = "Ninth";
  //     break;
  //   case 10:
  //     day = "Tenth";
  //     break;
  //   case 11:
  //     day = "Eleventh";
  //     break;
  //   case 12:
  //     day = "Twelfth";
  //     break;
  //   case 13:
  //     day = "Thirteenth";
  //     break;
  //   case 14:
  //     day = "Fourteenth";
  //     break;
  //   case 15:
  //     day = "Fifteenth";
  //     break;
  //   case 16:
  //     day = "Sixteenth";
  //     break;
  //   case 17:
  //     day = "Seventeenth";
  //     break;
  //   case 18:
  //     day = "Eighteenth";
  //     break;
  //   case 19:
  //     day = "Nineteenth";
  //     break;
  //   case 20:
  //     day = "Twentieth";
  //     break;
  //   case 21:
  //     day = "Twenty First";
  //     break;
  //   case 22:
  //     day = "Twenty Second";
  //     break;
  //   case 23:
  //     day = "Twenty Third";
  //     break;
  //   case 24:
  //     day = "Twenty Fourth";
  //     break;
  //   case 25:
  //     day = "Twenty Fifth";
  //     break;
  //   case 26:
  //     day = "Twenty Sixth";
  //     break;
  //   case 27:
  //     day = "Twenty Seventh";
  //     break;
  //   case 28:
  //     day = "Twenty Eighth";
  //     break;
  //   case 29:
  //     day = "Twenty Ninth";
  //     break;
  //   case 30:
  //     day = "Thirtieth";
  //     break;
  //   case 31:
  //     day = "Thirty First";
  //     break;
  //   default:
  // }

  return month + " " + day + ", " + year;
}