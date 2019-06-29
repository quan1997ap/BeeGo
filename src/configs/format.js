export function _formatCurrency(n) {
  var separate = ".";
  var s = n.toString();
  var regex = /\B(?=(\d{3})+(?!\d))/g;
  var ret = s.replace(regex, separate);
  return ret;
}

export function getStatus(statusCode) {
  let stustText = "";
  switch (statusCode) {
    case 0:
      stustText = "Chờ xác nhận";
      break;
    case 1:
      stustText = "Đã xác nhận";
      break;
    case 2:
      stustText = "Đang giao";
      break;
    case 3:
      stustText = "Hoàn thành";
      break;
    case 4:
      stustText = "Bị huỷ";
      break;
  }
  return stustText;
}
